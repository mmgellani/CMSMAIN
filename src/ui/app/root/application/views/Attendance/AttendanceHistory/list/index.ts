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
import { AttendanceAttendenceMasterService } from '../../../../service';
import { VWAttendanceHistory, AttendanceDevice } from '../../../../models';
import { now } from 'moment';
import { AttendanceAttendanceHistoryDetail } from '../add-edit';



@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'detail-model' : AttendanceAttendanceHistoryDetail
    }
})

export class AttendanceHistoryList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: AttendanceAttendenceMasterService;
    private data: Array<AttendanceDevice> = [];

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private attendanceDate: string = '';

    private columns = [

        { key: 'browserInfo', caption: 'Browser Info' },
        { key: 'count', caption: 'Count' }
    ];

    created() {
        this.repository = new AttendanceAttendenceMasterService(this.$store);

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
            if (('attendanceHistory' in this.user.claims) == true) {
                if (this.user.claims['attendanceHistory'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['attendanceHistory'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['attendanceHistory'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['attendanceHistory'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAttendanceDevice(this.attendanceDate)
            .then(response => this.data = (response as Array<AttendanceDevice>));

    }

    detailModel(model: AttendanceDevice) {
        this.$modal.show("detail-model", {
            model: {
                browserInfo: model.browserInfo,
                count: model.count,
                dated: model.dated
            }
        });
    }
}
