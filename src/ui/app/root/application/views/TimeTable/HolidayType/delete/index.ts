/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { ISetupZone, HolidayType } from "../../../../models";
import { SetupZoneService } from "../../../../service";
import { AcademicHolidayType } from "../list";
import { HolidayTypeService } from "../../../../service/AcademicCalendar/holidaytype";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class DeleteHolidayType extends Vue {

    repository:HolidayTypeService=new HolidayTypeService(this.$store);
    private data: HolidayType = {
        holidayTypeId: "",
        name: "",
        description: "",
        statusId: 0,
        isRecursive:false
      };

      created() {
        
      }
    
      beforeModalOpen(event) {
        Object.assign(this.data, event.params.model);
      }
    
      cancel() {
        
        this.$modal.hide("delete-model");
      }
    
      deleteModel() {
        this.data.statusId = 2;
        this.repository.Update(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been Deleted successfully",
            title: "Deleted",
            messageTypeId: PayloadMessageTypes.warning
          });
          this.cancel();
        });
    
        this.cancel();
      }

}