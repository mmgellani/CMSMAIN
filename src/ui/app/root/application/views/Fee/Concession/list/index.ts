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
  IFeeConcession,
  IFeeConcessionVM,
  IFeeScholarshipCriteriaVM,
  IFeeConcessionDetail,
  ISetupZone,
  ISetupSession,
  ISetupProgram,
  DDLModel,
  DDLGroupModel,
  ISetupProgramDetailsVM
} from "../../../../models";
import {
  FeeConcessionService,
  FeeScholarshipCriteriaService,
  FeeConcessionDetailService,
  SetupZoneService,
  SetupSessionService,
  SetupProgramService,
  SetupProgramDetailsService
} from "../../../../service";

import { FeeConcessionAddEdit } from "../add-edit";
import { FeeConcessionDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";
import { FeeConcessionAddEditBulk } from "../add-edit-bulk";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "Concession-add-edit-model": FeeConcessionAddEdit,
    // "Concession-add-edit-bulk-model": FeeConcessionAddEditBulk,
    "delete-model": FeeConcessionDelete
  }
})
export class FeeConcessionList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: FeeConcessionService;
  private data: Array<IFeeConcessionVM> = [];
  private filterString: string = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private scholarshipCriteriaModel: Array<IFeeScholarshipCriteriaVM> = [];
  private repositoryScholarshipCriteria: FeeScholarshipCriteriaService;
  private concessiondetailmodel: Array<IFeeConcessionDetail> = [];
  private repoconcessiondetail: FeeConcessionDetailService;
  private zoneId = "";
  private sessionId = "";
  private programId = "";
  private programDetailId = "";
  private ddl: Array<DDLModel> = []
  private programDDL: Array<DDLGroupModel> = []

  private zoneList: Array<ISetupZone> = [];
  private sessionList: Array<ISetupSession> = [];
  private programList: Array<ISetupProgram> = [];
  private programDetailList: Array<ISetupProgramDetailsVM> = [];


  private zoneRepo: SetupZoneService = new SetupZoneService(this.$store);
  private sessionRepo: SetupSessionService = new SetupSessionService(
    this.$store
  );
  private programRepo: SetupProgramService = new SetupProgramService(
    this.$store
  );
  private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(this.$store);


  private columns = [
    { key: "zoneName", caption: "Zone" },
    { key: "sessionName", caption: "Session" },
    { key: "programName", caption: "Program" },
    { key: "shiftName", caption: "Shift" },
    { key: "challanTypeName", caption: "ChallanType" },
    { key: "fullName", caption: "FullName" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  loadSession() {
    this.sessionList = [];
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }
  loadZone() {
    if (this.sessionId.length > 0) {
      this.zoneList = [];
      this.zoneId = "";
      this.zoneRepo.GetFindBy("e=>e.StatusId==1").then(r => {
        this.zoneList = r as Array<ISetupZone>;
      });
    }

  }
  loadProgramsDetail() {
    this.programList = [];
    this.programId = "";
    this.programRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.programList = r as Array<ISetupProgram>;
      // console.log(this.programList.length)
    });
  }
  loadPrograms() {
    if (this.zoneId.length > 0) {
      this.programRepo.GetFindBy('e=>e.StatusId==1')
        .then(r => {
          this.programList = r as Array<ISetupProgram>
        })
    }


  }

  loadProgramsOfCampus() {
    this.programId = ''
    this.ddl = [];
    this.programDDL = [];
    let oldObj: ISetupProgramDetailsVM;
    this.programDetailRepo.GetAllVM('2')
      .then(r => {
        this.programDetailList = r as Array<ISetupProgramDetailsVM>

        oldObj = this.programDetailList[0]
        this.programDetailList.forEach(e => {

          if (e.programId == oldObj.programId) {

            this.ddl.push({ id: e.programId, text: e.description })
          }
          else {

            this.programDDL.push({ title: this.programDetailList[this.programDetailList.indexOf(e) - 1].fullName, group: this.ddl })
            this.ddl = []
            this.ddl.push({ id: e.programId, text: e.description })
          }
          oldObj = e;
        })
        this.programDDL.push({ title: oldObj.fullName, group: this.ddl })

      })
  }

  created() {
    this.repository = new FeeConcessionService(this.$store);
    this.repositoryScholarshipCriteria = new FeeScholarshipCriteriaService(
      this.$store
    );
    this.repoconcessiondetail = new FeeConcessionDetailService(this.$store);
    this.loadSession();
  }

  mounted() {
    this.validatePage();
    // this.refreshData();
    // this.getScholarshipCriteria();
    // this.getconcessiondetail();
  }

  getconcessiondetail() {
    this.concessiondetailmodel = [];
    this.repoconcessiondetail
      .GetFindBy("e => e.StatusId!=2")
      .then(
        response =>
          (this.concessiondetailmodel = response as Array<IFeeConcessionDetail>)
      );
  }

  getScholarshipCriteria() {
    this.scholarshipCriteriaModel = [];
    this.repositoryScholarshipCriteria
      .GetFindBy("e => e.StatusId!=2")
      .then(
        response =>
          (this.scholarshipCriteriaModel = response as Array<
            IFeeScholarshipCriteriaVM
          >)
      );
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("feeConcession" in this.user.claims == true) {
        if (this.user.claims["feeConcession"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["feeConcession"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["feeConcession"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["feeConcession"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  refreshData() {
    if (this.programId.length > 0) {
      // this.getconcessiondetail();
      this.data = [];
      var key = this.sessionId + "?" + this.zoneId + "?" + this.programId
      this.repository.GetConcession(key).then(response => (this.data = response as Array<IFeeConcessionVM>));
    }

  }

  insertModel() {
    if (this.sessionId.length > 0 && this.zoneId.length && this.programId.length) {

      this.$modal.show("Concession-add-edit-model", {
        model: {
          concessionId: "",
          zoneId: this.zoneId,
          sessionId: this.sessionId,
          programId: this.programId,
          shiftId: "",
          challanTypeId: "",
          fullName: "",
          statusId: 0,
          loggerId: ""
        },
        IsNewRecord: true
      });
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select the Dropdowns",
        title: "Danger",
        messageTypeId: PayloadMessageTypes.error
      });
    }

  }
  bulkModel() {
    this.$modal.show("Concession-add-edit-bulk-model", {
      model: {
        concessionId: "",
        zoneId: "",
        sessionId: "",
        programId: "",
        shiftId: "",
        challanTypeId: "",
        fullName: "",
        statusId: 0,
        loggerId: ""
      },
      IsNewRecord: true
    });
  }

  editModel(model: IFeeConcession) {
    this.$modal.show("Concession-add-edit-model", {
      model: model,
      IsNewRecord: false
    });
  }

  deleteModel(model: IFeeConcession) {
    if (
      this.scholarshipCriteriaModel.filter(
        e => e.concessionId == model.concessionId
      ).length > 0
    ) {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "This Parent Child Relation Cannot be Deleted",
        title: "Success",
        messageTypeId: PayloadMessageTypes.success
      });
    } else if (
      this.concessiondetailmodel.filter(
        e => e.concessionId == model.concessionId
      ).length > 0
    ) {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "This Parent Child Relation Cannot be Deleted",
        title: "Success",
        messageTypeId: PayloadMessageTypes.success
      });
    } else {
      this.$modal.show("delete-model", { model: model });
    }
  }
}
