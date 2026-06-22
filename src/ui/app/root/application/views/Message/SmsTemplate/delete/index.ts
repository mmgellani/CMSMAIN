/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { ISetupTerm } from "../../../../models";
import { SetupTermService } from "../../../../service";
import { MessageService } from "../../../../service/Message/message-service";
import { ITemplates } from "../../../../models/Message/message";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class MessageTemplateDelete extends Vue {
  private repository: MessageService;
  private data: ITemplates = {
    templateId: "",
    type: "",
    title:"",
    description: "",
    status: 0,
    sendSms: 0,
    sendNotification: 0
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new MessageService(this.$store);
  }

  beforeModalOpen(event) {
    Object.assign(this.data, event.params.model);
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("delete-model");
  }

  deleteModel() {
    this.data.status = 2;
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
