/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";

import {
  IRegistrationProgramCourseLink,
  ISetupProgramDetails,
  ISetupClass,
  ICampusCityVM,
  RegistrationProgramCourseLinkVM,
  DDLGroupModel,
  DDLModel,
  ISetupCampusProgramVM,
  IFeeStudentFeeStructureVM,
  ISetupSession,
  ISetupProgramDetailsVM
} from "../../../../models";
import {
  RegistrationProgramCourseLinkService,
  SetupProgramDetailsService,
  SetupClassService,
  SetupCampusProgramLinkService,
  FeeStudentFeeStructureService,
  SetupCampusService,
  SetupSessionService
} from "../../../../service";

import { RegistrationProgramCourseLinkAddEdit } from "../add-edit";
import { RegistrationProgramCourseLinkAddEditSingle } from "../add-edit-single";
import { RegistrationProgramCourseLinkDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": RegistrationProgramCourseLinkAddEdit,
    "add-edit-single": RegistrationProgramCourseLinkAddEditSingle,
    "delete-model": RegistrationProgramCourseLinkDelete
  }
})
export class RegistrationProgramCourseLinkList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: RegistrationProgramCourseLinkService;
  private data: Array<RegistrationProgramCourseLinkVM> = [];
  private TempList: Array<RegistrationProgramCourseLinkVM> = [];
  private programDetailrepository: SetupProgramDetailsService = null;
  private programDetailList: Array<ISetupProgramDetails> = [];
  private Sessionrepository: SetupSessionService;
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    this.$store
  );

  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private StudentFeerepository: FeeStudentFeeStructureService;

  private sessionList: Array<ISetupSession> = [];
  private Classrepository: SetupClassService = null;
  private ClassList: Array<ISetupClass> = [];
  private filterString: string = "";
  private programDetailId: string = "";
  private ClassId: string = "";
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private programDDL: Array<DDLGroupModel> = [];
  private ddl: Array<DDLModel> = [];
  private campusId = "";
  private sessionId = "";
  private campusProgramId = "";
  private campusCityList: Array<ICampusCityVM> = [];

  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  private columns = [
    { key: "description", caption: "Description" },
    { key: "className", caption: "Class Name" },
    { key: "courseName", caption: "Course Name" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new RegistrationProgramCourseLinkService(this.$store);
    this.programDetailrepository = new SetupProgramDetailsService(this.$store);
    this.Classrepository = new SetupClassService(this.$store);
    this.StudentFeerepository = new FeeStudentFeeStructureService(this.$store);
    this.Sessionrepository = new SetupSessionService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.loadProgramsOfCampus();

    this.Classrepository.GetFindBy("e=>e.StatusId==1").then(
      res => (this.ClassList = res as Array<ISetupClass>)
    );
  }
  loadProgramsOfCampus() {
    this.programDetailId = "";
    this.programDetailList = [];
    this.programDetailrepository.GetAllVM("2").then(r => {
      this.programDetailList = r as Array<ISetupProgramDetailsVM>;
    });
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("registrationProgramCourseLink" in this.user.claims == true) {
        if (
          this.user.claims["registrationProgramCourseLink"].indexOf("R") >= 0
        ) {
          this.canRead = true;
        }
        if (
          this.user.claims["registrationProgramCourseLink"].indexOf("C") >= 0
        ) {
          this.canAdd = true;
        }
        if (
          this.user.claims["registrationProgramCourseLink"].indexOf("U") >= 0
        ) {
          this.canEdit = true;
        }
        if (
          this.user.claims["registrationProgramCourseLink"].indexOf("D") >= 0
        ) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  get shouldInsert() {
    if (this.programDetailId.length > 0 && this.ClassId.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  refreshData() {
    if (this.shouldInsert) {
      this.data = [];
      this.repository
        .GetAllFilterDataForList(this.programDetailId + `?` + this.ClassId)
        .then(
          response =>
            (this.data = response as Array<RegistrationProgramCourseLinkVM>)
        );
    }
  }

  insertModel() {
    if (this.shouldInsert) {
      this.$modal.show("add-edit-model", {
        model: {
          programCourseLinkId: "",
          programDetailId: this.programDetailId,
          classId: this.ClassId,
          courseId: "",
          statusId: 0,
          loggerId: ""
        },
        IsNewRecord: true,
        LIST: this.data
      });
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select the Dropdowns",
        title: "Danger",
        messageTypeId: PayloadMessageTypes.error
      });
    }
  }

  insertsingleModel() {
    var programdetailid = this.campusProgramLinkList.find(
      e =>
        e.campusProgramId == this.campusProgramId && e.campusId == this.campusId
    ).programDetailId;

    if (programdetailid != "" && this.ClassId != "") {
      this.$modal.show("add-edit-single-model", {
        model: {
          programCourseLinkId: "",
          programDetailId: programdetailid,
          classId: this.ClassId,
          courseId: "",
          statusId: 0,
          loggerId: ""
        },
        IsNewRecord: true
      });
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select Class and Program Detail",
        title: "Danger",
        messageTypeId: PayloadMessageTypes.error
      });
    }
  }

  editModel(model: IRegistrationProgramCourseLink) {
    this.$modal.show("add-edit-single-model", {
      model: model,
      IsNewRecord: false
    });
  }

  //   GetAllFilterData() {
  //     var programdetailid = this.campusProgramLinkList.find(
  //       e =>
  //         e.campusProgramId == this.campusProgramId && e.campusId == this.campusId
  //     ).programDetailId;
  //     var temp = programdetailid + "?" + this.ClassId;

  //     this.repository.GetAllFilterData(temp).then(res => {
  //       this.data = res as Array<RegistrationProgramCourseLinkVM>;
  //     });
  //   }

  deleteModel(model: IRegistrationProgramCourseLink) {
    this.$modal.show("delete-model", { model: model });
  }
}
