/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { required, maxLength, minLength } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes, IUser } from "../../../../../../model";

import { ISetupAddress, ISetupCity, CitySubCity } from "../../../../models";
import { SetupAddressService } from "../../../../service";

import * as helper from "../../../../helper";
import { SetupCityService } from "../../../../service/Setup/City";

import { SetupCityAddEdit } from "../../City/add-edit";
import { IRootStoreState } from "../../../../../store";
import { State } from "vuex-class";

type ValidateSetupAddress = { data: ISetupAddress; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupAddress> = {
  data: {
    address: { required },
    postalCode: {
      maxLength: maxLength(5),
      minLength: minLength(5)
    },
    subCityId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "Address-add-edit-model",
  template: require("./index.html"),
  components: {
    City: SetupCityAddEdit
  }
})
export class SetupAddressAddEdit extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private repository: SetupAddressService;
  private cityRepo: SetupCityService = new SetupCityService(this.$store);
  private cityList: Array<CitySubCity> = [];
  private phoneNoList: Array<IPhoneNumber> = [];
  private isActive: boolean = false;
  private data: ISetupAddress = {
    addressId: "",
    address: "",
    phoneNo: "",
    postalCode: "",
    cityId: "",
    statusId: 0,
    loggerId: "",
    subCityId: ""
  };
  private refresh: Array<ISetupAddress> = [];
  private IsNewRecord: boolean = true;
  private title: string = "";
  private canAdd: boolean = false;


  created() {
    this.repository = new SetupAddressService(this.$store);
    this.loadCity();
  }

  mounted() {
    this.validatePage();
  }

  // loadCities() {
  //   this.cityRepo.GetFindBy("s=>s.StatusId==1").then(res => {
  //     this.cityList = res as Array<ISetupCity>;
  //   });
  // }

  loadCity() {
    this.cityRepo.GetCityEx()
      .then(r => {
        this.cityList = r as Array<CitySubCity>

      })
  }
  validatePage() {
    if (this.user.roles.indexOf('admin') >= 0) {
      this.canAdd = true;
    }
    else {
      if (('setupAddress' in this.user.claims) == true) {
        if (this.user.claims['setupAddress'].indexOf('C') >= 0) {
          this.canAdd = true;
        }
      }
    }
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.phoneNoList = [];
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);

    if (this.IsNewRecord) {
      this.phoneNoList.push({ phoneNo: "" });
      this.phoneNoList.push({phoneNo: "" })
    } else {
      this.phoneNoList = [];
      if (this.data.statusId == 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
      this.phoneNoList = JSON.parse(this.data.phoneNo);
    }

    // this.loadCity();
  }


  addPhoneNo() {
    this.phoneNoList.push({ phoneNo: "" });
  }
  delPhoneNo(model: IPhoneNumber) {
    var index = this.phoneNoList.indexOf(model);
    this.phoneNoList.splice(index, 1);
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("Address-add-edit-model");
  }

  addNewCity() {
    this.$modal.show("City-add-edit-model", { IsNewRecord: true });
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.cityId = this.cityList.find(e=> e.subCityId == this.data.subCityId).cityId;
        this.data.addressId = helper.newGuid();
        this.data.loggerId = helper.newGuid();
        this.data.phoneNo = JSON.stringify(this.phoneNoList);
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
        this.data.cityId = this.cityList.find(e=> e.subCityId == this.data.subCityId).cityId;
        // debugger;
        this.data.phoneNo = JSON.stringify(this.phoneNoList);

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
      // this.cancel();
    }
  }

  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
  }

  $v: any;
}

export interface IPhoneNumber {
  phoneNo: string;
}
