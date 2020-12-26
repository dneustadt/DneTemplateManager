import template from './dne-template-manager-tree.html.twig';
import './dne-template-manager-tree.scss';

const { Component } = Shopware;

Component.register('dne-template-manager-tree', {
    template,

    data() {
        return {
            items: {},
            isLoading: true,
            searchText: '',
            editedOnly: false,
            selection: null
        };
    },

    created() {
        this.loadItems();

        this.$parent.$on('dne-template-manager-reload', (removeSelection) => {
            this.isLoading = true;
            this.loadItems();
            if (removeSelection) {
                this.selection = null;
            }
        });
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

    methods: {
        loadItems() {
            const httpClient = Shopware.Service('syncService').httpClient;
            const basicHeaders = {
                Authorization: `Bearer ${Shopware.Context.api.authToken.access}`,
                'Content-Type': 'application/json'
            };

            httpClient.get('_action/dne-templatemanager/list', { headers: basicHeaders }).then(({ data }) => {
                this.items = data;
                this.isLoading = false;
            });
        },
        changeItem(item) {
            this.selection = item.id;
            this.$parent.$emit('dne-template-manager-id-change', item.id);
        }
    }
});
