/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import * as helper from "../../../../helper";

import { ISetupSession, ISetupTerm } from "../../../../models";
import { SetupSessionService, SetupTermService } from "../../../../service";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";
import { maxLength, required } from "vuelidate/lib/validators";

import Component from "vue-class-component";
import { ITemplates } from "../../../../models/Message/message";
import { MessageService } from "../../../../service/Message/message-service";
import { PayloadMessageTypes } from "../../../../../../model";
import { StoreTypes } from "../../../../../../store";
import Vue from "vue";

type ValidateMessageTemplate = { model: ITemplates; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateMessageTemplate> = {
  model: {
    type: { required },
    description: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html")
})
export class MessageTemplateAddEdit extends Vue {
  private repository: MessageService;
  private SessionList: Array<ISetupSession> = [];
  private SessionRepo: SetupSessionService = null;
  isActive: boolean = true;

  private data: ITemplates = {
    templateId: "",
    type: "",
    title: "",
    description: "",
    status: 0,
    sendSms: 0,
    sendNotification: 0
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new MessageService(this.$store);
    // this.SessionRepo = new SetupSessionService(this.$store);
    // this.SessionRepo.GetFindBy("s=>s.StatusId==1")
    //   .then()
    //   .then(res => {
    //     this.SessionList = res as Array<ISetupSession>;
    //   });
  }

  beforeModalOpen(event) {
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("add-edit-model");
  }

  saveModel() {
    if (this.IsNewRecord) {
      this.data.templateId = helper.newGuid();
      this.data.status = 1;
      // this.data.loggerId = helper.newGuid();
      if (this.data.type.length > 0 &&
        this.data.description.length > 0) {

        this.repository.AddOneVM(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been inserted successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
          this.cancel();
        });
      }
      else{

        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Please Enter Template Type and Description",
          title: "",
          messageTypeId: PayloadMessageTypes.warning
        });


      }
    } else {
      // if (this.isActive == true) {
      //   this.data.statusId = 1;
      // } else {
      //   this.data.statusId = 0;
      // }

      if(this.data.type.length>0  && this.data.description.length>0)
      {
      this.repository.Update(this.data).then(() => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Record has been updated successfully",
          title: "Success",
          messageTypeId: PayloadMessageTypes.success
        });
        this.cancel();
      });
    }
    else
    {

      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please Enter Template Type and Description",
        title: "",
        messageTypeId: PayloadMessageTypes.warning
      });



    }
    }

    //this.cancel();
  }
  get allowSubmit() {
    return (
      this.data.type.length > 0 &&
      this.data.description.length > 0
    );
  }
  $v: Vuelidate<any>;
}
