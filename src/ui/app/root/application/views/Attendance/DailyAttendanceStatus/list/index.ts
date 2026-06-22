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
    ITimeTableTimeTableVM, IAttendanceAttendanceDetailVM, ITimeTableTimeTableTeacher, ITimeTableTimeTableDayClose, IDayCloseInsert, IOperationDayClose, ITimeTableTimeTableDayClose3, TimeTableDailyAttendanceStatus, TimeTableDailyAttendanceDetailmodel
} from '../../../../models';
import { FeeConcessionDetailService, SetupClassService, TimeTableTimeTableService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, AttendanceAttendanceDetailService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import * as helper from '../../../../helper';
import { AttendanceDailyAttendanceTeacher } from '../attendance-student';
import { MessageService } from '../../../../service/Message/message-service';
import { default as Axios } from 'axios';
import moment from "moment";
import { debug } from 'console';

//notification code start
export interface INotificationTypes {
    notificationtype: string;
}
export interface INotificationCredntials {

    sesseion: string;
    campus: string;
    program: string;
    classstudent: string;
    section: string;
    rollno: string;
    notificationObject: {
        notification: string;
        type: string;
        title: string;
        image: string;
    }
}
export interface IAttendanceNotificationEx {
    rollno: string;
    sessionId: string;
    campusId: string;
    campusProgramId: string;
    classId: string;
    sectionCourseLinkId: string;
    messageText: string;
}


@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'attendance-student': AttendanceDailyAttendanceTeacher
    }
})

export class DailyAttendanceStatus extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    private scholarshipCriteriaId = ''
    private campusProgramId = '';
    private date: Date = new Date();
    private datestring = ''
    private sectionCourseid = '';
    private courseId = '';
    private fullDayAbsent = false;
    private classId = '';
    private sectionCourseLinkId = '';
    private attendanceStatusId = '';
    private attendenceMasterId = '';
    private dated = ''
    private sectionId = ''
    private session: string = '0';
    private campus: string = '0';
    private CampusProgramId: string = '0';
    private cclassid: string = '0';
    private sectionCourseLink: string = '0';
    private srollno: string = '0';
    private datenotification = '';
    private Messaage = '';
    private titletxt = '';
    private imagetxt = '';
    private notifType = '';

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
    private timeTableDataList: Array<ITimeTableTimeTableDayClose> = [];
    private listofTimeTableData: Array<TimeTableDailyAttendanceStatus> = [];
    private data: Array<IAttendenceData> = [];
    private datas: any = [];
    private Ddata: any = [];
    private isDisabled: boolean = false;
    private enablebutton: boolean = false;
    private showmodel: boolean = false;
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

    private checkAll: boolean = false;
    private updateList: Array<IDayCloseInsert> = []

    private opertation: IOperationDayClose = { insertedBy: 0, browserInfo: '', insertionTime: '' }
    private timestamp: string = '';
    //private timestamp: Date = new Date();
    private TeacherDetailList: Array<TimeTableDailyAttendanceDetailmodel> = []

    private staffId: string = '';
    private teachername: string = '';
    private contactnumber: string = '';
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private isApproved: boolean = false;
    private attndanceId: number = 2;
    private selected = []
    private columns = [
        { key: "teacherName", caption: 'Teacher Name' },
        { key: 'email', caption: 'Email' },
        { key: 'totalLecture', caption: 'Scheduled Lectures ' },
        { key: 'lecturesMarked', caption: 'Marked Lectures' },
        { key: 'lecturesUnMarked', caption: 'Un-Marked Lectures' },
        { key: 'onTime', caption: 'On Time' },
        { key: 'offTime', caption: 'Off Time' },
        { key: 'isChecked', caption: 'Action' },


    ];
    service: MessageService = new MessageService(this.$store)
    private notificationRepo: MessageService = new MessageService(this.$store);

    created() {


        this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);



    }


    displayTime: string = '';
    currentTimeMinus10PM() {
        let currentTime = new Date();
        let tenPM = new Date();
        tenPM.setHours(22, 0, 0, 0);
        let difference = tenPM.getTime() - currentTime.getTime();
        let result = new Date(difference);
        let hours = result.getUTCHours();
        let minutes = result.getUTCMinutes();
        let seconds = result.getUTCSeconds();

        this.displayTime = `${this.pad(hours, 2)} : ${this.pad(minutes, 2)} : ${this.pad(seconds, 2)}`;
    }

    pad(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    }


    // loadAttendanceStatus() {
    //     this.attendanceStatusRepo.GetFindBy('s=>s.StatusId!=2')
    //         .then(r => { this.attendanceStatusList = r as Array<IAttendanceAttendenceStatus> });
    // }
    mounted() {

        this.validatePage();

        this.loadTimeTableData();

        setInterval(() => this.currentTimeMinus10PM(), 1000);

        this.refreshData();
        this.showmodel = false;
        this.flagg = false;
        this.markflag=false;

    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('dailyAttendanceStatus' in this.user.claims) == true) {
                if (this.user.claims['dailyAttendanceStatus'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['dailyAttendanceStatus'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['dailyAttendanceStatus'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['dailyAttendanceStatus'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }
    flagg: boolean = false;
    markflag: boolean = false;

    CheckDataDetail(status) {
        debugger
        this.TeacherDetailList = [];

        if (status == 'Un-Marked') {
            this.flagg = true;
            this.markflag = false;
        }
        else if (status = 'Marked') {
            this.flagg = false;
            this.markflag = true;
        }

        var key = this.staffId + '?' + this.datestring + '?' + status
        this.timeTableRepo.GetDailyAttendanceTeacherDeatail(key)
            .then(response => {
                this.TeacherDetailList = (response as Array<TimeTableDailyAttendanceDetailmodel>);

            });

    }


    loadTimeTableData() {

        this.listofTimeTableData = [];

        var key = this.datestring + '?' + this.attndanceId

        this.timeTableRepo.GetDailyAttendanceStatus(key)
            .then(response => {
                this.listofTimeTableData = (response as Array<TimeTableDailyAttendanceStatus>);
                console.log(this.listofTimeTableData);
            });
    }
    refreshData() {

        this.checkAll = false;

        this.loadTimeTableData();

    }

    // attendanceModel(model: ITimeTableTimeTableTeacher) {
    //     this.$modal.show('attendance-student', { model: model, IsNewRecord: false });
    // }

    // deleteModel(model: IFeeConcessionDetail) {
    //     this.$modal.show('delete-model', { model: model });
    // }
    toggel() {
        this.showmodel = !this.showmodel;
    }
    viewdata(staffid, teacherName, contactnumber) {

        this.showmodel = true;
        this.staffId = staffid;
        this.teachername = teacherName;
        this.contactnumber = contactnumber.replace('"', '').replace('"', '');

        this.CheckDataDetail('Un-Marked');
    }

}