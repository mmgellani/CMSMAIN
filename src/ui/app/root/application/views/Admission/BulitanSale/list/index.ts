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

import { IAdmissionBulitanSale } from "../../../../models";
import { AdmissionBulitanSaleService } from "../../../../service";

import { AdmissionBulitanSaleAddEdit } from "../add-edit";
import { AdmissionBulitanSaleDelete } from "../delete";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": AdmissionBulitanSaleAddEdit,
    "delete-model": AdmissionBulitanSaleDelete
  }
})
export class AdmissionBulitanSaleList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AdmissionBulitanSaleService;
  private data: Array<IAdmissionBulitanSale> = [];
  private filterString: string = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  private columns = [
    { key: "saleDate", caption: "SaleDate" },
    { key: "formNumber", caption: "FormNumber" },
    { key: "fullName", caption: "FullName" },
    { key: "fatherName", caption: "FatherName" },
    { key: "mobileNumber", caption: "MobileNumber" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new AdmissionBulitanSaleService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.refreshData();
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("admissionBulitanSale" in this.user.claims == true) {
        if (this.user.claims["admissionBulitanSale"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["admissionBulitanSale"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["admissionBulitanSale"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["admissionBulitanSale"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  refreshData() {
    this.data = [];
    // if (this.data.length > 0) {
      this.repository
        .GetFindBy("e => e.StatusId != 2")
        .then(
          response => (this.data = response as Array<IAdmissionBulitanSale>)
        );
    // } else {
    //   console.log("Error in refreshData()");
    // }
  }

  insertModel() {
    this.$modal.show("add-edit-model", {
      model: {
        bulitanSaleId: "",
        programDetailId: "",
        saleDate: new Date(),
        formNumber: 0,
        fullName: "",
        fatherName: "",
        genderId: "",
        mobileNumber: "",
        saleTypeId: "",
        statusId: 0,
        loggerId: ""
      },
      IsNewRecord: true
    });
  }

  editModel(model: IAdmissionBulitanSale) {
    this.$modal.show("add-edit-model", { model: model, IsNewRecord: false });
  }

  deleteModel(model: IAdmissionBulitanSale) {
    this.$modal.show("delete-model", { model: model });
  }
}
