/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { AttendanceAttendanceDetailService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, FeeConcessionDetailService, FeeConcessionService, FeeScholarshipCriteriaService, RegistrationEnrollmentsService, SetupAdmissionTypeService, SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupProgramDetailsService, SetupSessionService, SetupShiftService, TimeTableTimeTableService } from '../../../../service';
import {
    DDLGroupModel,
    DDLModel,
    IAttendanceAttendanceDetail,
    IAttendanceAttendanceDetailVMEx,
    IAttendanceAttendenceMaster,
    IAttendanceAttendenceStatus,
    IAttendenceDataEx,
    ICampusCityVM,
    ICourseSection,
    IFeeConcession,
    IFeeConcessionDetail,
    IFeeConcessionDetailVM,
    IFeeScholarshipCriteriaVM,
    IOperationAttendanceMaster,
    IReNewConcessionVM,
    IRegistrationSectionCourseLinkVM,
    IScholarshipApplyVM,
    IScholarshipStudentModel,
    IScholarshipsVM,
    ISetupAdmissionType,
    ISetupCampus,
    ISetupCampusProgramVM,
    ISetupClass,
    ISetupProgramDetails,
    ISetupProgramDetailsVM,
    ISetupSession,
    ISetupShift,
    IStudentModel,
    IStudentToEnrollVM,
    ITimeTableTimeTable,
    ITimeTableTimeTableVM
} from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import moment from "moment";

@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class ConcesssionReNewEx extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    private scholarshipCriteriaId = ''
    private campusProgramId = '';
    private date: Date = new Date();
    private fromdatestring = new Date();
    private todatestring = new Date();

    private classId = '';
    private sectionCourseLinkId = '';

    private sectionId = ''

    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private attendanceStatusList: Array<IAttendanceAttendenceStatus> = []
    private attendanceMaster: IAttendanceAttendenceMaster;
    private attendanceDetailList: Array<IAttendanceAttendanceDetail> = []
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []
    private classList: Array<ISetupClass> = []

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private courseList: Array<ICourseSection> = [];
    private programCourseList: Array<ITimeTableTimeTableVM> = [];
    private data: Array<IReNewConcessionVM> = [];
    maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }];




    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    //private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private attendanceDetailRepo: AttendanceAttendanceDetailService = new AttendanceAttendanceDetailService(this.$store)
    private attendanceStatusRepo: AttendanceAttendenceStatusService = new AttendanceAttendenceStatusService(this.$store)
    private attendanceMasterRepo: AttendanceAttendenceMasterService = new AttendanceAttendenceMasterService(this.$store)
    private CheckRepository: AttendanceAttendenceMasterService = new AttendanceAttendenceMasterService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private timeTableRepo: TimeTableTimeTableService = new TimeTableTimeTableService(this.$store)

    private opertation: IOperationAttendanceMaster = { approvalTime: '', approvedBy: 0, browserInfo: '', inTime: false, insertedBy: 0, insertionTime: '' }
    private mergeSectionList: any = []

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []
    private scholarshipList: Array<IScholarshipsVM> = []

    private columns = [
        { key: 'rollNo', caption: "Roll No" },
        { key: 'fullName', caption: "Name" },
        { key: 'admissionType', caption: "AdmissionType" },
        { key: 'concession', caption: "Concession" },
        { key: 'action', caption: "Action", width: 120 },
    ];

    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.loadSession();

        //var fdated = this.paidDate.getFullYear() + '/' + (this.paidDate.getMonth() + 1) + '/' + this.paidDate.getDate();

        //this.fromdatestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
        //this.todatestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);

        this.$watch(() => this.sessionId, this.loadSections);
        this.$watch(() => this.campusId, this.loadSections);
        this.$watch(() => this.programDetailId, this.loadSections);
        this.$watch(() => this.classId, this.loadSections);
        this.$watch(() => this.installmentNo, this.refreshData);

    }
    private isCheckedAll = false;
    checkAll() {
        if (this.isCheckedAll) {
            this.data.filter(s => s.isEligible).forEach(r => {
                r.isSelected = true;
            })
        }
        else {
            this.data.forEach(r => {
                r.isSelected = false;
            })
        }
    }


    loadScholarships() {
        this.scholarshipList = []
        if (this.campusId.length > 0 && this.sessionId.length > 0 && this.programDetailId.length > 0) {
            var campusProgramid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
            var key = campusProgramid;
            this.repository.GetScholarships(key)
                .then(r => {
                    this.scholarshipList = r as Array<IScholarshipsVM>
                })
        }
    }
    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }

    mounted() {
        //   this.validatePage();
        // this.refreshData();
    }

    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }

    loadCampus() {
        this.campusRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.campusList = r as Array<ISetupCampus>

            })
    }

    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }

    loadSections() {
        this.courseList = []
        this.sectionCourseLinkId = ''
        this.loadScholarships();
        this.refreshData();

        if (this.campusId.length > 0 && this.sessionId.length > 0 && this.programDetailId.length > 0 && this.classId.length > 0) {
            var campusProgramid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
            var key = campusProgramid + "?" + this.classId;
            this.enrollmentRepo.GetSectionList(key)
                .then(r => {
                    this.courseList = r as Array<ICourseSection>

                    // console.log(this.sectionList==null)
                    //alert(this.courseList.length)
                    if (this.courseList.length == 0) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Section not Defined',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }
                })
        }

    }


    loadProgramsOfCampus() {


        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        if (this.sessionId.length > 0 && this.campusId.length > 0) {


            var key = this.sessionId + "?" + this.campusId;
            this.campusProgramLinkRepo.GetAllVM(key).then(r => {
                this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
            });
        }


    }
    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('concessionRenew' in this.user.claims) == true) {
                if (this.user.claims['concessionRenew'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['concessionRenew'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['concessionRenew'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['concessionRenew'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }


    refreshData() {
        this.data = []
        if (this.sectionCourseLinkId.length > 0 && this.classId.length > 0) {
            var startdate = this.fromdatestring.getFullYear() + '/' + (this.fromdatestring.getMonth() + 1) + '/' + this.fromdatestring.getDate();
            var enddate = this.todatestring.getFullYear() + '/' + (this.todatestring.getMonth() + 1) + '/' + this.todatestring.getDate();

            var key = this.sectionCourseLinkId + "?" + this.classId + "?" + this.installmentNo;

            this.repository.ReNewConcessionEx(key)
                .then(r => {
                    this.data = r as Array<IReNewConcessionVM>
                })
        }

    }


    insertModel() {
        if (this.installmentNo > 0) {
            this.insertModelJson = []
            this.data.filter(s => s.isSelected).forEach(a => {
                this.insertModelJson.push({
                    admissionFormId: a.admissionFormId, installmentNo: this.installmentNo,
                    scholarshipId: a.scholarshipCriteriaId,classid:this.classId
                })
            })
            if (this.insertModelJson.length > 0) {

                var response=confirm('Are you Sure to Apply concession')

                if(response)
                {
                    this.repository.ReNewConcessionBulk(JSON.stringify(this.insertModelJson))
                    .then(r => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Concession Applied Successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                    })

                }

             
            }
            else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Please select any student',
                    title: 'warning',
                    messageTypeId: PayloadMessageTypes.warning
                })
            }
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please select any Installment no',
                title: 'warning',
                messageTypeId: PayloadMessageTypes.warning
            })
        }


    }

    private insertModelJson: Array<IReNewConcessionInsert> = [];
    private installmentNo: number = 0;


}

export interface IReNewConcessionInsert {
    scholarshipId: string;
    admissionFormId: string;
    installmentNo: number;
    classid:string;
}