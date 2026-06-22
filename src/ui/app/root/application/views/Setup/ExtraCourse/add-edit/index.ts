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

import { IRegistrationCourse, ISetupInstitutionType } from "../../../../models";
import { RegistrationCourseService, SetupInstitutionTypeService } from "../../../../service";

import * as helper from "../../../../helper";
import { ISetupExtraCourse } from "../../../../models/Setup/ExtraCourse";
import { SetupExtraCourseService } from "../../../../service/Setup/ExtraCourse";

// type ValidateSetupInstitutionType = {
//   data: ISetupInstitutionType;
//   validationGroup: string[];
// };
// let customValidation: ValidationRuleset<ValidateSetupInstitutionType> = {
//   data: {
//     name: {
//       required,
//       maxLength: maxLength(100)
//     },
//     description: {
//       required,
//       maxLength: maxLength(200)
//     }
//   }
// };

@Component({
  // mixins: [validationMixin],
  // validations: customValidation,
  name: "ExtraCourse-add-edit-model",
  template: require("./index.html")
})
export class SetupExtraCourseAddEdit extends Vue {
  private repository: SetupExtraCourseService;
  private data: ISetupExtraCourse = {
    extraCourseId: "",
    sessionId: "",
    campusId: "",
    courseId: "",
    statusId: 0
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private isActive: boolean = true;

  private courseRepo: RegistrationCourseService = new RegistrationCourseService(this.$store);
  private courseList: Array<IRegistrationCourse> = [];


  created() {
    this.repository = new SetupExtraCourseService(this.$store);
    this.loadCourse();
  }

  loadCourse() {
    this.courseList = [];
    this.courseRepo.GetFindBy("e=>e.StatusId==1").then(r => {
        this.courseList = r as Array<IRegistrationCourse>;
    });
}


  beforeModalOpen(event) {
    // this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    if(this.data.statusId == 1)
    {
      this.isActive = true;
    }
    else{
      this.isActive = false;
    }
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("ExtraCourse-add-edit-model");
  }

  saveModel() {
    // this.$v.$touch();
    // if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.extraCourseId = helper.newGuid();
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
    // }
  }
  get allowSubmit() {
    return true;
  }
  // $v: any;
}
