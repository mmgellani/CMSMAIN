/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IHumanResourceDepartments, IHumanResourceStaff } from '../../../../models';
import { HumanResourceDepartmentsService, HumanResourceStaffService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import { AdmissionEligibilityCriteriaAddEdit } from '../../../Admission/EligibilityCriteria/add-edit';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),

})

export class UpdMicroPassList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: HumanResourceDepartmentsService;
    private data: Array<IHumanResourceDepartments> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private staffModel: Array<IHumanResourceStaff> = [];
    private repoStaff: HumanResourceStaffService;





    created() {
        this.repoStaff = new HumanResourceStaffService(this.$store);
    }

    mounted() {
        this.validatePage();
        

    }


    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('updmicropass' in this.user.claims) == true) {
                if (this.user.claims['updmicropass'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['updmicropass'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['updmicropass'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['updmicropass'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.repoStaff.UpMicroPass(this.filterString).then(
            r=>{
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: r,
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                })


            }
        )

        
    }


}