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
export class AcademicSectionMapAddEdit extends Vue {
  isActive: boolean = true;
  private repository: AcademicSectionMapService;

  private ISectionCourseLinkList: Array<IRegistrationSectionCourseLink> = [];
  classList: Array<ISetupClass> = [];
  private academicSectionMapList: IAcademicSectionMap[] = [];
  private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
  private sectionListCB: Array<IRegistrationSectionCourseLinkVMCB> = [];

  repoAcademicCalendarMaster: AcademicCalendarMasterService = new AcademicCalendarMasterService(
    this.$store
  );
  academicCalendarMasterList: IAcademicCalendarMaster[] = [];
  private data: IAcademicSectionMap = {
    academicSectionLinkId: "",
    academicCalendarMasterId: "",
    sectionCourseLinkId: "",
    statusId: 0,
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private sectionCourseLinkId: string = "";
  private campusProgramId: string = "";
  private classId: string = "";
  private subCityId: string = "";
  private sessionId: string = "";
  private boardId: string = "";
  private academicCalendarMasterId: string = "";
  //academicCalendarMasterId=''

  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(
    this.$store
  );
  created() {
    this.repository = new AcademicSectionMapService(this.$store);
  }
  pushToList() {
    this.academicSectionMapList.push({
      academicSectionLinkId: helper.newGuid(),
      academicCalendarMasterId: "",
      sectionCourseLinkId: "",
      statusId: 1,
    });
  }
  removeFromList(id) {
    this.academicSectionMapList = this.academicSectionMapList.filter(
      (s) => s.academicSectionLinkId != id
    );
  }
  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.campusProgramId = event.params.campusProgramId;
    this.classId = event.params.classId;
    this.sessionId = event.params.sessionId;
    this.boardId = event.params.boardId;
    this.subCityId = event.params.subCityId;
    this.academicSectionMapList = [];
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
    this.loadSection();
    this.loadAcademicCalendarMaster();
  }

  loadSection() {
    this.sectionList = [];
    this.isCheckedAll=false;
    this.sectionListCB=[]
    var key = this.campusProgramId + "?" + this.classId;
    this.enrollmentRepo
      .GetSectionList(key)
      .then(
        (response) =>{
          this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>
          this.sectionList.forEach(s=>{
            this.sectionListCB.push({sectionCourseLinkId:s.sectionCourseLinkId,sectionName:s.sectionName,isChecked:false,
              campusProgramId:s.campusProgramId,classId:s.classId,className:s.className,
              fullName:s.fullName,description:s.description,sectionId:s.sectionId,
              sessionid:s.sessionid,campusid:s.campusid,
              programDetailId:s.programDetailId,fromSerial:s.fromSerial,
              toSerial:s.toSerial,statusId:s.statusId,loggerId:s.loggerId,rollNo:s.rollNo})
          })

        }
      );
  }

  loadAcademicCalendarMaster() {
    this.academicCalendarMasterList = [];
    if (
      this.sessionId.length > 0 &&
      this.subCityId.length > 0 &&
      this.classId.length > 0
    ) {
      var key =
        this.sessionId +
        "?" +
        this.subCityId +
        "?" +
        this.classId +
        "?" +
        this.boardId;
      this.repoAcademicCalendarMaster
        .GetCalendarMasterBoardWise(key)
        .then((r) => {
          this.academicCalendarMasterList = r as IAcademicCalendarMaster[];
        });
    }
  }

  isDisable=false;
  checkDuplicate(sectioncourselinkid:string){
   if(this.academicSectionMapList.filter(s=>s.sectionCourseLinkId==sectioncourselinkid).length>1){
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
    this.$v.$touch();
    this.academicSectionMapList=[]

    if (this.IsNewRecord) {
      if(this.academicCalendarMasterId.length>0){
        this.sectionListCB.filter(s=>s.isChecked).forEach(a=>{
          this.academicSectionMapList.push({ academicCalendarMasterId:this.academicCalendarMasterId, sectionCourseLinkId:a.sectionCourseLinkId,academicSectionLinkId:helper.newGuid(),statusId:1})
        })
       
        console.log(JSON.stringify(this.academicSectionMapList));
       
        this.repository.AddAcademicSectionMapBulkInsertion(JSON.stringify(this.academicSectionMapList)).then(r => {
          //var as=r as string;
          
          if(r.toString().startsWith('Data')){
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: r,
              title: "Success",
              messageTypeId: PayloadMessageTypes.success,
            });
          } else{
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: r,
              title: "Warning",
              messageTypeId: PayloadMessageTypes.warning,
            });
          }
         
  
          this.cancel();
        });
      }
      else{
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Please select Academic Master",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning,
        });
      }
     
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
    // return (this.data.classId.length > 0) && (this.data.sectionId.length > 0) && (this.data.fromSerial > 0) && (this.data.toSerial > 0);
  }
  $v: any;
}
