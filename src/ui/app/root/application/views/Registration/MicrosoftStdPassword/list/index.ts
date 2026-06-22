/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";
import {
  DDLGroupModel,
  DDLModel,
  ICampusCityVM,
  IFeeConcession,
  IFeeConcessionDetail,
  IFeeConcessionDetailVM,
  IFeeScholarshipCriteriaVM,
  IRegistrationSectionCourseLinkVM,
  IScholarshipApplyVM,
  IScholarshipStudentModel,
  ISetupAdmissionType,
  ISetupCampus,
  ISetupCampusProgramVM,
  ISetupClass,
  ISetupGender,
  ISetupProgramDetails,
  ISetupProgramDetailsVM,
  ISetupSession,
  ISetupShift,
  IStudentModel,
  IStudentToEnrollVM,
  IStudentsToEnrolledPercentageVM,
  IStudentEnrolledVM,
  StudentProfile,
  StudentProfileMask,
} from "../../../../models";
import {
  FeeConcessionDetailService,
  FeeConcessionService,
  FeeScholarshipCriteriaService,
  RegistrationEnrollmentsService,
  SetupAdmissionTypeService,
  SetupCampusProgramLinkService,
  SetupCampusService,
  SetupClassService,
  SetupGenderService,
  SetupProgramDetailsService,
  SetupSessionService,
  SetupShiftService,
} from "../../../../service";
import { IUser, PayloadMessageTypes } from "../../../../../../model";

import { IRootStoreState } from "../../../../../store";
import { ISetupGenderCB } from "../../EnrollmentBulk/list";
import { StoreTypes } from "../../../../../../store";
import { IStudentProfile } from "../../../../models/Admission/studentProfile";
import { ReportsService } from "../../../../service/Reports/AdmissionReports";
import { MessageService } from "../../../../service/Message/message-service";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
})
export class MicrosoftStdPassword extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private selected = [];
  private showMasking: boolean = false;
  maskName = [];
  private smsTOSent: string = "";
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(
    this.$store
  );
  private reports: ReportsService = new ReportsService(this.$store);
  private message: MessageService = new MessageService(this.$store);
  private stdRoll: IStudentProfile;
  private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
  private studentProfileList: Array<StudentProfile> = [];
  private studentProfileListCheck: Array<StudentProfile> = [];
  private stdProfilemask: Array<StudentProfileMask> = [];
  private profileList: boolean = false;
  private rolnumber: string = "";
  private sendPassword: string =
    "Dear Student, Thank you for contacting CMS Helpline. As per your request the new password of your Microsoft account is:";
  private smsapId: string = "";
  private password;
  private cellnos;
  private cellnop;
  private mskName;
  mounted() {
    this.validatePage();
  }
  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("microsoftStdPassword" in this.user.claims == true) {
        if (this.user.claims["microsoftStdPassword"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["microsoftStdPassword"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["microsoftStdPassword"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["microsoftStdPassword"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  clickRollno() {
    this.profileList = false;
    if (this.rolnumber.length > 0) {
      var rNo = this.rolnumber;
      this.reports.Getprofile(rNo).then((r) => {
        this.studentProfileList = r[0] as Array<StudentProfile>;
        this.studentProfileListCheck = r as Array<StudentProfile>;

        if (this.studentProfileListCheck.length > 0) {
          this.profileList = true;
          this.password = r[0].password;
          
          this.cellnop = r[0].parentContactNo;
          this.cellnos = r[0].studentContactNo;
          this.GetMask();
        } else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "No record found",
            title: "",
            messageTypeId: PayloadMessageTypes.error,
          });
        }
      });
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Roll no is required",
        title: "",
        messageTypeId: PayloadMessageTypes.error,
      });
    }
  }
  GetMask() {
    this.reports.GetMask().then((r) => {
      this.stdProfilemask = r;
    });
  }

  submitMask() {
    debugger;
    if (this.sendPassword != "") {
     if(this.smsapId.length == 0){
      
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select Mask",
        title: "",
        messageTypeId: PayloadMessageTypes.error,
      });
      return;
     }
      if (this.smsapId.length > 0) {
        this.mskName = this.stdProfilemask.find(
          (e) => e.smsApId == this.smsapId
        ).mask;
      }
      if (this.smsTOSent === "stdMnumber") {
        
        var key =
          this.cellnos +
          "?" +
          this.sendPassword +
          "?" +
          this.smsapId +
          "?" +
          this.mskName;
        this.message.SendResetMessage(key).then((res) => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Password has been sent to  mobile number via SMS using "+this.mskName+" masking.",
            title: "",
            messageTypeId: PayloadMessageTypes.success,
          });
        });
      } else if (this.smsTOSent === "prtMnumber") {
       
        var key =
          this.cellnop +
          "?" +
          this.sendPassword +
          "?" +
          this.smsapId +
          "?" +
          this.mskName;
        this.message.SendResetMessage(key).then((res) => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Password has been sent to  mobile number via SMS using "+this.mskName+" masking.",
            title: "",
            messageTypeId: PayloadMessageTypes.success,
          });
        });
      } else {
        var key =
          this.cellnop +
          "?" +
          this.sendPassword +
          "?" +
          this.smsapId +
          "?" +
          this.mskName;
        this.message.SendResetMessage(key).then((res) => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Password has been sent to  mobile number via SMS using "+this.mskName+" masking.",
            title: "",
            messageTypeId: PayloadMessageTypes.success,
          });
        });
        if (this.cellnos.length > 0) {
          var key =
            this.cellnos +
            "?" +
            this.sendPassword +
            "?" +
            this.smsapId +
            "?" +
            this.mskName;
          this.message.SendResetMessage(key).then((res) => { });
        }
      }
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please Enter Password",
        title: "",
        messageTypeId: PayloadMessageTypes.error,
      });
    }
  }
  changeOn(e) {
    if (e === "checked") {
      this.showMasking = true;
    } else {
      this.showMasking = false;
    }
  }
}
