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

import { IELChapters, ProgramCourseList } from "../../../../models";
import {
  AdmissionStudentsService,
  ELChaptersService,
} from "../../../../service";

import * as helper from "../../../../helper";

type ValidateELChapters = { data: IELChapters; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateELChapters> = {
  data: {
    // chapterId: { required },
    fullName: { required },
    description: { required },
    orderNo: { required },
    abbreviation: { required },
    // isEnable: { required },
    // courseId: { required },
    // classId: { required },
  },
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html"),
})
export class ELChaptersAddEdit extends Vue {
  private isActive: boolean = true;
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
  private IsNewRecord: boolean = true;
  private title: string = "";
  private courseRepository: AdmissionStudentsService;
  private programCourse: Array<ProgramCourseList> = [];

  created() {
    this.repository = new ELChaptersService(this.$store);
    this.courseRepository = new AdmissionStudentsService(this.$store);
    this.loadCourse();
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    console.log("befor calling");
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);

    if (this.IsNewRecord) {
    } else {
      if (this.data.statusId == 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    }
  }

  loadCourse() {
    this.courseRepository.GetProgramCourse().then((r) => {
      this.programCourse = r as Array<ProgramCourseList>;
    });
  }

  cancel() {
    this.$modal.hide("add-edit-model");
    this.$emit("submit");
  }

  saveModel() {
    if (this.IsNewRecord) {
      //this.data.loggerId = helper.newGuid();
      this.data.statusId = 1;
      this.data.chapterId = helper.newGuid();
      // alert(JSON.stringify(this.data))
      this.repository.AddOne(this.data).then(() => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Record has been inserted successfully",
          title: "Success",
          messageTypeId: PayloadMessageTypes.success,
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
          messageTypeId: PayloadMessageTypes.success,
        });
        this.cancel();
      });
    }

    this.cancel();
  }

  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
    //return  this.$v.data.$error (this.data.name.length > 0);
  }

  $v: any;
}
