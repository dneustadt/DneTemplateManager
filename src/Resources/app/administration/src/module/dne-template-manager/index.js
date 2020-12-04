import './component/dne-template-manager-tree';
import './page/dne-template-manager-list';
import './page/dne-template-manager-detail';
import deDE from './snippet/de-DE.json';
import enGB from './snippet/en-GB.json';

const { Module } = Shopware;

Module.register('dne-template-manager', {
    color: '#ff3d58',
    icon: 'default-shopping-paper-bag-product',
    title: 'dne-template-manager.title',
    description: '',

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    },

    routes: {
        list: {
            component: 'dne-template-manager-list',
            path: 'list'
        }
    },

    navigation: [{
        label: 'dne-template-manager.title',
        color: '#00acd2',
        path: 'dne.template.manager.list',
        icon: 'default-text-code',
        position: 100
    }]
});
