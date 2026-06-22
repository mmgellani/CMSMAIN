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

import { IAdmissionAdmissionForm, ISetupCampus, ISetupSession, ISetupCampusProgramLinkVM, IAdmissionAdmissionFormVM, IAdmissionAdmissionFormCplVM, ICampusCityVM, DDLGroupModel, DDLModel, IExaminationExamDetailVM, IFeeSubinstallmentVM, IGetStudentsVM } from '../../../../models';
import { AdmissionAdmissionFormService, SetupCampusService, SetupSessionService, SetupProgramDetailsService, SetupCampusProgramLinkService, ExaminationExamDetailService, FeeStudentChallanService, FeeConcessionDetailService } from '../../../../service';

import { AdmissionAdmissionFormAddEdit } from '../add-edit';
import { AdmissionAdmissionFormDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { ReportEngine } from '../../../../../../components/report/report-engine';
import { ReportsService } from '../../../../service/Reports/AdmissionReports';
import { FeeStudentChallanAddEdit } from '../../../Fee/StudentChallan/add-edit';
import { FeeStudentChallanApplyConcession } from '../../../Fee/StudentChallan/apply-concession';
import { FeeStudentSubInstallmentAddEdit } from '../../../Fee/SubInstallment/add-edit';
import { FeeStudentExemptionAddEdit } from '../../../Fee/feeExemption/add-edit';
import { Helper } from '../../../Fee/Helper';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': AdmissionAdmissionFormAddEdit,
        'delete-model': AdmissionAdmissionFormDelete,
        // "report-engine": ReportEngine,
        'student-challan-add-edit-model': FeeStudentChallanAddEdit,
        'apply-concession-model': FeeStudentChallanApplyConcession,
        "student-sub-installment-add-edit-model": FeeStudentSubInstallmentAddEdit,
        "fee-student-exemption-add-edit-model": FeeStudentExemptionAddEdit,
        "helper-modal": Helper,
    }
})

