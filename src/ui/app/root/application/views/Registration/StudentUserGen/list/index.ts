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

import moment from "moment";

import {
    IFeeConcessionDetail, ISetupClass, IAttendanceAttendanceDetail, IAttendanceAttendenceStatus, ICourseSection, IAttendenceData, IFeeConcessionDetailVM, ISetupSession, ISetupShift, ISetupCampus, IStudentModel, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupProgramDetailsVM, IFeeConcession, IFeeScholarshipCriteriaVM, ISetupAdmissionType, ISetupCampusProgramVM, IScholarshipStudentModel, IScholarshipApplyVM, IStudentToEnrollVM, IRegistrationSectionCourseLinkVM, IAttendanceAttendenceMaster, ICampusCityVM, ITimeTableTimeTable,
    ITimeTableTimeTableVM, IAttendanceAttendanceDetailVM, IAttendanceBulkModel, IAttendanceBulkChild, IAttendanceBulkModelU, IAttendanceBulkChildU
    , IOperationAttendanceMaster,
    IVMChallanValidityUpdate,
    ChallanBReport,
    StudentUserGenEx
} from '../../../../models';
import { FeeConcessionDetailService, SetupClassService, TimeTableTimeTableService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, AttendanceAttendanceDetailService, RegistrationSectionCourseLinkService, FeeChallanValidityService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import * as helper from '../../../../helper';

// import { AttendanceSlot } from './attendanceslot';
import { debug } from 'util';
import { IBoardVWCampusStudentLink } from '../../../../models/Board/VWCampusStudentLink';
import { BoardCampusStudentLinkService } from '../../../../service/Board/CampusStudentLink';
import { ReportEngine } from '../../../../../../components';
// export interface IAttendanceDetailUpdate {
//     attendanceDetailId: string;
//     attendenceStatusId: string;
// }
@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        // "report-engine": ReportEngine
    }
    // components: {
    //     'CampusStudentLink-add-edit-model': BoardCampusStudentLinkAddEdit
    // }
})

