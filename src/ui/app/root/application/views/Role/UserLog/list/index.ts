/*
*   Author: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { StoreTypes } from '../../../../../../store';

import { RoleUserLogService } from '../../../../service/Role/UserLog';
import { IUserLog } from '../../../../models/Role/UserLog';
import { RoleUserLogDetail } from '../detail';
import moment from 'moment';
import { Helper } from '../../..';


@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'userlog-detail-model': RoleUserLogDetail
    }
})

export class RoleUserLogList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: RoleUserLogService;
    private data: Array<IUserLog> = [];

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private fromDate = new Date();
    private toDate = new Date();

    private columns = [
        { key: 'dateTime', caption: "Time" },
        { key: 'user', caption: 'User Name' },
        { key: 'publicIpPort', caption: 'Client Info' },
        { key: 'controllerAction', caption: 'Operation' },
        { key: 'action', caption: 'Action' }
    ];

    created() {
        this.repository = new RoleUserLogService(this.$store);
    }

    mounted() {
        this.validatePage();
        // this.refreshData();
    }


    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupCountry' in this.user.claims) == true) {
                if (this.user.claims['setupCountry'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupCountry'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupCountry'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupCountry'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        //  this.fromDate=moment(this.fromDate).format('YYYY-MM-DD')
        // this.toDate=moment(this.toDate).format('YYYY-MM-DD')
        var key = moment(this.fromDate).format('YYYY-MM-DD') + "?" + moment(this.toDate).format('YYYY-MM-DD');
        this.repository.FindBy(key)
            .then(response => this.data = (response as Array<IUserLog>));

    }

    detailModel(model) {
        this.$modal.show('userlog-detail-model', { model: model });

    }

}
