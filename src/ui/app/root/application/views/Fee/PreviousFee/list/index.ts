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


import { StoreTypes } from '../../../../../../store';
import { ReportEngine } from '../../../../../../components/report/report-engine';
import { ReportsService } from '../../../../service/Reports/AdmissionReports';
import { FeeStudentChallanAddEdit } from '../../StudentChallan/add-edit';
import { FeeStudentChallanApplyConcession } from '../../StudentChallan/apply-concession';
import { FeeStudentSubInstallmentAddEdit } from '../../SubInstallment/add-edit';
import { FeeStudentExemptionAddEdit } from '../../feeExemption/add-edit';
import { Helper } from '../../Helper';
import { PreviousFeeAddEdit } from '../add-edit';

@Component({
    name: 'previous-fee',
    template: require('./index.html'),
    components: {
        "add-edit-model": PreviousFeeAddEdit,
    }

})

export class PreviousFee extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: AdmissionAdmissionFormService;
    private data: Array<IAdmissionAdmissionFormCplVM> = [];
    private campusId = ''
    private sessionId = ''
    private indexId = ''
    private title: string = '';


    private sessionList: Array<ISetupSession> = []
    private campusCityList: Array<ICampusCityVM> = []

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []

    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private datas: Array<IGetStudentsVM> = [];

    private columns = [
        { key: 'refferenceNo', caption: 'Reference No.' },
        { key: 'fullName', caption: 'Student Name' },
        { key: 'fatherName', caption: "Father Name" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new AdmissionAdmissionFormService(this.$store);
        this.loadSession();
        this.title = '';

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






    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('previousFee' in this.user.claims) == true) {
                if (this.user.claims['previousFee'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['previousFee'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['previousFee'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['previousFee'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        if (this.sessionId.length > 0 && this.campusId.length > 0) {
            var key = this.sessionId + '?' + this.campusId
            this.repository.GetAllVM(key)
                .then(response => this.data = (response as Array<IAdmissionAdmissionFormCplVM>));
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
        this.$modal.show('add-edit-model', { model: model, sessionId: this.sessionId, campusId: this.campusId });
    }

    deleteModel(model: IAdmissionAdmissionForm) {
        this.$modal.show('delete-model', { model: model });
    }



}
