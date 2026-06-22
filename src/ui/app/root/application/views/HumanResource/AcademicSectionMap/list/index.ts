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
  IRegistrationSectionCourseLink,
  ISetupCampus,
  ISetupSession,
  ISetupProgramDetails,
  ISetupCampusProgramLinkVM,
  IRegistrationSectionCourseLinkVM,
  ISetupClass,
  DDLGroupModel,
  DDLModel,
  ICampusCityVM,
  ISetupCampusProgramVM,
  IExaminationExamMasterVM,
  IExaminationExamMaster,
  IBoards,
} from "../../../../models";
import {
  RegistrationSectionCourseLinkService,
  SetupCampusService,
  SetupSessionService,
  SetupProgramDetailsService,
  SetupCampusProgramLinkService,
  SetupClassService,
  ExaminationExamMasterService,
  BoardsService,
  AcademicSectionMapService,
} from "../../../../service";

import { AcademicSectionMapAddEdit } from "../add-edit";
import { AcademicSectionMapDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";
import {
  IAcademicSectionMap,
  IAcademicSectionMapVW,
} from "../../../../models/academiccalendar/academicsectionmap";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": AcademicSectionMapAddEdit,
    "delete-model": AcademicSectionMapDelete,
    // 'add-edit-bulk-model': AcademicSectionMapAddEditBulk
  },
})
export class AcademicSectionMap extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AcademicSectionMapService;
  private data: Array<IAcademicSectionMapVW> = [];
  private filterString: string = "";
  private campusId = "";
  private sessionId = "";
  private campusProgramId = "";
  private subCityId = "";
  private Programdetailid = "";
  boardId = "";
  private classid: string = "";
  private programDDL: Array<DDLGroupModel> = [];
  private ddl: Array<DDLModel> = [];
  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];
  boardList: IBoards[] = [];
  boardRepo: BoardsService = new BoardsService(this.$store);

  private campusList: Array<ISetupCampus> = [];
  private sessionList: Array<ISetupSession> = [];
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private repoClass = new SetupClassService(this.$store);
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
  classList: Array<ISetupClass> = [];
  private campusCityList: Array<ICampusCityVM> = [];
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private examMasterModel: Array<IExaminationExamMasterVM> = [];
  private repositoryExamMaster: ExaminationExamMasterService;

  private columns = [
    { key: "academicMaster", caption: "Academic Calendar" },
    { key: "sectionName", caption: "Section" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 },
  ];

  created() {
    this.repository = new AcademicSectionMapService(this.$store);
    this.repositoryExamMaster = new ExaminationExamMasterService(this.$store);
    this.$watch("sessionId", this.loadCityCampus);
    this.$watch("campusId", this.loadProgramsOfCampus);
    this.$watch("campusProgramId", this.loadClass);
    this.$watch("classid", this.loadBoards);
    this.$watch("boardId", this.refreshData);
    this.$watch("sessionId", this.refreshData);
    this.$watch("campusId", this.refreshData);
    this.$watch("campusProgramId", this.refreshData);
    this.$watch("classid", this.refreshData);
    // this.loadCityCampus();
    this.loadSession();
  }
  loadCampus() {
    this.campusRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.campusList = r as Array<ISetupCampus>;
    });
  }
  loadSession() {
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }

  loadBoards() {
    this.boardRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
      this.boardList = r;
    });
  }
  loadCityCampus() {
    this.campusCityList = [];
    this.campusRepo.GetCityVM().then((r) => {
      this.campusCityList = r as Array<ICampusCityVM>;
    });
    // this.subCityId = this.campusCityList.find(
    //   (e) => e.campusId == this.campusId
    // ).subCityId;
  }

  loadProgramsOfCampus() {
    this.campusProgramLinkList = [];
    var key = this.sessionId + "?" + this.campusId;
    this.campusProgramLinkRepo.GetAllVM(key).then((r) => {
      this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
    });
  }

  loadProgramDetail() {
    this.Programdetailid = this.campusProgramLinkList.find(
      (e) => e.campusProgramId == this.campusProgramId
    ).programDetailId;
  }
  loadClass() {
    this.repoClass.GetFindBy("e=>e.StatusId==1").then((res) => {
      this.classList = res as Array<ISetupClass>;
    });
  }

  mounted() {
    this.validatePage();
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("academicSectionMap" in this.user.claims == true) {
        if (this.user.claims["academicSectionMap"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["academicSectionMap"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["academicSectionMap"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["academicSectionMap"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  /**this.$watch("sessionId", this.loadCityCampus);
    this.$watch("campusId", this.loadProgramsOfCampus);
    this.$watch("campusProgramId", this.loadClass);
    this.$watch("classid", this.loadBoards);
    this.$watch("boardId", this.refreshData);
    this.$watch("sessionId", this.refreshData);
    this.$watch("campusId", this.refreshData);
    this.$watch("campusProgramId", this.refreshData);
    this.$watch("classid", this.refreshData); */

  refreshData() {
    this.subCityId = this.campusCityList.find(
      (e) => e.campusId == this.campusId
    ).subCityId;
    if (
      this.sessionId.length > 0 &&
      this.campusProgramId.length > 0 &&
      this.subCityId.length > 0 &&
      this.boardId.length > 0 &&
      this.classid.length > 0
    ) {
      var key =
        this.sessionId +
        "?" +
        this.subCityId +
        "?" +
        this.classid +
        "?" +
        this.boardId +
        "?" +
        this.campusProgramId;

      this.data = [];
      this.repository
        .GetAcademicSectionMapList(key)
        .then(
          (response) => (this.data = response as Array<IAcademicSectionMapVW>)
        );
    }

    // if(
    //   this.classid.length > 0 ||
    //   this.boardId.length > 0 ||
    //   this.subCityId.length > 0 ||
    //   this.sessionId.length > 0 ||
    //   this.campusId.length > 0 ||
    //   this.Programdetailid.length > 0
    // )
    // {

    // }
    //this.loadProgramDetail();
  }

  insertModel() {
    if (
      this.campusId.length > 0 &&
      this.sessionId.length > 0 &&
      this.campusProgramId.length > 0 &&
      this.classid.length > 0 &&
      this.boardId.length > 0
    ) {
      this.$modal.show("add-edit-model", {
        campusProgramId: this.campusProgramId,
        classId: this.classid,
        boardId: this.boardId,
        sessionId: this.sessionId,
        subCityId: this.subCityId,
        IsNewRecord: true,
      });
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select the Dropdowns",
        title: "Danger",
        messageTypeId: PayloadMessageTypes.error,
      });
    }
  }

  editModel(model: IAcademicSectionMap) {
    this.$modal.show("add-edit-model", {
      model: model,
      campusProgramId: this.campusProgramId,
      classId: this.classid,
      boardId: this.boardId,
      sessionId: this.sessionId,
      subCityId: this.subCityId,
      IsNewRecord: false,
    });
  }

  deleteModel(model: IAcademicSectionMap) {
    this.$modal.show("delete-model", { model: model });
  }
}
