/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { required, maxLength } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { IRootStoreState } from '../../../../../store';

import { StoreTypes } from "../../../../../../store";
import { IUser, PayloadMessageTypes } from "../../../../../../model";

import {
  IRegistrationSectionCourseLink,
  ISetupClass,
  ISetupSection,
  IRegistrationCourse,
  ISetupCampusProgramLinkVM,
  ICourseSelected,
  IRegistrationSectionCourseLinkVM,
  IAcademicCalendarMaster,
} from "../../../../models";
import {
  RegistrationSectionCourseLinkService,
  SetupCampusProgramLinkService,
  SetupClassService,
  SetupSectionService,
  RegistrationCourseService,
  RegistrationEnrollmentsService,
  AcademicCalendarMasterService,
  AcademicSectionMapService,
} from "../../../../service";

import * as helper from "../../../../helper";

// import { RegistrationCourseAddEdit } from '../../Course/add-edit';
import { SetupClassAddEdit } from "../../../Setup/Class/add-edit";
import { SetupSectionAddEdit } from "../../../Setup/Section/add-edit";
import { IAcademicSectionMap } from "../../../../models/academiccalendar/academicsectionmap";
import { ssrCompile } from "vue-template-compiler";
import { AssessmentSectionMapService } from "../../../../service/Assessment/AssessmentSectionMap";
import { IAssessmentSchemeMaster1, IAssessmentSectionMap, IVWAsssessmentSectionMap } from "../../../../models/Assessment/AssessmentSectionMap";
import { AssessmentTypeService } from "../../../../service/Setup/AssessmentType";
import { IAssessmentType } from "../../../../models/Setup/AssessmentType";
import { State } from "vuex-class";
export interface IRegistrationSectionCourseLinkVMCB {
	sectionCourseLinkId: string;
	campusProgramId: string;
	classId: string;
	className: string;
	sectionName: string;
	fullName: string;
	description: string;
	sectionId: string;
	sessionid: string;
  
	campusid: string;
	programDetailId: string;
	fromSerial: number;
	toSerial: number;
	statusId: number;
	loggerId: string;
	rollNo: number;
	
  isChecked: boolean;
}
type ValidateRegistrationSectionCourseLink = {
  data: IRegistrationSectionCourseLink;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateRegistrationSectionCourseLink> = {
  // data: {
  //     // sectionCourseLinkId: { required },
  //     //campusProgramId: { required },
  //     //courseId: { required },
  //     // statusId: { required },
  //     // loggerId: { required },
  // }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html"),
  components: {
    // 'Class': SetupClassAddEdit,
    // 'Section': SetupSectionAddEdit,
    // 'Course': RegistrationCourseAddEdit
  },
})
export class AssessmentSectionMapAddEdit extends Vue {

  @State((state: IRootStoreState) => state.common.user) user: IUser;
  
  isActive: boolean = true;
  private repository: AssessmentSectionMapService = new AssessmentSectionMapService(this.$store);
  private result: Array<any> = [];
  private ISectionCourseLinkList: Array<IRegistrationSectionCourseLink> = [];
  classList: Array<ISetupClass> = [];
  //private academicSectionMapList: IAcademicSectionMap[] = [];
  private assessmentSectionMapList: IAssessmentSectionMap[] = [];

  private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
  private sectionListCB: Array<IRegistrationSectionCourseLinkVMCB> = [];

  repoAcademicCalendarMaster: AcademicCalendarMasterService = new AcademicCalendarMasterService(
    this.$store
  );

