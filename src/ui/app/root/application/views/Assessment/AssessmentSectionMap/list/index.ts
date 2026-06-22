/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";

import {
  IRegistrationSectionCourseLink,
  ISetupCampus,
  ISetupSession,
  ISetupProgramDetails,
  ISetupCampusProgramLinkVM,
  IRegistrationSectionCourseLinkVM,
  ISetupClass,
  DDLGroupModel,
  DDLModel,
  ICampusCityVM,
  ISetupCampusProgramVM,
  IExaminationExamMasterVM,
  IExaminationExamMaster,
  IBoards,
  ISetupCity,
  CitySubCity,
  ICampusCityData,
  ISetupProgram,
} from "../../../../models";
import {
  RegistrationSectionCourseLinkService,
  SetupCampusService,
  SetupSessionService,
  SetupProgramDetailsService,
  SetupCampusProgramLinkService,
  SetupClassService,
  ExaminationExamMasterService,
  BoardsService,
  AcademicSectionMapService,
  SetupSubCityService,
  SetupCityService,
  SetupProgramService,
  AssessmentScheduleService,
} from "../../../../service";

import { AssessmentSectionMapAddEdit } from "../add-edit";
import { AssessmentSectionMapDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";
import {
  IAcademicSectionMap,
  IAcademicSectionMapVW,
} from "../../../../models/academiccalendar/academicsectionmap";
import { AssessmentSectionMapService } from "../../../../service/Assessment/AssessmentSectionMap";
import { IAssessmentClassLevel, IAssessmentProgramLevel, IAssessmentSectionMap, IVWAsssessmentSectionMap } from "../../../../models/Assessment/AssessmentSectionMap";
import { GeneralModel } from "../../../../models/general";
import { LevelDefinitionService } from "../../../../service/Assessment/LevelDefinition";
import { ILevelDefinition } from "../../../../models/Assessment/LevelDefinition";
import { LevelProgramClassMapService } from "../../../../service/Assessment/LevelProgramClassMap";
import { F } from "lodash/fp";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": AssessmentSectionMapAddEdit,
    "delete-model": AssessmentSectionMapDelete,
    // 'add-edit-bulk-model': AcademicSectionMapAddEditBulk
  },
})
export class AssessmentSectionMap extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AssessmentSectionMapService = new AssessmentSectionMapService(this.$store);
  private cityRepo: SetupCityService = new SetupCityService(this.$store);
  private proDetRepo: SetupProgramDetailsService = new SetupProgramDetailsService(this.$store);


  private subCityRepo: SetupSubCityService;
  private data: Array<IVWAsssessmentSectionMap> = [];
  private viewPrograms: boolean = false;
  private viewProDet: boolean = false;
  private filterString: string = "";
  private campusId = "";
  private sessionId = "";
  private campusProgramId = "";
  private campusProgramIdEx = "";
  private subCityId = "";
  private Programdetailid = "";
  boardId = "";
  private classid: string = "";
  private programDDL: Array<DDLGroupModel> = [];
  private ddl: Array<DDLModel> = [];
  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];
  private cityList1: Array<CitySubCity> = [];
  private subCityList: Array<CitySubCity> = [];
  private cityList: Array<ISetupCity> = []
  private termModel: Array<GeneralModel> = [];
  private cityId: string = "";
  private subcityId : string = "";
  private levelId : string = "";
  private classId: string = "";
  boardList: IBoards[] = [];
  boardRepo: BoardsService = new BoardsService(this.$store);

  private campusList: Array<ISetupCampus> = [];
  private sessionList: Array<ISetupSession> = [];
  
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private campusCityListExx: Array<ICampusCityData> = []
  private repoClass = new SetupClassService(this.$store);
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private cityRepo1: SetupCityService = new SetupCityService(this.$store)
  private proRepo: SetupProgramService = new SetupProgramService(this.$store)
  private sessionRepo: SetupSessionService = new SetupSessionService(
    this.$store
  );
  private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(
    this.$store
  );
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    this.$store
  );
  classList: Array<ISetupClass> = [];
  private campusCityList: Array<ICampusCityVM> = [];
  private campusSubCityListExx: Array<ICampusCityData> = []
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private levelList: Array<ILevelDefinition> = [];
  private programDetailList: Array<ISetupProgramDetails> = [];
  private programList: Array<ISetupProgram> = [];
  private programList1: Array<IAssessmentProgramLevel> = [];
  private examMasterModel: Array<IExaminationExamMasterVM> = [];
  private classLevelList: Array<IAssessmentClassLevel> = [];
  private repositoryExamMaster: ExaminationExamMasterService;
  private subCityRepo1: SetupSubCityService = new SetupSubCityService(this.$store);
  private levelProClassRepo: LevelProgramClassMapService =  new LevelProgramClassMapService(this.$store);
  private repo : AssessmentScheduleService = new AssessmentScheduleService(this.$store)
  private levelRepo: LevelDefinitionService = new LevelDefinitionService(this.$store);


  private columns = [
    { key: "campusName", caption: "Campus" },
    { key: "programName", caption: "Program Detail" },
    { key: "className", caption: "Class Name" },
    { key: "assessmentMaster", caption: "Assessment Scheme" },
    { key: "sectionName", caption: "Section" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 },
  ];

 // cityRepo: any;

  created() {
    this.repository = new AssessmentSectionMapService(this.$store);
    this.repositoryExamMaster = new ExaminationExamMasterService(this.$store);
    this.$watch("subCityId", this.loadSubCityCampus);
    //this.$watch("campusId", this.loadProgramsOfCampus);
    //this.$watch("levelId", this.loadProgramsOfLevelsAndCampus);
    this.loadClass();
   // this.$watch("classid", this.loadBoards);
    this.$watch("cityId", this.loadSubCity);

    //this.$watch("cityId", this.);
    // this.$watch("sessionId", this.refreshData);
    // this.$watch("campusId", this.refreshData);
    // this.$watch("campusProgramId", this.refreshData);
    // this.$watch("classid", this.refreshData);
    //this.$watch("campusProgramId", this.loadProgramDetailofPrograms);
    // this.loadCityCampus();
    this.loadSession();
    this.loadCity();
  }
  loadCampus() {
    this.campusRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.campusList = r as Array<ISetupCampus>;
    });
  }
  // loadSession() {
  //   this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
  //     this.sessionList = r as Array<ISetupSession>;
  //   });
  // }

  loadBoards() {
    this.boardRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
      this.boardList = r;
    });
  }
  loadCityCampus() {
    this.campusCityList = [];
    this.campusRepo.GetCityVM().then((r) => {
      this.campusCityList = r as Array<ICampusCityVM>;
    });
    // this.subCityId = this.campusCityList.find(
    //   (e) => e.campusId == this.campusId
    // ).subCityId;
  }

  loadProgramsOfCampus() {
    this.campusProgramLinkList = [];
    var key = this.sessionId + "?" + this.campusId;
    this.campusProgramLinkRepo.GetAllVM(key).then((r) => {
      this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
    });
  }

  loadProgramDetail() {
    this.Programdetailid = this.campusProgramLinkList.find(
      (e) => e.campusProgramId == this.campusProgramId
    ).programDetailId;
  }
  loadClass() {
    this.repoClass.GetFindBy("e=>e.StatusId==1").then((res) => {
      this.classList = res as Array<ISetupClass>;
    });
  }

  loadClassesOfLevelProgramClassMap(){
    this.classLevelList = [];
    var key = this.levelId + "?" + this.campusId + "?" + this.programId;
    this.repo.GetClassesOfLevelProgramMap(key).then((r) => {
      this.classLevelList = r as Array<IAssessmentClassLevel>;
    });

  }

  mounted() {
    this.validatePage();
    this.loadLevels();
    this.loadCity();
  }

  loadSession() {
    this.cityId = "";
    this.subCityId = "";
    this.classId = "";
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.termModel = r;
    });
  }

  loadCity() { 
    this.subCityId = '';
    this.cityRepo.GetAllEx().then((r) => {
      this.cityList = r as Array<ISetupCity>;
      this.cityList = this.cityList.sort((one, two) =>
        one.fullName < two.fullName ? -1 : 1
      );
    });
  
}    
viewProDet1 : boolean = false;
showAllRecord() {
  
  this.programId = '';
  this.campusProgramId = '';
  this.campusProgramIdEx='';
 if(this.viewPrograms === false){
  this.programId = '';
  //this.loadProgramsOfCampus();
//   var IdsList = [];
//   this.programList1.forEach(item => IdsList.push(item.campusProgramId));
//  this.campusProgramId = IdsList.toString();
//  this.campusProgramIdEx= this.campusProgramId;
//  console.log(this.campusProgramId)
 }
 else{
  //this.loadProgramsOfLevelsAndCampus();
  this.viewProDet1 = true;
  this.viewProDet = true;
 }
}

