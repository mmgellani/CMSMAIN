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

import { ITimeTableSlotTimings, ITimeTableSlots } from "../../../../models";
import {
  TimeTableSlotTimingsService,
  TimeTableSlotsService
} from "../../../../service";

import * as helper from "../../../../helper";

import { TimeTableSlotsAddEdit } from "../../Slots/add-edit";
import { formulateSingle } from "../../../../helper";

type ValidateTimeTableSlotTimings = {
  data: ITimeTableSlotTimings;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateTimeTableSlotTimings> = {
  data: {
    slotId: { required },
    fullName: { required },
    startTime: { required },
    endTime: { required }
  }
};
@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html"),
  components: {
    Slots: TimeTableSlotsAddEdit
  }
})
export class TimeTableSlotTimingsAddEdit extends Vue {
  private repository: TimeTableSlotTimingsService;
  private Slotrepository: TimeTableSlotsService = null;
  SlotList: Array<ITimeTableSlots> = [];
  private data: ITimeTableSlotTimings = {
    slotTimingId: "",
    slotId: "",
    fullName: "",
    startTime: "",
    endTime: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  isActive: boolean = true;

  private selectTemplate =
    "startTime,endTime,<strong>Start Time</strong>: {0} <strong>End Time</strong> {1}";

  created() {
    this.repository = new TimeTableSlotTimingsService(this.$store);
    this.Slotrepository = new TimeTableSlotsService(this.$store);
  }

  options = {
    templateResult: this.formatFunction,
    templateSelection: this.formatFunction,
    data: []
  };

  private formatFunction(state) {
    var oneItem = this.SlotList.filter(e => e.slotId == state.id);

    var $state = $(
        oneItem ? oneItem.length > 0 ? 
        '<span><strong>Start Time</strong>: ' + oneItem[0].startTime.substring(0, 5) + ' <strong>End Time</strong>: ' + oneItem[0].endTime.substring(0, 5) + '</span>' : '' : ''
    );
    return $state;
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    if (this.data.statusId == 1) {
      this.isActive = true;
    } else if (this.data.statusId == 0) {
      this.isActive = false;
    }
    this.Slotrepository.GetFindBy("e=>e.StatusId==1").then(res => {
      this.SlotList = res as Array<ITimeTableSlots>;
      this.SlotList.forEach(element => {
        element.endTime=element.startTime+'-'+element.endTime
      });
      this.options.data = formulateSingle(this.SlotList, "slotId", "startTime");
    });
  }

  addNewSlots() {
    this.$modal.show("Slots-add-edit-model", { IsNewRecord: true });
  }
  loadSlots() {
    this.Slotrepository.GetFindBy("e=>e.StatusId==1").then(res => {
      this.SlotList = res as Array<ITimeTableSlots>;
    });
  }

  cancel() {
    this.$modal.hide("add-edit-model");
    this.$emit("submit");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.slotTimingId = helper.newGuid();
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

      this.cancel();
    }
  }
  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
  }
  $v: any;
}