  repoAssessmentSchemeMaster: AssessmentTypeService = new AssessmentTypeService(
    this.$store
  );
  assessmentSchemeMasterList: IAssessmentSchemeMaster1[] = [];
  private data: IAssessmentSectionMap = {
    assessmentSchemeMasterId: "",
    assessmentSectionMapId: "",
    sectionCourseLinkId: "",
    statusId: 0,
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private sectionCourseLinkId: string = "";
  private campusProgramId: string = "";
  private campusId: string = "";
  private classId: string = "";
  private levelId: string = "";
  private subCityId: string = "";
  private sessionId: string = "";
  private boardId: string = "";
  private assessmentSchemeMasterId: string = "";
  private dataList: Array<IVWAsssessmentSectionMap> = [];

  //academicCalendarMasterId=''

  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(
    this.$store
  );
  assessmentSectionMapId: string = "";
  created() {
    this.repository = new AssessmentSectionMapService(this.$store);
  }
  pushToList() {
    this.assessmentSectionMapList.push({
      assessmentSectionMapId: helper.newGuid(),
      assessmentSchemeMasterId: "",
      sectionCourseLinkId: "",
      statusId: 1,
    });
  }
  removeFromList(id) {
    this.assessmentSectionMapList = this.assessmentSectionMapList.filter(
      (s) => s.assessmentSectionMapId != id
    );
  }
  beforeModalClose() {
    console.log('i am clled')
    this.data = {assessmentSchemeMasterId:'',assessmentSectionMapId:'',sectionCourseLinkId:'',statusId:0}
    this.$v.$reset();

}
res1 : boolean = false;
  beforeModalOpen(event) {
    
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.sectionListCB=[];
    this.assessmentSchemeMasterId="";

    if(this.IsNewRecord === true){
      this.sessionId = event.params.sessionId;
      this.campusProgramId = event.params.campusProgramId;
      this.campusId = event.params.campusId;
      this.classId = event.params.classId;
      this.levelId = event.params.levelId;
    }
    
    // this.assessmentSchemeMasterId = event.params.model.assessmentSchemeMasterId;
    // this.assessmentSectionMapId = event.params.model.assessmentSectionMapId; 
    // this.sectionCourseLinkId = event.params.model.sectionCourseLinkId;
    else{
      debugger;
      this.sessionId = event.params.model.sessionId;
      this.campusProgramId = event.params.model.campusProgramId;
      this.campusId = event.params.model.campusId;
      this.classId = event.params.model.classId;
      this.levelId = event.params.model.levelId;
      this.assessmentSectionMapId = event.params.model.assessmentSectionMapId;
      this.dataList = event.params.assessmentSectionMapList;
      //this.sectionCourseLinkId = event.params.modal.sectionCourseLinkId;

      var key = this.assessmentSectionMapId + "?" ;
      this.repository.CheckCountForAssessment(key).then(
        (r) => {
          this.result = r as Array<any>;
          console.log("result", this.result[0].response); 
          if(this.result[0].response == 1){
            this.res1 = true;
          }
          else if(this.result[0].response == 0){
            this.res1 = false;
          }
        }
        
      );
  
      
    }
    
    this.assessmentSectionMapList = [];
    Object.assign(this.data, event.params.model);
    if (this.data.statusId == 1) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
    console.log(JSON.stringify(this.data));
    if (this.IsNewRecord == true) {
      this.pushToList();
    }
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    if(this.IsNewRecord === true){
      this.loadSection();
    }
    else{
      this.loadSectionForUpdate();
    }
    
    this.loadAssessmentSchemeMaster();
  }

  loadSection() {
    debugger
    this.sectionList = [];
    this.isCheckedAll=false;
    this.sectionListCB=[]
   if(this.campusProgramId.length>0){
    var key =  this.sessionId + "?" +this.campusProgramId + "?" + this.campusId + "?" + this.classId  + "?" + this.levelId;
  }
  else {
    var key = this.sessionId + "?" +'00000000-0000-0000-0000-000000000000' + "?" + this.campusId+"?"+ this.classId + "?" + this.levelId;

  }
    this.repository.GetSectionList(key)
      .then(
        (response) =>{
          this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>
          if(this.sectionList != null && this.sectionList.length > 0){
            this.sectionList.forEach(s=>{
              this.sectionListCB.push({sectionCourseLinkId:s.sectionCourseLinkId,sectionName:s.sectionName,isChecked:false,
                campusProgramId:s.campusProgramId,classId:s.classId,className:s.className,
                fullName:s.fullName,description:s.description,sectionId:s.sectionId,
                sessionid:s.sessionid,campusid:s.campusid,
                programDetailId:s.programDetailId,fromSerial:s.fromSerial,
                toSerial:s.toSerial,statusId:s.statusId,loggerId:s.loggerId,rollNo:s.rollNo})
            })
          }
         

        }
      );
  }


  loadSectionForUpdate() {
    debugger
    this.sectionList = [];
    this.isCheckedAll=false;
    this.sectionListCB=[]
   if(this.campusProgramId.length>0){
    var key =  this.sessionId + "?" +this.campusProgramId + "?" + this.campusId + "?" + this.classId  + "?" + this.levelId;
  }
  else {
    var key = this.sessionId + "?" +'00000000-0000-0000-0000-000000000000' + "?" + this.campusId+"?"+ this.classId + "?" + this.levelId;

  }
    this.repository.GetSectionListForUpdate(key)
      .then(
        (response) =>{
          this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>
          if(this.sectionList != null && this.sectionList.length > 0){
            this.sectionList.forEach(s=>{
              this.sectionListCB.push({sectionCourseLinkId:s.sectionCourseLinkId,sectionName:s.sectionName,isChecked:false,
                campusProgramId:s.campusProgramId,classId:s.classId,className:s.className,
                fullName:s.fullName,description:s.description,sectionId:s.sectionId,
                sessionid:s.sessionid,campusid:s.campusid,
                programDetailId:s.programDetailId,fromSerial:s.fromSerial,
                toSerial:s.toSerial,statusId:s.statusId,loggerId:s.loggerId,rollNo:s.rollNo})
            })
          }
         

        }
      );
  }
  // loadAcademicCalendarMaster() {
  //   this.academicCalendarMasterList = [];
  //   if (
  //     this.sessionId.length > 0 &&
  //     this.subCityId.length > 0 &&
  //     this.classId.length > 0
  //   ) {
  //     var key =
  //       this.sessionId +
  //       "?" +
  //       this.subCityId +
  //       "?" +
  //       this.classId +
  //       "?" +
  //       this.boardId;
  //     this.repoAcademicCalendarMaster
  //       .GetCalendarMasterBoardWise(key)
  //       .then((r) => {
  //         this.academicCalendarMasterList = r as IAcademicCalendarMaster[];
  //       });
  //   }
  // }
  loadAssessmentSchemeMaster() {
    this.assessmentSchemeMasterList = [];
    // if (
    //   this.sessionId.length > 0 &&
    //   //this.subCityId.length > 0 &&
    //   this.classId.length > 0
    // ) {
      
      // var key =
      //   this.sessionId +
      //   "?" +
      //   //this.subCityId +
      //   //"?" +
      //   this.classId +
      //   "?" +
        //this.boardId;
      this.repository.GetAllAssessments()
        .then((r) => {
          this.assessmentSchemeMasterList = r as IAssessmentSchemeMaster1[];
        });
   // }
  }

  isDisable=false;
  checkDuplicate(sectioncourselinkid:string){
   if(this.assessmentSectionMapList.filter(s=>s.sectionCourseLinkId==sectioncourselinkid).length>1){
    this.isDisable=true;
   }else{
     this.isDisable=false;
   }
  }
  cancel() {
    this.$modal.hide("add-edit-model");
    this.$emit("submit");
  }
  isCheckedAll=false;
checkAll(){
  if(this.isCheckedAll){
    this.sectionListCB.forEach(s=>{
      s.isChecked=true
    })
  }else{
    this.sectionListCB.forEach(s=>{
      s.isChecked=false
    })
  }
 
}
  saveModel() {
    var sec =  this.sectionListCB.filter(s=>s.isChecked).length;
    this.$v.$touch();
    //if (!this.$v.$invalid) {
    if (this.IsNewRecord) {
      this.assessmentSectionMapList=[];
      if(this.assessmentSchemeMasterId.length>0 && sec > 0){
        this.sectionListCB.filter(s=>s.isChecked).forEach(a=>{
          this.assessmentSectionMapList.push({assessmentSchemeMasterId:this.assessmentSchemeMasterId, sectionCourseLinkId:a.sectionCourseLinkId,assessmentSectionMapId:helper.newGuid(),statusId:1})
        })

       
        console.log(JSON.stringify(this.assessmentSectionMapList));
       
        this.repository.AddAssessmentSectionMapBulkInsertion(JSON.stringify(this.assessmentSectionMapList)).then(r => {
          //var as=r as string;
          
          if(r.toString().startsWith('Data')){
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: r,
              title: "Success",
              messageTypeId: PayloadMessageTypes.success,
            });
            this.cancel();
          } else{
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: r,
              title: "Warning",
              messageTypeId: PayloadMessageTypes.warning,
            });
            //this.cancel();
          }
         
  
          // this.cancel();
        });
      }
      else{
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Assessment Scheme Master and atleast 1 Section is required.",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning,
        });
      }
     
    } else {
      debugger;
      if (this.isActive == true) {
        this.data.statusId = 1;
      } else {
        this.data.statusId = 0;
      }
      var count = this.dataList.filter(s=> s.assessmentSectionMapId != this.assessmentSectionMapId && s.sectionCourseLinkId == this.data.sectionCourseLinkId && s.statusId != 2 )
      if(count.length > 0){
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "This Section is already Mapped.",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning,
        });
       }
       else{
        this.repository.Update(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been updated successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success,
          });
          this.cancel();
        });
       }
      
    }
  //}

    //this.cancel();
  }
  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
    // return (this.data.classId.length > 0) && (this.data.sectionId.length > 0) && (this.data.fromSerial > 0) && (this.data.toSerial > 0);
  }
  $v: any;
}