showAllRecordData(){
  this.campusProgramId = '';
  // this.refreshData();
  if (this.viewProDet == true){ 
    this.campusProgramId = '';
  //   var IdsList = [];
  //   this.campusProgramLinkList.forEach(item => IdsList.push(item.campusProgramId));
  //  //this.campusProgramId = IdsList.toString();
  //  this.campusProgramIdEx= IdsList.toString();

  //  console.log(this.campusProgramId)

  }
  // else{
  //   this.campusProgramId ='';
  // }
}
programId : string = "";
loadProgramDetailofPrograms(){
 // this.Programdetailid = '';
 if(this.programId.length > 0){
  this.campusProgramLinkList = [];
  var key = this.sessionId + "?" + this.campusId + "?" + this.programId ;
  this.campusProgramLinkRepo.ProgDetailByMultipleProgram(key).then((r) => {
  this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
 });
 }
 
}

  // loadCity1() {
  //   
  //   if (this.sessionId.length > 0) {
  //     
  //     this.subCityId = "";
  //     this.classId = "";
  //     this.campusRepo.GetCityVM().then((r) => {
  //       
  //       this.cityList1 = r as Array<CitySubCity>;
        
  //       // this.cityList = this.cityList.sort((one, two) =>
  //       //   one.ci < two.fullName ? -1 : 1
  //       // );
  //     });
  //     this.$store.dispatch(StoreTypes.loadingState, true);
  //   }
  // }
  loadSubCity() {
    if (this.sessionId.length > 0 && this.cityId.length > 0) {
      this.classId = "";
      this.subCityRepo1.GetFindByEx(this.cityId).then((r) => {
        this.subCityList = r as Array<CitySubCity>;
      });
    }
  }
  loadSubCityCampus() {
    
    // this.campusddl = [];
    // this.cityDDL = [];
    let oldObj: ICampusCityData;
    if (this.subCityId.length > 0) {
      this.campusRepo.GetCampusAgainstSubCity(this.subCityId).then(r => {
        this.campusSubCityListExx = r as Array<ICampusCityData>;
      });
    }
    
  }
  loadLevels() {
    this.levelRepo.GetFindBy('e=>e.StatusId==1')
        .then(r => {
            this.levelList = r as Array<ILevelDefinition>
          })
  }

  loadPrograms(){
    this.proRepo.GetFindBy('e=>e.StatusId == 1')
    .then(r =>{
      this.programList = r as Array<ISetupProgram>
    })
  }


