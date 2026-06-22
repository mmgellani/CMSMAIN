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
  IELChapters,
  IRegistrationCourse,
  ISetupClass,
  IRegistrationProgramCourseLink,
  RegistrationProgramCourseLinkVM,
  IBoards,
} from "../../../../models";
import {
  ELChaptersService,
  RegistrationCourseService,
  SetupClassService,
  RegistrationProgramCourseLinkService,
  BoardsService,
} from "../../../../service";

import { ELChaptersAddEdit } from "../add-edit";
import { ELChaptersDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": ELChaptersAddEdit,
    "delete-model": ELChaptersDelete,
  },
})
export class ELChaptersList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: ELChaptersService;
  private data: Array<IELChapters> = [];
  private filterString: string = "";
  private classId = "";
  private boardId = "";
  private courseId = "";
  private courseList: Array<RegistrationProgramCourseLinkVM> = [];
  private classList: Array<ISetupClass> = [];
  boardList: IBoards[] = [];
  boardRepo: BoardsService = new BoardsService(this.$store);

  private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(
    this.$store
  );
  private classRepo: SetupClassService = new SetupClassService(this.$store);

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  private columns = [
    { key: "fullName", caption: "FullName" },
    { key: "description", caption: "Description" },
    { key: "abbreviation", caption: "Abbreviation" },
    { key: "orderNo", caption: "Order No" },

    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 },
  ];

  created() {
    this.repository = new ELChaptersService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.loadClass();
    this.loadBoards();
  }
  loadClass() {
    this.classRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
      this.classList = r as Array<ISetupClass>;
    });
  }

  loadBoards() {
    this.boardRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
      this.boardList = r;
    });
  }
  loadCourse() {
    this.programCourseRepo.GetByClassId(this.classId).then((r) => {
      this.courseList = r as Array<RegistrationProgramCourseLinkVM>;
      this.refreshData();
    });
  }


  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("elChapters" in this.user.claims == true) {
        if (this.user.claims["elChapters"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["elChapters"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["elChapters"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["elChapters"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  refreshData() {
    this.data = [];
    //if (this.classId.length > 0 && this.courseId.length > 0) {
    var key = this.boardId + "?" + this.classId;
    this.repository
      .GetChaptersList(key)
      .then((response) => (this.data = response as Array<IELChapters>));
    //}
  }

  insertModel() {
    console.log("calling");
    if (this.classId.length > 0 && this.boardId.length > 0) {
      this.$modal.show("add-edit-model", {
        model: {
          abbreviation: "",
          orderNo: 0,
          chapterId: "",
          fullName: "",
          description: "",
          statusId: 0,
          courseId: "",
          boardId: this.boardId,
          classId: this.classId,
        },
        IsNewRecord: true,
      });
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please Select Drop Down Values First",
        title: "Warning",
        messageTypeId: PayloadMessageTypes.warning,
      });
    }
  }

  editModel(model: IELChapters) {
    this.$modal.show("add-edit-model", { model: model, IsNewRecord: false });
  }

  deleteModel(model: IELChapters) {
    this.$modal.show("delete-model", { model: model });
  }
}
