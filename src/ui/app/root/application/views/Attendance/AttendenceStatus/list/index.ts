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
  IAttendanceAttendenceStatus,
  IExaminationExamDetailVM
} from "../../../../models";
import {
  AttendanceAttendenceStatusService,
  ExaminationExamDetailService
} from "../../../../service";

import { AttendanceAttendenceStatusAddEdit } from "../add-edit";
import { AttendanceAttendenceStatusDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": AttendanceAttendenceStatusAddEdit,
    "delete-model": AttendanceAttendenceStatusDelete
  }
})
export class AttendanceAttendenceStatusList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AttendanceAttendenceStatusService;
  private data: Array<IAttendanceAttendenceStatus> = [];
  private filterString: string = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private examDetailModel: Array<IExaminationExamDetailVM> = [];
  private repositoryExamDetail: ExaminationExamDetailService;

  private columns = [
    { key: "code", caption: "Code" },
    { key: "fullName", caption: "FullName" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new AttendanceAttendenceStatusService(this.$store);
    this.repositoryExamDetail = new ExaminationExamDetailService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.refreshData();
    this.getExamDetail();
  }

  getExamDetail() {
    this.examDetailModel = [];
    this.repositoryExamDetail
      .GetFindBy("e => e.StatusId!=2")
      .then(
        response =>
          (this.examDetailModel = response as Array<IExaminationExamDetailVM>)
      );
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("attendanceAttendenceStatus" in this.user.claims == true) {
        if (this.user.claims["attendanceAttendenceStatus"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["attendanceAttendenceStatus"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["attendanceAttendenceStatus"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["attendanceAttendenceStatus"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  refreshData() {
    this.data = [];
    
      this.repository
        .GetFindBy("e => e.StatusId!=2")
        .then(
          response =>
            (this.data = response as Array<IAttendanceAttendenceStatus>)
        );
    
  }

  insertModel() {
    this.$modal.show("add-edit-model", {
      model: {
        attendenceStatusId: "",
        code: "",
        fullName: "",
        statusId: 0,
        loggerId: ""
      },
      IsNewRecord: true
    });
  }

  editModel(model: IAttendanceAttendenceStatus) {
    this.$modal.show("add-edit-model", { model: model, IsNewRecord: false });
  }

  deleteModel(model: IAttendanceAttendenceStatus) {
    // if (
    //   this.examDetailModel.filter(
    //     e => e.attendanceStatusId == model.attendenceStatusId
    //   ).length > 0
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
