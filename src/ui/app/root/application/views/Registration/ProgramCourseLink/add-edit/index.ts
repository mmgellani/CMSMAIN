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

import {
  IRegistrationProgramCourseLink,
  IRegistrationCourse,
  ICourseSelected,
  RegistrationProgramCourseLinkVM
} from "../../../../models";
import {
  RegistrationProgramCourseLinkService,
  RegistrationCourseService
} from "../../../../service";

import * as helper from "../../../../helper";

type ValidateRegistrationProgramCourseLink = {
  data: IRegistrationProgramCourseLink;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateRegistrationProgramCourseLink> = {
  data: {
    // programCourseLinkId: { required },
    // programDetailId: { required },
    // classId: { required },
    courseId: { required }
    // statusId: { required },
    // loggerId: { required },
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html")
})
export class RegistrationProgramCourseLinkAddEdit extends Vue {
  private repository: RegistrationProgramCourseLinkService;
  private repositorycourse: RegistrationCourseService = null;
  private courseList: Array<IRegistrationCourse> = [];
  private passdata: any = [];

  private ProgramcourseList: Array<IRegistrationProgramCourseLink> = [];
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

  private CourseSelectedList: Array<ICourseSelected> = [];
  private FinalCourseSelectedList: Array<ICourseSelected> = [];

  created() {
    this.repository = new RegistrationProgramCourseLinkService(this.$store);
    this.repositorycourse = new RegistrationCourseService(this.$store);
  }

  beforeModalOpen(event) {
    // this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    this.passdata = event.params.LIST as Array<RegistrationProgramCourseLinkVM>


    this.loadCourses();
  }

  loadCourses() {
    this.repositorycourse.GetFindBy("e=>e.StatusId==1").then(res => {
      this.courseList = (res as Array<IRegistrationCourse>).sort(
        (obj1, obj2) => {
          if (obj1.fullName > obj2.fullName) {
            return 1;
          }

          if (obj1.fullName < obj2.fullName) {
            return -1;
          }

          return 0;
        }
      );
      // this.courseList = this.courseList.sort();
      for (var i = 0; i < this.courseList.length; i++) {
        this.CourseSelectedList.push({
          courseId: this.courseList[i].courseId,
          fullName: this.courseList[i].fullName,
          title: this.courseList[i].title,
          isChecked: false
        });
      }
    });
  }

  cancel() {
    this.$modal.hide("add-edit-model");
    this.$emit("submit");
  }

  saveModel() {
    
    // this.$v.$touch();
    // if (!this.$v.$invalid) {
    if (this.IsNewRecord) {
      this.FinalCourseSelectedList = this.CourseSelectedList.filter(
        s => s.isChecked == true
      );
        

      if(this.FinalCourseSelectedList.length==0)
      {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Please Select some value",
          title: "Success",
          messageTypeId: PayloadMessageTypes.warning
        });

      }
      else
      {

      for (var i = 0; i < this.FinalCourseSelectedList.length; i++) {
        
        var count = this.passdata.filter(e => e.courseId == this.FinalCourseSelectedList[i].courseId && e.programDetailId == this.data.programDetailId && e.classId == this.data.classId)
        if (count == 0) {
          this.ProgramcourseList.push({
            programCourseLinkId: helper.newGuid(),
            programDetailId: this.data.programDetailId,
            classId: this.data.classId,
            courseId: this.FinalCourseSelectedList[i].courseId,
            statusId: 1,
            loggerId: helper.newGuid()
          });
        }
    
      }
     


      // var key = JSON.stringify(this.ProgramcourseList);
      // this.data.programCourseLinkId = helper.newGuid();
      // this.data.statusId = 1;
      // this.data.loggerId = helper.newGuid();
 
      {
      this.repository.AddMany(this.ProgramcourseList).then(() => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Record has been inserted successfully",
          title: "Success",
          messageTypeId: PayloadMessageTypes.success
        });
        this.ProgramcourseList = [];
        this.FinalCourseSelectedList=[];
        this.cancel();
        
      });
    }
  }
    } else {
      this.repository.Update(this.data).then(() => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Record has been updated successfully",
          title: "Success",
          messageTypeId: PayloadMessageTypes.success
        });
        this.cancel();
      });
    }

    //this.cancel();
    // }
  }
  beforeModalClose() {
    this.CourseSelectedList = [];
  }
  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
  }
  $v: any;
}
