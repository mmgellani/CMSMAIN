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
  IAdmissionEligibilityCriteria,
  IAdmissionEligibilityCriteriaVM,
  ISetupSession,
  ISetupCampus,
  ICampusCityVM,
  DDLGroupModel,
  DDLModel
} from "../../../../models";
import {
  AdmissionEligibilityCriteriaService,
  SetupSessionService,
  SetupCampusService
} from "../../../../service";

import { AdmissionEligibilityCriteriaAddEdit } from "../add-edit";
import { AdmissionEligibilityCriteriaDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";


@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": AdmissionEligibilityCriteriaAddEdit,
    "delete-model": AdmissionEligibilityCriteriaDelete
  }
})
export class AdmissionEligibilityCriteriaList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AdmissionEligibilityCriteriaService;
  private data: Array<IAdmissionEligibilityCriteriaVM> = [];
  private filterString: string = "";
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private sessionList: Array<ISetupSession> = [];
  private sessionId = "";
  private campusId = "";
  private campusList: Array<ISetupCampus> = [];
  private campusCityList: Array<ICampusCityVM> = [];

  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];

  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private sessionRepo: SetupSessionService = new SetupSessionService(this.$store);

  private columns = [
    { key: "description", caption: "CampusProgramId" },
    { key: "fullName", caption: "AdmissionTypeId" },
    { key: "gender", caption: "GenderId" },
    { key: "markPercentage", caption: "MarkPercentage" },
    { key: "minPassingYear", caption: "MinPassingYear" },
    { key: "fromDob", caption: "FromDob" },
    { key: "toDob", caption: "ToDob" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new AdmissionEligibilityCriteriaService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.loadSession();
    this.loadCityCampus();
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("admissionEligibilityCriteria" in this.user.claims == true) {
        if (
          this.user.claims["admissionEligibilityCriteria"].indexOf("R") >= 0
        ) {
          this.canRead = true;
        }
        if (
          this.user.claims["admissionEligibilityCriteria"].indexOf("C") >= 0
        ) {
          this.canAdd = true;
        }
        if (
          this.user.claims["admissionEligibilityCriteria"].indexOf("U") >= 0
        ) {
          this.canEdit = true;
        }
        if (
          this.user.claims["admissionEligibilityCriteria"].indexOf("D") >= 0
        ) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  get shouldInsert() {
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  loadCityCampus() {
    this.campusCityList = [];
    this.campusRepo.GetCityVM().then(r => {
      this.campusCityList = r as Array<ICampusCityVM>;
    });
  }

  loadSession() {
    this.sessionList = [];
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }

  refreshData() {
    this.data = [];
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      this.repository
        .GetEligibiltyCriteriaBySession(this.sessionId + "?" + this.campusId)
        .then(
          response =>
            (this.data = response as Array<IAdmissionEligibilityCriteriaVM>)
        );
    }
  }

  insertModel() {

    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      this.$modal.show("add-edit-model", {
        model: {
          eligibilityCriteriaId: "",
          campusProgramId: "",
          admissionTypeId: "",
          genderId: "",
          markPercentage: 0,
          minPassingYear: new Date(),
          fromDob: new Date(),
          toDob: new Date(),
          statusId: 0,
          loggerId: ""
        },
        IsNewRecord: true,
        sessionId: this.sessionId,
        campusId: this.campusId
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

  editModel(model: IAdmissionEligibilityCriteria) {
    this.$modal.show("add-edit-model", {
      model: model,
      IsNewRecord: false,
      sessionId: this.sessionId,
      campusId: this.campusId
    });
  }

  deleteModel(model: IAdmissionEligibilityCriteria) {
    this.$modal.show("delete-model", { model: model });
  }
}
