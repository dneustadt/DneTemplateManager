import template from './dne-template-manager-list.html.twig';

const { Component } = Shopware;

Component.register('dne-template-manager-list', {
    template,

    data() {
        return {
            isDocuments: false
        }
    },

    methods: {
        onIdChange(id) {
            this.$refs.detail.setItem(id);
        },

        onReload(removeSelection) {
            this.$refs.tree.onReload(removeSelection);
        },

        onLoading(tabsDisabled) {
            this.$refs.tree.onLoading(tabsDisabled);
        },
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    }
});
