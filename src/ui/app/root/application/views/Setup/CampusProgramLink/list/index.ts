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
  ISetupCampusProgramLink,
  ISetupCampus,
  ISetupSession,
  ISetupCampusProgramLinkVM,
  ICampusCityVM,
  DDLGroupModel,
  DDLModel,
  IAdmissionEligibilityCriteria
} from "../../../../models";
import {
  SetupCampusProgramLinkService,
  SetupCampusService,
  SetupSessionService,
  AdmissionEligibilityCriteriaService
} from "../../../../service";

import { SetupCampusProgramLinkAddEdit } from "../add-edit";
import { SetupCampusProgramLinkDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";
import { SetupCampusProgramLinkAddEditBulk } from "../add-edit-bulk";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": SetupCampusProgramLinkAddEdit,
    "delete-model": SetupCampusProgramLinkDelete,
    'add-edit-modelBulk': SetupCampusProgramLinkAddEditBulk
  }
})
export class SetupCampusProgramLinkList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: SetupCampusProgramLinkService;
  private data: Array<ISetupCampusProgramLinkVM> = [];
  private filterString: string = "";
  campusId: string = "";
  sessionId: string = "";

  private campusList: Array<ISetupCampus> = [];
  private sessionList: Array<ISetupSession> = [];
  private campusCityList: Array<ICampusCityVM> = [];

  private programDDL: Array<DDLGroupModel> = [];
  private ddl: Array<DDLModel> = [];

  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private sessionRepo: SetupSessionService = new SetupSessionService(this.$store);

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private EligibilityModel: Array<IAdmissionEligibilityCriteria> = [];
  private repositoryeligibility: AdmissionEligibilityCriteriaService;

  private columns = [
    { key: "description", caption: "Program" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new SetupCampusProgramLinkService(this.$store);
    this.repositoryeligibility = new AdmissionEligibilityCriteriaService(this.$store);
    this.loadSession();
  }

  mounted() {
    this.validatePage();
    // this.loadCityCampus();
  }

  loadSession() {
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }

  loadCityCampus() {
    if (this.sessionId.length > 0) {
      this.campusCityList = [];
      this.campusRepo.GetCityVM().then(r => {
        this.campusCityList = r as Array<ICampusCityVM>;
      });
    }
  }


  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("setupCampusProgramLink" in this.user.claims == true) {
        if (this.user.claims["setupCampusProgramLink"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["setupCampusProgramLink"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["setupCampusProgramLink"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["setupCampusProgramLink"].indexOf("D") >= 0) {
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

  refreshData() {
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      this.data = [];
      var key = this.sessionId + "?" + this.campusId;
      this.repository
        .GetAllVM(key)
        .then(
          response => (this.data = response as Array<ISetupCampusProgramLinkVM>)
        );
    }
  }

  insertModel() {
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      this.$modal.show("add-edit-model", {
        model: {
          campusProgramId: "",
          campusId: this.campusId,
          programDetailId: "",
          statusId: 0,
          loggerId: "",
          sessionId: this.sessionId
        },
        IsNewRecord: true
      });
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please Select the Dropdowns",
        title: "Error",
        messageTypeId: PayloadMessageTypes.error
      });
    }
  }

  insertModelBulk() {
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
        this.$modal.show('add-edit-modelBulk', { model: { campusProgramId: '', campusId: this.campusId, programDetailId: '', statusId: 0, loggerId: '', sessionId: this.sessionId, }, IsNewRecord: true });
    }
    else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Please Select the dropdowns first",
            title: "Error",
            messageTypeId: PayloadMessageTypes.error
        });
    }
}

  editModel(model: ISetupCampusProgramLink) {
    this.$modal.show("add-edit-model", {
      model: model,
      IsNewRecord: false,
      sessionId: this.sessionId,
      campusId: this.campusId
    });
  }

  deleteModel(model: ISetupCampusProgramLink) {
      this.$modal.show("delete-model", { model: model });
  }
}