export class StudentUserGen extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private SectionCourserepository: RegistrationSectionCourseLinkService;
    private repository: FeeChallanValidityService;
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    private scholarshipCriteriaId = ''
    private campusProgramId = '';
    private datestring = ''
    private sectionCourseid = '';
    private courseId = '';
    private fullDayAbsent = false;
    private classId = '';
    private sectionCourseLinkId = '';
    private attendanceStatusId = '';
    private attendenceMasterId = '';
    private reportData: any = [];
    private report: String = "";
    private title = 'Confirmation';



    private selectAll: boolean = false;
    private isSelected: boolean = false;



    private installmentNo = 1;
    private dueDate = '';

    private StudentList: Array<StudentUserGenEx> = [];
    private ChallanRList: Array<ChallanBReport> = [];

    // private dated = ''
    private sectionId = '';
    private opertation: IOperationAttendanceMaster = { approvalTime: '', approvedBy: 0, browserInfo: '', inTime: false, insertedBy: 0, insertionTime: '' }

    private detailData: Array<IAttendanceAttendanceDetailVM> = [];
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
    private attendanceBulkListI: Array<IAttendanceBulkModel> = []
    private attendanceBulkListU: Array<IAttendanceBulkModelU> = []
    private attendanceBulkList: any = [];
    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private courseList: Array<ICourseSection> = [];
    private programCourseList: Array<ITimeTableTimeTableVM> = [];
    private data: Array<IAttendenceData> = [];
    private datas: any = [];
    private Ddata: any = [];
    // private updateAttendanceList: Array<IAttendanceDetailUpdate> = [];

    private templist: any = [];

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
    private sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];
    // private updateList: Array<IUpdateDueDate> = []

    private columns = [
        { key: 'rollNo', caption: 'Roll No.' },
        { key: 'fullName', caption: `Student's Name` },
        { key: 'isSelected', caption: 'Selected' },
    ];

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []

    created() {
        this.repository = new FeeChallanValidityService(this.$store);
        this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
        this.loadSession();
        // this.loadCityCampus();
    }

    checkAll() {
        if (this.selectAll == true) {
            this.StudentList.forEach(element => {
                element.isSelected = true;
            });
        }
        else {
            this.StudentList.forEach(element => {
                element.isSelected = false;
            });
        }
    }
    loadProgramSection() {
        this.campusProgramId = '';
        if(this.programDetailId.length>0)
        this.campusProgramId = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.programDetailId == this.programDetailId).campusProgramId;
        if(this.campusId.length>0 && this.campusProgramId.length>0 && this.classId.length>0)
        {
        this.SectionCourserepository.GetSectionData(this.campusId + `?` + this.campusProgramId + `?` + this.classId)
            .then(response => {
                this.sectionCourseLinkList = response as Array<IRegistrationSectionCourseLinkVM>
            });
        }
    }
    loadClass() {
        this.classId = '';
        this.sectionCourseLinkId = '';
        this.classList = [];
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }

    mounted() {
        this.validatePage();
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

    loadSections(key: string) {
        this.enrollmentRepo.GetSectionList(key)
            .then(r => {
                this.courseList = r as Array<ICourseSection>
                if (this.courseList.length == 0) {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Section not Defined',
                        title: 'warning',
                        messageTypeId: PayloadMessageTypes.warning
                    });
                }
            })
    }
    loadProgramsOfCampus() {
        this.campusProgramLinkList = [];
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        if(this.sessionId.length>0 && this.campusId.length>0)
        {
        var key = this.sessionId + "?" + this.campusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
        });
    }
    }

    // loadChallanValidity(){
    //     var key1 = this.campusId; 
    //     this.repository.GetFindByChallanValidity(key1)
    //     .then(r => {
    //         this.$store.dispatch(StoreTypes.updateStatusBar, {
    //             text: 'Updated Successfully',
    //             title: 'success',
    //             messageTypeId: PayloadMessageTypes.success
    //         });
    //     })
    // }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('registrationStudentUserGen' in this.user.claims) == true) {
                if (this.user.claims['registrationStudentUserGen'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['registrationStudentUserGen'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['registrationStudentUserGen'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['registrationStudentUserGen'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }
    refreshData() {
        this.StudentList = [];
        if (this.sessionId.length > 0 && this.campusId.length > 0 && this.programDetailId.length > 0 && this.classId.length > 0 && this.sectionCourseLinkId.length > 0) {

            var key = this.sectionCourseLinkId
            this.repository.GetStudentList(key)
                .then(r => {
                    this.StudentList = r as Array<StudentUserGenEx>
                })
        }
    }

    // generateChallanReport() {
    //     this.ChallanRList = [];
    //     this.reportData = [];
    //     var key = this.campusId + "?" + this.programDetailId + "?" + this.sectionCourseLinkId + "?" + this.installmentNo + "?" + this.user.displayName
    //     this.repository.get_challan_report(key)
    //         .then(r => {
    //             this.ChallanRList = r as Array<ChallanBReport>
    //             this.reportData = this.ChallanRList as any;
    //             this.report =
    //                 "/assets/Reports/Resource/Admission/student-challan.xml";
    //             this.$modal.show("report-viewer-eng");
    //         })
    // }


    // editModel(model: IScholarshipApplyVM) {
    //     this.$modal.show('add-edit-model', { model: this.datas.filter(s=>s.scholarshipName==model.scholarshipName)});
    // }

    insertModel() {
        // this.updateList = [];
        this.templist = [];

        this.StudentList.filter(s => s.isSelected).forEach(e => {
            this.templist.push({ studentId: e.studentId })
        })

        var key = JSON.stringify(this.templist);
        this.repository.StudentUserGen(key)
            .then(r => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Created Successfully',
                    title: 'success',
                    messageTypeId: PayloadMessageTypes.success
                });
                this.refreshData();
            })
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }

    get allowSubmit() {
        return (
            this.sessionId.length > 0 && this.campusId.length > 0 && this.programDetailId.length > 0 &&
            this.classId.length > 0 && this.sectionCourseLinkId.length > 0
        )
    }
}

