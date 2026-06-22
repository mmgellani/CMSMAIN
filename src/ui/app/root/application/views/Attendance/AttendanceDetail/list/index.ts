/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";

import {
  IAttendanceAttendanceDetail,
  IAttendanceAttendanceDetailVM
} from "../../../../models";
import { AttendanceAttendanceDetailService } from "../../../../service";

import { AttendanceAttendanceDetailAddEdit } from "../add-edit";
import { AttendanceAttendanceDetailDelete } from "../delete";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": AttendanceAttendanceDetailAddEdit,
    "delete-model": AttendanceAttendanceDetailDelete
  }
})
export class AttendanceAttendanceDetailList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AttendanceAttendanceDetailService;
  private data: Array<IAttendanceAttendanceDetailVM> = [];
  private filterString: string = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  private columns = [
    { key: "dayName", caption: "Day" },
    { key: "name", caption: "Lecture" },
    { key: "startTime", caption: "StartTime" },
    { key: "endTime", caption: "EndTime" },
    { key: "dated", caption: "Date" },
    { key: "roomName", caption: "Room" },
    { key: "sectionName", caption: "Section" },
    { key: "staffName", caption: "Staff" },
    { key: "studentName", caption: "Student" },
    { key: "attendanceStatus", caption: "AttendenceStatus" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new AttendanceAttendanceDetailService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.refreshData();
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("attendanceAttendanceDetail" in this.user.claims == true) {
        if (this.user.claims["attendanceAttendanceDetail"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["attendanceAttendanceDetail"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["attendanceAttendanceDetail"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["attendanceAttendanceDetail"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  refreshData() {
    this.data = [];
    this.repository.GetFindByVM().then(response => {
      this.data = response as Array<IAttendanceAttendanceDetailVM>;
    });
}


  insertModel() {
    this.$modal.show("add-edit-model", {
      model: {
        attendanceDetailId: "",
        attendanceMasterId: "",
        admissionFormId: "",
        attendenceStatusId: "",
        statusId: 0,
        loggerId: ""
      },
      IsNewRecord: true
    });
  }

  editModel(model: IAttendanceAttendanceDetail) {
    this.$modal.show("add-edit-model", { model: model, IsNewRecord: false });
  }

  deleteModel(model: IAttendanceAttendanceDetail) {
    this.$modal.show("delete-model", { model: model });
  }
}
