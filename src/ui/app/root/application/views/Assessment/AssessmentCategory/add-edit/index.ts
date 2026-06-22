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

import { ISetupSection, DeviceInfoEx, ISetupBloodGroup } from "../../../../models";
import { AssessmentCategoryService, SetupBloodGroupService, SetupSectionService } from "../../../../service";
import { noWhiteSpace, registered } from '../../../../../../validation';

import * as helper from "../../../../helper";
import { StudntListEx, IAttendenceDashboard } from "../../../../models/Attendance/attendenceDashboard";
import { IAssessmentCategory } from "../../../../models/Assessment/AssessmentCategory";
import { forEach } from "lodash";

type ValidateSetupSection = { data: IAssessmentCategory; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupSection> = {
  data: {
    fullName: { required },
    code: { required, maxLength: maxLength(3),noWhiteSpace},
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'AssessmentCategory-add-edit-model',
  template: require('./index.html')
})
export class AssessmentCategoryAddEdit extends Vue {
  private repository: SetupBloodGroupService;
  private AssessmentCategoryrepo:AssessmentCategoryService;
  isActive: boolean = true;

  private data: IAssessmentCategory = {
    assessmentCategoryId: '',
    fullName: '',
    statusId: 0,
    code: ''
  };

  private datas: Array<IAssessmentCategory> = [];

  private IsNewRecord: boolean = true;
  private title: string = "";
 
  private assessmentCategoryModel: Array<IAssessmentCategory> = [];

  bloodGroupList = [{ item: "A+" }, { item: "A-" }, { item: "B+" }, { item: "B-" }, { item: "AB+" }, { item: "AB-" }, { item: "O+" }, { item: "O-" }];


  created() {
   
    this.AssessmentCategoryrepo = new AssessmentCategoryService(this.$store);
  }

  beforeModalOpen(event) {
  ;
     this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else if (this.data.statusId == 0) {
      this.isActive = false;
    }
    this.AssessmentCategoryrepo.GetAll().then(
      res => {
        this.assessmentCategoryModel = res as Array<IAssessmentCategory>
      }
    )
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("AssessmentCategory-add-edit-model");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.datas = [];
        
        this.AssessmentCategoryrepo.GetAll()
          .then(response => {
            this.datas = (response as Array<IAssessmentCategory>)
            var dupData = 0;
            
            dupData = this.datas.filter(s => s.fullName.toLowerCase() == this.data.fullName.toLowerCase() || s.code.toLowerCase() == this.data.code.toLowerCase() && s.statusId != 2).length;
            if (dupData > 0) {
              this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record Already Exists",
                title: "Warning",
                messageTypeId: PayloadMessageTypes.warning
              });
            } 
            else {
              this.data.assessmentCategoryId = helper.newGuid();
              this.data.statusId = 1;
              
              this.AssessmentCategoryrepo.AddOne(this.data).then(() => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                  text: "Record has been inserted successfully",
                  title: "Success",
                  messageTypeId: PayloadMessageTypes.success
                });
                this.cancel();
              });
            }
          });
        // this.data.bloodGroupId = helper.newGuid();
        // this.data.statusId = 1;
        // this.data.loggerId = helper.newGuid();
        // this.repository.AddOne(this.data).then(() => {
        //   this.$store.dispatch(StoreTypes.updateStatusBar, {
        //     text: "Record has been inserted successfully",
        //     title: "Success",
        //     messageTypeId: PayloadMessageTypes.success
        //   });
        // });

        // this.cancel();
      }
      else {
        if (this.isActive == true) {
          this.data.statusId = 1;
        } else {
          this.data.statusId = 0;
        }

        this.AssessmentCategoryrepo.GetAll()
        .then(response => {
          this.datas = (response as Array<IAssessmentCategory>)
          var dupData = 0;
          var dupDataa;
          

          dupDataa = this.datas.filter(s =>  s.fullName.toLowerCase() == this.data.fullName.toLowerCase()   || s.code.toLowerCase() == this.data.code.toLowerCase()  && s.statusId==1  );
         
          dupDataa.forEach (  item=>{

            
          if(item.assessmentCategoryId != this.data.assessmentCategoryId)
          dupData =1;
        });
          if (dupData > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "Record Already Exists",
              title: "Warning",
              messageTypeId: PayloadMessageTypes.warning
            });
          } 
          else {
            this.AssessmentCategoryrepo.Update(this.data).then(() => { 
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                  text: "Record has been updated successfully",
                  title: "Success",
                  messageTypeId: PayloadMessageTypes.success
                });
              // }
              this.cancel();
            });
          }
        });

        
      }
      // this.cancel();
    }
  }
  get allowSubmit() {
    return this.data.fullName.length > 0;
  }
  $v: any;
}