export class AdmissionAdmissionFormListEx extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private studentInfo: any = {};
    private indexId: number = 0

    private repository: AdmissionAdmissionFormService;
    private studentExemptionRepository: FeeStudentChallanService;
    private reportRepo: ReportsService;
    private data: Array<IAdmissionAdmissionFormCplVM> = [];
    private filterString: string = '';

    private campusId = ''
    private sessionId = ''
    private campusProgramId = ''
    private reportDate: any = [];
    private report: String = "";

    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    private campusCityList: Array<ICampusCityVM> = []

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []

    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(this.$store)

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private examDetailModel: Array<IExaminationExamDetailVM> = [];
    private repositoryExamDetail: ExaminationExamDetailService;

    private Challandata: Array<IFeeSubinstallmentVM> = [];
    private studentChallanRepository: FeeStudentChallanService;
    private modelVM: Array<IFeeSubinstallmentVM> = [];

    private datas: Array<IGetStudentsVM> = [];
    private concessionRepository: FeeConcessionDetailService;



    private subInstallmentRepository: FeeStudentChallanService;
    childKey: string = '';

    private columns = [
        { key: 'refferenceNo', caption: 'Reference No.' },
        { key: 'fullName', caption: 'Student Name' },
        { key: 'fatherName', caption: "Father Name" },
        { key: 'admissionStatus', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new AdmissionAdmissionFormService(this.$store);
        this.studentChallanRepository = new FeeStudentChallanService(this.$store);
        this.concessionRepository = new FeeConcessionDetailService(this.$store);
        this.subInstallmentRepository = new FeeStudentChallanService(this.$store);
        this.studentExemptionRepository = new FeeStudentChallanService(this.$store);
        // this.loadCampus();
        this.loadSession();
        // this.loadCityCampus();
        this.reportRepo = new ReportsService(this.$store);
        this.repositoryExamDetail = new ExaminationExamDetailService(this.$store);

        //this.$watch(() => this.childKey, e => { this.getAdmissionSlip(this.childKey) });
    }

    cities = [];
    loadCities(city) {
        if (this.campusCityList) {
            if (this.campusCityList.length > 0) {
                return this.campusCityList.filter(e => e.cityName == city);
            }
        }
    }

    loadCityCampus() {
        if (this.sessionId.length > 0) {
            this.campusddl = [];
            this.cityDDL = [];
            let oldObj: ICampusCityVM;
            this.campusRepo.GetCityVM()
                .then(r => {
                    this.campusCityList = r as Array<ICampusCityVM>;
                    this.cities = [];
                    this.campusCityList.forEach(element => {
                        if (this.cities.indexOf(element.cityName) == -1) {
                            this.cities.push(element.cityName);
                        }
                    });
                })
        }
    }
    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }

    mounted() {
        this.validatePage();
        // this.getExamDetail();
    }

    getExamDetail() {
        this.examDetailModel = [];
        this.repositoryExamDetail.GetFindBy('e => e.StatusId!=2')
            .then(response => this.examDetailModel = (response as Array<IExaminationExamDetailVM>));
    }



    getAdmissionSlip(sessionId, campusId, student, refferenceNo) {
        var z = refferenceNo.split('');
        if (z.length > 0) {
            if (z[0] == 'S') {
                var key = sessionId + '?' + campusId + '?' + student;
                this.reportRepo.GetAdmissionSlip(key).then(response => {
                    this.reportDate = response as any;
                    this.report = "assets/Reports/Resource/Admission/Scholorship_Report.xml";
                    this.$modal.show("report-viewer-eng");
                });
            }
            else {
                var key = sessionId + '?' + campusId + '?' + student;
                this.reportRepo.GetAdmissionSlip(key).then(response => {
                    this.reportDate = response as any;

                    this.report = "assets/Reports/Resource/Admission/admissionReport.xml";
                    this.$modal.show("report-viewer-eng");
                });

            }

        }


    }


    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('admissionAdmissionFormDirectEnroll' in this.user.claims) == true) {

                if (this.user.claims['admissionAdmissionFormDirectEnroll'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['admissionAdmissionFormDirectEnroll'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['admissionAdmissionFormDirectEnroll'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['admissionAdmissionFormDirectEnroll'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData(params) {
        if (this.campusId.length > 0) {
            this.fireChallan(params);
            this.data = [];
            if (this.sessionId.length > 0 && this.campusId.length > 0) {
                var key = this.sessionId + '?' + this.campusId
                this.repository.GetAllVM(key)
                    .then(response => this.data = (response as Array<IAdmissionAdmissionFormCplVM>));
            }
            // if (this.sessionId.length > 0) {
            //     var key = this.sessionId
            //     this.repository.GetSessionWise(key)
            //         .then(response => this.data = (response as Array<IAdmissionAdmissionFormCplVM>));
            // }
        }
    }

    insertModel() {

        if (this.campusId.length > 0 && this.sessionId.length > 0) {
            this.$modal.show('add-edit-model', { model: { admissionFormId: '', campusProgramId: '', studentId: '', admissionTypeId: '', rollNo: '', refferenceNo: '', academicInfo: '', statusId: 0, loggerId: '', }, IsNewRecord: true, sessionId: this.sessionId, campusId: this.campusId });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdowns",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }


    }

    editModel(model: IAdmissionAdmissionFormVM) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false, sessionId: this.sessionId, campusId: this.campusId });
    }

    deleteModel(model: IAdmissionAdmissionForm) {
        this.$modal.show('delete-model', { model: model });
    }

    feePreviewModel(referenceNo: string) {
        this.Challandata = [];
        this.studentChallanRepository.GetFeeByRefrenceNo(referenceNo).then(res => {
            this.Challandata = res as Array<IFeeSubinstallmentVM>;

            Object.assign(this.modelVM, this.Challandata);
            this.report = "assets/Reports/Resource/Admission/Report1.xml";
            // this.$modal.show("report-viewer-eng");
            this.$modal.show("student-challan-add-edit-model", { modelVM: this.modelVM });
        });
    }

    concessionModel(referenceNo: string) {
        this.datas = [];
        this.concessionRepository.StudentByRef(referenceNo)
            .then(res => {
                this.datas = res as Array<IGetStudentsVM>

                Object.assign(this.modelVM, this.datas)
                this.$modal.show("apply-concession-model", { modelVM: this.modelVM })
            })
    }
    installmentModel(referenceNo: string) {
        this.Challandata = [];
        this.subInstallmentRepository.GetFeeByRefrenceNo(referenceNo)
            .then(res => {
                this.Challandata = res as Array<IFeeSubinstallmentVM>

                Object.assign(this.modelVM, this.Challandata)
                this.$modal.show("student-sub-installment-add-edit-model", { modelVM: this.modelVM })
            })
    }

    feeExemptionModel(referenceNo: string) {
        this.Challandata = [];
        this.studentExemptionRepository.GetFeeByRefrenceNo(referenceNo).then(res => {
            this.Challandata = res as Array<IFeeSubinstallmentVM>;

            Object.assign(this.modelVM, this.Challandata);

            this.$modal.show("fee-student-exemption-add-edit-model", {
                sessionid: this.sessionId,
                campusid: this.campusId,
                modelVM: this.modelVM
            });
        });
    }

    helper(dta) {
        this.studentInfo = dta;
        this.$modal.show("helper-modal");
    }


    fireChallan(params) {
        if (params) {
            if (params.report) {
                this.reportDate = params.data as any;
                this.report = params.report;
                this.$modal.show("report-viewer-eng");
            }
        }
    }
}
