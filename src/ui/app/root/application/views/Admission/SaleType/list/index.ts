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

import { IAdmissionSaleType, IAdmissionBulitanSale } from "../../../../models";
import {
  AdmissionSaleTypeService,
  AdmissionBulitanSaleService
} from "../../../../service";

import { AdmissionSaleTypeAddEdit } from "../add-edit";
import { AdmissionSaleTypeDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "SaleType-add-edit-model": AdmissionSaleTypeAddEdit,
    "delete-model": AdmissionSaleTypeDelete
  }
})
export class AdmissionSaleTypeList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AdmissionSaleTypeService;
  private data: Array<IAdmissionSaleType> = [];
  private filterString: string = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private bulletinsaleModel: Array<IAdmissionBulitanSale> = [];
  private repositorybulletinsale: AdmissionBulitanSaleService;

  private columns = [
    { key: "fullName", caption: "FullName" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new AdmissionSaleTypeService(this.$store);
    this.repositorybulletinsale = new AdmissionBulitanSaleService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.refreshData();
    this.getbulletinsale();
  }

  getbulletinsale() {
    this.bulletinsaleModel = [];
    this.repositorybulletinsale
      .GetFindBy("e => e.StatusId!=2")
      .then(
        response =>
          (this.bulletinsaleModel = response as Array<IAdmissionBulitanSale>)
      );
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("admissionSaleType" in this.user.claims == true) {
        if (this.user.claims["admissionSaleType"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["admissionSaleType"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["admissionSaleType"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["admissionSaleType"].indexOf("D") >= 0) {
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
      .GetFindBy("e => e.StatusId != 2")
      .then(response => (this.data = response as Array<IAdmissionSaleType>));
  }

  insertModel() {
    this.$modal.show("SaleType-add-edit-model", {
      model: { saleTypeId: "", fullName: "", statusId: 0, loggerId: "" },
      IsNewRecord: true
    });
  }

  editModel(model: IAdmissionSaleType) {
    this.$modal.show("SaleType-add-edit-model", {
      model: model,
      IsNewRecord: false
    });
  }

  deleteModel(model: IAdmissionSaleType) {
    // if (
    //   this.bulletinsaleModel.filter(e => e.saleTypeId == model.saleTypeId)
    //     .length > 0
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
