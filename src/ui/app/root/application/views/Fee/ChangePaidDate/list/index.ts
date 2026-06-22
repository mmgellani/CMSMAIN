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
import WidgetBox from '../../../../../home/widget-box/index';

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
    name: 'changePaidDate',
    template: require('./index.html'),
    components: {
        WidgetBox
    }
})

export class StudentChangePaidDate extends Vue {
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
    private fatherName: string = '';
    private collectorid='';
    private campusName: string = '';
    private description: string = '';
    private className: string = '';
    private accountNo: string = '';
    private bankName: string = '';
    private branch: string = '';
    private code: string = '';
    private documentNo: string = '';
    private dueDate: string = '';
    private recievedDate: string = '';
    private feeHead: string = '';
    private stfeeamount: number = 0;
    private payableAmount: number = 0;
    private collectorName: string = '';
    private sectionName: string = '';
    private filterString: string = '';
    private FeeChallanrepository: FeeStudentChallanService = null;
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private StudentFeedata: Array<IFeeStudentChallanVM> = [];
    private TotalAmount: number = 0;
    private collectorId: string = '';
    private campusId: string = '';
    // campusId: string = "";
    private modelchallanData: Array<IFeeStudentChallan> = [];
    private paidDate: Date = new Date();
    private currentDate: Date = new Date();
    ChallanAmount: number = 0;
    installmentNO: number = 0;

    isAlreadyPaid: boolean = false;

    created() {
        this.repository = new FeeFeeHeadService(this.$store);
        this.FeeChallanrepository = new FeeStudentChallanService(this.$store);
        this.Collectorrepository = new SetupCollectorService(this.$store);

    }

    mounted() {
        this.validatePage();
        this.refreshData();

    }

    SearchFeeConfirmation() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            this.TotalAmount = 0;
            this.isAlreadyPaid = false;
            this.StudentFeedata = null;

            this.RefrenceNo = this.Name = this.fatherName = this.campusName = this.description =
                this.className = this.bankName = this.accountNo = this.branch = this.code = this.documentNo = this.dueDate =
                this.recievedDate = this.feeHead = '';
            this.installmentNO = this.stfeeamount = this.payableAmount = 0;

            var key = this.data.filterString + "?" + this.user.userId;
            this.FeeChallanrepository.GetFeeBychallan(key).then(res => {
                this.StudentFeedata = res as Array<IFeeStudentChallanVM>;

                if (this.StudentFeedata) {
                    if (this.StudentFeedata.length > 0) {
                        this.campusId = this.StudentFeedata[0].campusId;

                        this.StudentFeedata = Array.from(new Set(this.StudentFeedata.map(a => a.feeHead)))
                            .map(id => {
                                return this.StudentFeedata.find(a => a.feeHead === id)
                            });

                        this.RefrenceNo = this.StudentFeedata[0].refferenceNo;
                        this.Name = this.StudentFeedata[0].fullName;
                        this.installmentNO = this.StudentFeedata[0].installmentNo;
                        this.fatherName = this.StudentFeedata[0].fatherName;
                        this.campusName = this.StudentFeedata[0].campusName;
                        this.description = this.StudentFeedata[0].description;
                        this.className = this.StudentFeedata[0].className;
                        this.bankName = this.StudentFeedata[0].bankName;
                        this.accountNo = this.StudentFeedata[0].accountNo;
                        this.branch = this.StudentFeedata[0].branch;
                        this.code = this.StudentFeedata[0].code;
                        this.documentNo = this.StudentFeedata[0].documentNo;
                        this.dueDate = this.StudentFeedata[0].dueDate;
                        this.recievedDate = this.StudentFeedata[0].paidDate;
                        this.feeHead = this.StudentFeedata[0].feeHead;
                        this.stfeeamount = this.StudentFeedata[0].stfeeamount;
                        this.payableAmount = this.StudentFeedata[0].payableAmount;
                        this.collectorName = this.StudentFeedata[0].collectorName;
                    }

                    // for (var i = 0; i < this.StudentFeedata.length; i++) {
                    //     this.TotalAmount = this.TotalAmount + this.StudentFeedata[i].payableAmount
                    // }
                }

                this.FeeChallanrepository.GetFeeByChallanNo(this.data.filterString).then(
                    res => {

                        this.Collectorrepository.GetFindBy('e=>e.CampusId.ToString()=="' + this.campusId + '"').then(
                            res => {
                                this.CollectorList = res as Array<ISetupCollector>
                            }
                        )
                        this.modelchallanData = res as Array<IFeeStudentChallan>
                        if (this.modelchallanData.length == 0) {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: 'No Record Found',
                                title: 'warning',
                                messageTypeId: PayloadMessageTypes.warning
                            });
                        }
                        this.ChallanAmount = this.modelchallanData[0].feeAmount;
                        this.collectorid=this.modelchallanData[0].collectorId;

                        if (this.modelchallanData) {
                            if (this.modelchallanData.length > 0) {
                                if (this.modelchallanData[0].paidDate != null) {
                                    this.isAlreadyPaid = true;
                                }

                                this.TotalAmount = this.modelchallanData[0].feeAmount;
                            }
                        }
                    }
                )

            });


        }
    }

    InsertPaidDate() {
        this.FeeChallanrepository.GetAllChallandata(this.data.filterString).then(
            res => {
                this.modelchallanData = res as Array<IFeeStudentChallan>;

                this.paidDate = new Date(this.recievedDate);

                var dated = this.paidDate.getFullYear() + '/' + (this.paidDate.getMonth() + 1) + '/' + this.paidDate.getDate();

                //this.collectorId = '';
                //this.collectorId = this.CollectorList.find(e => e.description == this.collectorName).collectorId

                // alert(JSON.stringify(this.collectorId));

                var key = this.StudentFeedata[0].challanNo + '?' + dated + '?' + this.collectorid + '?' + this.modelchallanData[0].studentChallanId
                if (new Date(this.paidDate) <= new Date(this.currentDate)) {
                    this.FeeChallanrepository.updatePaidDate(key).then(() => this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Paid date Changed Successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    }));
                    this.StudentFeedata = [];

                    this.SearchFeeConfirmation();
                }

                else {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Paid date cannot be greater than Current Date',
                        title: 'Failed',
                        messageTypeId: PayloadMessageTypes.error
                    });
                }
            })

    }
    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('changePaidDate' in this.user.claims) == true) {
                if (this.user.claims['changePaidDate'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['changePaidDate'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['changePaidDate'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['changePaidDate'].indexOf('D') >= 0) {
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