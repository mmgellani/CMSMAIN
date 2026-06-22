import Vue from 'vue';
import Component from 'vue-class-component';
import { mapState, mapActions } from "vuex";
import { Action, State } from 'vuex-class';

import { NavLink } from './nav-link';
import { RootStoreTypes, IRootStoreState } from '../../../root/store';
import { IUser } from '../../../model';
import { PopulateMenu } from './menu-helper';

declare var slimScroll: any;

@Component({
    template: require('./sidebar.html'),
    components: { 'nav-link': NavLink }
})
export class AreaSidebar extends Vue {

    @State((state: IRootStoreState) => state.common.user) user: IUser;
    private menuRepo: PopulateMenu;
    disable: boolean = true;

    created() {
        this.menuRepo = new PopulateMenu(this.user);
    }

    toggleButton() {
        if (document.body.className.indexOf('kt-aside--minimize') >= 0) {
            document.body.className = 'kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed';
        } else {
            document.body.className = 'kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-aside--minimize';
        }
        this.disable = !this.disable;
    }

    mouseOver() {
        if (document.body.className.indexOf('kt-aside--minimize') >= 0) {
            document.body.className = 'kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-aside--minimize-hover';
        }
    }

    mouseLeave() {
        if (document.body.className.indexOf('kt-aside--minimize') >= 0) {
            document.body.className = 'kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-aside--minimize';
        }
    }

}