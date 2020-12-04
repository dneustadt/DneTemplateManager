import template from './dne-template-manager-detail.html.twig';

const { Component, Mixin } = Shopware;

Component.register('dne-template-manager-detail', {
    template,

    mixins: [
        Mixin.getByName('notification')
    ],

    metaInfo() {
        return {
            title: this.$createTitle()
        };
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
        this.$parent.$on('dne-template-manager-id-change', this.setItem);

        this.httpClient = Shopware.Service('syncService').httpClient;
        this.basicHeaders = {
            Authorization: `Bearer ${Shopware.Context.api.authToken.access}`,
            'Content-Type': 'application/json'
        };
    },

    methods: {
        setItem(path) {
            if (!path) {
                return;
            }

            this.httpClient.post(
                '_action/dne-templatemanager/detail',
                { path: path },
                { headers: this.basicHeaders }
            ).then(({ data }) => {
                this.item = data;
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
            this.httpClient.post(
                `_action/dne-templatemanager/${endpoint}`,
                { path: this.item.path, content: this.item.content },
                { headers: this.basicHeaders }
            ).then(() => {
                this.httpClient.delete('/_action/cache', { headers: this.basicHeaders }).then(() => {
                    this.isLoading = false;
                    this.$parent.$emit('dne-template-manager-reload');

                    if (endpoint === 'delete') {
                        this.item = null;
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
