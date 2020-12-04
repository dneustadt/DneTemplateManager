import template from './dne-template-manager-list.html.twig';

const { Component } = Shopware;

Component.register('dne-template-manager-list', {
    template,

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    }
});
