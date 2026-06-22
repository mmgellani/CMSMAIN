/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { required, maxLength } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import {
  ISetupBuildingAddressLink,
  ISetupAddress,
  ISetupBuilding
} from "../../../../models";
import {
  SetupBuildingAddressLinkService,
  SetupAddressService,
  SetupBuildingService
} from "../../../../service";

import * as helper from "../../../../helper";

type ValidateSetupBuildingAddressLink = {
  model: ISetupBuildingAddressLink;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupBuildingAddressLink> = {
  model: {
    addressLinkId: { required },
    addressId: { required },
    statusId: { required },
    loggerId: { required },
    buildingId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html")
})
export class SetupBuildingAddressLinkAddEdit extends Vue {
  isActive: boolean = false;
  private repository: SetupBuildingAddressLinkService;
  private data: ISetupBuildingAddressLink = {
    addressLinkId: "",
    addressId: "",
    statusId: 0,
    loggerId: "",
    buildingId: "",
    preferenceNo: 0
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  addressList: Array<ISetupAddress> = [];
  buidingList: Array<ISetupBuilding> = [];
  addressRepo: SetupAddressService = new SetupAddressService(this.$store);
  buildingRepo: SetupBuildingService = new SetupBuildingService(this.$store);

  created() {
    this.repository = new SetupBuildingAddressLinkService(this.$store);
    this.loadAdress();
    this.loadBuildings();
  }

  beforeModalOpen(event) {
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    if (this.IsNewRecord) {
    } else {
      if (this.data.statusId == 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    }
  }

  cancel() {
    this.$modal.hide("add-edit-model");
  }

  loadAdress() {
    this.addressRepo.GetFindBy("s=>s.StatusId==1").then(res => {
      this.addressList = res as Array<ISetupAddress>;
    });
  }
  loadBuildings() {
    this.buildingRepo.GetFindBy("s=>s.StatusId==1").then(res => {
      this.buidingList = res as Array<ISetupBuilding>;
    });
  }
  saveModel() {
    if (this.IsNewRecord) {
      this.data.loggerId = helper.newGuid();
      this.data.addressLinkId = helper.newGuid();
      this.data.statusId = 1;
      this.repository.AddOne(this.data).then(() => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Record has been inserted successfully",
          title: "Success",
          messageTypeId: PayloadMessageTypes.success
        });
        this.cancel();
      });
    } else {
      if (this.isActive == true) {
        this.data.statusId = 1;
      } else {
        this.data.statusId = 0;
      }
      this.repository.Update(this.data).then(() => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Record has been updated successfully",
          title: "Success",
          messageTypeId: PayloadMessageTypes.success
        });
        this.cancel();
      });
    }

    this.cancel();
  }
  $v: Vuelidate<any>;
}
