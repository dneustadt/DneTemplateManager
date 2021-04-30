Shopware.Service('privileges').addPrivilegeMappingEntry({
    category: 'permissions',
    parent: null,
    key: 'dne_template_manager',
    roles: {
        viewer: {
            privileges: [],
            dependencies: []
        },
        editor: {
            privileges: [],
            dependencies: ['system.clear_cache']
        },
        creator: {
            privileges: [],
            dependencies: ['system.clear_cache']
        },
        deleter: {
            privileges: [],
            dependencies: ['system.clear_cache']
        }
    }
});
