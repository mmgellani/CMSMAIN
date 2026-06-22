/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import * as helper from "../../../../helper";

import {
  CitySubCity,
  ISetupAddress,
  ISetupBuilding,
  ISetupPossession
} from "../../../../models";
import {
  SetupAddressService,
  SetupBuildingService,
  SetupCityService,
  SetupPossessionService
} from "../../../../service";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";
import { maxLength, required } from "vuelidate/lib/validators";

import Component from "vue-class-component";
import { PayloadMessageTypes } from "../../../../../../model";
import { SetupAddressAddEdit } from "../../Address/add-edit";
import { SetupPossessionAddEdit } from "../../Possession/add-edit";
import { StoreTypes } from "../../../../../../store";
import Vue from "vue";

type ValidateSetupBuilding = {
  data: ISetupBuilding;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupBuilding> = {
  data: {
    fullName: {
      required,
      maxLength: maxLength(100)
    },
    addressId: { required },
    possessionId: { required },
    subCityId: { required }
    // statusId: { required },
    // loggerId: { required },
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "Building-add-edit-model",
  template: require("./index.html"),
  components: {
    Address: SetupAddressAddEdit,
    Possession: SetupPossessionAddEdit
  }
})
export class SetupBuildingAddEdit extends Vue {
  private repository: SetupBuildingService;
  private addressrepository: SetupAddressService;
  private possessionrepository: SetupPossessionService;
  private cityRepo: SetupCityService = new SetupCityService(this.$store)
  isActive: boolean = true;
  private cityList: Array<CitySubCity> = []
  addresslist: Array<ISetupAddress> = [];
  possessionlist: Array<ISetupPossession> = [];
  private data: ISetupBuilding = {
    buildingId: "",
    fullName: "",
    addressId: "",
    possessionId: "",
    statusId: 0,
    loggerId: "",
    phoneNo: "",
    coordinate: "",
    subCityId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SetupBuildingService(this.$store);
    this.addressrepository = new SetupAddressService(this.$store);
    this.loadCity();
    // this.addressrepository
    //   .GetFindBy("s=>s.StatusId==1")
    //   .then(response => (this.addresslist = response as Array<ISetupAddress>));
    this.possessionrepository = new SetupPossessionService(this.$store);
    this.possessionrepository
      .GetFindBy("s=>s.StatusId==1")
      .then(
        response => (this.possessionlist = response as Array<ISetupPossession>)
      );
  }

  loadCity() {
    this.cityRepo.GetCityEx()
      .then(r => {
        this.cityList = r as Array<CitySubCity>

      })
  }
  beforeModalOpen(event) {
    this.$v.$reset();
    this.data = {
      buildingId: "",
      fullName: "",
      addressId: "",
      possessionId: "",
      statusId: 0,
      loggerId: "",
      phoneNo: "",
      coordinate: "",
      subCityId: ""
    };
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);

    if (!this.IsNewRecord) {
      if (this.data.statusId == 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    }
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("Building-add-edit-model");
  }

  addNewAddress() {
    this.$modal.show("Address-add-edit-model", { IsNewRecord: true });
  }

  loadAddress() {
    this.addresslist = [];
    this.addressrepository
      .GetFindBy('s=>s.SubCityId.ToString()=="' + this.data.subCityId +  '" && s.StatusId == 1')
      .then(response => (this.addresslist = response as Array<ISetupAddress>));
  }
  addNewPossession() {
    this.$modal.show("Possession-add-edit-model", { IsNewRecord: true });
  }

  loadPossession() {
    this.possessionrepository
      .GetFindBy("s=>s.StatusId==1")
      .then(
        response => (this.possessionlist = response as Array<ISetupPossession>)
      );
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.buildingId = helper.newGuid();
        this.data.statusId = 1;
        this.data.loggerId = helper.newGuid();
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
        }
        );
      }

      this.cancel();
    }
  }
  // get allowSubmit() {
  //   return (
  //     this.data.fullName.length > 0 &&
  //     this.data.addressId.length > 0 &&
  //     this.data.possessionId.length > 0
  //   );
  // }
  $v: any;
}
