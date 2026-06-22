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
    IFeeConcessionDetail, ISetupClass, IAttendanceAttendanceDetail, IAttendanceAttendenceStatus, ICourseSection, IAttendenceDataEx, IFeeConcessionDetailVM, ISetupSession, ISetupShift, ISetupCampus, IStudentModel, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupProgramDetailsVM, IFeeConcession, IFeeScholarshipCriteriaVM, ISetupAdmissionType, ISetupCampusProgramVM, IScholarshipStudentModel, IScholarshipApplyVM, IStudentToEnrollVM, IRegistrationSectionCourseLinkVM, IAttendanceAttendenceMaster, ICampusCityVM, ITimeTableTimeTable,
    ITimeTableTimeTableVM, IAttendanceAttendanceDetailVMEx, IOperationAttendanceMaster
} from '../../../../models';
import { FeeConcessionDetailService, SetupClassService, TimeTableTimeTableService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, AttendanceAttendanceDetailService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import * as helper from '../../../../helper';
// import { formulateSingle } from "../../../../helper";

import moment from "moment";
import { stat } from 'fs';


@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class AttendanceBulk extends Vue {
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
    private timeTableId = '';

    private detailData: Array<IAttendanceAttendanceDetailVMEx> = [];
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
    private data: Array<IAttendenceDataEx> = [];
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

    private opertation: IOperationAttendanceMaster = { approvalTime: '', approvedBy: 0, browserInfo: '', inTime: false, insertedBy: 0, insertionTime: '' }
    private mergeSectionList: any = []

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []

    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.loadSession();
        this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
        this.$watch(() => this.timeTableId, this.refreshData);
        // this.$watch('datestring', this.loadCourses);
        this.$watch('classId', this.loadCourses);
        this.$watch('programDetailId', this.loadClass);
        this.$watch('campusId', this.loadProgramsOfCampus);
        this.$watch('sessionId', this.loadCityCampus);

    }


    // private formatFunction(state) {
    //     var oneItem = this.SlotList.filter(e => e.slotId == state.id);

    //     var $state = $(
    //         oneItem ? oneItem.length > 0 ? 
    //         '<span><strong>Start Time</strong>: ' + oneItem[0].startTime.substring(0, 5) + ' <strong>End Time</strong>: ' + oneItem[0].endTime.substring(0, 5) + '</span>' : '' : ''
    //     );
    //     return $state;
    //   }




    // options = {
    //     templateResult: this.formatFunction,
    //     templateSelection: this.formatFunction,
    //     data: []
    // };
    // private formatFunction(state) {
    //     var oneItem = this.programCourseList.filter(e => e.timeTableId == state.id);
    //     var $state = $(
    //         oneItem ? oneItem.length > 0 ?
    //             oneItem[0].sectionName.toString() + '-' + oneItem[0].fullName.toString() + ' ' + oneItem[0].startTime.substring(0, 5) + '-' + oneItem[0].endTime.substring(0, 5) : '' : ''
    //         //  oneItem[0].courseId + ' <strong>End Time</strong>: ' + oneItem[0].endTime.substring(0, 5) + '</span>' : '' : ''
    //     );
    //     return $state;
    // }

    private columns = [
        { key: 'rollNo', caption: 'Roll No' },
        { key: 'fullName', caption: `Student's Name` },
        { key: 'startTime', caption: 'Slot Timing' },
        { key: 'action', caption: 'Action' }
    ];

    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }

    loadAttendanceStatus() {
        this.attendanceStatusRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => {
                this.attendanceStatusList = r as Array<IAttendanceAttendenceStatus>

            });
    }
    mounted() {
        this.validatePage();
        this.loadAttendanceStatus();
        // this.refreshData();
    }

    addClass(status, statusid) {

        if (status.fullName == "Present") {
            return 'btn btn-outline-success btn-elevate btn-circle btn-icon btn-sm m-1 ' + (status.attendenceStatusId == statusid ? 'green-color' : '');
        }
        if (status.fullName == "Absent") {
            return 'btn btn-outline-danger btn-elevate btn-circle btn-icon btn-sm m-1 ' + (status.attendenceStatusId == statusid ? 'red-color' : '')
        }
        if (status.fullName == "Leave") {
            return 'btn btn-outline-warning btn-elevate btn-circle btn-icon btn-sm m-1 ' + (status.attendenceStatusId == statusid ? 'yellow-color' : '')
        }
    }



    firstCharecter(value) {
        return value.substring(0, 1);
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
            if (('attendanceBulk' in this.user.claims) == true) {
                if (this.user.claims['attendanceBulk'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['attendanceBulk'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['attendanceBulk'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['attendanceBulk'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    loadCourses() {
        this.date = new Date();
        if (this.programDetailId.length > 0 && this.date != null && this.classId.length > 0) {
            var key = this.sessionId + '?' + this.campusId + '?' + this.programDetailId + '?' + this.classId + '?' + this.datestring;
            // alert(key);
            this.timeTableRepo.GetCourceVM(key)
                .then(response => {
                    this.programCourseList = (response as Array<ITimeTableTimeTableVM>);
                    this.programCourseList.forEach(e=>{
                        e.fullName=e.fullName+'-'+e.sectionName
                    })
                    if (this.programCourseList.length == 0) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Courses not Defined',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }
                    // console.log(JSON.stringify(data))
                    // if (this.datas.length > 0) {
                    //     this.loadSections(key);
                    // }

                });
        }
    }
    private isApproved = false;
    refreshData() {
        this.mergeSectionList = []
        this.isApproved = false;
        this.data = [];
        this.campusProgramId = null;
        this.campusProgramId = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.programDetailId == this.programDetailId).campusProgramId;
        // alert(JSON.stringify(this.campusProgramId));
        // this.date=new Date(this.date);
        if (this.campusProgramId.length > 0 && this.datestring != null && this.timeTableId.length > 0) {
            var key = this.datestring + '?' + this.timeTableId + '?' + this.user.userId
            this.attendanceDetailRepo.GetMergeAttendaceVM(key)
                .then(response => {
                    this.Ddata = [];

                    this.detailData = [];
                    this.detailData = (response as Array<IAttendanceAttendanceDetailVMEx>)
                    if (this.detailData.length > 0) {
                        this.isApproved = this.detailData[0].isApproved;
                        this.Ddata = this.detailData;
                        Array.from(new Set(this.Ddata.map((item: any) => item.sectionName))).forEach(e => {
                            console.log(e)
                            this.mergeSectionList.push({ sectionName: e })
                        })
                    }


                    if (this.detailData.length < 1) {
                        var key1 = this.datestring + '?' + this.timeTableId + "?" + this.user.userId
                        this.attendanceDetailRepo.GetMergeAttendaceData(key1).then(response => {
                            this.data = response as Array<IAttendenceDataEx>;

                            if (this.data.length > 0) {
                                this.Ddata = this.data;
                                Array.from(new Set(this.Ddata.map((item: any) => item.sectionName))).forEach(e => {
                                    this.mergeSectionList.push({ sectionName: e })
                                })
                            }



                        });
                    }


                });
        }


    }
    chck() {
        console.log(Array.from(new Set(this.Ddata.map((item: any) => item.timeTableId))).length)
        //this.Ddata
    }
    courseName(option) {
        return '<strong>' + option.sectionName + '-' + option.fullName + '</strong>' + ' <i>' + option.startTime + '-' + option.endTime + '</i>'
    }
    insertModel() {
        if (this.detailData.length > 0) {

            var key = JSON.stringify(this.Ddata)
            this.attendanceDetailRepo.UpdateBulkAttendance(key)
                .then(r => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: "Attendance has been updated successfully",
                        title: "Success",
                        messageTypeId: PayloadMessageTypes.success
                    });
                })
            // this.Ddata.forEach(e => {
            //     this.attendanceDetailRepo.Update(e).then(() => {
            //         this.$store.dispatch(StoreTypes.updateStatusBar, {
            //             text: "Attendance has been updated successfully",
            //             title: "Success",
            //             messageTypeId: PayloadMessageTypes.success
            //         });
            //     })

            // });
        }
        else {

            // WHEN section is not merged
            if (Array.from(new Set(this.Ddata.map((item: any) => item.timeTableId))).length == 1) {
                this.courseId = this.programCourseList.find(s => s.timeTableId == this.timeTableId).courseId;

                var sectionId = this.programCourseList.find(e => e.sessionId == this.sessionId && e.campusId == this.campusId && e.programDetailId == this.programDetailId && e.classId == this.classId && e.slotTimingId == this.data[0].slotTimingId).sectionId;
                var key = this.datestring + '?' + this.campusId + '?' + this.sessionId + '?' + sectionId + '?' + this.classId + '?' + this.programDetailId + '?' + this.courseId + '?' + this.data[0].slotTimingId;
                this.CheckRepository.CheckClash(key).then(
                    res => {
                        this.datas = res
                        if (this.datas[0].val == 0) {


                            this.attendanceDetailList = []
                            this.date = new Date(this.datestring)
                            var atndanceMasterId = helper.newGuid();

                            // var fromTime = moment(this.programCourseList.find(s => s.timeTableId == this.timeTableId).startTime, 'h:mm:ssa');
                            // var toDate = moment(this.programCourseList.find(s => s.timeTableId == this.timeTableId).endTime, 'h:mm:ssa');
                            // var currentTime = moment(new Date(), 'h:mm:ssa');
                            // console.log(' hi ' + currentTime.isBetween(fromTime, toDate))
                            // this.opertation.inTime = currentTime.isBetween(fromTime, toDate) ? true : false;
                            this.opertation.inTime = false;
                            this.opertation.approvalTime = '';
                            this.opertation.approvedBy = 0;
                            this.opertation.browserInfo = navigator.userAgent;
                            this.opertation.insertedBy = this.user.userId;
                            this.opertation.insertionTime = new Date().toLocaleString()
                            this.attendanceMaster = { attendenceMasterId: atndanceMasterId, isApproved: false, loggerId: helper.newGuid(), statusId: 1, dated: this.date, timeTableId: this.data[0].timeTableId, operation: JSON.stringify(this.opertation) }
                            this.Ddata.forEach(e => {
                                this.attendanceDetailList.push({ admissionFormId: e.admissionFormId, attendanceMasterId: atndanceMasterId, statusId: 1, loggerId: helper.newGuid(), attendenceStatusId: e.attendenceStatusId, attendanceDetailId: helper.newGuid() })
                            })
                            var key = JSON.stringify(this.attendanceMaster) + "?" + JSON.stringify(this.attendanceDetailList)
                            console.log(key)

                            this.attendanceDetailRepo.AddBulkAttendance(key)
                                .then(r => {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: 'Attendance Marked Successfully',
                                        title: 'success',
                                        messageTypeId: PayloadMessageTypes.success
                                    });
                                })


                        }
                        else if (this.datas[0].val > 0) {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: 'Same Record Already inserted',
                                title: 'Danger',
                                messageTypeId: PayloadMessageTypes.error
                            })
                        }
                    });
            }
            //For merged section attendance
            else {
                Array.from(new Set(this.Ddata.map((item: any) => item.timeTableId))).forEach(timetableid => {
                    console.log(timetableid + ' hello')
                    this.attendanceDetailList = []
                    this.date = new Date(this.datestring)
                    var atndanceMasterId = helper.newGuid();
                    // var fromTime = moment(this.programCourseList.find(s => s.timeTableId == timetableid).startTime, 'h:mm:ssa');
                    // var toDate = moment(this.programCourseList.find(s => s.timeTableId == timetableid).endTime, 'h:mm:ssa');
                    // var currentTime = moment(new Date(), 'h:mm:ssa');
                    // console.log(' hi ' + currentTime.isBetween(fromTime, toDate))
                    // this.opertation.inTime = currentTime.isBetween(fromTime, toDate) ? true : false;
                    this.opertation.inTime = false;
                    this.opertation.approvalTime = '';
                    this.opertation.approvedBy = 0;
                    this.opertation.browserInfo = navigator.userAgent;
                    // this.opertation.inTime = false;
                    this.opertation.insertedBy = this.user.userId;
                    this.opertation.insertionTime = new Date().toLocaleString()
                    this.attendanceMaster = { attendenceMasterId: atndanceMasterId, isApproved: false, loggerId: helper.newGuid(), statusId: 1, dated: this.date, timeTableId: timetableid.toString(), operation: JSON.stringify(this.opertation) }
                    this.Ddata.filter(s => s.timeTableId == timetableid).forEach(e => {
                        this.attendanceDetailList.push({ admissionFormId: e.admissionFormId, attendanceMasterId: atndanceMasterId, statusId: 1, loggerId: helper.newGuid(), attendenceStatusId: e.attendenceStatusId, attendanceDetailId: helper.newGuid() })
                    })

                    console.log(JSON.stringify(this.attendanceMaster))
                    console.log(JSON.stringify(this.attendanceDetailList))
                    var key = JSON.stringify(this.attendanceMaster) + "?" + JSON.stringify(this.attendanceDetailList)
                    console.log(key)

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

        }
    }

    editModel(model: IScholarshipApplyVM) {
        // this.$modal.show('add-edit-model', { model: this.datas.filter(s=>s.scholarshipName==model.scholarshipName)});
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }


}