/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
 
import Component from "vue-class-component";
import * as helper from "../../../../helper";
import { State } from "vuex-class";
import { DllPlugin } from "webpack";
import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";
import {
  CitySubCity,
  IAcademicCalendarMaster,
  IBuildingData,
  ICampusCityVM,
  ISetupCampusProgramVM,
  ISetupCity,
  ISetupClass,
  ISetupProgram,
  ISetupSession,
  ISetupSubCity,
  ISurvey2,
  ISurveyCommentDash,
  ISurveyMaster,
  ISurveyRatingList,
  ISurveyRatingListEx,
  ISurveyStatistics
} from "../../../../models";
import { IVWCampusBaseProgram } from "../../../../models/Setup/CampusBaseProgram";
import {
  AcademicCalendarMasterService,
  SetupCampusProgramLinkService,
  SetupCampusService,
  SetupCityService,
  SetupClassService,
  SetupProgramService,
  SetupSessionService,
  SetupSubCityService,
} from "../../../../service";
import { PublicVWDashBoardVMService } from "../../../../service/DashBoard/DashBoard";
import { SurveyDashboardMasterService } from "../../../../service/DashBoard/dashboardsurveymaster";
import { StoreTypes } from "../../../../../../store";
import { SurveyDashBoardComparisionApril } from "../../SurveyDashBoardComparisionApril/list";
import { timingSafeEqual } from "crypto";
import { TeacherSearchSurveyJuly23 } from "../../TeacherSearchSurveyJuly/list";
import { OverAllResultJuly23 } from "../../OverAllResultJuly23/list";
 

 
@Component({
  name: "Survery-Dashoard",
  template: require("./index.html"),
  components: {
    "over-all-result": OverAllResultJuly23,
    "Teacher-Search": TeacherSearchSurveyJuly23,
    "over-all-result-New-Component": SurveyDashBoardComparisionApril,
  },
})
export class SurveyDashEbooks24Statistics extends Vue {
  
  
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private surveyInfo: any = {};
  private currentUrl: boolean = false;

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private checkCity: boolean = false;
  private checkSubCity: boolean = false;
  private checkCampus: boolean = false;
  private isBuilding: boolean = false; 
  private loading:boolean=false;
  private search: string = "";
  surveyMasterId: string = "";
  sessionId: string = "";
  cityId: string = "";
  campusId: string = "";  
  buildingname: string = "";
  programId: string = "";
  classId: string = "";
  campusProgramId: string = "";
  subCityId: string = "";
  subCityId1: string = "";
  subCityId2: string = "";
  subCityId3: string = "";
  subCity1Name: string = "";
  subCity2Name: string = "";
  subCity3Name: string = "";
  filterArr: any = [];
  newArr = [];

  private survey: Array<ISurvey2> = [];
  private building: Array<IBuildingData> = [];
  private surveyStatistics: Array<ISurveyStatistics> = [];
  private subCityData: Array<ISurveyStatistics> = [];
  private subCampusData: Array<ISurveyStatistics> = [];
  sessionList: Array<ISetupSession> = [];
  cityComparisonList: Array<ISurveyRatingList> = [];
  cityComparisonListEx: Array<ISurveyRatingListEx> = [];
  surveyCommentDashList: Array<ISurveyCommentDash> = [];
  surveyDashboardMasterList: Array<ISurveyMaster> = [];
  private subCityList: Array<CitySubCity> = [];
  private cityList: Array<ISetupCity> = [];
  private data: Array<ISetupSubCity> = [];
  private campusCityList: Array<ICampusCityVM> = [];
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  // private subCityRepo: SetupSubCityService = new SetupSubCityService(this.$store);
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private programList: Array<IVWCampusBaseProgram> = [];
  private programListEx: Array<ISetupProgram> = [];
  classList: Array<ISetupClass> = [];
  

 

