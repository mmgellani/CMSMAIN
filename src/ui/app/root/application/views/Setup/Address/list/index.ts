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
  ISetupAddress,
  ISetupCity,
  ISetupBuilding,
  ISetupBusinessUnit,
  ISetupCampus
} from "../../../../models";
import {
  SetupAddressService,
  SetupCityService,
  SetupBuildingService,
  SetupBusinessUnitService,
  SetupCampusService
} from "../../../../service";

import { SetupAddressAddEdit } from "../add-edit";
import { SetupAddressDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "Address-add-edit-model": SetupAddressAddEdit,
    "delete-model": SetupAddressDelete
  }
})
export class SetupAddressList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: SetupAddressService;
  private data: Array<ISetupAddress> = [];
  private filterString: string = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private buildingModel: Array<ISetupBuilding> = [];
  private repobuilding: SetupBuildingService;
  private campusModel: Array<ISetupCampus> = [];
  private repocampus: SetupCampusService;
  private businessunitModel: Array<ISetupBusinessUnit> = [];
  private repobu: SetupBusinessUnitService;

  private cityM: ISetupCity = {
    cityId: "",
    fullName: "",
    cityCode: "",
    statusId: 0,
    loggerId: "",
    provinceId: "",
    zoneId: ""
  };

  private columns = [
    { key: "address", caption: "Address" },
    { key: "phoneNo", caption: "Phone #" },
    { key: "postalCode", caption: "Postal Code" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new SetupAddressService(this.$store);
    this.repobuilding = new SetupBuildingService(this.$store);
    this.repobu = new SetupBusinessUnitService(this.$store);
    this.repocampus = new SetupCampusService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.refreshData();
  }

  getPhone(item) {
    return JSON.parse(item);
  }
  getcampus() {
    this.campusModel = [];
    this.repocampus
      .GetFindBy("e => e.StatusId!=2")
      .then(response => (this.campusModel = response as Array<ISetupCampus>));
  }

  getbuilding() {
    this.buildingModel = [];
    this.repobuilding
      .GetFindBy("e => e.StatusId!=2")
      .then(
        response => (this.buildingModel = response as Array<ISetupBuilding>)
      );
  }

  getbusinessunit() {
    this.businessunitModel = [];
    this.repobu
      .GetFindBy("e => e.StatusId!=2")
      .then(
        response =>
          (this.businessunitModel = response as Array<ISetupBusinessUnit>)
      );
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("setupAddress" in this.user.claims == true) {
        if (this.user.claims["setupAddress"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["setupAddress"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["setupAddress"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["setupAddress"].indexOf("D") >= 0) {
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
      .then(response => (this.data = response as Array<ISetupAddress>));
  }

  insertModel() {
    this.$modal.show("Address-add-edit-model", {
      model: {
        addressId: "",
        address: "",
        phoneNo: "",
        postalCode: "",
        cityId: "",
        statusId: 0,
        loggerId: "",
        subCityId:""
      },
      IsNewRecord: true
    });
  }

  editModel(model: ISetupAddress) {
    this.$modal.show("Address-add-edit-model", {
      model: model,
      IsNewRecord: false
    });
  }

  deleteModel(model: ISetupAddress) {
    if (
      this.buildingModel.filter(e => e.addressId == model.addressId).length > 0
    ) {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "This Parent Child Relation Cannot be Deleted",
        title: "Success",
        messageTypeId: PayloadMessageTypes.success
      });
    } else if (
      this.businessunitModel.filter(e => e.addressId == model.addressId)
        .length > 0
    ) {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "This Parent Child Relation Cannot be Deleted",
        title: "Success",
        messageTypeId: PayloadMessageTypes.success
      });
    }
    // else if( this.campusModel.filter(e => e.addressId == model.addressId).length > 0){
    //     this.$store.dispatch(StoreTypes.updateStatusBar, {
    //         text: "This Parent Child Relation Cannot be Deleted",
    //         title: "Success",
    //         messageTypeId: PayloadMessageTypes.success
    //       });
    // }
    else {
      this.$modal.show("delete-model", { model: model });
    }
  }
}
