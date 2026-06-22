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

import { IFeeFeeHead, IFeeStudentFeeStructureVM, IFeeStudentChallanVM, ISetupCollector, IFeeStudentChallan } from '../../../../models';
import { FeeFeeHeadService, FeeStudentChallanService, SetupCollectorService } from '../../../../service';
import { StoreTypes } from '../../../../../../store';

import WidgetBox from '../../../../../home/widget-box/index';

@Component({
    name: 'feeConfirmation',
    template: require('./index.html'),
    components: {
        WidgetBox
    }
})

export class ChallanCancel extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeFeeHeadService;
    private data: Array<IFeeFeeHead> = [];

    private Collectorrepository: SetupCollectorService = null;
    CollectorList: Array<ISetupCollector> = [];
    private RefrenceNo: string = '';
    private Name: string = '';
    private fatherName: string = '';
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

    isAlreadyPaid: boolean = true;

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
        this.TotalAmount = 0;
        this.isAlreadyPaid = false;
        this.StudentFeedata = [];

        this.RefrenceNo = this.Name = this.fatherName = this.campusName = this.description =
            this.className = this.bankName = this.accountNo = this.branch = this.code = this.documentNo = this.dueDate =
            this.recievedDate = this.feeHead = '';
        this.installmentNO = this.stfeeamount = this.payableAmount = 0;

        this.FeeChallanrepository.GetFeeCancelByChallanNo(this.filterString).then(res => {
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

            this.FeeChallanrepository.GetFeeCancelByChallanNo(this.filterString).then(
                res => {

                    this.Collectorrepository.GetFindBy('e=>e.CampusId.ToString()=="' + this.campusId + '"').then(
                        res => {
                            this.CollectorList = res as Array<ISetupCollector>
                        }
                    )
                    this.modelchallanData = res as Array<IFeeStudentChallan>
                    this.ChallanAmount = this.modelchallanData[0].feeAmount;

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

    cancelChallan() {
        this.FeeChallanrepository.CancelChallan(this.filterString)
            .then(r => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Challan Cancelled Successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                })
            })
    }
    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('challanCancel' in this.user.claims) == true) {
                if (this.user.claims['challanCancel'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['challanCancel'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['challanCancel'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['challanCancel'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAll()
            .then(response => this.data = (response as Array<IFeeFeeHead>));
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
}