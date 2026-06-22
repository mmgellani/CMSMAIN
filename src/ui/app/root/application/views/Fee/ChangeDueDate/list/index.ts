/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { FeeFeeHeadService, FeeStudentChallanService, SetupCollectorService } from '../../../../service';
import { IFeeFeeHead, IFeeStudentChallan, IFeeStudentChallanVM, IFeeStudentFeeStructureVM, IFilterString, ISetupCollector } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { maxLength, minLength, required } from "vuelidate/lib/validators";

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

type ValidateChallanNumber = { data: IFilterString; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateChallanNumber> = {
    data: {
        filterString: {
            required,
            minLength: minLength(12),
            maxLength: maxLength(14)
        }
    }
};


@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'changeDueDate',
    template: require('./index.html'),

})

export class ChangeDueDate extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeFeeHeadService;
    private datas: Array<IFeeFeeHead> = [];
    private data: IFilterString = {
        filterString: ''
    };

    private Collectorrepository: SetupCollectorService = null;
    CollectorList: Array<ISetupCollector> = [];
    private RefrenceNo: string = '';
    private Name: string = '';
    private filterString: string = '';
    private FeeChallanrepository: FeeStudentChallanService = null;
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private StudentFeedata: Array<IFeeStudentChallanVM> = [];
    private TotalAmount: number = 0;
    private collectorId: string = '';
    private modelchallanData: Array<IFeeStudentChallan> = [];
    private paidDate: Date = new Date();
    private currentDate: Date = new Date();
    private dueDate: Date = new Date();
    private isPaid: boolean = false;
    private str = '';

    created() {
        this.repository = new FeeFeeHeadService(this.$store);
        this.FeeChallanrepository = new FeeStudentChallanService(this.$store);
        this.Collectorrepository = new SetupCollectorService(this.$store);
        this.Collectorrepository.GetFindBy('e=>e.StatusId!=2').then(
            res => {
                this.CollectorList = res as Array<ISetupCollector>
            }
        )
    }

    mounted() {
        this.validatePage();
        this.refreshData();

    }

    SearchFeeConfirmation() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            this.TotalAmount = 0;

            var key = this.data.filterString + "?" + this.user.userId;
            this.FeeChallanrepository.GetFeeBychallan(key).then(res => {
                this.StudentFeedata = res as Array<IFeeStudentChallanVM>
                if(this.StudentFeedata.length>0)
                {
                
                if (this.StudentFeedata[0].paidDate == null) {
                    this.isPaid = true;
                }
                else {
                    this.isPaid = false;
                }


                if (this.isPaid == false) {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Paid Challan Due Date cannot change',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.warning
                    });



                }
                //alert(this.StudentFeedata[0].paidDate==null);
                this.RefrenceNo = this.StudentFeedata[0].refferenceNo;
                this.Name = this.StudentFeedata[0].fullName;
                this.dueDate = new Date(this.StudentFeedata[0].dueDate)
                //this.str=(this.StudentFeedata[0].dueDate.split('T')[0])
                // this.dueDate=new Date(this.StudentFeedata[0].dueDate)

                for (var i = 0; i < this.StudentFeedata.length; i++) {
                    this.TotalAmount = this.TotalAmount + this.StudentFeedata[i].payableAmount;

                }
            }
            else{

                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'No Record Found',
                    title: '',
                    messageTypeId: PayloadMessageTypes.warning
                });




            }
            });
        


        }
    }

    Save() {
        // if (new Date(this.str) <= new Date(this.currentDate)) {
        var dated = this.dueDate.getFullYear() + '/' + (this.dueDate.getMonth() + 1) + '/' + this.dueDate.getDate();
       
        var key = this.StudentFeedata[0].studentChallanId + "?" + dated
        this.FeeChallanrepository.updateDueDate(key)
            .then(r => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Due Date Updated Successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                });
            })
        // }
        // else{
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: 'Due date cannot be greater than Current Date',
        //         title: 'Failed',
        //         messageTypeId: PayloadMessageTypes.error
        //     });
        // }
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('changeDueDate' in this.user.claims) == true) {
                if (this.user.claims['changeDueDate'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['changeDueDate'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['changeDueDate'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['changeDueDate'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.datas = [];
        this.repository.GetAll()
            .then(response => this.datas = (response as Array<IFeeFeeHead>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { feeHeadId: '', fullName: '', description: '', feeType: 0, statusId: 0, loggerId: '', orderBy: 0, }, IsNewRecord: true });
    }

    editModel(model: IFeeFeeHead) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IFeeFeeHead) {
        this.$modal.show('delete-model', { model: model });
    }
    $v: any;
}