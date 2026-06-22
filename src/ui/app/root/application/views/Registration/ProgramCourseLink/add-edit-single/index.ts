import Vue from "vue";
import Component from "vue-class-component";
import { required, maxLength } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import {
  IRegistrationProgramCourseLink,
  IRegistrationCourse
} from "../../../../models";
import {
  RegistrationProgramCourseLinkService,
  RegistrationCourseService
} from "../../../../service";

import * as helper from "../../../../helper";

type ValidateRegistrationProgramCourseLink = {
  model: IRegistrationProgramCourseLink;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateRegistrationProgramCourseLink> = {
  model: {
    programDetailId: { required },
    classId: { required },
    courseId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-single",
  template: require("./index.html")
})
export class RegistrationProgramCourseLinkAddEditSingle extends Vue {
  private repository: RegistrationProgramCourseLinkService;
  private data: IRegistrationProgramCourseLink = {
    programCourseLinkId: "",
    programDetailId: "",
    classId: "",
    courseId: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private isActive: boolean = true;
  private repositorycourse: RegistrationCourseService = null;
  private courseList: Array<IRegistrationCourse> = [];

  created() {
    this.repository = new RegistrationProgramCourseLinkService(this.$store);
    this.repositorycourse = new RegistrationCourseService(this.$store);
  }

  beforeModalOpen(event) {
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);

    this.repositorycourse.GetFindBy("e=>e.StatusId==1").then(res => {
      this.courseList = res as Array<IRegistrationCourse>;
    });

    if (!this.IsNewRecord) {
      if (this.data.statusId == 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    }
  }

  cancel() {
    this.$modal.hide("add-edit-single-model");
    this.$emit("submit");
  }

  saveModel() {
    if (this.IsNewRecord) {
      this.data.statusId = 1;
      this.data.programCourseLinkId = helper.newGuid();
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
      this.repository.Update(this.data).then(res => {
        
        console.log("update data",res);
        if(res === "Cannot Update/Delete Exam is scheduled for this course."){
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: res,
            title: "Info",
            messageTypeId: PayloadMessageTypes.failure
          });
        }
        else{
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been updated successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
          this.cancel();
        }
       
      });
    }

    this.cancel();
  }
  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
  }
  $v: Vuelidate<any>;
}
