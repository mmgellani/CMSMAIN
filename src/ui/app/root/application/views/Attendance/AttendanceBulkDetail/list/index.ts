/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { AttendanceAttendanceDetailService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, FeeConcessionDetailService, FeeConcessionService, FeeScholarshipCriteriaService, RegistrationEnrollmentsService, RegistrationSectionCourseLinkService, SetupAdmissionTypeService, SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupProgramDetailsService, SetupSessionService, SetupShiftService, TimeTableTimeTableService } from '../../../../service';
import {
    DDLGroupModel,
    DDLModel,
    IAttendanceAttendanceDetail,
    IAttendanceAttendanceDetailVM,
    IAttendanceAttendenceMaster,
    IAttendanceAttendenceStatus,
    IAttendanceBulkChild,
    IAttendanceBulkChildU,
    IAttendanceBulkModel,
    IAttendanceBulkModelU,
    IAttendenceData,
    ICampusCityVM,
    ICourseSection,
    IFeeConcession,
    IFeeConcessionDetail,
    IFeeConcessionDetailVM,
    IFeeScholarshipCriteriaVM,
    IOperationAttendanceMaster,
    IRegistrationSectionCourseLinkVM,
    IScholarshipApplyVM,
    IScholarshipStudentModel,
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

import { AttendanceSlot } from './attendanceslot';
import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import { debug } from 'util';
import moment from "moment";

export interface IAttendanceDetailUpdate {
    attendanceDetailId: string;
    attendenceStatusId: string;
    isApproved: boolean;
}
@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'attendance-slot': AttendanceSlot
    }
})

export class AttendanceBulkDetail extends Vue {
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
    private attendanceeList: any = [];
    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private courseList: Array<ICourseSection> = [];
    private programCourseList: Array<ITimeTableTimeTableVM> = [];
    private data: Array<IAttendenceData> = [];
    private datas: any = [];
    private Ddata: any = [];
    private Ddataaa: any = [];

