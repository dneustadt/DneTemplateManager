(this.webpackJsonp=this.webpackJsonp||[]).push([["dne-template-manager"],{Hf5f:function(e,t,n){},QN1p:function(e,t,n){"use strict";n.r(t);var a=n("iPtR"),i=n.n(a);n("jd/E");const{Component:l}=Shopware;l.register("dne-template-manager-tree",{template:i.a,data:()=>({items:{},isLoading:!0,searchText:"",editedOnly:!1,selection:null}),created(){this.loadItems(),this.$parent.$on("dne-template-manager-reload",e=>{this.isLoading=!0,this.loadItems(),e&&(this.selection=null)})},computed:{getItems(){if(this.searchText.length||this.editedOnly){let e=Object.values(this.items);return this.searchText.length&&(e=e.filter(e=>-1!==e.name.indexOf(this.searchText))),this.editedOnly&&(e=e.filter(e=>1===e.custom)),e}return Object.values(this.items)},columns(){return[{property:"name",dataIndex:"name",label:this.$t("dne-template-manager.nameLabel"),allowResize:!1,sortable:!1,primary:!0}]}},methods:{loadItems(){const e=Shopware.Service("syncService").httpClient,t={Authorization:`Bearer ${Shopware.Context.api.authToken.access}`,"Content-Type":"application/json"};e.get("_action/dne-templatemanager/list",{headers:t}).then(({data:e})=>{this.items=e,this.isLoading=!1})},changeItem(e){this.selection=e.id,this.$parent.$emit("dne-template-manager-id-change",e.id)}}});var s=n("XQo1"),o=n.n(s);const{Component:d}=Shopware;d.register("dne-template-manager-list",{template:o.a,metaInfo(){return{title:this.$createTitle()}}});var r=n("xBkV"),m=n.n(r);const{Component:c,Mixin:p}=Shopware;c.register("dne-template-manager-detail",{template:m.a,mixins:[p.getByName("notification")],metaInfo(){return{title:this.$createTitle()}},data:()=>({httpClient:null,basicHeader:null,item:null,isLoading:!1,deleteModal:!1}),created(){this.$parent.$on("dne-template-manager-id-change",this.setItem),this.httpClient=Shopware.Service("syncService").httpClient,this.basicHeaders={Authorization:`Bearer ${Shopware.Context.api.authToken.access}`,"Content-Type":"application/json"}},methods:{setItem(e){e&&(this.isLoading=!0,this.httpClient.post("_action/dne-templatemanager/detail",{path:e},{headers:this.basicHeaders}).then(({data:e})=>{this.item=e,this.isLoading=!1}))},onClickSave(){this.doRequest("save")},onClickDelete(){this.deleteModal=!1,this.$nextTick().then(()=>{this.doRequest("delete")})},doRequest(e){this.isLoading=!0,this.httpClient.post(`_action/dne-templatemanager/${e}`,{path:this.item.path,content:this.item.content},{headers:this.basicHeaders}).then(({data:t})=>{const n=t.cacheWarmup?"cache_warmup":"cache";this.httpClient.delete(`/_action/${n}`,{headers:this.basicHeaders}).then(()=>{this.isLoading=!1,this.$parent.$emit("dne-template-manager-reload","delete"===e),"delete"===e?this.item=null:this.item.custom=1})}).catch(e=>{this.isLoading=!1,this.createNotificationError({title:"Error",message:e})})}}});var h=n("kluj"),u=n("h3zy");const{Module:g}=Shopware;g.register("dne-template-manager",{color:"#ff3d58",icon:"default-shopping-paper-bag-product",title:"dne-template-manager.title",description:"",snippets:{"de-DE":h,"en-GB":u},routes:{list:{component:"dne-template-manager-list",path:"list"}},navigation:[{label:"dne-template-manager.menuEntry",path:"dne.template.manager.list",parent:"sw-settings",position:100}]})},XQo1:function(e,t){e.exports='{% block dne_template_manager_list %}\n    <sw-page class="dne-template-manager-list">\n        <template #side-content>\n            <dne-template-manager-tree></dne-template-manager-tree>\n        </template>\n\n        <template slot="content">\n            {% block dne_template_manager_list_content %}\n                <dne-template-manager-detail></dne-template-manager-detail>\n            {% endblock %}\n        </template>\n    </sw-page>\n{% endblock %}\n'},h3zy:function(e){e.exports=JSON.parse('{"dne-template-manager":{"title":"Custom Template Manager","menuEntry":"Custom Template","nameLabel":"Path","searchLabel":"Search","editedOnlyLabel":"edited only","contentLabel":"Custom template content for","originalContentLabel":"Original template content","saveButton":"Save","deleteButton":"Delete","cancelButton":"Cancel","deleteWarning":"Are you sure you want to delete the custom template?","donateText":"Click here to support this free extension or if you want to buy me a cup of coffee","credit":"David Neustadt - kontakt@davidneustadt.de - https://neustadt.dev"}}')},iPtR:function(e,t){e.exports='<sw-data-grid\n        :dataSource="getItems"\n        :columns="columns"\n        :fullPage="false"\n        :showSettings="false"\n        :showSelection="false"\n        :showActions="false"\n        :isLoading="isLoading"\n        :allowColumnEdit="false"\n        :allowInlineEdit="false"\n        class="dne-template-manager">\n    <template #column-name="{ item }">\n        <a\n            href="#"\n            :class="{\n                \'sw-button-active\': selection === item.id,\n                \'is-custom\': item.custom === 1\n            }"\n            @click.prevent="changeItem(item)"\n        >\n            <sw-icon\n                v-if="item.custom === 1"\n                name="default-documentation-file"\n                :color="selection === item.id ? \'#ffffff\' : \'#007bff\'"\n                size="14">\n            </sw-icon>\n            <sw-icon\n                v-else\n                name="default-web-loading-star"\n                size="14">\n            </sw-icon>\n            {{ item.name }}\n        </a>\n    </template>\n    <template #column-label-name>\n        <span>\n            {{ $t(\'dne-template-manager.nameLabel\') }}\n        </span>\n        <sw-field\n            v-model="searchText"\n            type="text"\n            :placeholder="$t(\'dne-template-manager.searchLabel\')"\n        ></sw-field>\n        <sw-switch-field\n            v-model="editedOnly"\n            :label="$t(\'dne-template-manager.editedOnlyLabel\')"\n        ></sw-switch-field>\n    </template>\n</sw-data-grid>\n'},"jd/E":function(e,t,n){var a=n("Hf5f");"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);(0,n("SZ7m").default)("9056411a",a,!0,{})},kluj:function(e){e.exports=JSON.parse('{"dne-template-manager":{"title":"Custom Template Manager","menuEntry":"Custom Template","nameLabel":"Pfad","searchLabel":"Suchen","editedOnlyLabel":"nur bearbeitete","contentLabel":"Custom Template Inhalt von","originalContentLabel":"Original Template Inhalt","saveButton":"Speichern","deleteButton":"Löschen","cancelButton":"Abbreichen","deleteWarning":"Sind Sie sicher, dass Sie das Custom Template endgültig löschen möchten?","donateText":"Klicken Sie hier, wenn Sie dieses kostenlose Plugin unterstützen oder mir einen Kaffee ausgeben möchten","credit":"David Neustadt - kontakt@davidneustadt.de - https://neustadt.dev"}}')},xBkV:function(e,t){e.exports='{% block dne_template_manager_detail %}\n    <sw-card-view>\n        <sw-card v-if="item" :isLoading="isLoading">\n            <sw-code-editor\n                    :label="`${$t(\'dne-template-manager.contentLabel\')} ${item.path}`"\n                    name="content"\n                    identifier="content"\n                    completionMode="entity"\n                    v-model="item.content">\n            </sw-code-editor>\n\n            <sw-button\n                    :isLoading="isLoading"\n                    variant="primary"\n                    @click="onClickSave">\n                {{ $t(\'dne-template-manager.saveButton\') }}\n            </sw-button>\n\n            <sw-button\n                v-if="item.custom === 1"\n                :isLoading="isLoading"\n                variant="secondary"\n                @click="deleteModal = true">\n                {{ $t(\'dne-template-manager.deleteButton\') }}\n            </sw-button>\n\n            <sw-modal v-if="deleteModal"\n                      @modal-close="deleteModal = false"\n                      :title="$tc(\'global.default.warning\')"\n                      variant="small">\n                <p>\n                    {{ $tc(\'dne-template-manager.deleteWarning\') }}\n                </p>\n\n                <template #modal-footer>\n                    <sw-button @click="deleteModal = false" size="small">\n                        {{ $tc(\'dne-template-manager.cancelButton\') }}\n                    </sw-button>\n\n                    <sw-button @click="onClickDelete" variant="danger" size="small">\n                        {{ $tc(\'dne-template-manager.deleteButton\') }}\n                    </sw-button>\n                </template>\n            </sw-modal>\n        </sw-card>\n        <sw-card v-if="item" :isLoading="isLoading">\n            <sw-code-editor\n                :label="$t(\'dne-template-manager.originalContentLabel\')"\n                :disabled="true"\n                :editorConfig="{\n                    readOnly: true\n                }"\n                v-model="item.originalContent">\n            </sw-code-editor>\n        </sw-card>\n        <sw-card>\n            <a href="https://github.com/dneustadt/DneTemplateManager" target="_blank" rel="noopener">\n                {{ $t(\'dne-template-manager.donateText\') }}\n            </a>\n            <p>{{ $t(\'dne-template-manager.credit\') }}</p>\n        </sw-card>\n    </sw-card-view>\n{% endblock %}\n'}},[["QN1p","runtime","vendors-node"]]]);