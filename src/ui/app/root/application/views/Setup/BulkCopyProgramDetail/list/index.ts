

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { IRootStoreState, RootStoreTypes } from "../../../../../store";

import {
  ISetupCampus,
  ISetupSession,
  ISetupCampusProgramVMEx,
  ICampusCityVM,
  DDLGroupModel,
  DDLModel,
  IGetStudentsVM
} from "../../../../models";
import {
  SetupCampusService,
  SetupSessionService,
  SetupProgramDetailsService,
  SetupCampusProgramLinkService,
} from "../../../../service";

import { StoreTypes } from "../../../../../../store";
import { ReportsService } from "../../../../service/Reports/AdmissionReports";
import { Helper } from "../../../Fee/Helper";

import * as hlp from "../../../../helper";
import { GroupModel, GeneralModel } from "../../../../models/general";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "helper-modal": Helper
  }
})
export class BulkCopyProgramDetail extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private locck: boolean = false;
  private reportRepo: ReportsService;
  private checkfromcampus: boolean = false;
  private disableProgramDetail: boolean = false;
  private campusId = "";
  private selectAllToggle: boolean = false;
  private sessionId = "";
  private campusProgramId = "";
  private campusIdTo = "";
  private sessionIdTo = "";
  private campusProgramIdTo = "";
  private ProgramDetailIdTos = "";
  private reportDate: any = [];
  private report: String = "";
  private campusList: Array<ISetupCampus> = [];
  private sessionList: Array<ISetupSession> = [];
  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private sessionRepo: SetupSessionService = new SetupSessionService(
    this.$store
  );
  private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(
    this.$store
  );
  private campusSubCityModel: Array<GroupModel> = [];
  private campusSubCityModelTo: Array<GroupModel> = [];
  private termModel: Array<GeneralModel> = [];
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private campusProgramLinkList: Array<ISetupCampusProgramVMEx> = []
  private programDDL: Array<DDLGroupModel> = []
  private ddl: Array<DDLModel> = []
  ischecked = false;
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
  private datas: Array<IGetStudentsVM> = [];
  childKey: string = "";
  title: string = "";
  private disabldeProgramDetail: boolean = true;

  created() {
    this.loadSession();
    this.title = "";
    this.reportRepo = new ReportsService(this.$store);
    this.$store.dispatch(RootStoreTypes.reportOperation, {
      data: null,
      path: "",
      show: false
    });
  }
  loadCityCampus() {
    this.campusddl = [];
    this.cityDDL = [];
    this.campusId = "";
    let oldObj: ICampusCityVM;
    if (this.sessionId.length > 0) {
      this.campusRepo.GetCityVM().then(r => {
        this.campusSubCityModel = r;
      });
    }

  }

  loadCityCampusTo() {
    if (this.sessionId === this.sessionIdTo) {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please Select Different Sessions",
        title: "error",
        messageTypeId: PayloadMessageTypes.error
      })
    }
    else {
      this.campusIdTo = "";
      if (this.sessionIdTo.length > 0) {
        this.campusRepo.GetCityVM().then(r => {
          this.campusSubCityModelTo = r;
        });
      }
    }
  }
  loadSession() {
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.termModel = r;
    });
    this.loadCityCampus();
  }

  mounted() {
    this.validatePage();
  }
  loadProgramsOfCampus() {
    this.ddl = [];
    this.programDDL = [];
    let oldObj: ISetupCampusProgramVMEx;
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      var key = this.sessionId + "?" + this.campusId;
      this.campusProgramLinkRepo.GetAllVM(key).then(r => {
        this.campusProgramLinkList = r as Array<ISetupCampusProgramVMEx>;

      });
    }

  }
  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("bulkCopyProgramDetail" in this.user.claims == true) {
        if (this.user.claims["bulkCopyProgramDetail"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["bulkCopyProgramDetail"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["bulkCopyProgramDetail"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["bulkCopyProgramDetail"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  helper(dta) {

    this.$modal.show("helper-modal");
  }
  toggleSelectAll() {
    this.campusProgramLinkList.forEach(p => {
      p.isChecked = this.selectAllToggle;
    });
    const selectedItems = this.campusProgramLinkList
      .filter(p => p.isChecked === true)
      .map(p => p.programDetailId);
    this.ProgramDetailIdTos = selectedItems.join(',');
  }
  reloadProgramList(data: ISetupCampusProgramVMEx) {
    if (!this.selectAllToggle) {
      console.log("Checkbox changed:", data);
    }
  }

  addParam(isChecked: boolean, param: string) {

    this.disabldeProgramDetail = !isChecked;
  }

  addParamTo(isChecked: boolean, param: string) {


  }

  saveModel() {

    this.ProgramDetailIdTos = "";
    const selectedItems = this.campusProgramLinkList
      .filter(p => p.isChecked === true)
      .map(p => p.programDetailId);
    this.ProgramDetailIdTos = selectedItems.join(',');
    const isEnabled = !this.disabldeProgramDetail;

    const keyParts = [
      isEnabled,
      this.sessionId,
      isEnabled ? this.campusId : "",
      isEnabled ? this.ProgramDetailIdTos : "",
      this.sessionIdTo,
      isEnabled ? this.campusIdTo : ""
    ];
    const key = keyParts.join("?");

    this.campusRepo.BulkCopyProgramDetail(key).then(() => {
      this.Reset();
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: " Record Saved Successfully",
        title: "",
        messageTypeId: PayloadMessageTypes.success
      });
    });


  }

  Reset() {
    this.loadSession();
    this.disabldeProgramDetail = true;
    this.checkfromcampus = false;
    this.sessionId = "";
    this.campusId = "";
    this.sessionIdTo = "";
    this.campusIdTo = "";
    this.ProgramDetailIdTos = "";
    this.reportRepo = new ReportsService(this.$store);
    this.$store.dispatch(RootStoreTypes.reportOperation, {
      data: null,
      path: "",
      show: false
    });
  }

  toggleSpecificSelection() {
    this.$nextTick(() => {
      const selectedItems = this.campusProgramLinkList
        .filter(p => p.isChecked)
        .map(p => p.programDetailId);
      this.ProgramDetailIdTos = selectedItems.join(',');

    });
  }




  get allowSubmit() {

    if (this.disabldeProgramDetail == false) {
      return (
        this.sessionId.length > 0 &&
        this.sessionIdTo.length > 0 &&
        this.campusId.length > 0 &&
        this.campusIdTo.length > 0 &&
        this.ProgramDetailIdTos.length > 0
      );
    }
    else {
      return (
        this.sessionId.length > 0 &&
        this.sessionIdTo.length > 0
      );
    }
  }
}
