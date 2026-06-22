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
import { PayloadMessageTypes, IUser } from "../../../../../../model";
import { IAssessmentType,IAssessmentTypeAdd,IAssessmentCategory } from '../../../../models/Setup/AssessmentType';
import { AssessmentTypeService } from '../../../../service/Setup/AssessmentType';

import {
  ISetupBusinessUnit,
  ISetupBusinessGroup,
  ISetupAddress,IExaminationExamType,
} from "../../../../models";
import {
  SetupBusinessUnitService,
  SetupBusinessGroupService,
  SetupAddressService,ExaminationExamTypeService
} from "../../../../service";

import * as helper from "../../../../helper";

// import { SetupAddressAddEdit } from "../../Address/add-edit";
// import { SetupBusinessGroupAddEdit } from "../../BusinessGroup/add-edit";
import { State } from "vuex-class";
import { IRootStoreState } from "../../../../../store";

type ValidateSetupBusinessUnit = {
  data: IAssessmentTypeAdd;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupBusinessUnit> = {
  data: {
    assessmentCategoryId: { required },
    examTypeId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "assessmentType-add-edit-model",
  template: require("./index.html"),
  components: {
    // Address: SetupAddressAddEdit,
    // BusinessGrp: SetupBusinessGroupAddEdit
  }
})
export class SetupBusinessUnitAddEdit extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  // private repositoryCatgory: AssessmentTypeService;

  private isActive: boolean = false;
  private repository: SetupBusinessUnitService;
  private businessGroupList: Array<ISetupBusinessGroup> = [];
  private addressList: Array<ISetupAddress> = [];
  private examtypeList: Array<IExaminationExamType> = [];
  private assementCategoryList: Array<IAssessmentCategory> = [];

  private assesmenttypelist: Array<IAssessmentType> = [];
private assessmentdetailList: IAssessmentType[] = [];


  
  private canAddAddress: boolean = false;
  private canAddBusinessGroup: boolean = false;


  private businessGroupRepo: SetupBusinessUnitService = new SetupBusinessGroupService(
    this.$store
  );
  private addressRepo: SetupAddressService = new SetupAddressService(
    this.$store
  );
  private examtypeRepo: ExaminationExamTypeService = new ExaminationExamTypeService(
    this.$store
  );
  private repositoryCatgory: AssessmentTypeService = new AssessmentTypeService(
    this.$store
  );

  
  private data: IAssessmentTypeAdd = {
    assessmentTypeId : "",
	assessmentCategoryId : "",
	examTypeId : "",
	code : "",
	statusId : 0
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SetupBusinessUnitService(this.$store);
    
  }
  addNewAddress() {
    this.$modal.show("Address-add-edit-model", { IsNewRecord: true });
  }

  addNewBusinessGrp() {
    this.$modal.show("BusinessGrp-add-edit-model", { IsNewRecord: true });
  }

  loadAddress() {
    this.addressRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.addressList = r as Array<ISetupAddress>;
    });
  }
  loadExamtype() {
    this.examtypeRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.examtypeList = r as Array<IExaminationExamType>;
    });
  }
  loadAssesmentCategory() {
    
    this.repositoryCatgory.GetFindBy("e=>e.StatusId==1").then(r => {
      this.assementCategoryList = r as Array<IAssessmentCategory>;
    });
  }
  loadBusinessGroup() {
    this.businessGroupRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.businessGroupList = r as Array<ISetupBusinessGroup>;
    });
  }

  validatePage() {
    if (this.user.roles.indexOf('admin') >= 0) {
      this.canAddAddress = this.canAddBusinessGroup = true;
    }
    else {
      if (('setupAddress' in this.user.claims) == true) {
        if (this.user.claims['setupAddress'].indexOf('C') >= 0) {
          this.canAddAddress = true;
        }
      }

      if (('setupBusinessGroup' in this.user.claims) == true) {
        if (this.user.claims['setupBusinessGroup'].indexOf('C') >= 0) {
          this.canAddBusinessGroup = true;
        }
      }
    }
  }

  beforeModalOpen(event) {
    
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
this.loadExamtype();
this.loadAssesmentCategory();
    // this.loadAddress();
    // this.loadExamtype();
    // this.loadBusinessGroup();
    // this.validatePage();

    if (!this.IsNewRecord) {
      if (this.data.statusId == 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    }
  }

  cancel() {
    this.data={
      assessmentTypeId : "",
      assessmentCategoryId : "",
      examTypeId : "",
      code : "",
      statusId:0
    };
    this.$emit("submit");
    this.$modal.hide("assessmentType-add-edit-model");
  }

  // onFileChange(e) {
  //   //alert(JSON.stringify(e));
  //   var files = e.target.files || e.dataTransfer.files;
  //   if (!files.length) return;
  //   this.createImage(files[0]);
  // }

  // createImage(file) {
  //   var $this = this;
  //   helper.resizeImage({ file: file, maxSize: 120 }).then(resizeImage => {
  //     $this.data.logo = resizeImage as string;
  //   });
  // }

  // removeImage() {
  //   if (this.data.logo.length != 0) {
  //     this.data.logo = "";
  //   }
  // }

  saveModelnew() {
    
    this.$v.$touch();
    // if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
   
    this.repositoryCatgory.GetAll()
    .then(response => {
        this.assesmenttypelist = response as Array<IAssessmentType>;
       
    
        var dupData = 0;
        dupData = this.assesmenttypelist.filter(s => s.assessmentCategoryId == this.data.assessmentCategoryId && s.examTypeId==this.data.examTypeId).length;
        if (dupData > 0) {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record Already Exists",
            title: "Warning",
            messageTypeId: PayloadMessageTypes.warning
          });
        } 
        else
        {
          this.data.assessmentTypeId = helper.newGuid();
          this.data.statusId = 1;
          this.repositoryCatgory.AddOne(this.data).then(() => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "Record has been inserted successfully",
              title: "Success",
              messageTypeId: PayloadMessageTypes.success
            });
            this.cancel();
          });
        }

      })
      } else {
        if (this.isActive == true) {
          this.data.statusId = 1;
        } else {
          this.data.statusId = 0;
        }
        this.repositoryCatgory.Update(this.data).then(() => {
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


  saveModel() {
    
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.assesmenttypelist = [];
        this.repositoryCatgory.GetAll()
          .then(response => {

            this.assesmenttypelist = (response as Array<IAssessmentType>)
            var dupData = 0;
            var examData = 0;

            dupData = this.assesmenttypelist.filter(s => s.assessmentCategoryId.toLowerCase() == this.data.assessmentCategoryId.toLowerCase() && s.examTypeId==this.data.examTypeId && s.statusId==1).length;
            examData = this.assesmenttypelist.filter(s => s.examTypeId==this.data.examTypeId  && s.statusId==1).length;

            if (dupData > 0 ||examData > 0) {
              this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record Already Exists",
                title: "Warning",
                messageTypeId: PayloadMessageTypes.warning
              });
            } 
            else {
              this.data.assessmentTypeId = helper.newGuid();
              this.data.statusId = 1;
              
              this.repositoryCatgory.AddOne(this.data).then(() => {
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

        this.repositoryCatgory.GetAll()
        .then(response => {
          this.assesmenttypelist = (response as Array<IAssessmentType>)
          var dupData = 0;
          var dupDataa;
          var examData = 0;
           var examDataA;

          
debugger;
dupData = this.assesmenttypelist.filter(s => s.assessmentCategoryId.toLowerCase() == this.data.assessmentCategoryId.toLowerCase() && s.examTypeId==this.data.examTypeId && s.statusId==1 && s.assessmentTypeId != this.data.assessmentTypeId).length;
examData = this.assesmenttypelist.filter(s =>  s.examTypeId==this.data.examTypeId && s.assessmentTypeId != this.data.assessmentTypeId && s.statusId==1).length;
// examDataA.forEach (  item=>{

            
            //   if(item.examTypeId != this.data.examTypeId)
            //   dupData =1;
            // });
            if (dupData > 0 ||examData > 0 ) {
              this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record Already Exists",
                title: "Warning",
                messageTypeId: PayloadMessageTypes.warning
              });
            } 
          else {
            debugger;
            this.repositoryCatgory.Update(this.data).then(() => { 
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
//       else {
//         debugger;
//         if (this.isActive == true) {
//           this.data.statusId = 1;
//         } else {
//           this.data.statusId = 0;
//         }


//         this.assesmenttypelist = [];
//         this.repositoryCatgory.GetAll()
//           .then(response => {

//             this.assesmenttypelist = (response as Array<IAssessmentType>)
//             var dupData = 0;
//             var examData = 0;
//             var dupDataa;
//             var examDataA;

// debugger
//             dupDataa = this.assesmenttypelist.filter(s => s.assessmentCategoryId.toLowerCase() == this.data.assessmentCategoryId.toLowerCase() && s.examTypeId==this.data.examTypeId && s.statusId==1).length;
//             examDataA = this.assesmenttypelist.filter(s => s.examTypeId==this.data.examTypeId  && s.statusId==1).length;
//             dupDataa.forEach (  item=>{

            
//               if(item.assessmentCategoryId != this.data.assessmentCategoryId && item.examTypeId !=this.data.examTypeId)
//               dupData =1;
//             });
//             examDataA.forEach (  item=>{

//             debugger;
//               if(item.examTypeId != this.data.examTypeId)
//               examData =1;
//             });
//             if (dupData > 0 ||examData > 0) {
//               this.$store.dispatch(StoreTypes.updateStatusBar, {
//                 text: "Record Already Exists",
//                 title: "Warning",
//                 messageTypeId: PayloadMessageTypes.warning
//               });
//             } 
//             else {
//               debugger;
//               this.repositoryCatgory.Update(this.data).then(() => {
//                 this.$store.dispatch(StoreTypes.updateStatusBar, {
//                   text: "Record has been updated successfully",
//                   title: "Success",
//                   messageTypeId: PayloadMessageTypes.success
//                 });
//                 this.cancel();
//               });
//             }
//           });
//         // this.repositoryCatgory.Update(this.data).then(() => {
    
//         //     this.$store.dispatch(StoreTypes.updateStatusBar, {
//         //       text: "Record has been updated successfully",
//         //       title: "Success",
//         //       messageTypeId: PayloadMessageTypes.success
//         //     });
//         //   // }
//         //   this.cancel();
//         // });
//       }
      // this.cancel();
    }
  }
  // get allowSubmit() {
  //   let error = this.$v.data.$error || this.$v.data.$invalid;
  //   return !error;
  // }
  $v: any;
}
