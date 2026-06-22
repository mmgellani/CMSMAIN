/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { required, maxLength } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes, IUser } from "../../../../../../model";

import {
  ITimeTableTimeTableTeacher, ISetupCampusProgramVM, IAttendenceDataEx, IAttendanceAttendanceDetailVMEx, IAttendanceAttendenceStatus, IAttendanceAttendanceDetail, IAttendanceAttendenceMaster, IOperationAttendanceMaster
} from "../../../../models";

import * as helper from "../../../../helper";
import { SetupCampusProgramLinkService, AttendanceAttendanceDetailService, AttendanceAttendenceStatusService, AttendanceAttendenceMasterService } from "../../../../service";
import moment from "moment";
import { State } from "vuex-class";
import { IRootStoreState } from "../../../../../store";


type ValidateAttendanceTeacher = { model: ITimeTableTimeTableTeacher; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateAttendanceTeacher> = {
  model: {

  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "attendance-student",
  template: require("./index.html"),
  components: {
    // BoardType: SetupBoardTypeAddEdit,

  }
})
export class AttendanceAttendanceTeacher extends Vue {

  @State((state: IRootStoreState) => state.common.user) user: IUser;

  //   private repository: SetupBoardService;
  private datas: ITimeTableTimeTableTeacher = {
    timeTableId: "",
    sectionCourseLinkId: "",
    staffId: "",
    staffName: "",
    sectionName: "",
    fullName: "",
    roomId: "",
    classId: "",
    dayName: "",
    roomName: "",
    sectionId: "",
    name: "",
    startTime: "",
    endTime: "",
    slotTimingId: "",
    session: "",
    campusName: "",
    sessionId: "",
    campusId: "",
    programDetailId: "",
    description: "",
    statusId: 1,
    loggerId: "",
    programCourseLinkId: "",
    courseId: "",
    isBreak: false,
    userId: 1,
    className: "",
    ribbon: 0,
    isDayOff:0
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private isActive = false;
  private ProgramList: Array<ISetupCampusProgramVM> = [];
  private Programrepository: SetupCampusProgramLinkService = null;
  private data: Array<IAttendenceDataEx> = [];
  private Ddata: any = [];
  private attendanceDetailRepo: AttendanceAttendanceDetailService = new AttendanceAttendanceDetailService(this.$store)
  private attendanceStatusRepo: AttendanceAttendenceStatusService = new AttendanceAttendenceStatusService(this.$store)
  private CheckRepository: AttendanceAttendenceMasterService = new AttendanceAttendenceMasterService(this.$store)
  private attendanceMasterRepo: AttendanceAttendenceMasterService = new AttendanceAttendenceMasterService(this.$store)

  private detailData: Array<IAttendanceAttendanceDetailVMEx> = [];
  private date: Date = new Date();
  private datestring = '';
  private attendanceStatusList: Array<IAttendanceAttendenceStatus> = [];
  private fullDayAbsent = false;
  private isApproved = false;
  private attendanceDetailList: Array<IAttendanceAttendanceDetail> = [];
  private attendanceMaster: IAttendanceAttendenceMaster;
  private attendanceMasterTeacher: Array<IAttendanceAttendenceMaster> = [];
  private mergeSectionList: any = []


  private opertation: IOperationAttendanceMaster = { approvalTime: '', approvedBy: 0, browserInfo: '', inTime: false, insertedBy: 0, insertionTime: '' }








  created() {
    // this.repository = new SetupBoardService(this.$store);
    this.Programrepository = new SetupCampusProgramLinkService(this.$store);
    this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
    this.loadAttendanceStatus();

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

  beforeModalOpen(event) {
    this.fullDayAbsent = false;
    this.isApproved = false;
    this.mergeSectionList=[]

    Object.assign(this.datas, event.params.model);

    var key1 = this.datestring + "?" + this.datas.timeTableId;
    this.attendanceMasterRepo.GetAttendanceApprovalTeacher(key1).then(res => {
      this.attendanceMasterTeacher = res as Array<IAttendanceAttendenceMaster>;
      if (this.attendanceMasterTeacher.length > 0) {
        this.isApproved = this.attendanceMasterTeacher[0].isApproved;
      }
    });

    // alert(JSON.stringify(this.datas));
    if (this.datas.campusId.length > 0 && this.datas.sessionId.length > 0 && this.datas.programDetailId.length > 0) {       // this.campusCityList.find(s=>s.)
      var key = this.datas.sessionId + "?" + this.datas.campusId + "?" + this.datas.programDetailId;
      this.Programrepository.GetAllActive(key).then(res => {
        this.ProgramList = res as Array<ISetupCampusProgramVM>;

        //student list here


        this.data = [];
        // this.campusProgramId = null;
        // this.campusProgramId = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.programDetailId == this.programDetailId).campusProgramId;
        // alert(JSON.stringify(this.campusProgramId));
        // this.date=new Date(this.date);
        if (this.ProgramList[0].campusProgramId.length > 0 && this.datas.dayName.length > 0 && this.datas.timeTableId.length > 0) {
          var key = this.datestring + '?' + this.datas.timeTableId
         
          this.attendanceDetailRepo.GetMergeTeacherAttendaceVM(key)
            .then(response => {
              this.Ddata = [];
              this.detailData = [];

              this.detailData = (response as Array<IAttendanceAttendanceDetailVMEx>)
              if (this.detailData.length > 0) {
                this.Ddata = this.detailData;
                Array.from(new Set(this.Ddata.map((item: any) => item.sectionName))).forEach(e => {
                  this.mergeSectionList.push({ sectionName: e })
              })

              }

              if (this.detailData.length < 1) {

                var key1 = this.datestring + '?' + this.datas.timeTableId
                
                this.attendanceDetailRepo.GetTeacherMergeAttendaceData(key1).then(response => {
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







      });
    }

  }

  loadAttendanceStatus() {
    this.attendanceStatusRepo.GetFindBy('s=>s.StatusId!=2')
      .then(r => { this.attendanceStatusList = r as Array<IAttendanceAttendenceStatus> });
  }

  saveModel() {
    if (this.detailData[0] != null) {
      this.Ddata.forEach(e => {
        this.attendanceDetailRepo.Update(e).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Attendance has been updated successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
        })

        this.cancel();

      });
    }
    else {
      if (Array.from(new Set(this.Ddata.map((item: any) => item.timeTableId))).length == 1) {

        ////-------------------------------
        // var sectionId = this.programCourseList.find(e => e.sessionId == this.sessionId && e.campusId == this.campusId && e.programDetailId == this.programDetailId && e.classId == this.classId && e.slotTimingId == this.data[0].slotTimingId).sectionId;
        var key = this.datestring + '?' + this.datas.campusId + '?' + this.datas.sessionId + '?' + this.datas.sectionId + '?' + this.datas.classId + '?' + this.datas.programDetailId + '?' + this.datas.courseId + '?' + this.datas.slotTimingId;
        // alert(key);
        this.CheckRepository.CheckClash(key).then(
          res => {
            this.datas = res
            if (this.datas[0].val == 0) {


              this.attendanceDetailList = []
              this.date = new Date(this.datestring)
              var atndanceMasterId = helper.newGuid();

              // var fromTime = moment(this.datas.startTime, 'h:mm:ssa');
              // var toDate = moment(this.datas.endTime, 'h:mm:ssa');

              // var currentTime = moment(new Date(), 'h:mm:ssa');
              // console.log(' hi ' + currentTime.isBetween(fromTime, toDate))
              // this.opertation.inTime = currentTime.isBetween(fromTime, toDate) ? true : false;
              this.opertation.inTime=false;
              this.opertation.approvalTime = '';
              this.opertation.approvedBy = 0;
              this.opertation.browserInfo = navigator.userAgent;
              // this.opertation.inTime = false;
              this.opertation.insertedBy = this.user.userId;
              this.opertation.insertionTime = new Date().toLocaleString()
              this.attendanceMaster = { attendenceMasterId: atndanceMasterId, isApproved: false, loggerId: helper.newGuid(), statusId: 1, dated: this.date, timeTableId: this.data[0].timeTableId, operation: JSON.stringify(this.opertation) }
              this.data.forEach(e => {
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

              this.cancel();

             
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
          // var fromTime = moment(this.datas.startTime, 'h:mm:ssa');
          // var toDate = moment(this.datas.endTime, 'h:mm:ssa');
          // var currentTime = moment(new Date(), 'h:mm:ssa');
          // console.log(' hi ' + currentTime.isBetween(fromTime, toDate))
          // this.opertation.inTime = currentTime.isBetween(fromTime, toDate) ? true : false;
          this.opertation.inTime=false;
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

  cancel() {
    this.$emit("submit");
    this.$modal.hide("attendance-student");
  }


  //   get allowSubmit() {
  //     return (
  //       this.data.provinceId.length > 0 &&
  //       this.data.boardTypeId.length > 0 &&
  //       this.data.fullName.length > 0 &&
  //       this.data.description.length > 0
  //     );
  //   }
  $v: Vuelidate<any>;
}
