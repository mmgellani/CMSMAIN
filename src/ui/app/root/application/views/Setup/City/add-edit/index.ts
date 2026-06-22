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

import { ISetupCity, ISetupProvince, ISetupZone } from "../../../../models";
import { SetupCityService, SetupProvinceService, SetupZoneService } from "../../../../service";

import * as helper from "../../../../helper";

import { SetupProvinceAddEdit } from "../../Province/add-edit";
import { SetupZoneAddEdit } from "../../Zone/add-edit";
import { IRootStoreState } from "../../../../../store";
import { State } from "vuex-class";

type ValidateSetupCity = { data: ISetupCity; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupCity> = {
  data: {
    fullName: { required,
    maxLength: maxLength(100) },
    cityCode: { required,
    maxLength: maxLength(10) },
    provinceId: { required },
    zoneId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "City-add-edit-model",
  template: require("./index.html"),
  components: {
    'Province': SetupProvinceAddEdit,
    'Zone': SetupZoneAddEdit
  }
})
export class SetupCityAddEdit extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private repository: SetupCityService;
  private provincerepository: SetupProvinceService = null;
  private zonerepository: SetupZoneService = null;

  isActive: boolean = true;
  provinceList: Array<ISetupProvince> = [];
  zoneList: Array<ISetupZone> = [];
  private canAdd: boolean = false;

  private data: ISetupCity = {
    cityId: "",
    fullName: "",
    cityCode: "",
    statusId: 0,
    loggerId: "",
    provinceId: "",
    zoneId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SetupCityService(this.$store);
    this.provincerepository = new SetupProvinceService(this.$store);
    this.zonerepository = new SetupZoneService(this.$store);
    this.validatePage();
  }
  validatePage() {
    if (this.user.roles.indexOf('admin') >= 0) {
      this.canAdd = true;
    }
    else {
      if (('setupProvince' in this.user.claims) == true) {
        if (this.user.claims['setupProvince'].indexOf('C') >= 0) {
          this.canAdd = true;
        }
      }
      else if (('setupZone' in this.user.claims) == true) {
        if (this.user.claims['setupZone'].indexOf('C') >= 0) {
          this.canAdd = true;
        }
      }
    }
  }

  // if(this.user.claims['setupZone'.indexOf('C')] >= 0) {
  //   this.canAdd = true;
  // }

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
    this.provincerepository.GetFindBy("s=>s.StatusId==1").then(res => {
      this.provinceList = res as Array<ISetupProvince>;
    });

    this.zonerepository.GetFindBy("s=>s.StatusId==1").then(res => {
      this.zoneList = res as Array<ISetupZone>;
    });
  }

  addNewProvince() {
    this.$modal.show("Province-add-edit-model", { IsNewRecord: true });
  }

  loadProvince() {
    this.provincerepository.GetFindBy("s=>s.StatusId==1").then(res => {
      this.provinceList = res as Array<ISetupProvince>;
    });
  }

  addNewZone() {
    this.$modal.show("Zone-add-edit-model", { IsNewRecord: true });
  }

  loadZone() {
    this.zonerepository.GetFindBy("s=>s.StatusId==1").then(res => {
      this.zoneList = res as Array<ISetupZone>;
    });
  }

  cancel() {
    this.$modal.hide("City-add-edit-model");
    this.$emit("submit");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.loggerId = helper.newGuid();
        this.data.cityId = helper.newGuid();
        this.data.statusId = 1;
        this.repository.AddOne(this.data).then(() =>
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been inserted successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          })
        );
        this.cancel();
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
        this.cancel();
      }
    }
  }
  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid
    return !error;
  }
  $v: any;
}
