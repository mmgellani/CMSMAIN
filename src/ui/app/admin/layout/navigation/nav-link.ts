import Vue from 'vue';
import Component from 'vue-class-component';
import { RootStoreTypes } from '../../../root/store';

import { IMenu } from './menu-helper';

@Component({
    template: require('./nav-link.html'),
    name: 'nav-link',
    props: { userMenu: Object }
})
export class NavLink extends Vue {

    userMenu: IMenu = (<any>this).userMenu;

    isOpened: boolean = false;

    get activeLink() {
        if(this.$route.fullPath.indexOf(this.userMenu.name) >= 0) {
            return 'kt-menu__item kt-menu__item--active';
        } else {
            return 'kt-menu__item';
        }
    }

    get menuToggled() {
        if(this.isOpened){
            return 'kt-menu__item  kt-menu__item--submenu kt-menu__item--open kt-menu__item--here';
        } else {
            return 'kt-menu__item  kt-menu__item--submenu';
        }
    }

    get hasChildrens() {
        return this.userMenu.children && this.userMenu.isVisable;
    }
}