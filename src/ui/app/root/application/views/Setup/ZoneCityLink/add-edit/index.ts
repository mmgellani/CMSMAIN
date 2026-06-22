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
  ISetupZoneCityLink,
  ISetupZone,
  ISetupCity,
  ISetupSubCity
} from "../../../../models";
import {
  SetupZoneCityLinkService,
  SetupZoneService,
  SetupCityService,
  SetupSubCityService
} from "../../../../service";

import * as helper from "../../../../helper";

type ValidateSetupZoneCityLink = {
  model: ISetupZoneCityLink;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupZoneCityLink> = {
  model: {
    zoneId: { required },
    cityId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html")
})
export class SetupZoneCityLinkAddEdit extends Vue {
  private repository: SetupZoneCityLinkService;
  private Zonerepository: SetupZoneService = null;
  private Cityerepository: SetupCityService = null;
  private isActive: boolean = true;
  ZoneList: Array<ISetupZone> = [];
  CityList: Array<ISetupCity> = [];

  private data: ISetupZoneCityLink = {
    zoneCityId: "",
    zoneId: "",
    cityId: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SetupZoneCityLinkService(this.$store);
    this.Zonerepository = new SetupZoneService(this.$store);
    this.Cityerepository = new SetupCityService(this.$store);
  }

  beforeModalOpen(event) {
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model) as ISetupZoneCityLink;
    this.Zonerepository.GetFindBy("e=>e.StatusId!=2").then(res => {
      this.ZoneList = res as Array<ISetupZone>;
    });

    this.Cityerepository.GetFindBy("e=>e.StatusId!=2").then(res => {
      this.CityList = res as Array<ISetupCity>;
    });
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("add-edit-model");
  }

  saveModel() {
    if (this.IsNewRecord) {
      this.data.zoneCityId = helper.newGuid();
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
      //console.log(JSON.stringify(this.data));
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
  get allowSubmit() {
    return this.data.zoneId.length > 0 && this.data.cityId.length > 0;
  }
  $v: Vuelidate<any>;
}
