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
import { PayloadMessageTypes, IUser } from "../../../../../../model";

import { ISetupProvince, ISetupCountry } from "../../../../models";
import { SetupProvinceService, SetupCountryService } from "../../../../service";

import * as helper from "../../../../helper";

import { SetupCountryAddEdit } from "../../Country/add-edit";
import { IRootStoreState } from "../../../../../store";
import { State } from "vuex-class";

type ValidateSetupProvince = { data: ISetupProvince; validationGroup: string[]; };
let customValidation: ValidationRuleset<ValidateSetupProvince> = {
  data: {
    fullName: {
      required,
      maxLength: maxLength(100)
    },
    code: {
      required,
      maxLength: maxLength(10)
    },
    description: {
      required,
      maxLength: maxLength(100)
    },
    countryId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "Province-add-edit-model",
  template: require("./index.html"),
  components: {
    Country: SetupCountryAddEdit
  }
})
export class SetupProvinceAddEdit extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private repository: SetupProvinceService;
  private countryrepository: SetupCountryService = null;
  isActive: boolean = true;
  countryList: Array<ISetupCountry> = [];
  private data: ISetupProvince = {
    provinceId: "",
    fullName: "",
    code: "",
    description: "",
    countryId: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private canAdd: boolean = false;

  created() {
    this.repository = new SetupProvinceService(this.$store);
    this.countryrepository = new SetupCountryService(this.$store);
    this.validatePage();
  }
  validatePage() {
    if (this.user.roles.indexOf('admin') >= 0) {
      this.canAdd = true;
    }
    else {
      if (('setupCountry' in this.user.claims) == true) {
        if (this.user.claims['setupCountry'].indexOf('C') >= 0) {
          this.canAdd = true;
        }
      }
    }
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else if (this.data.statusId == 0) {
      this.isActive = false;
    }

    this.countryrepository.GetFindBy("e=>e.StatusId ==1").then(res => {
      this.countryList = res as Array<ISetupCountry>;
    });
  }

  addNewCountry() {
    this.$modal.show("Country-add-edit-model", { IsNewRecord: true });
  }

  loadCountry() {
    this.countryrepository.GetFindBy("e=>e.StatusId ==1").then(res => {
      this.countryList = res as Array<ISetupCountry>;
    });

  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("Province-add-edit-model");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.provinceId = helper.newGuid();
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
