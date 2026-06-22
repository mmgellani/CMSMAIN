import Vue from 'vue';
import Component from 'vue-class-component';

import { FeeStudentExemptionAddEdit } from './Exemption';
import { FeeStudentSubInstallmentAddEdit } from './SubInstallment';
import { FeeStudentChallanAddEdit } from './StudentChallan';
import { FeeStudentChallanApplyConcession } from './Concession'
import { FeeStudentChallanChangeDueDateAddEdit } from './StudentChallanChangeDueDate'
import { State } from 'vuex-class';
import { IRootStoreState } from '../../../../store';
import { IUser } from '../../../../../model';

@Component({
    template: require('./index.html'),
    name: 'helper-modal',
    components: {
        'concession': FeeStudentChallanApplyConcession,
        'exemption': FeeStudentExemptionAddEdit,
        'subInstallment': FeeStudentSubInstallmentAddEdit,
        'challan': FeeStudentChallanAddEdit,
        'DueDate': FeeStudentChallanChangeDueDateAddEdit
    }
})
export class Helper extends Vue {
   // studentInfo: any = (<any>this).studentInfo;
    @State((state: IRootStoreState) => state.feeStudentInfo) studentInfo: any;

    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private conc: boolean = false;
    private exep: boolean = false;
    private insta: boolean = false;
    private stchallan: boolean = true;
    private changeDueDate: boolean = false;
    private title:string="Edit Details"

    private indexed: number = 0;
    private selc = '';
    mounted() {
        // this.$watch('studentInfo', () => {
        //   //  this.studentInfo = (<any>this).studentInfo;
        //     this.indexed = this.indexed + 1;
        // });
      

        this.validatePage();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('bulkFeeOperation' in this.user.claims) == true) {
                if (this.user.claims['bulkFeeOperation'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['bulkFeeOperation'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['bulkFeeOperation'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['bulkFeeOperation'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            }
        }
    }

    show(module: string) {
        switch (module) {
            case 'conc':
                this.conc = true;
                this.exep = this.insta = this.stchallan = this.changeDueDate = false;
                break;
            case 'exep':
                this.exep = true;
                this.conc = this.insta = this.stchallan = this.changeDueDate = false;
                break;
            case 'insta':
                this.insta = true;
                this.exep = this.conc = this.stchallan = this.changeDueDate = false;
                break;
            case 'challan':
                this.stchallan = true;
                this.exep = this.conc = this.insta = this.changeDueDate = false;
                break;
            case 'changeDueDate':
                this.changeDueDate = true;
                this.exep = this.conc = this.insta = this.stchallan = false;
        }
    }
    cancel() {

        this.$modal.hide("helper-modal");
    }


}