  private classRepository: SetupClassService = new SetupClassService(
    this.$store
  );
  private programSRepo: SetupProgramService = new SetupProgramService(
    this.$store
  );
  repoSurveyDashboardMaster: SurveyDashboardMasterService = new SurveyDashboardMasterService(
    this.$store
  );
  private cityRepo: SetupCityService = new SetupCityService(this.$store);
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    this.$store
  );

  private repository: PublicVWDashBoardVMService = new PublicVWDashBoardVMService(this.$store);
  sessionRepo: SetupSessionService = new SetupSessionService(this.$store);

  private columns = [{ key: "comment", caption: "Comments" }];

  //   private comparisonColumns = [
  //     { key: 'question', caption: 'Refference No' },
  //     { key: 'course', caption: '' },
  //     { key: 'subCity1Rating', caption: 'Sub-City 1' },
  //     { key: 'subCity2Rating', caption: 'Sub-City 2' },
  //     { key: 'subCity4Rating', caption: 'Sub-City 3' },
  //     { key: 'rating', caption: 'OverAll' }
  //     // { key: 'action', caption: 'Action', width: 120 }
  // ];
  private breadcrums = [];
  searchArr = [];
  duplicateArr: any = [];

  created() {
    // this.loadSurveyDashboardMaster();
    // this.loadCity();
    // // this.$watch("cityId", this.loadSubCity);
    // this.$watch("subCityId", this.loadCityCampus);
    // // this.$watch("campusId", this.loadPrograms);
    // // this.$watch("programId", this.loadClass);
    // this.$watch("cityId", this.refreshData);
    // this.$watch("subCityId", this.refreshData);
    // this.$watch("campusId", this.refreshData);
    // // this.$watch("programId", this.ProgramData);
    // // this.$watch("classId", this.ClassData);
    // this.$watch("subCityId3", this.loadCityWise);
    // this.$watch("buildingname", this.laoddatawithbuilding);
    

  }

  mounted() {
    this.validatePage();
    // this.loadSession();
    
    //this.loadCityData();
    // this.loadSubCityEx();
    this.loadData();
  
  
  }
  sort(){
    alert('click')
  }
  async refreshdata(){
    this.loading = true;
    await this.$nextTick();
    try {
     await Promise.all([this.loadCityData()]);
     
    } catch (error) {
      console.error(error);

    } 
    
    finally {
      this.loading = false;
    }
    console.log('dgdfgfd',this.loading)

  };

  querySearch() {
    this.filterArr = [];
    if (this.search) {
      let check = this.searchArr.find((x) => x == this.search);
      if (!check) {
        this.searchArr.push(this.search.toLowerCase());
        this.search = "";
      }
      this.search = "";
    }
    this.searchArr.forEach((value) => {
      // this.duplicateArr = this.data.filter(item =>
      //   Object.keys(item).some(k => item[k] != null &&
      //     item[k].toString().toLowerCase()
      //       .includes(value))
      // );
      this.duplicateArr = this.surveyCommentDashList.filter((e) =>
        e.comment.toLowerCase().includes(value)
      );
      console.log(this.duplicateArr);
      this.duplicateArr.forEach((e) => {
        let search = this.filterArr.find((x) => x.newID == e.newID);
        if (!search) {
          this.filterArr.unshift({
            ...e,
            comment: e.comment
              .toLowerCase()
              .replaceAll(
                value,
                `<span class="font-weight-bold">${value}</span>`
              ),
          });
        }
      });
    });
  }
  private csvdata: any = [];

  loadcsv() {
    this.csvdata = [];
    if (this.surveyCommentDashList.length > 0) {
      this.surveyCommentDashList.forEach((element) => {
        this.csvdata.push({
          Comments: element.comment,
        });
      });
      helper.exportToCsv("Comments.csv", this.csvdata);
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "No Data Found",
        title: "warning",
        messageTypeId: PayloadMessageTypes.warning,
      });
    }
  }
  deleteSearch(i) {
    this.searchArr.splice(i, 1);
    this.querySearch();
    if (this.searchArr.length == 0) {
      this.filterArr = this.surveyCommentDashList;
    }
  }
  loadCity() {
    this.cityRepo.GetAllEx().then((r) => {
      this.cityList = r as Array<ISetupCity>;
      this.cityList = this.cityList.sort((one, two) => (one.fullName < two.fullName ? -1 : 1));
    });
  }

  // loadSubCity() {
  //   this.subCityRepo.GetFindByEx(this.cityId).then((r) => {
  //     this.subCityList = r as Array<CitySubCity>;
  //   });
  // }

  // async loadSubCityEx() {
  //   this.data = [];
  //   this.subCityRepo.GetFindBy("e => e.StatusId!=2").then((r) => {
  //     this.data = r as Array<ISetupSubCity>;
      
  //   });
  //   // return new Promise(resolve => setTimeout(resolve, 5000)); // 2 seconds delay

  // }

  cities = [];
  loadCityCampus() {
    this.campusRepo.GetCityVM().then((r) => {
      this.campusCityList = r as Array<ICampusCityVM>;
      this.campusCityList = this.campusCityList.filter(
        (e) => e.subCityId == this.subCityId
      );
      this.cities = [];
      this.campusCityList.forEach((element) => {
        if (this.cities.indexOf(element.cityName) == -1) {
          this.cities.push(element.cityName);
        }
      });
    });
  }

  loadClass() {
    // this.programId = this.campusProgramLinkList.find(
    //   (e) => e.campusProgramId == this.campusProgramId
    // ).programId;
    this.classRepository.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.classList = r as Array<ISetupClass>;
    });
  }
  loadProgramsOfCampus() {
    if (this.campusId.length > 0) {
      // this.ddl = [];
      // this.programDDL = [];
      // let oldObj: ISetupCampusProgramVM;
      // var key = this.campusId;
      // this.campusProgramLinkRepo.GetAllVMEx(key).then((r) => {
      //   this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
      // });
      this.programSRepo
        .ProgramByCampus('e=>e.CampusId.ToString()=="' + this.campusId + '"')
        .then((r) => {
          this.programList = r as Array<IVWCampusBaseProgram>;
        });
    }
  }

  loadPrograms() {
   
    this.programSRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.programListEx = r as Array<ISetupProgram>;
      this.programListEx = this.programListEx.filter(e => e.fullName.indexOf('STEP'));
    });
  }

  loadSurveyDashboardMaster() {
    this.surveyDashboardMasterList = [];
    this.repoSurveyDashboardMaster.GetAllEx().then((r) => {
      this.surveyDashboardMasterList = r as Array<ISurveyMaster>;
    });
  }

  // loadSession() {
  //   this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
  //     this.sessionList = r as Array<ISetupSession>;
  //   });
  // }

  loadCityWise() {
    this.subCity1Name = this.data.find(
      (e) => e.subCityId == this.subCityId1
    ).name;
    this.subCity2Name = this.data.find(
      (e) => e.subCityId == this.subCityId2
    ).name;
    this.subCity3Name = this.data.find(
      (e) => e.subCityId == this.subCityId3
    ).name;

    this.cityComparisonListEx = [];
    this.cityComparisonList = [];
    var key = this.subCityId1 + "?" + this.subCityId2 + "?" + this.subCityId3;
    this.repository.GetSurveyRatingAllExEbook24(key).then((r) => {
      this.cityComparisonList = r as Array<ISurveyRatingList>;
    });
  }

  loadCityWiseEx() {
    if (
      this.subCityId1.length > 0 &&
      this.subCityId2.length &&
      this.subCityId3.length == 0
    ) {
      this.subCity1Name = this.data.find(
        (e) => e.subCityId == this.subCityId1
      ).name;
      this.subCity2Name = this.data.find(
        (e) => e.subCityId == this.subCityId2
      ).name;
      this.cityComparisonList = [];
      this.cityComparisonListEx = [];
      var key = this.subCityId1 + "?" + this.subCityId2;
      this.repository.GetSurveyRatingAllEbook24(key).then((r) => {
        this.cityComparisonListEx = r as Array<ISurveyRatingListEx>;
      });
    }
  }
  ProgramData(){
    this.surveyInfo = 'Posession';
    this.surveyCommentDashList = [];
    this.filterArr = [];
    this.searchArr = [];
    
    if (
      this.cityId.length > 0 &&
      this.subCityId.length > 0 &&
      this.campusId.length > 0 &&
      this.buildingname.length>0 &&
      this.programId != "00000000-0000-0000-0000-000000000000"
    ) {
      console.log("program");
      var key =
        this.cityId +
        "?" +
        this.subCityId +
        "?" +
        this.campusId +
        "?" + 
        this.buildingname +
        "?" +
        this.programId +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "program" +
        "?" +
        this.user.userId;
      this.repository.GetSurveyCommentDashJuly23WithBuilding(key).then((r) => {
        this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
        this.duplicateArr = this.surveyCommentDashList;
        this.filterArr = this.surveyCommentDashList;
      });
    }
  }
  ClassData(){
    this.surveyInfo = 'Posession';
    this.surveyCommentDashList = [];
    this.filterArr = [];
    this.searchArr = [];
    
    
    if (
      this.cityId.length > 0 &&
      this.subCityId.length > 0 &&
      this.campusId.length > 0 &&   
      this.buildingname.length > 0 &&
      this.programId.length > 0 &&
      this.classId!= "00000000-0000-0000-0000-000000000000" 
    ) {
      console.log("class");
      var key =
        this.cityId +
        "?" +
        this.subCityId +
        "?" +
        this.campusId +
        "?" +
        this.buildingname +
        "?" +
        this.programId +
        "?" +
        this.classId +
        "?" +
        "class" +
        "?" +
        this.user.userId;
      this.repository.GetSurveyCommentDashJuly23WithBuilding(key).then((r) => {
        this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
        this.duplicateArr = this.surveyCommentDashList;
        this.filterArr = this.surveyCommentDashList;
      });
    }
  }
