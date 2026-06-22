import Vue from 'vue';
import Component from 'vue-class-component';
import { RootStoreTypes } from '../../store';

import { IMenuModel } from './model';

@Component({
    template: require('./nav-link.html'),
    name: 'nav-link',
    props: {
        menuItem: Object
    }
})
export class NavLink extends Vue {

    menuItem: IMenuModel = this.menuItem;

    private headerLinkWasClicked: boolean = true;

    togglePanelCollapse(link) {
        this.$store.dispatch(RootStoreTypes.changeSidebarActive, link);
        this.headerLinkWasClicked = !this.headerLinkWasClicked || !this.menuItem.activeItem.includes(this.menuItem.index);
    }

    get isActive() {
        if (this.menuItem.activeItem) {
            return (this.menuItem.activeItem
                && this.menuItem.activeItem.includes(this.menuItem.index)
                && this.headerLinkWasClicked);
        } else {
            return false;
        }
    }

    get isActualActive() {
        return this.menuItem.activeItem
            && this.menuItem.activeItem.includes(this.menuItem.index);
    }

    get currentClass() {
        return (this.isActualActive ? ' active ' : '') + this.menuItem.className;
    }
}