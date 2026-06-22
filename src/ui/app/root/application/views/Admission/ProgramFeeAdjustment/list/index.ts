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

import { IProgramFeeAdjustment, IAdmissionBulitanSale, ICampusCityVM, ISetupSession, DDLGroupModel, DDLModel, ISetupCampusProgramVM, IProgramFeeAdjustmentVM } from "../../../../models";
import {
  ProgramFeeAdjustmentService,
  AdmissionBulitanSaleService,
  SetupCampusService,
  SetupSessionService,
  SetupCampusProgramLinkService
} from "../../../../service";

import { ProgramFeeAdjustmentAddEdit } from "../add-edit";
import { ProgramFeeAdjustmentDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";
import { GroupModel } from "../../../../models/general";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "programFeeAdjustment-add-edit-model": ProgramFeeAdjustmentAddEdit,
    "delete-model": ProgramFeeAdjustmentDelete
  }
})
export class ProgramFeeAdjustmentList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: ProgramFeeAdjustmentService;
  private data: Array<IProgramFeeAdjustmentVM> = [];
  private filterString: string = "";
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
  private campusId = ''
  private sessionId = ''
  private programDetailId = ''
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private bulletinsaleModel: Array<IAdmissionBulitanSale> = [];
  private repositorybulletinsale: AdmissionBulitanSaleService;
  private campusCityList: Array<ICampusCityVM> = []
  private sessionList: Array<ISetupSession> = []
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
  private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
  private columns = [
    { key: "description", caption: "Program Detail" },
    { key: "isEnabled", caption: "Enable" },
    // { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)

  created() {
    this.repository = new ProgramFeeAdjustmentService(this.$store);
    this.repositorybulletinsale = new AdmissionBulitanSaleService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.loadSession();
    this.loadCityCampus();
    this.refreshData();
    //this.getbulletinsale();
  }

  loadCityCampus() {

    this.campusRepo.GetCityVM().then(r => {
      this.campusCityList = r as Array<ICampusCityVM>;
    });
  }
  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionList = r as Array<ISetupSession>
      })
  }

  loadProgramsOfCampus() {


    this.refreshData();
  }
  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("ProgramFeeAdjustment" in this.user.claims == true) {
        if (this.user.claims["ProgramFeeAdjustment"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["ProgramFeeAdjustment"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["ProgramFeeAdjustment"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["ProgramFeeAdjustment"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  refreshData() {
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      var key = this.sessionId + "?" + this.campusId;
      this.campusProgramLinkRepo.GetAllVM(key).then(r => {
        this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
      });
      this.data = [];
      var key = this.sessionId + "?" + this.campusId
      this.repository
        .GetAllVMExDel(key)
        .then(response => (this.data = response as Array<IProgramFeeAdjustmentVM>));
    }
  }

  insertModel() {
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      this.$modal.show("programFeeAdjustment-add-edit-model", {
        model: { saleTypeId: "", fullName: "", statusId: 0, loggerId: "" },
        IsNewRecord: true, list: this.campusProgramLinkList
      });
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select all drop downs",
        title: "Warning",
        messageTypeId: PayloadMessageTypes.warning
      });
    }

  }

  editModel(model: IProgramFeeAdjustment) {
    this.$modal.show("programFeeAdjustment-add-edit-model", {
      model: model,
      IsNewRecord: false
    });
  }

  deleteModel(model: IProgramFeeAdjustment) {
    // if (
    //   this.bulletinsaleModel.filter(e => e.saleTypeId == model.saleTypeId)
    //     .length > 0
    // ) {
    //   this.$store.dispatch(StoreTypes.updateStatusBar, {
    //     text: "This Parent Child Relation Cannot be Deleted",
    //     title: "Success",
    //     messageTypeId: PayloadMessageTypes.success
    //   });
    // } else {
    this.$modal.show("delete-model", { model: model });
    // }
  }
}
