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

import { ISetupMedium } from "../../../../models";
import { SetupMediumService, SeatingPlanDateSheetService } from "../../../../service";

import * as helper from "../../../../helper";
import { ISeatingPlanDateSheet } from "../../../../models/Seating Plan/datesheet";
import { ISeatingPlanDateSheetDetail } from "../../../../models/Seating Plan/datesheetdetail";
import { SeatingPlanDateSheetDetailService } from "../../../../service/seatingplan/datesheetdetail";
import moment from "moment";

type ValidateSeatingPlanDateSheetDetail = { data: ISeatingPlanDateSheetDetail; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSeatingPlanDateSheetDetail> = {
  data: {
    dateSheetDate: { required },
    fromTime: { required },
    toTime: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'datesheetdetail-add-edit-model',
  template: require('./index.html')
})
export class DateSheetDetailAddEdit extends Vue {
  private repository: SeatingPlanDateSheetDetailService;
  isActive: boolean = true;
  private data: ISeatingPlanDateSheetDetail = {
    dateSheetDetailId: "",
    dateSheetDate: new Date(),
    fromTime: "",
    toTime: "",
    statusId: 0,
    dateSheetId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SeatingPlanDateSheetDetailService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";

    this.data.dateSheetDetailId=event.params.model.dateSheetDetailId;
    this.data.dateSheetId=event.params.model.dateSheetId;
    this.data.dateSheetDate=event.params.model.dateSheetDate;
    this.data.fromTime=event.params.model.fromTime;
    this.data.toTime=event.params.model.toTime;
    this.data.statusId=event.params.model.statusId;

    Object.assign(this.data, event.params.model);
    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else {
      this.isActive = false;
    }
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide('datesheetdetail-add-edit-model');
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.dateSheetDetailId = helper.newGuid();
        this.data.dateSheetDate = new Date(moment(this.data.dateSheetDate).format('YYYY-MM-DD'))
        this.data.fromTime = this.data.fromTime;
        this.data.toTime = this.data.toTime;
        this.data.dateSheetId = this.data.dateSheetId;
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
        new Date(moment(this.data.dateSheetDate).format('YYYY-MM-DD'))
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
    return (
      this.data.fromTime.length > 0 &&
      this.data.toTime.length > 0
    );
  }
  $v: any;
}
