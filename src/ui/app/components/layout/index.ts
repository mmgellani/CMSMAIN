/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { State } from 'vuex-class';

import { IUser } from '../../model';
import { IRootStoreState } from '../../root/store';

@Component({
    name: 'layout',
    template: require('./index.html'),
    props: ['name', 'title', 'data', 'columns'],
})
export class Layout extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    
    name: string = this.name;
    title: string = this.title;
    data: any = this.data;
    columns: any = this.columns;

    canRead: boolean = false;
    canAdd: boolean = false;
    canEdit: boolean = false;
    canDelete: boolean = false;

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if ((this.name in this.user.claims) == true) {
                if (this.user.claims[this.name].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims[this.name].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims[this.name].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims[this.name].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }
}