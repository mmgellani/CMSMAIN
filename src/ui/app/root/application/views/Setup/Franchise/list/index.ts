import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";
import { IUser } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";
import { ISetupFranchise } from "../../../../models/Setup/Franchise";
import { SetupFranchiseService } from "../../../../service/Setup/Franchise";
import { FranchiseAddEdit } from "../add-edit/index";
import { FranchiseDelete } from "../delete/index";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": FranchiseAddEdit,
    "delete-model": FranchiseDelete
  }
})
export class Franchise extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private data: Array<ISetupFranchise> = [];
  private service: SetupFranchiseService = null;
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  private columns = [
    { key: "description", caption: "Description" },
    { key: "companyOperated", caption: "Company Operated" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.service = new SetupFranchiseService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.loadData();
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("franchise" in this.user.claims == true) {
        if (this.user.claims["franchise"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["franchise"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["franchise"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["franchise"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  loadData() {
    this.service
      .GetFindBy("f=>f.StatusId != 2")
      .then(response => (this.data = response as Array<ISetupFranchise>));
  }

  insertData() {
    this.$modal.show("add-edit-model", {
      model: { franchiseId: "", description: "", companyOperated: false },
      IsNewRecord: true
    });
  }

  editData(model: ISetupFranchise) {
    //alert(JSON.stringify(model))
    this.$modal.show("add-edit-model", {
      model: model,
      IsNewRecord: false
    });
  }

  deleteData(data: ISetupFranchise) {
    this.$modal.show("delete-model", { data: data });
  }
}