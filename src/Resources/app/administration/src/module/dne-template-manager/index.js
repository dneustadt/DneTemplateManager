import './component/dne-template-manager-tree';
import './page/dne-template-manager-list';
import './page/dne-template-manager-detail';
import './acl';
import deDE from './snippet/de-DE.json';
import enGB from './snippet/en-GB.json';

const { Module } = Shopware;

Module.register('dne-template-manager', {
    color: '#ff3d58',
    icon: 'regular-code',
    title: 'dne-template-manager.title',
    description: '',

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    },

    routes: {
        list: {
            component: 'dne-template-manager-list',
            path: 'list',
            meta: {
                privilege: 'dne_template_manager.viewer'
            }
        }
    },

    navigation: [{
        label: 'dne-template-manager.menuEntry',
        path: 'dne.template.manager.list',
        parent: 'sw-extension',
        position: 100
    }]
});
