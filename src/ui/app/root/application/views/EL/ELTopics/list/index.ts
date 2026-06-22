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
  IELTopics,
  IRegistrationCourse,
  ISetupClass,
  IRegistrationProgramCourseLink,
  RegistrationProgramCourseLinkVM,
  IMCQsQuestion,
  IVideos,
  IELChapters,
  ProgramCourseList,
  IBoards,
} from "../../../../models";
import {
  ELTopicsService,
  RegistrationCourseService,
  SetupClassService,
  RegistrationProgramCourseLinkService,
  VideosService,
  MCQsQuestionService,
  ELChaptersService,
  AdmissionStudentsService,
  BoardsService,
} from "../../../../service";

import { TopicsAddEdit } from "../add-edit";
import { TopicsDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": TopicsAddEdit,
    "delete-model": TopicsDelete,
  },
})
export class TopicsList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: ELTopicsService = new ELTopicsService(this.$store);
  private data: Array<IELTopics> = [];
  private filterString: string = "";
  private classId = "";
  private chapterId = "";
  private chapterList: Array<IELChapters> = [];
  private chapterRepo: ELChaptersService = new ELChaptersService(this.$store);
  private classList: Array<ISetupClass> = [];

  private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(
    this.$store
  );
  private classRepo: SetupClassService = new SetupClassService(this.$store);
  private courseRepository: AdmissionStudentsService = new AdmissionStudentsService(
    this.$store
  );

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private questionList: Array<IMCQsQuestion> = [];
  private videoList: Array<IVideos> = [];
  private videoRepo: VideosService = new VideosService(this.$store);
  private questionRepo: MCQsQuestionService = new MCQsQuestionService(
    this.$store
  );
  private programCourse: Array<ProgramCourseList> = [];
  boardList: IBoards[] = [];
  boardRepo: BoardsService = new BoardsService(this.$store);
  boardId = "";

  private videoId = "";
  private questionid = "";
  private courseId = "";
  private columns = [
    { key: "title", caption: "Title" },
    { key: "description", caption: "Description" },
    // { key: 'video', caption: 'Tags' },
    // { key: 'question', caption: 'Links' },

    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 },
  ];

  created() {
    // this.loadChapters();
  }
  mounted() {
    this.validatePage();
    // this.refreshData();
    this.loadCourse();
    this.loadClass();
    this.loadBoards();
  }
  loadCourse() {
    this.courseRepository.GetProgramCourse().then((r) => {
      this.programCourse = r as Array<ProgramCourseList>;
    });
  }

  loadClass() {
    this.classRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
      this.classList = r as Array<ISetupClass>;
    });
  }

  loadChapters() {
    this.chapterRepo
      .GetFindBy(
        's=>s.CourseId.ToString()=="' +
          this.courseId +
          '" && s.BoardId.ToString()=="' +
          this.boardId +
          '" && s.ClassId.ToString()=="' +
          this.classId +
          '" && s.StatusId == 1'
      )
      .then((r) => {
        this.chapterList = r as Array<IELChapters>;
      });
  }
  // loadVideos() {
  //     this.videoRepo.GetFindBy('s=>s.StatusId==1')
  //         .then(r => {
  //             this.videoList = r as Array<IVideos>

  //         })
  // }
  // loadQusetions() {
  //     this.questionRepo.GetFindBy('s=>s.StatusId==1')
  //         .then(r => {
  //             this.questionList = r as Array<IMCQsQuestion>

  //         })
  // }

  // loadClass() {
  //     this.classRepo.GetFindBy('s=>s.StatusId==1')
  //         .then(r => {
  //             this.classList = r as Array<ISetupClass>

  //         })
  // }
  // loadCourse() {
  //     this.programCourseRepo.GetByClassId(this.classId)
  //         .then(r => {
  //             this.courseList = r as Array<RegistrationProgramCourseLinkVM>
  //             this.refreshData();
  //         })

  // }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("Topics" in this.user.claims == true) {
        if (this.user.claims["Topics"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["Topics"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["Topics"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["Topics"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  loadBoards() {
    this.boardRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
      this.boardList = r;
    });
  }

  refreshData() {
    this.data = [];

    if (this.chapterId.length > 0) {
      this.repository
        .GetFindBy(
          's=>s.ChapterId.ToString()=="' + this.chapterId + '" && s.StatusId!=2'
        )
        .then((response) => (this.data = response as Array<IELTopics>));
    }
  }

  insertModel() {
    if (this.chapterId.length > 0 && this.boardId.length > 0) {
      this.$modal.show("add-edit-model", {
        model: {
          chapterId: this.chapterId,
          videoLinks: "",
          description: "",
          title: "",
          topicId: "",
          statusId: 0,
          boardId: "",
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

  editModel(model: IELTopics) {
    this.$modal.show("add-edit-model", { model: model, IsNewRecord: false });
  }

  deleteModel(model: IELTopics) {
    this.$modal.show("delete-model", { model: model });
  }
}
