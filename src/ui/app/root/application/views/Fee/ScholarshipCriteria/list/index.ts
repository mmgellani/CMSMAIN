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

import { StoreTypes } from "../../../../../../store";

import {
  IFeeScholarshipCriteria,
  ISetupCampus,
  ISetupSession,
  ISetupProgramDetails,
  ISetupCampusProgramLinkVM,
  IFeeScholarshipCriteriaVM,
  ISetupCampusProgramVM,
  DDLGroupModel,
  DDLModel,
  ISetupZoneCityLinkVM,
  ICampusCityVM
} from "../../../../models";
import {
  FeeScholarshipCriteriaService,
  SetupCampusService,
  SetupSessionService,
  SetupProgramDetailsService,
  SetupCampusProgramLinkService,
  SetupZoneCityLinkService
} from "../../../../service";

import { FeeScholarshipCriteriaAddEdit } from "../add-edit";
import { FeeScholarshipCriteriaDelete } from "../delete";
import { FeeScholarshipCriteriaAddEditBulk } from "../add-edit-bulk";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": FeeScholarshipCriteriaAddEdit,
    "add-edit-bulk": FeeScholarshipCriteriaAddEditBulk,
    "delete-model": FeeScholarshipCriteriaDelete
  }
})
export class FeeScholarshipCriteriaList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: FeeScholarshipCriteriaService;
  private data: Array<IFeeScholarshipCriteriaVM> = [];
  private filterString: string = "";
  private campusId = "";
  private sessionId = "";
  private campusProgramId = "";

  private campusList: Array<ISetupZoneCityLinkVM> = [];
  private sessionList: Array<ISetupSession> = [];
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private programDDL: Array<DDLGroupModel> = [];
  private ddl: Array<DDLModel> = [];

  private campusCityList: Array<ICampusCityVM> = [];

  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];

  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private sessionRepo: SetupSessionService = new SetupSessionService(
    this.$store
  );
  private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(
    this.$store
  );
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    this.$store
  );
  private zoneCityLinkRepo: SetupZoneCityLinkService = new SetupZoneCityLinkService(
    this.$store
  );

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  private columns = [
    { key: "fullName", caption: "Full Name" },
    { key: "admissionTypeName", caption: "Admission Type" },
    { key: "continuationPolicyName", caption: "Continuation Policy" },
    { key: "concessionName", caption: "Concession" },
    { key: "attendancePercentage", caption: "Attendance Percentage" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new FeeScholarshipCriteriaService(this.$store);
    // this.loadCampus();
    this.loadSession();
    // this.loadCityCampus();
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
  loadSession() {
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }
  loadProgramsOfCampus() {
    if (this.campusId.length > 0) {
      this.ddl = [];
      this.programDDL = [];
      let oldObj: ISetupCampusProgramVM;
      var key = this.sessionId + "?" + this.campusId;
      this.campusProgramLinkRepo.GetAllVM(key).then(r => {
        this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;

      });
    }
  }
  mounted() {
    this.validatePage();
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("feeScholarshipCriteria" in this.user.claims == true) {
        if (this.user.claims["feeScholarshipCriteria"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["feeScholarshipCriteria"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["feeScholarshipCriteria"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["feeScholarshipCriteria"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  refreshData() {
    if (this.campusProgramId.length > 0) {
      this.data = [];
      this.repository
        .GetAllVM(this.campusProgramId)
        .then(
          response => (this.data = response as Array<IFeeScholarshipCriteriaVM>)
        );
    }
  }
  insertModelBulk()
  {
    
    if (this.sessionId.length > 0 && this.campusId.length > 0 && this.campusProgramId.length > 0) {
      var programIds = this.campusProgramLinkList.find(
        s => s.campusProgramId == this.campusProgramId
      ).programId;
      var zoneIds = this.campusCityList.find(s => s.campusId == this.campusId)
        .zoneId;

      this.$modal.show("add-edit-bulk-model", {
        model: {
          scholarshipCriteriaId: "",
          campusProgramId: this.campusProgramId,
          admissionTypeId: "",
          continuationPolicyId: "",
          concessionId: "",
          scholarshipTypeId: "",
          marksPer: 0,
          fullName: "",
          statusId: 0,
          loggerId: ""
        },
        IsNewRecord: true,
        sessionid: this.sessionId,
        programid: programIds,
        zoneid: zoneIds
      });
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select the Dropdowns",
        title: "Danger",
        messageTypeId: PayloadMessageTypes.error
      });
    }

  }

  insertModel() {

    if (this.sessionId.length > 0 && this.campusId.length > 0 && this.campusProgramId.length > 0) {
      var programIds = this.campusProgramLinkList.find(
        s => s.campusProgramId == this.campusProgramId
      ).programId;
      var zoneIds = this.campusCityList.find(s => s.campusId == this.campusId)
        .zoneId;

      this.$modal.show("add-edit-model", {
        model: {
          scholarshipCriteriaId: "",
          campusProgramId: this.campusProgramId,
          admissionTypeId: "",
          continuationPolicyId: "",
          concessionId: "",
          scholarshipTypeId: "",
          marksPer: 0,
          fullName: "",
          statusId: 0,
          loggerId: ""
        },
        IsNewRecord: true,
        sessionid: this.sessionId,
        programid: programIds,
        zoneid: zoneIds
      });
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select the Dropdowns",
        title: "Danger",
        messageTypeId: PayloadMessageTypes.error
      });
    }


  }

  editModel(model: IFeeScholarshipCriteriaVM) {
    this.$modal.show("add-edit-model", {
      model: model,
      IsNewRecord: false,
      shiftid: model.shiftId,
      sessionid: this.sessionId,
      programid: this.campusProgramLinkList.find(
        s => s.campusProgramId == this.campusProgramId
      ).programId,
      zoneid: this.campusCityList.find(s => s.campusId == this.campusId).zoneId
    });
  }

  deleteModel(model: IFeeScholarshipCriteria) {
    this.$modal.show("delete-model", { model: model });
  }
}
