/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import moment from "moment";
import { MessageService } from "../../../service/Message/message-service";
import { IRootStoreState } from "../../../../store";
import {
  GetExamSMSApprovalData,
  GetExamSMSApprovalDatapopup,
  GetStudentExamDetail,
  IExamApproval2,
} from "../../../models/Examination/ExamApproval";
import { IUser, PayloadMessageTypes } from "../../../../../model";
import { StoreTypes } from "../../../../../store";
import {
  AttendanceAttendenceStatusService,
  ExaminationExamDetailService,
  ExaminationExamMasterService,
  ExaminationExamTypeService,
  FeeConcessionDetailService,
  RegistrationEnrollmentsService,
  RegistrationSectionCourseLinkService,
  SetupCampusProgramLinkService,
  SetupCampusService,
  SetupClassService,
  SetupSessionService,
} from "../../../service";
import {
  DDLGroupModel,
  DDLModel,
  IAttendanceAttendanceDetail,
  IAttendanceAttendenceMaster,
  IAttendanceAttendenceStatus,
  ICampusCityVM,
  ICourseSection,
  IExaminationExamType,
  IExamScheduleName,
  IFeeConcessionDetail,
  IRegistrationSectionCourseLinkVM,
  IScholarshipApplyVM,
  ISetupCampus,
  ISetupCampusProgramVM,
  ISetupClass,
  ISetupSession,
} from "../../../models";

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
  };

  //notification code end
}
@Component({
  name: "models-form-list",
  template: require("./index.html"),
  // components: {
  //     'add-edit-model': FeeApplyScholarshipAddEdit
  // }
})
export class ExamSMSApproval extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private notificationRepo: MessageService = new MessageService(this.$store);
  service: MessageService = new MessageService(this.$store);
  private repository: FeeConcessionDetailService;
  private filterString: string = "";
  private campusId = "";
  private sessionId = "";
  private sectionId = "";
  private sectionCourseLinkId = "";
  private classId = "";
  private programDetailId = "";
  private scholarshipCriteriaId = "";
  private campusProgramId = "";
  private date: Date = new Date();
  private datestring = "";
  private sectionCourseid = "";
  private fullDayAbsent = false;
  private dateMonth: string = "";
  private title = "Confirmation";
  private campus = "";
  private CampusProgramId = "";
  private cclassid = "";
  private sectionCourseLink = "";
  private srollno = "";
  private Messaage = "";
  private titletxt = "";
  private imagetxt = "";
  private notifType = "";
  private session = "";
  private checkStatus = false;
  private id1: "";
  private CheckAllRec: boolean = false;
  private ischeck: boolean;
  private campusList: Array<ISetupCampus> = [];
  private sessionList: Array<ISetupSession> = [];
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private attendanceStatusList: Array<IAttendanceAttendenceStatus> = [];
  private attendanceMaster: IAttendanceAttendenceMaster;
  private attendanceDetailList: Array<IAttendanceAttendanceDetail> = [];
  private programDDL: Array<DDLGroupModel> = [];
  private ddl: Array<DDLModel> = [];
  private campusCityList: Array<ICampusCityVM> = [];
  private examTypeList: Array<IExaminationExamType> = [];
  private examscheduleList: Array<IExamScheduleName> = [];

  private sectionRepo: RegistrationSectionCourseLinkService;
  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];
  // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
  private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
  private courseList: Array<ICourseSection> = [];
  private data: Array<IExamApproval2> = []; //
  private examTypeId = "";
  private programdetail = "";

  private SectionName = "";
  private ClassName = "";
  private Month = "";
  private month = "";

  //private data: Array<IExamApproval2> = [];
  // studentdata: Array<GetStudentExamDetail> = [];
  private studentdata: Array<GetExamSMSApprovalData> = [];
  private studentdatapopup: Array<GetExamSMSApprovalDatapopup> = [];

  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    this.$store
  );
  private examTypeRepo: ExaminationExamTypeService = new ExaminationExamTypeService(
    this.$store
  );

  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private sessionRepo: SetupSessionService = new SetupSessionService(
    this.$store
  );
  //private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(
    this.$store
  );
  private examDetailRepo: ExaminationExamDetailService = new ExaminationExamDetailService(
    this.$store
  );
  private attendanceStatusRepo: AttendanceAttendenceStatusService = new AttendanceAttendenceStatusService(
    this.$store
  );
  private examMasterRepo: ExaminationExamMasterService = new ExaminationExamMasterService(
    this.$store
  );

  private classRepo: SetupClassService = new SetupClassService(this.$store);
  private classList: Array<ISetupClass> = [];
  private showmodel: boolean = false;
  private isdisabled: boolean = false;
  private isCheckedAll: boolean = false;

  private idd: number = null;

  private AssExType: Array<object> = [
    { idd: 0, text: "Assessment" },
    { idd: 1, text: "Examination" },
  ];

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private selected = [];
  private columns = [
    { key: "programDetail", caption: "Program Detail" },
    { key: "section", caption: "Section" },
    { key: "totalScheduledExams", caption: "Scheduled" },
    { key: "approvedExams", caption: "Approved" },
    { key: "status", caption: "Status" },
    { key: "action", caption: "Action" },
    { key: "ischeck", caption: "Check All" },
  ];
  private statusList: Array<object> = [
    { idd: "Pending", text: "Pending" },
    { idd: "Ready To send", text: "Ready To send" },
    { idd:"Sent", text: "Sent" },
  ];
  created() {
    this.repository = new FeeConcessionDetailService(this.$store);
    this.sectionRepo = new RegistrationSectionCourseLinkService(this.$store);
    // this.loadCampus();
    // this.loadCityCampus();
    // this.loadExamType();
    this.loadSession();
    this.id1 = "";
    this.datestring =
      this.date.getFullYear() +
      "-" +
      ("0" + (this.date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + this.date.getDate()).slice(-2);
  }

  mounted() {
    this.validatePage();
    // this.refreshData();
    this.showmodel = false;
  }
  get canSave() {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].isApproved) {
        return true;
        break;
      }
    }
    return false;
  }

  loadProgramsOfCampus() {
    if (this.campusId.length > 0) {
      this.ddl = [];
      this.programDDL = [];
      let oldObj: ISetupCampusProgramVM;
      var key = this.sessionId + "?" + this.campusId;
      this.campusProgramLinkRepo.GetAllVM(key).then((r) => {
        this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
      });
    }
  }

  loadCityCampus() {
    if (this.sessionId.length > 0) {
      this.campusddl = [];
      this.cityDDL = [];
      let oldObj: ICampusCityVM;
      this.campusRepo.GetCityVM().then((r) => {
        this.campusCityList = r as Array<ICampusCityVM>;
      });
    }
  }

  loadCampus() {
    this.campusRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.campusList = r as Array<ISetupCampus>;
    });
  }

  loadClass() {
    if (this.programDetailId.length > 0) {
      this.classId = "";
      this.sectionCourseLinkId = "";
      this.classRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
        this.classList = r as Array<ISetupClass>;
      });
    }
  }
  loadSection() {
    if (this.classId.length > 0) {
      this.data = [];
      this.sectionCourseLinkId = "";
      var cmid = this.campusProgramLinkList.find(
        (s) =>
          s.campusId == this.campusId &&
          s.programDetailId == this.programDetailId &&
          s.sessionId == this.sessionId
      ).campusProgramId;
      var key = this.campusId + "?" + cmid + "?" + this.classId;
      this.sectionRepo
        .GetSectionData(key)
        .then(
          (response) =>
            (this.sectionList = response as Array<
              IRegistrationSectionCourseLinkVM
            >)
        );
    }
  }

  loadSession() {
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }

  loadSections(key: string) {
    this.enrollmentRepo.GetSectionList(key).then((r) => {
      this.courseList = r as Array<ICourseSection>;

      // console.log(this.sectionList==null)
      //alert(this.courseList.length)
      if (this.courseList.length == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Section not Defined",
          title: "warning",
          messageTypeId: PayloadMessageTypes.warning,
        });
      }
    });
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("examSMSApproval" in this.user.claims == true) {
        if (this.user.claims["examSMSApproval"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["examSMSApproval"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["examSMSApproval"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["examSMSApproval"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  // loadCourses() {
  //     this.date = new Date();
  //     if (this.campusProgramId.length > 0 && this.date != null) {
  //         var key = this.campusProgramId + '?' + this.datestring
  //         this.attendanceDetailRepo.GetCourseSection(key)
  //             .then(response => {
  //                 this.courseList = (response as Array<ICourseSection>);
  //                 if (this.courseList.length == 0) {
  //                     this.$store.dispatch(StoreTypes.updateStatusBar, {
  //                         text: 'Courses not Defined',
  //                         title: 'warning',
  //                         messageTypeId: PayloadMessageTypes.warning
  //                     });
  //                 }
  //             });
  //     }
  // }
  refreshData() {
    debugger;

    // Check if sessionId and campusId have values
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      const date = new Date(this.dateMonth);
      const monthName = date.toLocaleString("en-US", { month: "long" });
var status="";
      // Build key for the API call
      var key =
        this.sessionId +
        "?" +
        this.campusId +
        "?" +
        this.programDetailId +
        "?" +
        this.classId +
        "?" +
        monthName +
        "?" + status;

      console.log("key value", key);

      // Fetch data from the repository
      this.examMasterRepo.GetExamSMSApprovalData(key).then((response) => {
        debugger;

        // Assign the response to studentdata array
        this.studentdata = response as Array<GetExamSMSApprovalData>;

        // Use Vue's $set to ensure reactivity
        this.studentdata.forEach((student, index) => {
          this.$set(this.studentdata[index], "isApproved", false); // Ensure checkboxes are unchecked reactively
        });

        console.log("smsdata", this.studentdata);
      });
    }

    // Uncheck the "Select All" checkbox
    this.CheckAllRec = false;
  }

  refreshDataEx() {
    debugger;

    // Check if sessionId and campusId have values
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      const date = new Date(this.dateMonth);
      const monthName = date.toLocaleString("en-US", { month: "long" });

      // Build key for the API call
      var key =
        this.sessionId +
        "?" +
        this.campusId +
        "?" +
        this.programDetailId +
        "?" +
        this.classId +
        "?" +
        monthName + "?" + this.id1;

      console.log("key value", key);

      // Fetch data from the repository
      this.examMasterRepo.GetExamSMSApprovalData(key).then((response) => {
        debugger;

        // Assign the response to studentdata array
        this.studentdata = response as Array<GetExamSMSApprovalData>;

        // Use Vue's $set to ensure reactivity
        this.studentdata.forEach((student, index) => {
          this.$set(this.studentdata[index], "isApproved", false); // Ensure checkboxes are unchecked reactively
        });

        console.log("smsdata", this.studentdata);
      });
    }

    // Uncheck the "Select All" checkbox
    this.CheckAllRec = false;
  }

  checkStatusData() {
    console.log(this.checkStatus);
    if (this.checkStatus === true) {
      this.id1 = "";
    }
  }

  // loadExamType() {
  //     if (this.sectionCourseLinkId.length > 0) {
  //         this.examMasterRepo.GetExamScheduleNameNewList(this.sectionCourseLinkId)
  //             .then(r => {
  //                 this.examscheduleList = r as Array<IExamScheduleName>
  //             });
  //     }
  // }
  isAssessment: boolean = false;
  loadExamType() {
    if (this.sectionCourseLinkId.length > 0 && this.idd != null) {
      if (this.idd == 0) {
        var key = this.sectionCourseLinkId + "?" + "Assessment";
        this.isAssessment = true;
      } else {
        var key = this.sectionCourseLinkId + "?" + "Exam";
        this.isAssessment = false;
      }
      console.log("Key", key);
      this.examMasterRepo
        .GetExamAssessmentScheduleNameNewList(key)
        .then((r) => {
          this.examscheduleList = r as Array<IExamScheduleName>;
        });
    }
  }
  toggel() {
    this.showmodel = !this.showmodel;
  }
  viewdata(sectionCourseLinkId) {
    debugger;
    this.showmodel = true;
    var key1 = sectionCourseLinkId;
    console.log("sectioncourse", sectionCourseLinkId);
    const date = new Date(this.dateMonth);
    const monthName = date.toLocaleString("en-US", { month: "long" });
    var key = sectionCourseLinkId + "?" + monthName;
    console.log("sectioncourse key", key);

    console.log("key value", key);
    this.examMasterRepo.GetExamSMSApprovalDataPopup(key).then((r) => {
      this.studentdatapopup = r as Array<GetExamSMSApprovalDatapopup>;
      this.programdetail = this.studentdatapopup[0].programDetail;
      this.SectionName = this.studentdatapopup[0].section;
      this.Month = this.studentdatapopup[0].month;
      this.ClassName = this.studentdatapopup[0].className;
      console.log("sectioncourse list", this.studentdatapopup);
    });
  }
  // CheckAllrecords() {
  //   debugger;

  //   console.log("student data is: ", this.studentdata);

  //   // console.log("Selected SectionCourseLinkId:", sectionCourseLinkId); // Debugging line

  //   // Handle comma-separated IDs
  //   // let ids = sectionCourseLinkId.split(","); // split the incoming IDs if they are in comma-separated form

  //   if (this.CheckAllRec) {
  //     // Select only 'Ready to Send' items for the provided IDs
  //     this.studentdata.forEach((e, index) => {
  //       // Check if the ID of the current item is in the list of provided IDs
  //       if (
  //         // ids.includes(e.sectionCourseLinkId.toString()) &&
  //         e.status === "Ready to Send"
  //       ) {
  //         // Explicitly updating the isApproved property to true
  //         this.$set(this.studentdata[index], "isApproved", true);
  //       }
  //     });
  //   } else {
  //     // Unselect all items
  //     this.studentdata.forEach((e, index) => {
  //       this.$set(this.studentdata[index], "isApproved", false);
  //       // if (ids.includes(e.sectionCourseLinkId.toString())) {
  //       //   this.$set(this.studentdata[index], "isApproved", false);
  //       // }
  //     });
  //   }
  // }

  // insertModel() {
  //   debugger;
  //   var list = this.studentdata;

  //   let ides = "";
  //   let smsid = "";
  //   this.studentdata.forEach((e) => {
  //     //if (e.isApproved) {
  //     ides += `'` + e.sectionCourseLinkId + `',`;
  //     smsid += `''` + e.month + `'',`;
  //     //}
  //   });

  //   ides = ides.substring(0, ides.length - 1);
  //   smsid = smsid.substring(1, smsid.length - 2);
  //   console.log(smsid);
  //   if (ides.length > 0) {
  //     this.examMasterRepo.UpdateBulk(ides + "?" + smsid).then((r) => {
  //       this.$store.dispatch(StoreTypes.updateStatusBar, {
  //         text: "Approved Successfully",
  //         title: "success",
  //         messageTypeId: PayloadMessageTypes.success,
  //       });
  //       this.Notificaiton();
  //       this.refreshData();
  //     });
  //   }
  // }

  extractStudentSectionAndMonth() {
    let ids = [];

    // No need to reset 'month' as it's a single string, not an array
    this.studentdata.forEach((student) => {
      ids.push(student.sectionCourseLinkId); // Collect sectionCourseLinkId
      this.month = student.month; // Directly assign month as a string (not an array)
    });

    // Store comma-separated sectionCourseLinkId in a variable
    this.sectionCourseLinkId = ids.join(","); // Comma-separated
    console.log("Section Course Link IDs:", this.sectionCourseLinkId);
    console.log("Month:", this.month); // Just a single month, not an array
  }

  // Function to check and approve records
  CheckAllrecords() {
    debugger;

    // First, extract sectionCourseLinkId and month
    this.extractStudentSectionAndMonth();

    if (this.CheckAllRec) {
      // Select only 'Ready to Send' items
      this.studentdata.forEach((student, index) => {
        if (student.status === "Ready to Send") {
          this.$set(this.studentdata[index], "isApproved", true);
        }
      });
    } else {
      // Unselect all items
      this.studentdata.forEach((student, index) => {
        this.$set(this.studentdata[index], "isApproved", false);
      });
    }
  }

  checkSingle(recordId) {
    this.studentdata.forEach((student, index) => {
      if (student.sectionCourseLinkId == recordId) {
        this.$set(
          this.studentdata[index],
          "isApproved",
          !this.studentdata[index].isApproved
        );
      }
    });
  }

  // insertModel() {
  //   debugger;

  //   // Call the extractStudentSectionAndMonth method first
  //   this.extractStudentSectionAndMonth();

  //   // Initialize `ides` as a string
  //   let ides = this.sectionCourseLinkId; // Use the extracted sectionCourseLinkIds
  //   let smsid = this.month; // Use the extracted month (assuming single month)

  //   // Debugging to see the values
  //   console.log("Comma-separated sectionCourseLinkIds: ", ides);
  //   console.log("Month: ", smsid);

  //   if (ides.length > 0) {
  //     // Send the comma-separated `ides` and `smsid` for the update
  //     this.examMasterRepo.SendSMSApproval(`${ides}?${smsid}`).then((r) => {
  //       this.$store.dispatch(StoreTypes.updateStatusBar, {
  //         text: "Send SMS Approval Successfully",
  //         title: "success",
  //         messageTypeId: PayloadMessageTypes.success,
  //       });
  //       this.refreshData();
  //       this.Notificaiton();
  //     });
  //   }
  // }

  insertModel() {
    debugger;

    // Call the extractStudentSectionAndMonth method first
    this.extractStudentSectionAndMonth();

    debugger;
    // Filter `this.studentdata` to get only `sectionCourseLinkIds` with status "Ready to Send"
    const readyToSendIds = this.studentdata
      .filter(
        (student) => student.status === "Ready to Send" && student.isApproved
      )
      .map((student) => student.sectionCourseLinkId); // Assuming sectionCourseLinkId is the property name

    // Join the filtered ids into a comma-separated string
    let ides = readyToSendIds.join(","); // Join to create a comma-separated string
    let smsid = this.month; // Use the extracted month (assuming single month)

    // Debugging to see the values
    console.log("Comma-separated sectionCourseLinkIds: ", ides);
    console.log("Month: ", smsid);

    // Check if no checkboxes were selected (i.e., no students are "Ready to Send" with isApproved)
    if (readyToSendIds.length === 0) {
      // Display a toaster message if no checkboxes are selected
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select a checkbox",
        title: "warning",
        messageTypeId: PayloadMessageTypes.warning, // Assuming 'warning' type exists in your message types
      });
      return; // Stop execution, don't proceed with sending SMS
    }

    if (ides.length > 0) {
      // Send the comma-separated `ides` and `smsid` for the update
      this.examMasterRepo.SendSMSApproval(`${ides}?${smsid}`).then((r) => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Send SMS Approval Successfully",
          title: "success",
          messageTypeId: PayloadMessageTypes.success,
        });
        this.refreshData();
        this.Notificaiton();
      });
    }
  }

  //   insertModel() {
  //     debugger;
  //     var list = this.studentdata;

  //     // Initialize `ides` as a string, not an array
  //     let ides = "";
  //     let smsid = "";

  //     this.studentdata.forEach((e) => {
  //       // Assuming you only want approved records
  //       if (e.isApproved) {
  //         // Append sectionCourseLinkId to `ides`, with commas
  //         ides += `'${e.sectionCourseLinkId}',`;

  //         // Assign `month` to `smsid` (assuming you want a single month value)
  //         smsid = `${e.month}`; // Removing extra single quotes and keeping it simple
  //       }
  //     });

  //     // Remove the trailing comma from `ides` if there is one
  //     if (ides.length > 0) {
  //       ides = ides.slice(0, -1); // Remove the last comma
  //     }

  //     // Debugging to see the values
  //     console.log("Comma-separated sectionCourseLinkIds: ", ides);
  //     console.log("Month: ", smsid);

  //     if (ides.length > 0) {
  //       // Send the comma-separated `ides` and `smsid` for the update
  //       this.examMasterRepo.UpdateBulk(`${ides}?${smsid}`).then((r) => {
  //         this.$store.dispatch(StoreTypes.updateStatusBar, {
  //           text: "Approved Successfully",
  //           title: "success",
  //           messageTypeId: PayloadMessageTypes.success,
  //         });
  //         this.Notificaiton();
  //         this.refreshData();
  //       });
  //     }
  // }

  editModel(model: IScholarshipApplyVM) {
    // this.$modal.show('add-edit-model', { model: this.datas.filter(s=>s.scholarshipName==model.scholarshipName)});
  }

  deleteModel(model: IFeeConcessionDetail) {
    this.$modal.show("delete-model", { model: model });
  }

  Notificaiton() {
    //var datedasc = this.paidDate.getDate() + '-' + (this.paidDate.getMonth() + 1) + '-' + this.paidDate.getFullYear();
    this.session = "" + this.sessionId + "";
    this.campus = "" + this.campusId + "";
    this.CampusProgramId = "" + this.campusProgramId + "";
    this.cclassid = "" + this.classId + "";
    this.sectionCourseLink = "" + this.sectionCourseLinkId + "";
    this.srollno = "0";
    var examschedulename = this.examscheduleList.find(
      (e) => e.examTypeId == this.examTypeId
    ).examName;
    //this.Messaage = 'Dear Parents, your child ' + this.Name + ' ,' + this.RefrenceNo + ' has paid Rs.' + this.TotalAmount + ' on ' + datedasc + '. Thank you for your cooperation';
    this.Messaage =
      "Exam results of " +
      examschedulename +
      " have been uploaded. Kindly check under â€˜Exam Resultsâ€™ section.";

    this.titletxt = "Exam";
    this.imagetxt = "0";
    this.notifType = "Exam";

    if (this.sectionCourseLink != "00000000-0000-0000-0000-000000000000") {
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
          image: this.imagetxt,
        },
      };

      var keysend =
        JSON.stringify(dataNotification) +
        "?" +
        this.user.userId +
        "?" +
        this.Messaage;
      this.notificationRepo.BulkNotificationSelectionEx(keysend).then((r) => {
        var today = new Date();
        var notificationIdd = r;

        var keyapproval =
          notificationIdd +
          "?" +
          this.Messaage +
          "?" +
          moment(today).format("YYYY/MM/DD") +
          "?" +
          this.user.userId;
        var convert = notificationIdd;
        // alert(JSON.stringify(keyapproval))
        this.service.NotificationApprove(keyapproval).then((r) => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Fee Confirm Successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success,
          });

          // Axios.post('https://superapp.cms.edu/api/Notification/SendNotificationToUser', {
          //     notify: {
          //         notification: this.Messaage,
          //         type: this.notifType
          //         //,title: titles,
          //         // image: images
          //     },
          //     sesseion: this.session,
          //     campus: this.campus,
          //     program: this.CampusProgramId,
          //     classstudent: this.cclassid,
          //     section: this.sectionCourseLink,
          //     rollno: this.srollno
          // })
          // .then(response => {})
          // .catch(e => {

          // })
        });
      });
    }
  }
}
