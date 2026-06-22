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
import { FeeStudentChallanService } from '../../../../service';
import { StudentFeeDetailDescription, StudentFeesdetailActivity } from '../../../../models/Reports/FeeReports';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    // components: {
    //     'userlog-detail-model' : RoleUserLogDetail
    // }
})

export class StudentFeeDetailDescriptionList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeStudentChallanService=null;
    private data: Array<StudentFeesdetailActivity> = [];

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private fromDate = new Date();
    private toDate = new Date();

    private columns = [
        { key: 'ref_No', caption: "Refference No" },
        { key: 'reg_No', caption: 'RollNo' },
        { key: 'challan_Number', caption: 'ChallanNo' },
        { key: 'over_Due_Amount', caption: 'FeeAmount' },
        { key: 'payDate', caption: 'Paid Date' }
    ];

    created() {
        this.repository = new FeeStudentChallanService(this.$store);
        // this.$watch('toDate',this.refreshData);
    }

    mounted() {
        this.validatePage();
        /// this.refreshData();
    }


    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('studentFeeDetailDescription' in this.user.claims) == true) {
                if (this.user.claims['studentFeeDetailDescription'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['studentFeeDetailDescription'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['studentFeeDetailDescription'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['studentFeeDetailDescription'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        var key= this.fromDate.toDateString() + "?" + this.toDate.toDateString();
        
        this.repository.StudentFeeDetailDescription(key)
           .then(r=>{
               this.data=r as Array<StudentFeesdetailActivity>
               
           })

    }

    // detailModel (model) {
    //     this.$modal.show('userlog-detail-model', { model: model} );

    // }

}