    private AllStudents: any = [];
    private result: any = [];
    private updateAttendanceList: Array<IAttendanceDetailUpdate> = []
    private atterndancemasterlist: any = [];



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
    sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []

    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
        this.loadSession();
        this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);

    }
    loadProgramSection() {
        this.campusProgramId = null;
        this.campusProgramId = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.programDetailId == this.programDetailId).campusProgramId;
        this.SectionCourserepository.GetSectionData(this.campusId + `?` + this.campusProgramId + `?` + this.classId)
            .then(response => {
                this.sectionCourseLinkList = response as Array<IRegistrationSectionCourseLinkVM>
            });
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

    markFullDayAbsent(model) {
        var absentid = this.attendanceStatusList.find(s => s.fullName.toLowerCase().startsWith('a')).attendenceStatusId
        var presentid = this.attendanceStatusList.find(s => s.fullName.toLowerCase().startsWith('p')).attendenceStatusId
        var leaveid = this.attendanceStatusList.find(s => s.fullName.toLowerCase().startsWith('l')).attendenceStatusId

        var i = 0;

        if (!model.isChecked) {
            model.courses.forEach(s => {
                if (model.courses[i].attendenceStatusId != leaveid && model.courses[i].isApproved != true) {
                    model.courses[i].attendenceStatusId = absentid
                }
                i++;
            })
        }
        else {
            model.courses.forEach(s => {
                if (model.courses[i].attendenceStatusId != leaveid && model.courses[i].isApproved != true) {
                    model.courses[i].attendenceStatusId = presentid
                }
                i++;
            })
        }
    }
    DisableLeave(option: any) {
        if (this.attendanceStatusList.find(e => e.attendenceStatusId == option).code == 'L')
            return true;
        return false;

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
            if (('attendanceBulkDetail' in this.user.claims) == true) {
                if (this.user.claims['attendanceBulkDetail'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['attendanceBulkDetail'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['attendanceBulkDetail'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['attendanceBulkDetail'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }
    getCourses(model: ITimeTableTimeTableVM) {
        if (this.detailData.find(s => s.timeTableId == model.timeTableId && new Date(s.dated).getDate() == new Date(this.datestring).getDate()) != null) {
            return model.fullName + '(' + model.startTime + '-' + model.endTime + ')';
        }
    }
    loadCourses() {
        this.date = new Date();
        this.programCourseList = [];
        if (this.programDetailId.length > 0 && this.date != null && this.classId.length > 0) {
            var key = this.sessionId + '?' + this.campusId + '?' + this.programDetailId + '?' + this.classId + '?' + this.sectionId + '?' + moment(this.datestring).format("YYYY/MM/DD");
            // alert(key);
            this.timeTableRepo.GetCourceVMD(key)
                .then(response => {
                    this.programCourseList = (response as Array<ITimeTableTimeTableVM>);
                    console.log(JSON.stringify(this.programCourseList))
                    if (this.programCourseList.length == 0) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Courses not Defined',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }

                });
        }
    }

 getCourseAttendance(courses, courseId) {
    let found = courses.find(c => c.courseId === courseId);
    return found ? found : { attendenceStatusId: null, isApproved: false };
  }
    refreshData() {
        debugger;
        this.attendanceBulkList = [];
        this.result = [];
        this.loadCourses();

        this.data = [];
        this.campusProgramId = null;
        this.campusProgramId = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.programDetailId == this.programDetailId && e.sessionId == this.sessionId).campusProgramId;
        // alert(JSON.stringify(this.campusProgramId));
        // this.date=new Date(this.date);
        if (this.campusProgramId.length > 0 && moment(this.datestring).format("YYYY/MM/DD") != null && this.classId.length > 0) {
            var data = moment(this.datestring).format("YYYY/MM/DD");
            var key = this.campusProgramId + '?' + data + '?' + this.classId + '?' + this.sectionId + "?" + this.user.userId
            this.attendanceDetailRepo.GetAttendaceDatas(key)
                .then(response => {
                    this.data = (response as Array<IAttendenceData>)

                    console.log('data' + JSON.stringify(this.data));


                    this.detailData = [];
                    var key1 = this.campusId + '?' + this.programDetailId + '?' + moment(this.datestring).format("YYYY/MM/DD") + '?' + this.classId + '?' + this.sectionId + "?" + this.user.userId + "?" + this.sessionId
                    this.attendanceDetailRepo.GetAttendaceVMS(key1).then(response => {

                        this.detailData = response as Array<IAttendanceAttendanceDetailVM>;
                        console.log('detail' + JSON.stringify(this.detailData));




                        this.Ddata = [];
                        this.Ddataaa = [];
                        this.result = [];
                        this.AllStudents = [];

                        if (this.detailData[0] != null) {

                            this.Ddata = this.detailData;     ////marked list
                            this.Ddataaa = this.data;
                            console.log('<<<<<<<!!!!<<<<<', this.Ddataaa, '<<<<<<<!!!!<<<<<<');

                            this.result = this.Ddataaa.filter(ad =>
                                this.Ddata.every(fd => fd.timeTableId !== ad.timeTableId));

                            console.log('<<<<<<<<<<<<<<<<<<<<<<', this.result, '<<<<<<<<<<<<<<<<<<<<<<');


                            if (this.Ddata.length > 0) {

                                this.attendanceBulkListU = [];
                                this.attendanceBulkList = [];
                                this.bulkAttendanceChildListU = [];
                                var oldObj = this.Ddata[0]
                                this.Ddata.forEach(r => {
                                    if (r.rollNo == oldObj.rollNo) {
                                        this.bulkAttendanceChildListU.push({ attendenceStatusId: r.attendenceStatusId, courseId: r.courseId, courseName: r.courseName, timeSlot: r.startTime + '-' + r.endTime, timeTableId: r.timeTableId, admissionFormId: r.admissionFormId, attendanceDetailId: r.attendanceDetailId, attendanceMasterId: r.attendanceMasterId, loggerId: r.loggerId, isApproved: r.isApproved, isUpdate: true })
                                    }
                                    else {

                                        var index = this.Ddata.indexOf(r) - 1;
                                        this.attendanceBulkListU.push({ admissionFormId: this.Ddata[index].admissionFormId, fullName: this.Ddata[index].fullName, isChecked: false, rollNo: this.Ddata[index].rollNo, loggerId: this.Ddata[index].loggerId, courses: this.bulkAttendanceChildListU, isApproved: r.isApproved })
                                        this.bulkAttendanceChildListU = [];
                                        this.bulkAttendanceChildListU.push({ attendenceStatusId: r.attendenceStatusId, courseId: r.courseId, courseName: r.courseName, timeSlot: r.startTime + '-' + r.endTime, timeTableId: r.timeTableId, admissionFormId: r.admissionFormId, attendanceDetailId: r.attendanceDetailId, attendanceMasterId: r.attendanceMasterId, loggerId: r.loggerId, isApproved: r.isApproved, isUpdate: true })

                                    }
                                    oldObj = r;
                                })
                                var index = this.Ddata.length - 1;
                                this.attendanceBulkListU.push({ admissionFormId: this.Ddata[index].admissionFormId, fullName: this.Ddata[index].fullName, isChecked: false, rollNo: this.Ddata[index].rollNo, loggerId: this.Ddata[index].loggerId, courses: this.bulkAttendanceChildListU, isApproved: this.Ddata[index].isApproved })


                                this.attendanceBulkList = this.attendanceBulkListU;


                            }
                            ///////////////////////////
                            if (this.result.length > 0) {

                                //this.attendanceeList = [];                                                      
                                this.attendanceBulkListI = [];
                                // this.attendanceBulkList = [];
                                this.bulkAttendanceChildListI = [];

                                var oldObj = this.result[0]
                                this.result.forEach(r => {
                                    if (r.rollNo == oldObj.rollNo) {

                                        this.bulkAttendanceChildListI.push({ attendenceStatusId: r.attendenceStatusId, courseId: r.courseId, courseName: r.courseName, timeSlot: r.startTime + '-' + r.endTime, timeTableId: r.timeTableId, admissionFormId: r.admissionFormId, isUpdate: false })

                                    }
                                    else {

                                        var index = this.result.indexOf(r) - 1;
                                        this.attendanceBulkListI.push({ admissionFormId: this.result[index].admissionFormId, fullName: this.result[index].fullName, isChecked: false, rollNo: this.result[index].rollNo, courses: this.bulkAttendanceChildListI })
                                        this.bulkAttendanceChildListI = [];
                                        this.bulkAttendanceChildListI.push({ attendenceStatusId: r.attendenceStatusId, courseId: r.courseId, courseName: r.courseName, timeSlot: r.startTime + '-' + r.endTime, timeTableId: r.timeTableId, admissionFormId: r.admissionFormId, isUpdate: false })

                                    }
                                    oldObj = r;
                                })
                                var index = this.result.length - 1;
                                this.attendanceBulkListI.push({ admissionFormId: this.result[index].admissionFormId, fullName: this.result[index].fullName, isChecked: false, rollNo: this.result[index].rollNo, courses: this.bulkAttendanceChildListI })
                                // this.attendanceBulkList = this.attendanceBulkListI;
                                // this.attendanceBulkList = this.attendanceBulkList.pushValues(this.attendanceBulkListI);         

                                // var mergedArray =  this.attendanceBulkList.concat(this.attendanceBulkListI); 
                                // this.attendanceBulkList = mergedArray;


                                if (this.attendanceBulkListI.length > 0) {
                                    this.attendanceBulkList.forEach(r => {

                                        this.attendanceBulkListI.forEach(e => {
                                            if (r.admissionFormId == e.admissionFormId) {

                                                var mergedArray = r.courses.concat(e.courses);
                                                r.courses = mergedArray.sort(function (a, b) {
                                                    return a.timeSlot.split('-')[0].localeCompare(b.timeSlot.split('-')[0]);
                                                });

                                            }

                                        });

                                    });
                                }


                            }

                            //this.attendanceBulkListI=[];


                        }

                        else {
                            this.Ddata = this.data;

                            this.attendanceBulkList = [];
            

                            if (this.Ddata.length > 0) {



                                this.attendanceBulkListI = [];
                                this.attendanceBulkList = [];
                                this.bulkAttendanceChildListI = [];

                                var oldObj = this.Ddata[0]
                                this.Ddata.forEach(r => {
                                    if (r.rollNo == oldObj.rollNo) {
                                        this.bulkAttendanceChildListI.push({ attendenceStatusId: r.attendenceStatusId, courseId: r.courseId, courseName: r.courseName, timeSlot: r.startTime + '-' + r.endTime, timeTableId: r.timeTableId, admissionFormId: r.admissionFormId, isUpdate: false })
                                    }
                                    else {
                                        var index = this.Ddata.indexOf(r) - 1;
                                        this.attendanceBulkListI.push({ admissionFormId: this.Ddata[index].admissionFormId, fullName: this.Ddata[index].fullName, isChecked: false, rollNo: this.Ddata[index].rollNo, courses: this.bulkAttendanceChildListI })
                                        this.bulkAttendanceChildListI = [];
                                        this.bulkAttendanceChildListI.push({ attendenceStatusId: r.attendenceStatusId, courseId: r.courseId, courseName: r.courseName, timeSlot: r.startTime + '-' + r.endTime, timeTableId: r.timeTableId, admissionFormId: r.admissionFormId, isUpdate: false })

                                    }
                                    oldObj = r;
                                })
                                var index = this.Ddata.length - 1;
                                this.attendanceBulkListI.push({ admissionFormId: this.Ddata[index].admissionFormId, fullName: this.Ddata[index].fullName, isChecked: false, rollNo: this.Ddata[index].rollNo, courses: this.bulkAttendanceChildListI })

                                this.attendanceBulkList = this.attendanceBulkListI;
                                console.log(JSON.stringify(this.attendanceBulkListI));


                            }
                        }
                    });
                });
        }
    }
    private bulkAttendanceChildListI: Array<IAttendanceBulkChild> = []
    private bulkAttendanceChildListU: Array<IAttendanceBulkChildU> = []
    insertModel(option: any) {

        // if(option==false)
        // var msg1="Attendance has been updated successfully";
        // if (option==true)
        // var msg1="Attendance has been approved successfully";




        if (this.detailData[0] != null) {
            this.updateAttendanceList = [];
            console.log(JSON.stringify(this.attendanceBulkList));
            this.programCourseList.forEach(e => {
                this.attendanceBulkList.forEach(s => {
                    if (s.courses.find(a => a.timeTableId == e.timeTableId && a.courseId == e.courseId && a.isUpdate == true) != undefined) {
                        this.updateAttendanceList.push({
                            attendanceDetailId: s.courses.find(a => a.timeTableId == e.timeTableId && a.courseId == e.courseId).attendanceDetailId,
                            attendenceStatusId: s.courses.find(a => a.timeTableId == e.timeTableId && a.courseId == e.courseId).attendenceStatusId,
                            isApproved: option
                        })
                    }
                })
                var key = JSON.stringify(this.updateAttendanceList)
                this.attendanceDetailRepo.UpdateBulkAttendance(key)
                    .then(r => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Attendance has been updated successfully",
                            title: "",
                            messageTypeId: PayloadMessageTypes.success
                        });
                    })
            });

            var _programcourselinklist = this.programCourseList;

            this.Ddata.forEach((item1, index) => {


                _programcourselinklist = _programcourselinklist.filter(e => e.timeTableId != item1.timeTableId);
            });


            _programcourselinklist.forEach(e => {
                this.attendanceDetailList = []
                var atenMastid = helper.newGuid();
                var atndanceMasterId = helper.newGuid();
                this.date = new Date(moment(this.datestring).format('YYYY-MM-DD'))
                // var fromTime = moment(e.startTime, 'h:mm:ssa');
                // var toDate = moment(e.endTime, 'h:mm:ssa');
                // var currentTime = moment(new Date(), 'h:mm:ssa');
                // console.log(' hi ' + currentTime.isBetween(fromTime, toDate))
                // this.opertation.inTime = currentTime.isBetween(fromTime, toDate) ? true : false;
                this.opertation.inTime = false;
                this.opertation.approvalTime = '';
                this.opertation.approvedBy = 0;
                this.opertation.browserInfo = navigator.userAgent;
                this.opertation.insertedBy = this.user.userId;
                this.opertation.insertionTime = new Date().toLocaleString();
                this.attendanceMaster = { attendenceMasterId: atenMastid, isApproved: option, loggerId: helper.newGuid(), statusId: 1, dated: this.date, timeTableId: e.timeTableId, operation: JSON.stringify(this.opertation) }
                this.attendanceBulkList.forEach(s => {
                    this.attendanceDetailList.push({ admissionFormId: s.admissionFormId, attendanceMasterId: atenMastid, statusId: 1, loggerId: helper.newGuid(), attendenceStatusId: s.courses.filter(e => e.isUpdate == false).find(a => a.timeTableId == e.timeTableId && a.courseId == e.courseId && a.isUpdate == false).attendenceStatusId, attendanceDetailId: helper.newGuid() })

                })

                var key = JSON.stringify(this.attendanceMaster) + "?" + JSON.stringify(this.attendanceDetailList)


                this.attendanceDetailRepo.AddBulkAttendance(key)
                    .then(r => {

                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Attendance Marked Successfully',
                            title: '',
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
                this.date = new Date(moment(this.datestring).format('YYYY-MM-DD'))
                // var fromTime = moment(e.startTime, 'h:mm:ssa');
                // var toDate = moment(e.endTime, 'h:mm:ssa');
                // var currentTime = moment(new Date(), 'h:mm:ssa');
                // console.log(' hi ' + currentTime.isBetween(fromTime, toDate))
                // this.opertation.inTime = currentTime.isBetween(fromTime, toDate) ? true : false;
                this.opertation.inTime = false;
                this.opertation.approvalTime = '';
                this.opertation.approvedBy = 0;
                this.opertation.browserInfo = navigator.userAgent;
                this.opertation.insertedBy = this.user.userId;
                this.opertation.insertionTime = new Date().toLocaleString();
                this.attendanceMaster = { attendenceMasterId: atenMastid, isApproved: option, loggerId: helper.newGuid(), statusId: 1, dated: this.date, timeTableId: e.timeTableId, operation: JSON.stringify(this.opertation) }
                this.attendanceBulkList.forEach(s => {
                    this.attendanceDetailList.push({ admissionFormId: s.admissionFormId, attendanceMasterId: atenMastid, statusId: 1, loggerId: helper.newGuid(), attendenceStatusId: s.courses.find(a => a.timeTableId == e.timeTableId && a.courseId == e.courseId).attendenceStatusId, attendanceDetailId: helper.newGuid() })

                })

                var key = JSON.stringify(this.attendanceMaster) + "?" + JSON.stringify(this.attendanceDetailList)


                this.attendanceDetailRepo.AddBulkAttendance(key)
                    .then(r => {

                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Attendance Marked Successfully',
                            title: '',
                            messageTypeId: PayloadMessageTypes.success
                        });
                    })
            })

        }
        this.attendanceBulkList = [];
        this.refreshData();
    }
    check() {
        // alert(new Date().getTime());
        var beginningTime = moment('12:00:10pm', 'h:mm:ssa');
        var endTime = moment('04:30:30pm', 'h:mm:ssa');
        var currentTime = moment(new Date(), 'h:mm:ssa');

        //     var from= moment('12:15p', "HH:mm a");
        //     var to= moment('01:15p', "HH:mm a");
        //     var currentTime='12:30p'
        //    alert(moment().isBetween(from , to));

    }
    editModel(model: IScholarshipApplyVM) {
        // this.$modal.show('add-edit-model', { model: this.datas.filter(s=>s.scholarshipName==model.scholarshipName)});
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }


}

