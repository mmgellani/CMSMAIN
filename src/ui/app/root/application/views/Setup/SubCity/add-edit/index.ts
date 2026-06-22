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

import { ISetupSubCity, ISetupCity } from "../../../../models";
import { SetupSubCityService, SetupCityService } from "../../../../service";

import * as helper from "../../../../helper";

import { SetupCityAddEdit } from "../../City/add-edit";
import { max } from "moment";
import { State } from "vuex-class";
import { IRootStoreState } from "../../../../../store";

type ValidateSetupSubCity = { data: ISetupSubCity; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupSubCity> = {
  data: {
    name: {
      required,
      maxLength: maxLength(50)
    },
    cityId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "subCity-add-edit-model",
  template: require("./index.html"),
  components: {
    'City': SetupCityAddEdit
  }
})
export class SetupSubCityAddEdit extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private repository: SetupSubCityService;
  private cityrepository: SetupCityService = null;
  private citylist: Array<ISetupCity> = [];
  private data: ISetupSubCity = {
    subCityId: "",
    name: "",
    statusId: 0,
    loggerId: "",
    cityId: "",
    code: ''
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private isActive = false;
  private canAddCity: boolean = false;

  created() {
    this.validatePage();
    this.repository = new SetupSubCityService(this.$store);
    this.cityrepository = new SetupCityService(this.$store);
    this.loadCity();
    
  }
  validatePage() {
    if (this.user.roles.indexOf('admin') >= 0) {
      this.canAddCity = true;
    }
    else {
      if (('setupCity' in this.user.claims) == true) {
        if (this.user.claims['setupCity'].indexOf('C') >= 0) {
          this.canAddCity = true;
        }
      }
    }
  }
  beforeModalOpen(event) {
    this.$v.$reset();
    this.data = {
      subCityId: "",
      name: "",
      statusId: 0,
      loggerId: "",
      cityId: "",
      code: ''
    };

    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    if (this.IsNewRecord) {
      this.data.cityId = "";
      this.data.loggerId = helper.newGuid();
      this.data.subCityId = helper.newGuid();
      this.data.statusId = 1;
    } else {
      if (this.data.statusId == 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    }
  }

  cancel() {
    this.$modal.hide("subCity-add-edit-model");
    this.$emit("submit");
  }

  addNewCity() {
    this.$modal.show("City-add-edit-model", { IsNewRecord: true });
  }
  loadCity() {
    this.cityrepository.GetFindBy("e=>e.StatusId == 1").then(res => {
      this.citylist = res as Array<ISetupCity>;
    });
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {

      if (this.IsNewRecord) {
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
          this.cancel()
        }
        );
      }
      this.cancel();
    }
  }
  get allowSubmit() {
    return (
      this.data.name.length > 0 &&
      this.data.cityId.length > 0
    );
  }
  $v:any;
}
