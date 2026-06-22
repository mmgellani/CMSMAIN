import Vue from 'vue';
import Component from 'vue-class-component';
import { mapState, mapActions } from "vuex";
import { Action, State } from 'vuex-class';

import isScreen from '../../store/sing/screenHelper';
import { NavLink } from './nav-link';
import { RootStoreTypes, IRootStoreState } from '../../store';
import { IUser } from '../../../model';

import { GenerateMenu } from './model';

@Component({
    template: require('./sidebar.html'),
    components: { 'nav-link': NavLink }
})
export class AreaSidebar extends Vue {

    @State((state: IRootStoreState) => state.sidebarStatic) sidebarStatic: boolean;
    @State((state: IRootStoreState) => !state.sidebarClose) sidebarOpened: boolean;
    @State((state: IRootStoreState) => state.sidebarActiveElement) activeItem: any;

    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private userMenu: any = [];

    alerts = [
        {
            id: 0,
            title: "Sales Report",
            value: 15,
            footer: "Calculating x-axis bias... 65%",
            color: "info"
        },
        {
            id: 1,
            title: "Personal Responsibility",
            value: 20,
            footer: "Provide required notes",
            color: "danger"
        }
    ]

    created() {
        this.setActiveByRoute();
        var linqed = new GenerateMenu(this.user);

        this.userMenu = linqed.processMenu();
    }

    setActiveByRoute() {
        const paths = this.$route.fullPath.split("/");
        paths.pop();
        this.$store.dispatch(RootStoreTypes.changeSidebarActive, paths.join("/"));
    }
    sidebarMouseEnter() {
        if (!this.sidebarStatic && (isScreen("lg") || isScreen("xl"))) {
            this.$store.dispatch(RootStoreTypes.switchSidebar, false);
            this.setActiveByRoute();
        }
    }
    sidebarMouseLeave() {
        if (!this.sidebarStatic && (isScreen("lg") || isScreen("xl"))) {
            this.$store.dispatch(RootStoreTypes.switchSidebar, true);
            this.$store.dispatch(RootStoreTypes.changeSidebarActive, null);
        }
    }
}