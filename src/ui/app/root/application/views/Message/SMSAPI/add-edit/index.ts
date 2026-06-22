/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

// import Vue from "vue";
// import Component from "vue-class-component";
// import { required, maxLength } from "vuelidate/lib/validators";
// import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

// import { StoreTypes } from "../../../../../../store";
// import { PayloadMessageTypes } from "../../../../../../model";

// import { SetupTermService, SetupSessionService } from "../../../../service";

// import * as helper from "../../../../helper";
// import { ISmsAPI } from "../../../../models/Message/message";
// import { MessageService } from "../../../../service/Message/message-service";

// type ValidateSetupSmsAPI = { data: ISmsAPI; validationGroup: string[] };
// let customValidation: ValidationRuleset<ValidateSetupSmsAPI> = {
//   data: {
//     loginId: { required },
//     password: { required },
//     shortCodePref: { required },
//     isUnicode: { required },
//     mask: { required }
//   }
// };

// @Component({
//   mixins: [validationMixin],
//   validations: customValidation,
//   name: "add-edit-model",
//   template: require("./index.html")
// })
// export class MessageSMSAPIAddEdit extends Vue {
//   private repository: MessageService;
//   isActive: boolean = true;

//   private data: ISmsAPI = {
//     smsApId: "",
//     loginId: "",
//     password: "",
//     shortCodePref: "",
//     isUnicode: "",
//     mask: ""
//   };
//   private IsNewRecord: boolean = true;
//   private title: string = "";

//   created() {
//     this.repository = new MessageService(this.$store);
//   }

//   beforeModalOpen(event) {
//     this.IsNewRecord = event.params.IsNewRecord;
//     this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
//     Object.assign(this.data, event.params.model);
//   }

//   cancel() {
//     this.$emit("submit");
//     this.$modal.hide("add-edit-model");
//   }

//   saveModel() {
//     if (this.IsNewRecord) {
//       this.data.smsApId = helper.newGuid();
//       this.repository.AddSmsMask(this.data).then(() => {
//         this.$store.dispatch(StoreTypes.updateStatusBar, {
//           text: "Record has been inserted successfully",
//           title: "Success",
//           messageTypeId: PayloadMessageTypes.success
//         });
//         this.cancel();
//       });
//     } else {
//       if (this.isActive == true) {
//         this.data.statusId = 1;
//       } else {
//         this.data.statusId = 0;
//       }
//       this.repository.Update(this.data).then(() => {
//         this.$store.dispatch(StoreTypes.updateStatusBar, {
//           text: "Record has been updated successfully",
//           title: "Success",
//           messageTypeId: PayloadMessageTypes.success
//         });
//         this.cancel();
//       });
//     }

//     this.cancel();
//   }
//   get allowSubmit() {
//     let error = this.$v.data.$error || this.$v.data.$invalid;
//     return !error;
//   }
//   $v: Vuelidate<any>;
// }