loadProgramsOfLevelsAndCampus(){
  
  if(this.levelId.length > 0){
    
    var key = this.levelId + "?" + this.campusId;
    this.repository.GetProgramAgainstLevel(key)
        .then(r => {
            this.programList1 = r as Array<IAssessmentProgramLevel>
        })
        this.showAllRecord();
  }
  
  
}
  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("AssessmentSectionMap" in this.user.claims == true) {
        if (this.user.claims["AssessmentSectionMap"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["AssessmentSectionMap"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["AssessmentSectionMap"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["AssessmentSectionMap"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  /**this.$watch("sessionId", this.loadCityCampus);
    this.$watch("campusId", this.loadProgramsOfCampus);
    this.$watch("campusProgramId", this.loadClass);
    this.$watch("classid", this.loadBoards);
    this.$watch("boardId", this.refreshData);
    this.$watch("sessionId", this.refreshData);
    this.$watch("campusId", this.refreshData);
    this.$watch("campusProgramId", this.refreshData);
    this.$watch("classid", this.refreshData); */

  refreshData() {
    console.log(this.classid);
    if(this.classid!=undefined){
    
    if(this.campusProgramIdEx.length>0 && this.campusProgramIdEx!=undefined && this.campusProgramIdEx!=''){
      this.campusProgramId =this.campusProgramIdEx;
    }
    
    // this.subCityId = this.campusCityList.find(
    //   (e) => e.campusId == this.campusId
    // ).subCityId;
    // if(this.viewProDet == true){
    //   this.campusProgramId = 
    // }
    if (
      this.sessionId.length > 0 &&
      //this.campusProgramId.length > 0 &&
      this.campusId.length > 0 &&
      this.levelId.length > 0 &&
      this.classid.length > 0
    ) {
      
      
      //var proArray =this.campusProgramId.split(',');
    
      var key =
        this.sessionId +
        "?" +
        this.levelId +
        "?" +
         this.classid +
         "?" +
        this.campusId +
        "?" +
        this.campusProgramId;

      this.data = [];
      this.repository.GetAllData(key)
        .then(
          (response) => (this.data = response as Array<IVWAsssessmentSectionMap>)
        );
    }
    else{
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select the Dropdowns",
        title: "Warning",
        messageTypeId: PayloadMessageTypes.warning,
      });
     
    }
  }
  }




  insertModel() {
    if(this.campusProgramIdEx.length>0 && this.campusProgramIdEx!=undefined && this.campusProgramIdEx!=''){
      this.campusProgramId =this.campusProgramIdEx;
    }
    if (
      this.campusId.length > 0 &&
      this.sessionId.length > 0 &&
      // this.campusProgramId.length > 0 &&
      this.classid.length > 0
      //this.boardId.length > 0
    ) {
      this.$modal.show("add-edit-model", {
        campusProgramId: this.campusProgramId,
        levelId : this.levelId,
        classId: this.classid,
        campusId : this.campusId,
        //boardId: this.boardId,
        sessionId: this.sessionId,
        subCityId: this.subCityId,
        IsNewRecord: true,
      });
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select the Dropdowns",
        title: "Warning",
        messageTypeId: PayloadMessageTypes.warning,
      });
    }
  }
  sectionCourseLinkId : string = "";
  assessmentSchemeMasterId : string = "";
  //assessSectionMapId : string = ""
  editModel(model: IAssessmentSectionMap) {
    
    this.$modal.show('add-edit-model', { 
      model: model,
      sectionCourseLinkId  : model.sectionCourseLinkId,
      assessmentSchemeMasterId : model.assessmentSchemeMasterId,
      assessmentSectionMapId : model.assessmentSectionMapId,
      assessmentSectionMapList : this.data,
      IsNewRecord: false })


      


    // this.$modal.show("add-edit-model", {
    //   //model: model,
    //   //campusProgramId: this.campusProgramId,
    //   assessmentSectionMapId : model.assessmentSectionMapId,
    //   assessmentSchemeMasterId : model.assessmentSchemeMasterId,
    //   sectionCourseLinkId : model.sectionCourseLinkId,
    //   statusId : model.statusId,
    //   //classId: this.classid,
    //   //boardId: this.boardId,
    //   //sessionId: this.sessionId,
    //   //subCityId: this.subCityId,
    //   IsNewRecord: false,
    // });
  }

  deleteModel(model: IAssessmentSectionMap) {
    this.$modal.show("delete-model", { model: model });
  }
}
