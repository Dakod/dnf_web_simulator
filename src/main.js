import Vue from 'vue'
import App from './App.vue'
import CommonSelect from "@/components/common_components/CommonSelect";
import CommonInput from "@/components/common_components/CommonInput";
import CommonInputNumber from "@/components/common_components/CommonInputNumber";
import CommonButton from "@/components/common_components/CommonButton";
import CommonDialog from "@/components/common_components/CommonDialog";
import CommonTabBar from "@/components/common_components/CommonTabBar";
import CommonBubble from "@/components/common_components/CommonBubble";
import Modal from "@/components/common_components/Modal";
import SpriteRender from "@/components/common_components/SpriteRender";
import * as xmlReader from "@/js/xmlReader";
import * as utils from "@/js/utils";
import {InputNumber, Table, TableColumn, CascaderPanel} from 'element-ui';
import {VERSION} from "@/js/SerializeUtils";
import VueRouter from 'vue-router'
import $ from 'jquery';
import './registerServiceWorker'
import SimulatorPage from "@/components/simulator_page/SimulatorPage";
import ComputerPage from "@/components/computer_page/ComputerPage";

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.prototype.$ = $;
Vue.prototype.xmlReader = xmlReader;
Vue.prototype.myUtils = utils;
Vue.prototype.version = VERSION;

Vue.prototype.updateRole = function (role) {
    role.updateRole();
};


Vue.component("CommonSelect", CommonSelect);
Vue.component("CommonInput", CommonInput);
Vue.component("CommonInputNumber", CommonInputNumber);
Vue.component("CommonButton", CommonButton);
Vue.component("SpriteRender", SpriteRender);
Vue.component("CommonDialog", CommonDialog);
Vue.component("CommonTabBar", CommonTabBar);
Vue.component("CommonBubble", CommonBubble);
Vue.component("Modal", Modal);
Vue.component(InputNumber.name, InputNumber);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(CascaderPanel.name, CascaderPanel);

//路由
Vue.use(VueRouter);
const routes = [
    {
        path: "/simulator",
        component: SimulatorPage
    },
    {
        path: "/computer",
        component: ComputerPage
    },
    {
        path: "",
        redirect: "/simulator"
    }
];
const router = new VueRouter({
    routes
});


//创建实例之前先获取资源
xmlReader.initResource().then(() => {
    new Vue({
        render: h => h(App),
        router
    }).$mount('#app');
});


