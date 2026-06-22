import { IUser, SecurityRoleClaims } from "../../../model";
import { AuthenticationService } from "../../../services";

import { Store } from '../../store/store';

import * as icons from './svgPath';
import { settings } from "cluster";

export interface IMenu {
    name: string;
    route: string;
    svgPath: string;
    isVisable: boolean;
    isHeader: boolean;
    children: Array<IMenu>;
};

const providedMenu: Array<IMenu> = [
    { isVisable: true, name: 'dashboard', svgPath: icons.dashboard, children: null, isHeader: true, route: '/' },
    { isVisable: true, name: 'userList', svgPath: 'icon-layers', children: null, isHeader: false, route: 'users' },
    { isVisable: true, name: 'listRoles', svgPath: 'icon-layers', children: null, isHeader: false, route: 'roles' },
];

export class PopulateMenu {

    private user: IUser;
    private auth: AuthenticationService;

    constructor(providedUser: IUser) {
        this.user = providedUser;
        this.auth = new AuthenticationService(Store);
    }

    private get isInAdminRole() {
        return this.user.authenticated && this.auth.satisfies(this.user, [SecurityRoleClaims.Admin]);
    }

    get processMenu() {
        if (this.isInAdminRole) {
            return providedMenu;
        } else {
            return providedMenu.forEach(element => {
                this.processMenuEx(element);
            });
        }
    }

    private processMenuEx(item: IMenu) {
        if (item.children) {
            item.children.forEach(element => {
                this.processMenuEx(element);
            });

            item.isVisable = this.hasChildrenVisible(item);
        } else {
            item.isVisable = this.foundInRoule(item.route);
        }
    }

    private foundInRoule(value) {
        var found: boolean = false;
        if (this.user.claims[value] != undefined) {
            found = true;
        }
        return found;
    }

    private hasChildrenVisible(item: IMenu) {
        var found: boolean = false;
        item.children.forEach(element => {
            if (element.isVisable == true) {
                found = true;
            }
        });
        return found;
    }
}