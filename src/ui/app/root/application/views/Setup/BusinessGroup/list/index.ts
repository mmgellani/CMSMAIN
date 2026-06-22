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

import { ISetupBusinessGroup, ISetupBusinessUnit } from "../../../../models";
import {
  SetupBusinessGroupService,
  SetupBusinessUnitService
} from "../../../../service";

import { SetupBusinessGroupAddEdit } from "../add-edit";
import { SetupBusinessGroupDelete } from "../delete";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "BusinessGrp-add-edit-model": SetupBusinessGroupAddEdit,
    "delete-model": SetupBusinessGroupDelete
  }
})
export class SetupBusinessGroupList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: SetupBusinessGroupService;
  private data: Array<ISetupBusinessGroup> = [];
  private filterString: string = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private businessunitModel: Array<ISetupBusinessUnit> = [];
  private repobu: SetupBusinessUnitService;

  private columns = [
    { key: "fullName", caption: "Full Name" },
    { key: "url", caption: "URL" },
    { key: "uan", caption: "UAN" },
    { key: "email", caption: "Email" },
    { key: "slogan", caption: "Slogan" },
    { key: "logo", caption: "Logo" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new SetupBusinessGroupService(this.$store);
    this.repobu = new SetupBusinessUnitService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.refreshData();
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("setupBusinessGroup" in this.user.claims == true) {
        if (this.user.claims["setupBusinessGroup"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["setupBusinessGroup"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["setupBusinessGroup"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["setupBusinessGroup"].indexOf("D") >= 0) {
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
      .then(response => (this.data = response as Array<ISetupBusinessGroup>));
  }

  insertModel() {
    this.$modal.show("BusinessGrp-add-edit-model", {
      model: {
        businessGroupId: "",
        fullName: "",
        url: "",
        uan: "",
        email: "",
        logo: "",
        slogan: "",
        statusId: 0,
        loggerId: ""
      },
      IsNewRecord: true
    });
  }

  editModel(model: ISetupBusinessGroup) {
    this.$modal.show("BusinessGrp-add-edit-model", {
      model: model,
      IsNewRecord: false
    });
  }

  deleteModel(model: ISetupBusinessGroup) {
    if (
      this.businessunitModel.filter(
        e => e.businessGroupId == model.businessGroupId
      ).length > 0
    ) {
      alert("This Parent Child Relation Cannot be Deleted");
    } else {
      this.$modal.show("delete-model", { model: model });
    }
  }
}
