import template from './dne-template-manager-tree.html.twig';
import './dne-template-manager-tree.scss';

const { Component } = Shopware;

Component.register('dne-template-manager-tree', {
    template,

    data() {
        return {
            items: {},
            isLoading: true,
            tabsDisabled: false,
            searchText: '',
            editedOnly: false,
            isDocuments: false,
            selection: null
        };
    },

    created() {
        this.loadItems();
    },

    computed: {
        getItems() {
            if (this.searchText.length || this.editedOnly) {
                let items = Object.values(this.items);
                if (this.searchText.length) {
                    items = items.filter((item) => {
                        return item.name.indexOf(this.searchText) !== -1;
                    });
                }
                if (this.editedOnly) {
                    items = items.filter((item) => {
                        return item.custom === 1;
                    });
                }

                return items;
            }

            return Object.values(this.items);
        },
        columns() {
            return [{
                property: 'name',
                dataIndex: 'name',
                label: this.$t('dne-template-manager.nameLabel'),
                allowResize: false,
                sortable: false,
                primary: true
            }]
        }
    },

    watch: {
        isDocuments(value) {
            this.isLoading = true;
            this.loadItems();
            this.selection = null;

            this.$emit('dne-template-manager-documents', value);
        }
    },

    methods: {
        onReload(removeSelection) {
            this.isLoading = true;
            this.loadItems();
            if (removeSelection) {
                this.selection = null;
            }
        },

        onLoading(tabsDisabled) {
            this.tabsDisabled = tabsDisabled;
        },

        loadItems() {
            const httpClient = Shopware.Service('syncService').httpClient;
            const basicHeaders = {
                Authorization: `Bearer ${Shopware.Context.api.authToken.access}`,
                'Content-Type': 'application/json'
            };

            const params = {};
            if (this.isDocuments) {
                params.documents = true;
            }

            httpClient.get('_action/dne-templatemanager/list', { headers: basicHeaders, params: params }).then(({ data }) => {
                this.items = data;
                this.isLoading = false;
            });
        },
        changeItem(item) {
            this.selection = item.id;
            this.$emit('dne-template-manager-id-change', item.id);
        }
    }
});
