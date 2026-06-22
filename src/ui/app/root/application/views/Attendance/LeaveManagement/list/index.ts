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
    ITimeTableTimeTableVM, IAttendanceAttendanceDetailVM, IAttendanceBulkModel, IAttendanceBulkChild, IAttendanceBulkModelU, IAttendanceBulkChildU, IOperationAttendanceMaster, IRegistrationSectionCourseLinkList
} from '../../../../models';
import { FeeConcessionDetailService, SetupClassService, TimeTableTimeTableService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, AttendanceAttendanceDetailService, RegistrationSectionCourseLinkService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import * as helper from '../../../../helper';

import { AttendanceSlot } from './attendanceslot';
import { debug } from 'util';
import { IAttendanceDetailUpdate } from '../../../../views';
import { LeaveManagementAddEdit } from '../add-edit';
import { LeaveInfo, IAttendanceLeaves } from '../../../../models/Attendance/Attendenceleave';

import { LeaveManagementTesting } from '../../LeaveManagementTesting/list';
import { LeaveManagementViewLeave } from '../view-leaves';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'leave-manage': LeaveManagementAddEdit,
        'leave-search': LeaveManagementTesting,
        'view-leave-model': LeaveManagementViewLeave
    }
})

export class LeaveManagement extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private SectionCourserepository: RegistrationSectionCourseLinkService;
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
    private admissionformid: string = '';

    Leaveinfolist: Array<IAttendanceLeaves> = [];
    TempLeaveinfolist: Array<IAttendanceLeaves> = [];

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
    private updateAttendanceList: Array<IAttendanceDetailUpdate> = []
    private opertation: IOperationAttendanceMaster = { approvalTime: '', approvedBy: 0, browserInfo: '', inTime: false, insertedBy: 0, insertionTime: '' }


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
    sectionCourseLinkList: Array<IRegistrationSectionCourseLinkList> = [];


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []
    private columns = [
        { key: "fullName", caption: "Student's Name" },
        { key: "rollNo", caption: "Roll No." },
        { key: "action", caption: "Action", width: 120 }
    ];
    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
        this.loadSession();
        this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
        this.loadClass();
    }
    loadProgramSection() {

        this.campusProgramId = null;
        if (this.sessionId.length > 0 && this.campusId.length > 0 && this.programDetailId.length > 0 && this.classId.length > 0) {
            this.campusProgramId = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.programDetailId == this.programDetailId).campusProgramId;
            this.SectionCourserepository.GetUserSectionListData(this.sessionId + `?` + this.campusId + `?` + this.classId + '?' + this.programDetailId)
                .then(response => {
                    this.sectionCourseLinkList = response as Array<IRegistrationSectionCourseLinkList>
                });
        }

    }
    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }
    loadAttendanceStatus() {
        this.attendanceStatusRepo.GetFindBy('s=>s.StatusId=2')
            .then(r => { this.attendanceStatusList = r as Array<IAttendanceAttendenceStatus> });
    }
    mounted() {
        this.validatePage();

        // this.refreshData();
    }

    loadCityCampus() {
        if (this.sessionId.length > 0) {
            this.campusddl = [];
            this.cityDDL = [];
            let oldObj: ICampusCityVM;
            this.campusRepo.GetCityVM().then(r => {
                this.campusCityList = r as Array<ICampusCityVM>;
            });
        }
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



    loadProgramsOfCampus() {
        console.log("hi from loadProgramsOfCampus")

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
            if (('leaveManagement' in this.user.claims) == true) {
                if (this.user.claims['leaveManagement'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['leaveManagement'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['leaveManagement'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['leaveManagement'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    loadCourses() {
        this.date = new Date();
        this.programCourseList = [];
        if (this.programDetailId.length > 0 && this.datestring.length > 0 && this.classId.length > 0 && this.sessionId.length > 0 && this.campusId.length > 0 && this.sectionId.length > 0) {
            var key = this.sessionId + '?' + this.campusId + '?' + this.programDetailId + '?' + this.classId + '?' + this.sectionId + '?' + this.datestring;
            // alert(key);
            this.timeTableRepo.GetCourceVMD(key)
                .then(response => {
                    this.programCourseList = (response as Array<ITimeTableTimeTableVM>);
                    if (this.programCourseList.length == 0) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Time Table Not Defined for This Program, Section and Day',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }

                });
        }
    }
    refreshData() {
        this.attendanceBulkList = [];
        this.loadCourses();
        this.data = [];
        this.campusProgramId = null;
        this.campusProgramId = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.programDetailId == this.programDetailId).campusProgramId;

        if (this.campusProgramId.length > 0 && this.datestring.length > 0 && this.classId.length > 0 && this.sectionId.length > 0) {
            var key = this.campusProgramId + '?' + this.datestring + '?' + this.classId + '?' + this.sectionId + '?' + this.user.userId;

            this.attendanceDetailRepo.GetAttendaceDatas(key)
                .then(response => {
                    this.data = (response as Array<IAttendenceData>)


                    this.detailData = [];
                    if (this.campusId.length > 0 && this.programDetailId.length > 0 && this.datestring.length > 0 && this.classId.length > 0 && this.sectionId.length > 0) {


                        var key1 = this.campusId + '?' + this.programDetailId + '?' + this.datestring + '?' + this.classId + '?' + this.sectionId + '?' + this.user.userId + '?' + this.sessionId
                        this.attendanceDetailRepo.GetAttendaceVMS(key1).then(response => {
                            this.detailData = response as Array<IAttendanceAttendanceDetailVM>;



                            this.Ddata = [];


                            if (this.detailData[0] != null) {
                                this.Ddata = this.detailData;
                                // alert('Attendance already marked')

                                if (this.Ddata.length > 0) {

                                    this.attendanceBulkListU = [];
                                    this.attendanceBulkList = [];

                                    this.bulkAttendanceChildListU = [];
                                    var oldObj = this.Ddata[0]
                                    this.Ddata.forEach(r => {
                                        if (r.rollNo == oldObj.rollNo) {

                                            this.bulkAttendanceChildListU.push({ attendenceStatusId: r.attendenceStatusId, courseId: r.courseId, courseName: r.courseName, timeSlot: r.startTime + '-' + r.endTime, timeTableId: r.timeTableId, admissionFormId: r.admissionFormId, attendanceDetailId: r.attendanceDetailId, attendanceMasterId: r.attendanceMasterId, loggerId: r.loggerId,isApproved:r.isApproved,isUpdate: true })
                                        }
                                        else {

                                            var index = this.Ddata.indexOf(r) - 1;
                                            this.attendanceBulkListU.push({ admissionFormId: this.Ddata[index].admissionFormId, fullName: this.Ddata[index].fullName, isChecked: false, rollNo: this.Ddata[index].rollNo, loggerId: this.Ddata[index].loggerId, courses: this.bulkAttendanceChildListU,isApproved:this.Ddata[index].isApproved })
                                            this.bulkAttendanceChildListU = [];
                                            this.bulkAttendanceChildListU.push({ attendenceStatusId: r.attendenceStatusId, courseId: r.courseId, courseName: r.courseName, timeSlot: r.startTime + '-' + r.endTime, timeTableId: r.timeTableId, admissionFormId: r.admissionFormId, attendanceDetailId: r.attendanceDetailId, attendanceMasterId: r.attendanceMasterId, loggerId: r.loggerId ,isApproved:r.isApproved,isUpdate: true})

                                        }
                                        oldObj = r;
                                    })
                                    var index = this.Ddata.length - 1;
                                    this.attendanceBulkListU.push({ admissionFormId: this.Ddata[index].admissionFormId, fullName: this.Ddata[index].fullName, isChecked: false, rollNo: this.Ddata[index].rollNo, loggerId: this.Ddata[index].loggerId, courses: this.bulkAttendanceChildListU ,isApproved:this.Ddata[index].isApproved})

                                    this.attendanceBulkList = this.attendanceBulkListU;

                                }


                            }
                            else {
                                this.Ddata = this.data;
                                // alert('New Record')

                                if (this.Ddata.length > 0) {

                                    this.attendanceBulkListI = [];
                                    this.attendanceBulkList = [];
                                    this.bulkAttendanceChildListI = [];
                                    var oldObj = this.Ddata[0]
                                    this.Ddata.forEach(r => {
                                        if (r.rollNo == oldObj.rollNo) {

                                            this.bulkAttendanceChildListI.push({ attendenceStatusId: r.attendenceStatusId, courseId: r.courseId, courseName: r.courseName, timeSlot: r.startTime + '-' + r.endTime, timeTableId: r.timeTableId, admissionFormId: r.admissionFormId,isUpdate: false })
                                        }
                                        else {

                                            var index = this.Ddata.indexOf(r) - 1;
                                            this.attendanceBulkListI.push({ admissionFormId: this.Ddata[index].admissionFormId, fullName: this.Ddata[index].fullName, isChecked: false, rollNo: this.Ddata[index].rollNo, courses: this.bulkAttendanceChildListI })
                                            this.bulkAttendanceChildListI = [];
                                            this.bulkAttendanceChildListI.push({ attendenceStatusId: r.attendenceStatusId, courseId: r.courseId, courseName: r.courseName, timeSlot: r.startTime + '-' + r.endTime, timeTableId: r.timeTableId, admissionFormId: r.admissionFormId,isUpdate: false })

                                        }
                                        oldObj = r;
                                    })
                                    var index = this.Ddata.length - 1;
                                    this.attendanceBulkListI.push({ admissionFormId: this.Ddata[index].admissionFormId, fullName: this.Ddata[index].fullName, isChecked: false, rollNo: this.Ddata[index].rollNo, courses: this.bulkAttendanceChildListI })

                                    this.attendanceBulkList = this.attendanceBulkListI;

                                }
                            }
                        });
                    }
                });
        }


    }
    private bulkAttendanceChildListI: Array<IAttendanceBulkChild> = []
    private bulkAttendanceChildListU: Array<IAttendanceBulkChildU> = []
    insertModel() {

        if (this.detailData[0] != null) {
            this.updateAttendanceList = [];
            this.programCourseList.forEach(e => {
               

                this.attendanceBulkList.forEach(s => {

                    this.updateAttendanceList.push({
                        attendanceDetailId: s.courses.find(a => a.timeTableId == e.timeTableId && a.courseId == e.courseId).attendanceDetailId,
                        attendenceStatusId: s.courses.find(a => a.timeTableId == e.timeTableId && a.courseId == e.courseId).attendenceStatusId,
                        isApproved:false
                    })
                })
                var key = JSON.stringify(this.updateAttendanceList)
                this.attendanceDetailRepo.UpdateBulkAttendance(key)
                    .then(r => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Attendance has been updated successfully",
                            title: "Success",
                            messageTypeId: PayloadMessageTypes.success
                        });
                    })
            })

        }


        else {

            this.programCourseList.forEach(e => {
                this.attendanceDetailList = []
                var atenMastid = helper.newGuid();
                var atndanceMasterId = helper.newGuid();
                this.date = new Date(this.datestring)
                var fromTime = moment(e.startTime, 'h:mm:ssa');
                var toDate = moment(e.endTime, 'h:mm:ssa');
                var currentTime = moment(new Date(), 'h:mm:ssa');

                this.opertation.inTime = currentTime.isBetween(fromTime, toDate) ? true : false;
                this.opertation.approvalTime = '';
                this.opertation.approvedBy = 0;
                this.opertation.browserInfo = '';
                // this.opertation.inTime = false;
                this.opertation.insertedBy = this.user.userId;
                this.opertation.insertionTime = new Date().getTime().toString();
                this.attendanceMaster = { attendenceMasterId: atenMastid, isApproved: false, loggerId: helper.newGuid(), statusId: 1, dated: this.date, timeTableId: e.timeTableId, operation: JSON.stringify(this.opertation) }
                this.attendanceBulkList.forEach(s => {
                    this.attendanceDetailList.push({ admissionFormId: s.admissionFormId, attendanceMasterId: atenMastid, statusId: 1, loggerId: helper.newGuid(), attendenceStatusId: s.courses.find(a => a.timeTableId == e.timeTableId && a.courseId == e.courseId).attendenceStatusId, attendanceDetailId: helper.newGuid() })

                })

                var key = JSON.stringify(this.attendanceMaster) + "?" + JSON.stringify(this.attendanceDetailList)


                this.attendanceDetailRepo.AddBulkAttendance(key)
                    .then(r => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Attendance Marked Successfully',
                            title: 'success',
                            messageTypeId: PayloadMessageTypes.success
                        });
                    })
            })



        }
        this.refreshData();
    }



    GetLeaveInfo() {
        this.Leaveinfolist = [];
        this.attendanceDetailRepo.GetLeaveInfo(this.admissionformid).then(
            r => {
                this.Leaveinfolist = r as Array<IAttendanceLeaves>
                Object.assign(this.TempLeaveinfolist, this.Leaveinfolist);


            }
        )



    }
    AddModel(option: any) {


        this.$modal.show('add-edit-model', { ClassID: this.classId, ProgramDetailID: this.programDetailId, AdmissionFormID: option.admissionFormId, IsNewRecord: true });
    }

    viewLeave(option: any) {

        this.$modal.show('view-leave-model', { ClassID: this.classId, ProgramDetailID: this.programDetailId, AdmissionFormID: option.admissionFormId, IsNewRecord: true });

    }

    getDays(fromDate: any, ToDate: any) {

        var date2 = new Date(ToDate);
        var date1 = new Date(fromDate);
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        return dayDifference;

    }



    EditModel(option: any) {
        console.log(option)

        this.$modal.show('add-edit-model', { ClassID: this.classId, ProgramDetailID: this.programDetailId, AdmissionFormID: option, IsNewRecord: false, modelVM: option });
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }


}