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

import { ITransportationVehicleInfo } from "../../../../models";
import { TransportationVehicleInfoService } from "../../../../service";

import * as helper from "../../../../helper";

type ValidateTransportationVehicleInfo = {
  data: ITransportationVehicleInfo;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateTransportationVehicleInfo> = {
  data: {
    // vehicleId: { required },
    vehicleName: {
      required,
      maxLength: maxLength(20)
    },
    vehicleCapacity: {
      required,
      maxLength: maxLength(3)
    },
    // vehicleNumberPlate: {
    //   required,
    //   maxLength: maxLength(10)
    // },
    registrationNo: {
      required,
      maxLength: maxLength(30)
    },
    parking: {
      required,
      maxLength: maxLength(30)
    },
    // statusId: { required },
    // loggerId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html")
})
export class TransportationVehicleInfoAddEdit extends Vue {
  private repository: TransportationVehicleInfoService;
  private data: ITransportationVehicleInfo = {
    vehicleId: "",
    vehicleName: "",
    vehicleCapacity: 0,
    vehicleNumberPlate: "",
    registrationNo: "",
    statusId: 0,
    loggerId: "",
    parking: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private isActive: boolean = false;

  created() {
    this.repository = new TransportationVehicleInfoService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    if (this.data.statusId == 1) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  }

  cancel() {
    this.$modal.hide("add-edit-model");
    this.$emit("submit");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.vehicleId = helper.newGuid();
        this.data.loggerId = helper.newGuid();
        this.data.statusId = 1;
        this.data.vehicleNumberPlate=this.data.registrationNo;
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
        this.data.loggerId = helper.newGuid();
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
  }

  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
  }
  $v: any;
}