laoddatawithbuilding(){
  
  if(this.buildingname.length>0){
var buildingnewdata=this.building.filter(e=>e.buildingName==this.buildingname);
  this.isBuilding= buildingnewdata[0].isBuilding;
if(this.isBuilding==true){

  this.surveyInfo = 'Posession';
  this.surveyCommentDashList = [];
  this.filterArr = [];
  this.searchArr = [];
  
  
   
    if (
    this.cityId.length > 0 &&
    this.subCityId.length > 0 &&
    this.campusId.length > 0 &&   
    this.buildingname.length>0 
  ) {
    console.log("building");
    var key =
      this.cityId +
      "?" +
      this.subCityId +
      "?" +
      this.campusId +
      "?" +
      this.buildingname +
      "?" +
      "00000000-0000-0000-0000-000000000000" +
      "?" +
      "00000000-0000-0000-0000-000000000000" +
      "?" +
      "building" +
      "?" +
      this.user.userId;
    this.repository.GetSurveyCommentDashJuly23WithBuilding(key).then((r) => {
      this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
      this.duplicateArr = this.surveyCommentDashList;
      this.filterArr = this.surveyCommentDashList;
    });
  }
 
  
}
else{  
    }

  }
  else{
  }

}

  refreshData() {

  
    this.surveyInfo = 'Posession';
    this.surveyCommentDashList = [];
    this.filterArr = [];
    this.searchArr = [];
     
  
      if (
    this.campusId!="00000000-0000-0000-0000-000000000000" && this.campusId!=""
    ) {
      console.log("campus");

      var key =
        this.cityId +
        "?" +
        this.subCityId +
        "?" +
        this.campusId +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "campus" +
        "?" +
        this.user.userId;
      this.repository.GetSurveyCommentDashEbook23(key).then((r) => {
        this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
        this.duplicateArr = this.surveyCommentDashList;
        this.filterArr = this.surveyCommentDashList;
      });
      this.loadbuildingdata();
    }
    else  if (
      
      this.subCityId!="00000000-0000-0000-0000-000000000000" &&  this.subCityId!=""
       
    ) {
      console.log("subcity");

      var key =
        this.cityId +
        "?" +
        this.subCityId +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "subcity" +
        "?" +
        this.user.userId;
      this.repository.GetSurveyCommentDashEbook23(key).then((r) => {
        this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
        this.duplicateArr = this.surveyCommentDashList;
        this.filterArr = this.surveyCommentDashList;
      });
    }
   else if (
      this.cityId!="00000000-0000-0000-0000-000000000000" && this.cityId!=""
       
    ) {
      console.log("city");

      var key =
        this.cityId +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "city" +
        "?" +
        this.user.userId;
      this.repository.GetSurveyCommentDashEbook23(key).then((r) => {
        this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
        this.duplicateArr = this.surveyCommentDashList;
        this.filterArr = this.surveyCommentDashList;
      });
    }
    


   
    // var key =
    //   this.cityId +
    //   "?" +
    //   this.subCityId +
    //   "?" +
    //   this.campusId +
    //   "?" +
    //   this.programId +
    //   "?" +
    //   this.classId +
    //   "?" +
    //   this.user.userId;
    // this.repository.GetSurveyCommentDash(key).then((r) => {
    //   this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
    //   this.duplicateArr = this.surveyCommentDashList;
    //   this.filterArr = this.surveyCommentDashList;
    // });
  }
  loadData() {

    this.surveyCommentDashList = [];
    this.filterArr = [];
    this.searchArr = [];
    let key:string =String(this.user.userId);
    // this.repository.GetSurveyCommentDashEbook23(key).then((r) => {
    //   this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
    //   this.duplicateArr = this.surveyCommentDashList;
    //   this.filterArr = this.surveyCommentDashList;
      this.loadCityData();
    // });

  }

  loadbuildingdata(){
    if(this.campusId.length>0){

      this.repository.BuildingSectionData(this.campusId).then((r) => {
        this.building = r as Array<IBuildingData>;
      });
    }  

  }
   loadCityData() {
    this.checkCity = true;
    this.checkSubCity = false;
    this.checkCampus = false;
    this.surveyStatistics = [];
    var key =
      "00000000-0000-0000-0000-000000000000" +
      "?" +
      "city" +
      "?" +
      this.user.userId + "?" +
      "f36f5089-c160-4e97-902d-48b230c85e6a";
    this.repository.SurveyStatisticsEbook24(key).then((r) => {
      this.surveyStatistics = r as Array<ISurveyStatistics>;
      this.loadTotalSurvey();
    });
    // return new Promise(resolve => setTimeout(resolve, 5000)); // 2 seconds delay

    
  }

  loadSubCityData(id, next, name) {
    this.checkCity = false;
    this.checkCampus = false;
    this.checkSubCity = true;
    this.subCityData = [];
    this.breadcrums = [];
    this.breadcrums[0] = name;
    var key = id + "?" + next + "?" + this.user.userId + '?' +
      "f36f5089-c160-4e97-902d-48b230c85e6a";
    this.repository.SurveyStatisticsEbook24(key).then((r) => {
      this.subCityData = r as Array<ISurveyStatistics>;
    });
  }

  loadCampusData(id, next, name) {
    this.breadcrums[1] = name;
    this.checkCity = false;
    this.checkSubCity = false;
    this.checkCampus = true;
    this.subCampusData = [];
    var key = id + "?" + next + "?" + this.user.userId + '?' +
      "f36f5089-c160-4e97-902d-48b230c85e6a" ;
    this.repository.SurveyStatisticsEbook24(key).then((r) => {
      this.subCampusData = r as Array<ISurveyStatistics>;
    });
  }
  // 4063768d-34df-4829-a811-f92bebf857a1
  // 08594f95-bdbb-4f0a-aa54-9ea5dc8c46c9
  loadTotalSurvey() {

    this.survey = [];
    this.repository
      .TotalSurveyEbooks24('f36f5089-c160-4e97-902d-48b230c85e6a')
      .then((response) => (this.survey = response as Array<ISurvey2>));
   
  }

  loadPrevious() {
    if (this.checkSubCity == true) {
      this.checkSubCity = false;
      this.checkCampus = false;
      this.checkCity = true;
      this.breadcrums.splice(0, 1);
    }
    if (this.checkCampus == true) {
      this.checkSubCity = true;
      this.checkCampus = false;
      this.checkCity = false;
      this.breadcrums.splice(1, 1);
    }
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("CMSStudentCountEbook2024Statistics" in this.user.claims == true) {
        if (this.user.claims["CMSStudentCountEbook2024Statistics"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["CMSStudentCountEbook2024Statistics"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["CMSStudentCountEbook2024Statistics"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["CMSStudentCountEbook2024Statistics"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }
  // transform(val, course) {
  //   return val.replace("following", course);
  // }
}
