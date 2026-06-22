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

import {
    IFeeConcessionDetail, ISetupClass, IAttendanceAttendanceDetail, IAttendanceAttendenceStatus, ICourseSection, IAttendenceData, IFeeConcessionDetailVM, ISetupSession, ISetupShift, ISetupCampus, IStudentModel, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupProgramDetailsVM, IFeeConcession, IFeeScholarshipCriteriaVM, ISetupAdmissionType, ISetupCampusProgramVM, IScholarshipStudentModel, IScholarshipApplyVM, IStudentToEnrollVM, IRegistrationSectionCourseLinkVM, IAttendanceAttendenceMaster, ICampusCityVM, ITimeTableTimeTable,
    ITimeTableTimeTableVM, IAttendanceAttendanceDetailVM, ITimeTableTimeTableTeacher
} from '../../../../models';
import { FeeConcessionDetailService, SetupClassService, TimeTableTimeTableService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, AttendanceAttendanceDetailService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import * as helper from '../../../../helper';
import { AttendanceAttendanceTeacher } from '../attendance-student';
import { addListener } from 'cluster';
import moment from 'moment';

interface IQueryParam {
    param: string;
    value: string;
    name: string;
}
@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'attendance-student': AttendanceAttendanceTeacher
    }
})

export class AttendanceTeacherUser extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    private scholarshipCriteriaId = ''
    private campusProgramId = '';
    private date: Date = new Date();
    private datestring = '';
    private temp='';
    private sectionCourseid = '';
    private courseId = '';
    private fullDayAbsent = false;
    private classId = '';
    private sectionCourseLinkId = '';
    private attendanceStatusId = '';
    private attendenceMasterId = '';
    private dated = ''
    private sectionId = ''
    private paramList: Array<IQueryParam> = [];

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

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private courseList: Array<ICourseSection> = [];
    private timeTableDataList: Array<ITimeTableTimeTableTeacher> = [];
    private data: Array<IAttendenceData> = [];
    private datas: any = [];
    private Ddata: any = [];



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
    private attendanceMasterTeacher: Array<IAttendanceAttendenceMaster> = [];




    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private isApproved: boolean = false;
    private attndanceId: number = 0;
    checkSession = false;
    checkCampus = false;
    checkProgram = false;
    checkClass = false;
    checkRibbon = false;
    private selected = []
    private columns = [
        { key: 'campusName', caption: 'Campus' },
        { key: 'description', caption: 'Program' },
        { key: 'className', caption: 'Class' },
        { key: 'sectionName', caption: `Section` },
        { key: 'fullName', caption: `Course` },
        { key: 'startTime', caption: 'Slot Timing' },
        { key: 'status', caption: `Status` },
        { key: 'action', caption: 'Action' }
    ];

    created() {
        //this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
        //this.datestring = (new Date(this.datestring).getFullYear()) + '-' + (new Date(this.datestring).getMonth() + 1) + '-' + (new Date(this.datestring).getDate());

        //this.loadTimeTableData();
        //  this.$watch('classId', this.loadCourses);
        this.loadClass();
        this.loadSession()
        this.loadCityCampus();
        this.$watch('programDetailId', this.loadClass);
        this.$watch('campusId', this.loadProgramsOfCampus);
        this.$watch('sessionId', this.loadTimeTableData);
        this.$watch('attndanceId', this.loadTimeTableData);
        this.$watch('datestring', this.loadTimeTableData);
        this.$watch('campusId', this.loadTimeTableData);
        this.$watch('programDetailId', this.loadTimeTableData);
        this.$watch('classId', this.loadTimeTableData);

    }
    addParam(isChecked: boolean, param: string) {
        console.log(isChecked, param)
        if (param == 'SessionId') {
            if (isChecked) {
                if (this.paramList.find(s => s.name == 'SessionId')) {
                    this.paramList.find(s => s.name == 'SessionId').value = this.sessionId;
                } else {
                    this.paramList.push({ param: "AND ab.\"SessionId\"", value: this.sessionId, name: 'SessionId' });
                }
            } else {
                if (this.paramList.find(s => s.name == 'SessionId')) {
                    this.paramList.splice(this.paramList.findIndex(s => s.name == 'SessionId'), 1);
                }
            }
        }
        if (param == 'ClassId') {
            if (isChecked) {
                if (this.paramList.find(s => s.name == 'ClassId')) {
                    this.paramList.find(s => s.name == 'ClassId').value = this.classId;
                } else {
                    this.paramList.push({ param: "AND ab.\"ClassId\"", value: this.classId, name: 'ClassId' });
                }
            } else {
                if (this.paramList.find(s => s.name == 'ClassId')) {
                    this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
                }
            }
        }
        if (param == 'CampusId') {
            if (isChecked) {
                if (this.paramList.find(s => s.name == 'CampusId')) {
                    this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
                } else {
                    this.paramList.push({ param: "AND ab.\"CampusId\"", value: this.campusId, name: 'CampusId' });
                }
            } else {
                if (this.paramList.find(s => s.name == 'CampusId')) {
                    this.paramList.splice(this.paramList.findIndex(s => s.name == 'CampusId'), 1);
                }
            }
        }

        if (param == 'ProgramDetailId') {
            if (isChecked) {
                if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
                    this.paramList.find(s => s.name == 'ProgramDetailId').value = this.programDetailId;
                } else {
                    this.paramList.push({ param: "AND ab.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
                }
            } else {
                if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
                    this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
                }
            }
        }

        if (param == 'Ribbon') {
            console.log('rib')
            if (isChecked) {
                if (this.paramList.find(s => s.name == 'Ribbon')) {
                    this.paramList.find(s => s.name == 'Ribbon').value = this.attndanceId.toString();
                } else {
                    this.paramList.push({ param: "AND ab.\"Ribbon\"", value: this.attndanceId.toString(), name: 'Ribbon' });
                }
            } else {
                if (this.paramList.find(s => s.name == 'Ribbon')) {
                    this.paramList.splice(this.paramList.findIndex(s => s.name == 'Ribbon'), 1);
                }
            }
        }

    }
    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }
    loadAttendanceStatus() {
        this.attendanceStatusRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => { this.attendanceStatusList = r as Array<IAttendanceAttendenceStatus> });
    }
    mounted() {
        this.validatePage();
        this.loadAttendanceStatus();
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

    markFullDayAbsent() {
        var absentid = this.attendanceStatusList.find(s => s.fullName.toLowerCase().startsWith('a')).attendenceStatusId
        var presentid = this.attendanceStatusList.find(s => s.fullName.toLowerCase().startsWith('p')).attendenceStatusId

        if (this.fullDayAbsent) {
            this.Ddata.forEach(s => {
                s.attendenceStatusId = absentid
            })
        }
        else {
            this.Ddata.forEach(s => {
                s.attendenceStatusId = presentid
            })
        }
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
            if (('attendanceTeacherUser' in this.user.claims) == true) {
                if (this.user.claims['attendanceTeacherUser'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['attendanceTeacherUser'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['attendanceTeacherUser'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['attendanceTeacherUser'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    loadTimeTableData() {

        //  
        if(this.temp!=moment(this.datestring).format("YYYY/MM/DD") && this.temp!='')

        {
                this.checkRibbon=false;
                this.attndanceId=0;
 
        }
         if(this.checkRibbon==false)
         {
             //if Attendence Status not selected Pass Unmarked in Function
             this.attndanceId=0;
             //var where = "ab.\"TimeTableId\" IS NOT NULL AND ab.\"Ribbon\"=''0''"
            var where = "ab.\"TimeTableId\" IS NOT NULL AND ab.\"Ribbon\"=0"

 
         }
        //var where = "ab.\"Dated\"=''" + moment(this.datestring).format('YYYY-MM-DD')+"''"

        

       
        
   
        var where = "ab.\"TimeTableId\" IS NOT NULL "
        console.log(this.paramList)
        this.paramList.forEach(e => {

            where = where + " " + e.param + "=''" + e.value + "''";

        })
        //where=where.substring(4,where.length)
        //where = where + " AND ab.\"Dated\"=" + moment(this.datestring).format('YYYY-MM-DD')
        console.log(where)
        this.timeTableDataList = [];

        //Edit on 13-01-2020
        // To Check Date Not Change on Against Attendence Status i.e Marks UnMarked
       

        var key = moment(this.datestring).format("YYYY/MM/DD") + '?' + this.attndanceId+"?"+where



         
        this.timeTableRepo.GetUserTimeTableRib(key)
      
            .then(response => {
                this.timeTableDataList = (response as Array<ITimeTableTimeTableTeacher>);

                this.temp= moment(this.datestring).format("YYYY/MM/DD") ;
            });
    }

    refreshData() {
 
        this.data = [];
        if (this.datestring != null && this.courseId.length > 0) {
            var key = this.datestring + '?' + this.courseId
            this.attendanceDetailRepo.GetAttendaceDataTeacher(key)
                .then(response => {
                    this.data = (response as Array<IAttendenceData>)
                });
        }
    }

    attendanceModel(model: ITimeTableTimeTableTeacher) {
 
        this.$modal.show('attendance-student', { model: model, dated: this.datestring, IsNewRecord: false });
        this.loadTimeTableData();
    }

    deleteModel(model: IFeeConcessionDetail) {
         
        this.$modal.show('delete-model', { model: model });
    }


}