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
import axios from 'axios';

import { IFeeFeeHead, IFeeStudentFeeStructureVM, IFeeStudentChallanVM, ISetupCollector, IFeeStudentChallan, StudentConcessedData } from '../../../../models';
import { FeeFeeHeadService, FeeStudentChallanService, SetupCollectorService } from '../../../../service';
import { StoreTypes } from '../../../../../../store';
import { IAdmissionReportsData } from '../../../../models/Reports/AdmissionReports';

@Component({
    name: 'singleConcession',
    template: require('./index.html'),

})

export class SingleConcession extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    //using VW-studentFeeVM get ConcessionStudentData

    private ConStddata: Array<StudentConcessedData> = [];

    private repository: FeeFeeHeadService;
    private data: Array<IFeeFeeHead> = [];

    private FatherName: string = '';

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
    private columns = [
        { key: 'RefrenceNo', caption: 'Refferenco No' },
        { key: 'Name', caption: "Name" },
        { key: 'FatherName', caption: "Father Name" }
    ];

    created() {
        this.repository = new FeeFeeHeadService(this.$store);
        this.FeeChallanrepository = new FeeStudentChallanService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();

    }

    SearchSingleConcession() {
        this.TotalAmount = 0;

        this.FeeChallanrepository.GetSingleConcessionFeeByRefrenceNo(this.filterString).then(res => {
            this.ConStddata = res as Array<StudentConcessedData>
            this.RefrenceNo = this.ConStddata[0].refferenceNo;
            this.Name = this.ConStddata[0].fullName;
            this.FatherName = this.ConStddata[0].fatherName;
        });


    }

    InsertPaidDate() {

        alert('concessoin Applied')

    }
    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('singleConcession' in this.user.claims) == true) {
                if (this.user.claims['singleConcession'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['singleConcession'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['singleConcession'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['singleConcession'].indexOf('D') >= 0) {
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