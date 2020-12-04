import template from './dne-template-manager-tree.html.twig';
import './dne-template-manager-tree.scss';

const { Component } = Shopware;

Component.register('dne-template-manager-tree', {
    template,

    data() {
        return {
            items: {},
            isLoading: true
        };
    },

    created() {
        this.loadItems();

        this.$parent.$on('dne-template-manager-reload', () => {
            this.isLoading = true;
            this.loadItems();
        });
    },

    computed: {
        getItems() {
            return Object.values(this.items);
        },
        columns() {
            return [{
                property: 'name',
                dataIndex: 'name',
                label: this.$t('dne-template-manager.nameLabel'),
                allowResize: false,
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
            this.$parent.$emit('dne-template-manager-id-change', item.id);
        }
    }
});
