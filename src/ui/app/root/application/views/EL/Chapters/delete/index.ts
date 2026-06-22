/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { IELChapters } from "../../../../models";
import { ELChaptersService } from "../../../../service";

@Component({
  name: "delete-modal",
  template: require("./index.html"),
})
export class ELChaptersDelete extends Vue {
  private repository: ELChaptersService;
  private data: IELChapters = {
    abbreviation: "",
    orderNo: 0,
    chapterId: "",
    fullName: "",
    description: "",
    statusId: 0,
    courseId: "",
    boardId: "",
    classId: "",
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new ELChaptersService(this.$store);
  }

  beforeModalOpen(event) {
    Object.assign(this.data, event.params.model);
  }

  cancel() {
    this.$modal.hide("delete-model");
    this.$emit("submit");
  }

  deleteModel() {
    this.data.statusId = 2;
    this.repository.Update(this.data).then(() => {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Record has been Deleted successfully",
        title: "Deleted",
        messageTypeId: PayloadMessageTypes.warning,
      });
      this.cancel();
    });

    this.cancel();
  }
}
