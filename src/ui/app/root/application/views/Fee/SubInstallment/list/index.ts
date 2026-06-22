/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IFeeStudentChallan, IFeeStudentChallanVM, IFeeStudentFeeStructureVM, ISetupCampus, ISetupSession, DDLGroupModel, DDLModel, ISetupCampusProgramVM, IFeeSubinstallmentVM, ICampusCityVM } from '../../../../models';
import { FeeStudentChallanService, FeeStudentFeeStructureService, SetupCampusService, SetupSessionService, SetupCampusProgramLinkService } from '../../../../service';

import { FeeStudentSubInstallmentAddEdit } from '../add-edit';
import { FeeStudentChallanDelete } from '../delete';

@Component({
    name: 'feeSubInstallment',
    template: require('./index.html'),
    components: {
        'student-sub-installment-add-edit-model': FeeStudentSubInstallmentAddEdit,
        'delete-model': FeeStudentChallanDelete
    }
})

export class feeSubInstallment extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeStudentChallanService;
    private Campusepository: SetupCampusService = null;
    private Sessionrepository: SetupSessionService;
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private StudentFeerepository: FeeStudentFeeStructureService;
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)

    private data: Array<IFeeStudentFeeStructureVM> = [];
    private Tempdata: Array<IFeeStudentFeeStructureVM> = [];
    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    private campusId: string = '';
    private sessionId: string = '';
    private campusProgramId: string = '';

    private modelVM: Array<IFeeSubinstallmentVM> = [];
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []

    private campusCityList: Array<ICampusCityVM> = []

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []


    private Challandata: Array<IFeeSubinstallmentVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'refferenceNo', caption: 'ReferenceNo', sort: true },
        { key: 'fullName', caption: 'StudentName', sort: true },
        { key: 'fatherName', caption: 'ParentName' },
        { key: 'description', caption: "Program" },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new FeeStudentChallanService(this.$store);
        this.StudentFeerepository = new FeeStudentFeeStructureService(this.$store);
        this.Campusepository = new SetupCampusService(this.$store);
        this.Sessionrepository = new SetupSessionService(this.$store)
        // this.loadCityCampus();
        this.loadSession();
        this.$watch("campusId", this.loadProgramsOfCampus);
        this.$watch("sessionId", this.loadCityCampus);
        this.$watch("campusProgramId", this.GetAllFilterData);
    }

    mounted() {
        this.validatePage();
    }

    loadSession() {
        this.Sessionrepository.GetFindBy('e=>e.StatusId==1').then(
            res => {
                this.sessionList = res as Array<ISetupSession>
            });
    }

    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }
    loadProgramsOfCampus() {
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionId + "?" + this.campusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
        });
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('feeSubInstallment' in this.user.claims) == true) {
                if (this.user.claims['feeSubInstallment'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeSubInstallment'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeSubInstallment'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeSubInstallment'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        // this.StudentFeerepository.GetAllVM().then(res => {
        //     this.data = res as Array<IFeeStudentFeeStructureVM>
        // })
        // this.repository.GetAllVM()
        //     .then(response => this.data = (response as Array<IFeeStudentChallanVM>));
    }



    insertModel() {
        this.$modal.show('student-sub-installment-add-edit-model', { model: { studentChallanId: '', admissionFormId: '', classId: '', installmentNo: 0, challanNo: '', feeAmount: 0, dueDate: new Date(), paidDate: new Date(), statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(referenceNo: string) {

        this.repository.GetFeeByRefrenceNo(referenceNo)
            .then(res => {
                this.Challandata = res as Array<IFeeSubinstallmentVM>

                Object.assign(this.modelVM, this.Challandata)
                this.$modal.show('student-sub-installment-add-edit-model', { modelVM: this.modelVM })
            })
    }


    GetAllFilterData() {
        var ProgramDetialid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.campusProgramId == this.campusProgramId).programDetailId
        var key = this.sessionId + ',' + this.campusId + ',' + ProgramDetialid;
        this.StudentFeerepository.GetAllFilterData(key).then(res => {
            this.data = res as Array<IFeeStudentFeeStructureVM>
        })
    }
    deleteModel(model: IFeeStudentChallan) {
        this.$modal.show('delete-model', { model: model });
    }
}