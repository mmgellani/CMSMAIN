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

import { ITransportationRouteDetailInfo } from "../../../../models";
import { TransportationRouteDetailInfoService } from "../../../../service";

import * as helper from "../../../../helper";
import { ITransportationRouteInfo } from "../../../../models/Transportation/RouteInfo";
import { TransportationRouteInfoService } from "../../../../service/Transportation/RouteInfo";

type ValidateTransportationRouteDetailInfo = {
  data: ITransportationRouteDetailInfo;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<
  ValidateTransportationRouteDetailInfo
> = {
  data: {
    // routeDetailId: { required },
    routeId: { required },
    stopName: {
      required,
      maxLength: maxLength(15)
    },
    startingPoint: {
      required,
      maxLength: maxLength(50)
    },
    endingPoint: {
      required,
      maxLength: maxLength(50)
    },
    fare: {
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
export class TransportationRouteDetailInfoAddEdit extends Vue {
  private repository: TransportationRouteDetailInfoService;
  private data: ITransportationRouteDetailInfo = { routeDetailId: '', routeId: '', stopName: '', startingPoint: '', endingPoint: '', fare: 0, statusId: 0, loggerId: '', latitude:'',longitude:''  };

  private routeModel: Array<ITransportationRouteInfo> = [];
  private routeService: TransportationRouteInfoService = null;
  private IsNewRecord: boolean = true;
  private title: string = "";
  private isActive: boolean = false;


  created() {
    this.repository = new TransportationRouteDetailInfoService(this.$store);
    this.routeService = new TransportationRouteInfoService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    this.getRoutes();
    if (this.data.statusId == 1) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  }

  getRoutes() {
    this.routeService
      .GetFindBy("f=>f.StatusId == 1")
      .then(
        response =>
          (this.routeModel = response as Array<ITransportationRouteInfo>)
      );
  }

  cancel() {
    this.$modal.hide("add-edit-model");
    this.$emit("submit");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.routeDetailId = helper.newGuid();
        this.data.loggerId = helper.newGuid();
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
