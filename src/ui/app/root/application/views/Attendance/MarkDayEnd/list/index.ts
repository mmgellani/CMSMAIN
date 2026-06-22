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
    ITimeTableTimeTableVM, IAttendanceAttendanceDetailVM, ITimeTableTimeTableTeacher, ITimeTableTimeTableDayClose, IDayCloseInsert, IOperationDayClose, ITimeTableTimeTableDayClose3
} from '../../../../models';
import { FeeConcessionDetailService, SetupClassService, TimeTableTimeTableService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, AttendanceAttendanceDetailService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import * as helper from '../../../../helper';
import { AttendanceAttendanceTeacher } from '../attendance-student';
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
        'attendance-student': AttendanceAttendanceTeacher
    }
})

export class MarkDayEnd extends Vue {
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
    private listofTimeTableData: Array<ITimeTableTimeTableDayClose3> = [];
    private data: Array<IAttendenceData> = [];
    private datas: any = [];
    private Ddata: any = [];
    private isDisabled: boolean = false;
    private enablebutton: boolean= false;

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
    private AttendanceNotificationEx: Array<IAttendanceNotificationEx> = [];

    private checkAll: boolean = false;
    private updateList: Array<IDayCloseInsert> = []

    private opertation: IOperationDayClose = { insertedBy: 0, browserInfo: '', insertionTime: '' }






    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private isApproved: boolean = false;
    private attndanceId: number = 2;
    private selected = []
    private columns = [
        { key: "sectionName", caption: 'Section' },
        { key: 'className', caption: 'Class' },
        { key: 'programDetail', caption: 'Program ' },
        { key: 'lecturesApproved', caption: 'Lectures Approved' },
        { key: 'unApprovedLectures', caption: 'Lectures Un-Approved' },
        { key: 'unMarkedLectures', caption: 'Lectures Un-Marked' },
        { key: 'isChecked', caption: 'Select All' }
    ];
    service: MessageService = new MessageService(this.$store)
    private notificationRepo: MessageService = new MessageService(this.$store);

    created() {
        //this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
        //  this.datestring = (new Date(this.datestring).getFullYear()) + '-' + (new Date(this.datestring).getMonth() + 1) + '-' + (new Date(this.datestring).getDate());
        this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
        // alert(JSON.stringify(this.datestring));
        this.refreshData();

    }
    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }
    loadAttendanceStatus() {
        this.attendanceStatusRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.attendanceStatusList = r as Array<IAttendanceAttendenceStatus> });
    }
    mounted() {

        this.validatePage();
        this.loadAttendanceStatus();

        // this.refreshData();

    }

    insertModel() {
    
        this.updateList = [];
        var masterkey = ''
        this.listofTimeTableData.filter(s => s.isChecked).forEach(e => {
            // this.opertation = JSON.parse(e.operation);       
            this.opertation = {

                insertedBy: this.user.userId,
                browserInfo: navigator.userAgent,
                insertionTime: new Date().toString()
            };
           masterkey = e.sectionCourseLinkId + "," + masterkey
            // this.updateList.push({
            //     attendenceMasterId: e.sectionCourseLinkId,
            //     operation: JSON.stringify(this.opertation)
            // })

        })
        masterkey = "" + masterkey.substring(0, masterkey.length - 1)
        console.log(masterkey)
        var key = JSON.stringify(this.opertation) + "?" + masterkey

        this.timeTableRepo.InsertDayClose(key)
            .then(r => {

                this.AttendanceNotificationEx = r;

                this.AttendanceNotificationEx.forEach(e => {


                    this.session = "" + e.sessionId + "";
                    this.campus = "" + e.campusId + "";
                    this.CampusProgramId = "" + e.campusProgramId + "";
                    this.cclassid = "" + e.classId + "";
                    this.sectionCourseLink = "" + e.sectionCourseLinkId + "";
                    this.srollno = "" + e.rollno + "";

                    this.Messaage = "" + e.messageText + "";

                    // this.Notificaiton();



                })

                this.refreshData();
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record saved successfully',
                    title: ' ',
                    messageTypeId: PayloadMessageTypes.success
                });
            })


    }
    updatechek() {
      
        if (this.listofTimeTableData.filter(e => e.isChecked == true).length > 0)
        {
        if (this.listofTimeTableData.filter(e => e.isdisabled == true).length > 0) {
         
            this.checkAll = false;
            this.enablebutton =true;
        }
    }
        else {
            this.checkAll = false;
            this.enablebutton =false;

        }
        
        
    }

    selectAll() {

        if (this.checkAll == true) {
            this.listofTimeTableData.forEach(element => {
                if (element.isdisabled == true)
                    element.isChecked = false;

                else {
                    element.isChecked = true;
                }
            });
            this.enablebutton =true;
           
        }
        else {
            this.listofTimeTableData.forEach(element => {
                element.isChecked = false;
                this.enablebutton =false;
                
            });
         


        }

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
            if (('markDayEnd' in this.user.claims) == true) {
                if (this.user.claims['markDayEnd'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['markDayEnd'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['markDayEnd'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['markDayEnd'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    loadTimeTableData() {

        this.listofTimeTableData = [];

        var key = this.datestring + '?' + this.attndanceId



        this.timeTableRepo.GetUserDayClose(key)
            .then(response => {
                this.listofTimeTableData = (response as Array<ITimeTableTimeTableDayClose3>);
                console.log(this.listofTimeTableData);
            });
    }
    refreshData() {

        // this.data = [];
        // if (this.datestring != null && this.courseId.length > 0) {
        //     var key = this.datestring + '?' + this.courseId
        //     this.attendanceDetailRepo.GetAttendaceDataTeacher(key)
        //         .then(response => {
        //             this.data = (response as Array<IAttendenceData>)
        //         });
        // }

        this.checkAll = false;

        this.loadTimeTableData();

    }

    attendanceModel(model: ITimeTableTimeTableTeacher) {
        this.$modal.show('attendance-student', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }

    Notificaiton() {


        //this.Messaage= 'Dear Parents, your child '+this.name+ ' ,'+this.srollno+''+this.attendanceStatus+' on '+this.datenotification+'. Thank you for your cooperation';
        this.titletxt = 'Attendance';
        this.imagetxt = '0';
        this.notifType = 'Attendance';
        //  if (this.sectionCourseLinkId='00000000-0000-0000-0000-000000000000') {
        //     this.sectionCourseLink='0'
        //  }""
        var dataNotification: INotificationCredntials = {
            sesseion: this.session,
            campus: this.campus,
            program: this.CampusProgramId,
            classstudent: this.cclassid,
            section: this.sectionCourseLink,
            rollno: this.srollno,
            notificationObject: {
                notification: this.Messaage,
                type: this.notifType,
                title: this.titletxt,
                image: this.imagetxt
            }
        }

        var keysend = JSON.stringify(dataNotification) + '?' + this.user.userId + '?' + this.Messaage;

        this.notificationRepo.BulkNotificationSelectionEx(keysend)
            .then(r => {
                var today = new Date();
                var notificationIdd = r;

                //  var keyapproval = notificationIdd + '?' + this.Messaage + '?' + moment(today).format("YYYY/MM/DD") + '?' + this.user.userId;
                //  var convert = notificationIdd;
                //         this.service.NotificationApprove(keyapproval).then(r => {
                //             this.$store.dispatch(StoreTypes.updateStatusBar, {
                //                 text: 'Success',
                //                 title: 'Success',
                //                 messageTypeId: PayloadMessageTypes.success
                //             })


                //      })
            })


    }









}