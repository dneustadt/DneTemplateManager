import template from './dne-template-manager-detail.html.twig';

const { Component, Mixin } = Shopware;

Component.register('dne-template-manager-detail', {
    template,

    inject: [
        'acl',
        'cacheApiService',
    ],

    mixins: [
        Mixin.getByName('notification')
    ],

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    props: {
        isDocuments: Boolean
    },

    data() {
        return {
            httpClient: null,
            basicHeader: null,
            item: null,
            isLoading: false,
            deleteModal: false
        };
    },

    created() {
        this.httpClient = Shopware.Service('syncService').httpClient;
        this.basicHeaders = {
            Authorization: `Bearer ${Shopware.Context.api.authToken.access}`,
            'Content-Type': 'application/json'
        };
    },

    watch: {
        isDocuments() {
            this.item = null;
        },
        isLoading(value) {
            this.$emit('dne-template-manager-loading', value);
        }
    },

    methods: {
        setItem(path) {
            if (!path) {
                return;
            }

            const params = {};
            if (this.isDocuments) {
                params.documents = true;
            }

            this.isLoading = true;
            this.httpClient.post(
                '_action/dne-templatemanager/detail',
                { path: path },
                { headers: this.basicHeaders, params: params }
            ).then(({ data }) => {
                this.item = data;
                this.isLoading = false;
            });
        },

        onClickSave() {
            this.doRequest('save');
        },

        onClickDelete() {
            this.deleteModal = false;

            this.$nextTick().then(() => {
                this.doRequest('delete');
            });
        },

        doRequest(endpoint) {
            this.isLoading = true;

            const post = { path: this.item.path, content: this.item.content };
            if (this.isDocuments) {
                post.documents = true;
            }

            this.httpClient.post(
                `_action/dne-templatemanager/${endpoint}`,
                post,
                { headers: this.basicHeaders }
            ).then(() => {
                this.cacheApiService.clear().then(() => {
                    this.isLoading = false;
                    this.$emit('dne-template-manager-reload', endpoint === 'delete');

                    if (endpoint === 'delete') {
                        this.item = null;
                    } else {
                        this.item.custom = 1;
                    }
                });
            }).catch((exception) => {
                this.isLoading = false;
                this.createNotificationError({
                    title: 'Error',
                    message: exception
                });
            });
        }
    }
});
