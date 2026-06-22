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
  IExaminationExamMaster,
  IExaminationExamMasterVM,
  IExaminationExamDetailVM,
  ISetupSession,
  ISetupCampus,
  DDLModel,
  DDLGroupModel,
  ISetupCampusProgramVM,
  ISetupClass,
  IRegistrationSectionCourseLinkVM,
  ICampusCityVM
} from "../../../../models";
import {
  ExaminationExamMasterService,
  ExaminationExamDetailService,
  SetupSessionService,
  SetupCampusService,
  SetupCampusProgramLinkService,
  SetupClassService,
  RegistrationSectionCourseLinkService
} from "../../../../service";

import { ExaminationExamMasterAddEdit } from "../add-edit";
import { ExaminationExamMasterDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "ExamMaster-add-edit-model": ExaminationExamMasterAddEdit,
    "delete-model": ExaminationExamMasterDelete
  }
})
export class ExaminationExamMasterList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: ExaminationExamMasterService;
  private data: Array<IExaminationExamMasterVM> = [];
  private filterString: string = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;


  private programDetailId: string;
  private ddl: Array<DDLModel> = [];
  private programDDL: Array<DDLGroupModel> = [];
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private classList: Array<ISetupClass> = [];
  sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];
  private sessionId: string;
  private campusId: string;
  private classId: string;
  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];
  private campusCityList: Array<ICampusCityVM> = [];
  private campusProgramId: string;
  private sectionCourseLinkId: string;


  private campusList: Array<ISetupCampus> = []
  private sessionList: Array<ISetupSession> = [];
  private sessionRepo: SetupSessionService;
  private examDetailModel: Array<IExaminationExamDetailVM> = [];
  private repositoryExamDetail: ExaminationExamDetailService;
  private campusRepo: SetupCampusService;
  private campusProgramLinkRepo: SetupCampusProgramLinkService;
  private classRepo: SetupClassService;
  private SectionCourserepository: RegistrationSectionCourseLinkService;

  private columns = [
    { key: "courseName", caption: "Course" },
    { key: "fullName", caption: "ExamType" },
    { key: "dated", caption: "Date" },
    { key: "totalMarks", caption: "TotalMarks" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new ExaminationExamMasterService(this.$store);
    this.repositoryExamDetail = new ExaminationExamDetailService(this.$store);
    this.sessionRepo = new SetupSessionService(this.$store);
    this.campusRepo = new SetupCampusService(this.$store);
    this.campusProgramLinkRepo = new SetupCampusProgramLinkService(this.$store);
    this.classRepo = new SetupClassService(this.$store);
    this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.loadSession();
  }

  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionList = r as Array<ISetupSession>
      })
  }


  loadCampus() {
    this.campusRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.campusList = r as Array<ISetupCampus>

      })
  }
  loadCityCampus() {
    this.campusddl = [];
    this.cityDDL = [];
    let oldObj: ICampusCityVM;
    this.campusRepo.GetCityVM()
        .then(r => {
            this.campusCityList = r as Array<ICampusCityVM>


            oldObj = this.campusCityList[0]
            this.campusCityList.forEach(e => {

                if (e.cityName == oldObj.cityName) {

                    this.campusddl.push({ id: e.campusId, text: e.campusName })
                }
                else {

                    this.cityDDL.push({ title: this.campusCityList[this.campusCityList.indexOf(e) - 1].cityName, group: this.campusddl })
                    this.campusddl = []
                    this.campusddl.push({ id: e.campusId, text: e.campusName })
                }
                oldObj = e;
            })
            this.cityDDL.push({ title: oldObj.cityName, group: this.campusddl });
        })
}

  loadProgramsOfCampus() {
    this.programDetailId = ''
    this.data = []
    this.ddl = [];
    this.programDDL = [];
    let oldObj: ISetupCampusProgramVM;
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      var key = this.sessionId + '?' + this.campusId
      this.campusProgramLinkRepo.GetAllVM(key)
        .then(r => {
          this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>

          oldObj = this.campusProgramLinkList[0]
          this.campusProgramLinkList.forEach(e => {

            if (e.programId == oldObj.programId) {

              this.ddl.push({ id: e.programDetailId, text: e.description })
            }
            else {

              this.programDDL.push({ title: this.campusProgramLinkList[this.campusProgramLinkList.indexOf(e) - 1].programName, group: this.ddl })
              this.ddl = []
              this.ddl.push({ id: e.programDetailId, text: e.description })
            }
            oldObj = e;
          })
          this.programDDL.push({ title: oldObj.programName, group: this.ddl })
        })
    }
  }
  loadSectionCourseLink() {
    this.sectionCourseLinkId = "";
    this.sectionCourseLinkList = [];
    this.campusProgramId = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.programDetailId == this.programDetailId).campusProgramId;
    var key = this.campusId + "?" + this.campusProgramId + "?" + this.classId
    this.SectionCourserepository.GetSectionData(key)
      .then(response => {
        this.sectionCourseLinkList = response as Array<IRegistrationSectionCourseLinkVM>
        this.sectionCourseLinkId = this.sectionCourseLinkList[0].sectionCourseLinkId;
      });
  }

  loadClass() {
    this.classRepo.GetFindBy('s=>s.StatusId!=2')
      .then(r => { this.classList = r as Array<ISetupClass> });
  }


  // getExamDetail() {
  //   this.examDetailModel = [];
  //   this.repositoryExamDetail
  //     .GetFindBy("e => e.StatusId!=2")
  //     .then(
  //       response =>
  //         (this.examDetailModel = response as Array<IExaminationExamDetailVM>)
  //     );
  // }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("examinationExamMaster" in this.user.claims == true) {
        if (this.user.claims["examinationExamMaster"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["examinationExamMaster"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["examinationExamMaster"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["examinationExamMaster"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  refreshData() {
    this.loadSectionCourseLink();
    this.data = [];
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      var key = this.sessionId + '?' + this.campusId + '?' + this.programDetailId + '?' + this.classId
      this.repository.GetFindByVM(key)
        .then(res => {
          this.data = res as Array<IExaminationExamMasterVM>;
        });
    }
  }

  insertModel() {
    this.$modal.show("ExamMaster-add-edit-model", {
      model: {
        examMasterId: "",
        examTypeId: "",
        dated: new Date(),
        // toDate: new Date(),
        totalMarks: 0,
        statusId: 0,
        loggerId: "",
        programCourseLinkId: "",
        sessionId: this.sessionId,
        campusId: this.campusId,
        programDetailId: this.programDetailId,
        classId: this.classId,
        sectionCourseLinkId: this.sectionCourseLinkId

      },
      IsNewRecord: true
    });
  }

  editModel(model: IExaminationExamMaster) {
    this.$modal.show("ExamMaster-add-edit-model", {
      model: model,
      IsNewRecord: false
    });
  }

  deleteModel(model: IExaminationExamMaster) {
    if (
      this.examDetailModel.filter(e => e.examMasterId == model.examMasterId)
        .length > 0
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
