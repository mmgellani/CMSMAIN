import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuelidate from 'vuelidate';
import { TokenHelper, UseAxios } from '../common';
import { Loader, StatusBar, Grid, InputDate, TreeNode, DropDown, PageArea, PortletArea, ReportEngine, TextBox } from '../components';
import { VueSelect } from 'vue-select';
import { InitI18n } from '../locales';
import * as Plugins from '../plugins';
import { RouteGuards, RouteNames, RouterOptions } from './routes';
import './root.scss';
import { RootStoreTypes } from './store';
import { Store } from './store/store';
import VModal from 'vue-js-modal';
import VueSlimScroll from 'vue-slimscroll';

import VueTouch from 'vue-touch';

import './filters';
import '../components/tabs';
import '../components/feather';

import 'bootstrap/dist/js/bootstrap.bundle';

import 'select2';
import '../components/select2';
import '../components/input';

import vueXlsxTable from 'vue-xlsx-table';
import DatePicker from 'vue2-datepicker';

// const VueInputMask = require('vue-inputmask').default
import VueTheMask from 'vue-the-mask';


export const bus = new Vue();

Vue.use(Vuex);
Vue.use(Vuelidate);
Vue.use(VueRouter);
Vue.use(VModal);
Vue.use(VueTheMask);
// Vue.use(FullCalendar);
//Vue.use(VueInputMask);

Vue.use(VueSlimScroll);
Vue.use(vueXlsxTable, { rABS: false });

Vue.use(VueTouch);

const router = new VueRouter(RouterOptions);

let options = {
    resolveUser: () => Store.state.common.user,
    forbiddenRouteName: RouteNames.forbidden,
    loginRouteName: RouteNames.login.home,
    verifyRouteName: RouteNames.login.verify,
    store: Store
};

router.beforeEach(RouteGuards(options));

Vue.use(Plugins.CommonsPlugin, {
    store: <never>Store,
});

let loadApp = (cb: (vue: Vue) => void) => {

    InitI18n().then((i18n) => {
        Vue.use(Plugins.UserOptionsPlugin, {
            i18n,
            store: <never>Store,
            watchLocaleChanges: true
        });

        UseAxios(router);

        Vue.component('status-bar', StatusBar);
        Vue.component('v-select', VueSelect);
        Vue.component('grid', Grid);
        Vue.component('input-date', InputDate);
        Vue.component('text-box', TextBox);

        Vue.component('tree', TreeNode);
        Vue.component('drop-down', DropDown);

        Vue.component('date-picker', DatePicker);
        Vue.component('page-area', PageArea);
        Vue.component('portlet-area', PortletArea);

        let app = new Vue({

            components: {
                Loader
            },

            i18n,

            router,

            store: Store,

            created() {

                // check if location hash has state/nonce value ...
                let resumeExternalLogin = () => {
                    if (location.hash) {

                        let hash = location.hash.substring(1);

                        if (hash.indexOf("error") != -1 || hash.indexOf("state") != -1 || hash.indexOf("token") != -1) {
                            router.push({
                                name: RouteNames.login.home,
                                query: { hash: hash }
                            });
                        }
                    }
                }

                let token = TokenHelper.getAccessToken();

                Store.dispatch(RootStoreTypes.common.updateUser, token)
                    .then(() => Store.dispatch(RootStoreTypes.common.loadingState, false))
                    .then(() => resumeExternalLogin());
            },

            computed: {

                isLoading: () => Store.state.common.isLoading

            }
        });

        return cb(app);
    });
}

(() => {
    window['bootstrap'].loadApp = loadApp;
})();