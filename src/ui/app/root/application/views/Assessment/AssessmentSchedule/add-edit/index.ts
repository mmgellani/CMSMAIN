/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue, { WatchOptions } from "vue";
import Component from "vue-class-component";
import { required, maxLength } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import * as helper from "../../../../helper";
import { GetCourseFromTimetable, GetCourseListByTimetable, IExaminationExamSchedule, IExamScheduleExx, IExaminationExamScheduleCourseName, DateArray, UpdatemarksResponse } from "../../../../models/Examination/ExamSchedule";
import { ExaminationExamScheduleService } from "../../../../service/Examination/ExamSchedule";
import {
    IExaminationExamType,
    IProgramDetail,
    IRegistrationSectionCourseLinkVM,
    RegistrationProgramCourseLinkVM,
    VWAssessmentSections,
} from "../../../../models";
import { AssessmentScheduleService, ExaminationExamTypeService, RegistrationProgramCourseLinkService } from "../../../../service";
import {
    IExaminationFailMasterCriteria,
    IExaminationVWFailMasterCriteria,
} from "../../../../models/Examination/FailCriteria";
import { ExaminationFailCriteriaService } from "../../../../service/Examination/FailCriteria";
import { GradingMasterDetailData } from "../../../../models/Examination/GradingCriteria";
import { ExaminationGradingMasterService } from "../../../../service/Examination/GradingMaster";
import moment from "moment";
// import { FailMasterPreview } from "../failMasterPreview";
// import { GradingPolicyPreview } from "../gradingPolicyPreview";
import { debug } from "console";
import { IAssessmentExamType, IAssessmentSchemeDefinitionAll ,IAssessmentSchemeDetailList,IAssessmentSchemeDetailListAdd, IAssessmentSchemeDetailListGet, IAssessmentSchemeMasterList} from "../../../../models/Setup/AssessmentSchemeDefinition";
import { AssessmentSchemeDetailService } from "../../../../service/Assessment/AssesmentDetail";
import { IAssessmentCategory } from '../../../../models/Setup/AssessmentType';
import { AssessmentTypeService } from '../../../../service/Setup/AssessmentType';
import { AssessmentSchemeMasterService } from "../../../../service/Assessment/AssesmentMaster";
import { FailMasterPreview } from "../../AssessmentSchemeMaster/failMasterPreview";
import { GradingPolicyPreview } from "../../AssessmentSchemeMaster/gradingPolicyPreview";
import { Assesmentsecdulelistdata,AssessmentSchedule,GetassesmentSceduleData } from "../../../../models/Assessment/AssessmentSchedule";

type ValidateExaminationExamSchedule = {
    data: IExaminationExamSchedule;
    assmentMasterdata: IAssessmentSchemeDefinitionAll ;
    assmentdetaildata:IAssessmentSchemeDetailListAdd;
    assesmentScemeMasterlistEx: IAssessmentSchemeMasterList;
    validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateExaminationExamSchedule> = {
    // data: {
    //     fullName: { required },
    //     gradingMasterId: { required },
    //     failMasterId: { required },
    //     totalWeightage: { required },
    // },
    assmentMasterdata:{
         fullName: { required },
            gradingMasterId: { required },
            failMasterId: { required },
            totalWeightage: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: "ExamSchedule-add-edit-model",
    template: require("./index.html"),
    props: ["courseLists"],
    components: {
        "fail-master-preview": FailMasterPreview,
        "grading-olicy-preview": GradingPolicyPreview,
    },
})
export class ExaminationExamScheduleAddEdit extends Vue {
    private repository: ExaminationExamScheduleService;
    isActive: boolean = true;
    dropdisble:boolean=false;
    private examTypeId: string;
    private courseId: string;
    private forAllSectionId: string;
    private classId = ''
    private assessmentSectionMapList: AssessmentSchedule[] = [];
    private assessmentSectionMapListExxx: AssessmentSchedule[] = [];

    private assessmentSectionMapListEx: AssessmentSchedule[] = [];
    private assessmentSectionMapListFilter = [];

    private campusProgramId: string;
    private fromDate = new Date();
    private toDate = new Date();
    private courseLists: Array<RegistrationProgramCourseLinkVM>;
    private courseListsEx: Array<RegistrationProgramCourseLinkVM>;

    private assesmentssecduleLists: Array<RegistrationProgramCourseLinkVM>;

    private examTypeRepo: ExaminationExamTypeService;

    private assementscedulerepo:AssessmentScheduleService= new AssessmentScheduleService(this.$store);
    private assementdeatilrepo: AssessmentSchemeDetailService;
    // private assmentdetaildata:IAssessmentSchemeDetailListAdd;


    private examTypeList: Array<IExaminationExamType> = [];
    private GradingMasterDetailData: Array<GradingMasterDetailData> = [];
    private examtypelistData  :Array<IAssessmentExamType>=[];
    private assementsecdulelist:Array<Assesmentsecdulelistdata>=[];
    private assementsecdulelistdata:Array<GetassesmentSceduleData>=[];

    
    datestring = new Date();
    private datas: Array<IExaminationExamSchedule> = [];
    private esNameList: Array<IExamScheduleExx> = [];
    private examScheduleList: IExaminationExamSchedule[] = [];
    private examScheduleListCourseName: IExaminationExamScheduleCourseName[] = [];
    private assessmentdetailList: IAssessmentSchemeDetailList[] = [];

    private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(this.$store);

    private listlength: number;
    private courseList: Array<GetCourseListByTimetable> = [];
    private updatemarks: Array<UpdatemarksResponse> = [];
    private exammarking: Array<GetCourseListByTimetable> = [];
    private iscourseentered: Array<GetCourseListByTimetable> = [];
    private getListOfCourse: Array<GetCourseFromTimetable> = [];
    private exaamdate: Date;
    //name: string = this.name;
    private SectionCourseLinkIdList = "";
    private SectionCourseLinkIdListarray = [];
    private SectionCourseLinkIdleng: number;
    private sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];
    private assementCategoryList: Array<IAssessmentCategory> = [];
    private AssesmentSchmeMastrRepo: AssessmentSchemeMasterService;
    private AssesmentSchmeDetailRepo: AssessmentSchemeDetailService;
    private programDetailList: Array<IProgramDetail> = []

    private abc = "";
    private abcArray = [];
    private programDetailId: string = '';
    private assessmentSchemeMasterId: string = '';

    private assessmentSchedulingDetailId: string = '';
    private examTypeIdEx: string = '';


    private dateArray: Array<DateArray> = [];
    private examDate = new Date();
    private sessionId: string = '';
    private campusid: string = '';
    private sectionId: string = '';
    private GradingMasterrepository: ExaminationGradingMasterService = null;
    private failCriteriaList: Array<IExaminationVWFailMasterCriteria> = [];
    private failCriteriaRepo: ExaminationFailCriteriaService = new ExaminationFailCriteriaService(
        this.$store
    );
    // this.assementdeatilrepo = new AssessmentSchemeDetailService(this.$store);
    private msgShow: string = '';
   private  academicsArray: Array<IAssessmentSchemeDetailListAdd> = [];
   private  academicsArrayEx: Array<IAssessmentSchemeDetailListAdd> = [];
   private assesmentScemeDeatilistEx:Array<IAssessmentSchemeDetailListGet>=[];

 
   private assesmentScemeMasterlistEx:Array<IAssessmentSchemeMasterList>=[];




   //private assesmentScemeDeatilist = new IAssessmentSchemeDetailListGet();

   private assesmentScemeMasterlist:Array<IAssessmentSchemeMasterList>=[];

   private gradingPolicy= "";
   private passCriteria = "";
   private totalWeightage= 0;
   private assessmentName= "";
   private Month= "";

   private assessmentType= "";

   private assessmentSectionList: Array<VWAssessmentSections> = [];
   private assessmentSectionListEx = [];


   private programId = '';

    private cousridcheck: string = '';
    private activeDayoff: boolean = false;
    private dateselect: boolean = false;
    private showEditModel: boolean = true;

    private enablebutton: boolean = true;
    private disablebuuton: boolean = false;
    private enablelistcourse: boolean = false;
    private monthList =
        [{ name: 'January' }, { name: 'February' }, { name: 'March' }, { name: 'April' }, { name: 'May' }, { name: 'June' }, { name: 'July' }, { name: 'August' }, { name: 'September' }, { name: 'October' }, { name: 'November' }, { name: 'December' }]
    private data: IExaminationExamSchedule = {
        examScheduleId: "",
        examDate: "",
        statusId: 0,
        examTypeId: "",
        courseId: "",
        campusProgramId: "",
        classId: "",
        failMasterId: "",
        gradingMasterId: "",
        sectionCourseLinkId: '',
        totalMarks: 0,
        fullName: "",
        month: "",
    };
    private assmentMasterdata: IAssessmentSchemeDefinitionAll = {
    assessmentSchemeMasterId :"",
	fullName : "",
	gradingMasterId :"",
	failMasterId : "",
	totalWeightage : 100,
	statusId :0,
    }

    // private assesmentScemeMasterlistEx: IAssessmentSchemeMasterList = {
    //     assessmentSchemeMasterId :"",
    //     assessmentSchemeName:"",
    //     fullName : "",
    //     gradingMasterId :"",
    //     failMasterId : "",
    //     totalWeightage : 0,
    //     //name:"",
    //     statusId :0,
    
    //     }


        
        // private assmentMasterdata: IAssessmentSchemeDefinitionAll = {
        //     assessmentSchemeMasterId :"",
        //     fullName : "",
        //     gradingMasterId :"",
        //     failMasterId : "",
        //     totalWeightage : 0,
        
        //     statusId :0,
        //     }

    private assmentdetaildatalist:IAssessmentSchemeDetailListAdd={
        assessmentSchemeDetailId:"",
        assessmentSchemeMasterId:"",
        assessmentTypeId:"",
        weightage:"",
        examCount:"",
        statusId:0,
    }

    private dataEx: IAssessmentExamType = {
        assessmentTypeId : "",
	assessmentCategoryId : "",
	examTypeId : "",
	fullName : "",
    };

    private detaildataEx: IAssessmentSchemeDetailList = {
        assessmentTypeId : "",
        examCount : "",
      weightage : "",
      statusId : 1,

        
	
    };

    private assesmentscedulelistasgin:AssessmentSchedule=

    {
      assessmentScheduleId: '',
      assessmentStatus: 8,
      assessmentSchedulingDetailId: '',
      totalMarks: 0,
      programCourseLinkId: '',
      statusId: 1,
      assessmentSectionMapId : '',
      scheduleDate: new Date,
    }
    private dataCoursename: IExaminationExamScheduleCourseName = {
        examScheduleId: "",
        examDate: "",
        statusId: 0,
        examTypeId: "",
        courseId: "",
        campusProgramId: "",
        classId: "",
        failMasterId: "",
        gradingMasterId: "",
        sectionCourseLinkId: '',
        totalMarks: 0,
        fullName: "",
        month: "",
        courseName: ''

    };
    private IsNewRecord: boolean = true;
    private title: string = "";
    private inputValue: string = '';
    private repositoryCatgory: AssessmentTypeService = new AssessmentTypeService(
        this.$store
      );
    assessmentCategoryId: any;
  assessmentSectionMapId: any;
  checkallsection: any;
  examName: any;
    programCourseLinkId: any;
    created() {

        this.$watch('',this.getTotalWeightage);

        this.repository = new ExaminationExamScheduleService(this.$store);
        this.examTypeRepo = new ExaminationExamTypeService(this.$store);
        this.loadFailCriteria();
        this.loadExamType();
        this.loadAssesmentCategory();
     this.assementdeatilrepo = new AssessmentSchemeDetailService(this.$store);
     this.AssesmentSchmeMastrRepo = new AssessmentSchemeMasterService(this.$store);
     this.AssesmentSchmeDetailRepo=new  AssessmentSchemeDetailService(this.$store);

        this.GradingMasterrepository = new ExaminationGradingMasterService(
            this.$store
        );
        this.GradingMasterrepository.GetGradingMasterDetailEx().then((r) => {
            this.GradingMasterDetailData = r as Array<GradingMasterDetailData>;
        });
        this.listlength = this.data.sectionCourseLinkId.length;
        console.log(this.$refs.table, 'dfasdfsdfsdf');
;
          this.$watch('courseLists', this.GetCourseList);
    }
    pushToList() {


        this.dateselect = true;
        this.examScheduleList.push({

            campusProgramId: this.data.campusProgramId,
            courseId: this.data.courseId,
            examDate: new Date(
                moment(this.data.examDate).format("YYYY-MM-DD")
            ),
            failMasterId: "",
            totalMarks: 0,
            classId: this.data.classId,
            examScheduleId: helper.newGuid(),
            examTypeId: "",
            fullName: "",
            gradingMasterId: "",
            sectionCourseLinkId: this.data.sectionCourseLinkId,
            statusId: 1,
            month: this.data.month,



        });




    }

    loadAssesmentCategory() {
        ;
        this.repositoryCatgory.GetFindBy("e=>e.StatusId==1").then(r => {
          this.assementCategoryList = r as Array<IAssessmentCategory>;
        });
      }

      loadAssesmentExamType(id:any) {
        ;
        var key = id;
        this.assementdeatilrepo.GetAssesmentExamType(key).then(r => {
          this.examtypelistData = r as Array<IAssessmentExamType>;
        });
      }
    pushToListCourseName() {

        // this.checkdayoff();
;

        this.enablebutton = false;
        this.dateselect = true;

        this.examScheduleListCourseName.push({

            campusProgramId: this.data.campusProgramId,
            courseId: this.data.courseId,
            examDate: new Date(moment(this.data.examDate).format("YYYY-MM-DD")).toLocaleDateString(),
            failMasterId: "",
            totalMarks: this.data.totalMarks,
            classId: this.data.classId,
            examScheduleId: helper.newGuid(),
            examTypeId: "",
            fullName: "",
            gradingMasterId: "",
            sectionCourseLinkId: this.data.sectionCourseLinkId,
            statusId: 1,
            month: this.data.month,
            courseName: this.courseLists.find(e => e.courseId == this.data.courseId).courseName

        });

        // this.courseLists = [];\

        this.data.examDate = null;
        this.data.totalMarks = null;
        this.data.courseId = null;

    }

    pushToListAssementMarks() {

        // this.checkdayoff();
;

        this.enablebutton = false;
        this.dateselect = true;

        this.assessmentdetailList.push({

            assessmentTypeId : this.dataEx.assessmentTypeId,
             examCount : this.detaildataEx.examCount,
             weightage : this.detaildataEx.weightage,
             statusId : 1,


        });

        // this.courseLists = [];\

        this.dataEx.assessmentTypeId = null;
        this.detaildataEx.examCount = null;
        this.detaildataEx.weightage = null;

    }

    removeCourseList(i) {

        //this.activeDayoff = true; ////// ansa 
        this.examScheduleListCourseName.splice(i, 1);
    }


    removeFromList(id) {
        this.activeDayoff = true; ////// ansa 
        this.examScheduleList = this.examScheduleList.filter(
            (s) => s.examScheduleId != id
        );
    }

    editModel() {
        ;
        var model = this.failCriteriaList.find(
            (s) => s.failMasterId == this.assmentMasterdata.failMasterId
        );
        //
        this.$modal.show("fail-master-preview", {
            IsNewRecord: false,
            failMaster: this.assmentMasterdata.failMasterId,
            failMarks: model.failMarks,
            failIn: model.fail_In,
            absentConsiderFail: model.absentConsiderFail,
            failMasterName: model.fullName,
        });
    }

    editModel2() {
        ;
        var model = this.GradingMasterDetailData.find(
            (s) => s.gradingMasterId == this.assmentMasterdata.gradingMasterId
        );
        this.$modal.show("grading-olicy-preview", {
            fullName: model.name,
            gradingMasterId: this.assmentMasterdata.gradingMasterId,
            IsNewRecord: false,
        });

    }



    codeToBind = "";
    loadCode() {

        var key = this.data.examTypeId + "?" + this.data.sectionCourseLinkId;
        if (this.IsNewRecord) {
            if (!this.isExistingNew) {
                if (this.data.sectionCourseLinkId.length > 1) {
                    this.codeToBind = "";
                    this.repository.GetCodeSpecificSections(key).then((r) => {
                        this.codeToBind = r[0].providedString as any;
                        this.data.fullName = "";
                        var code = this.examTypeList.find(
                            (e) => e.examTypeId == this.data.examTypeId
                        ).code;
                        this.data.fullName = code + "-" + this.codeToBind;
                    });
                }
                else if (!this.forAllSection) {
                    this.codeToBind = "";
                    this.repository.GetCode(key).then((r) => {
                        this.codeToBind = r[0].providedString as any;
                        this.data.fullName = "";
                        var code = this.examTypeList.find(
                            (e) => e.examTypeId == this.data.examTypeId
                        ).code;
                        this.data.fullName = code + "-" + this.codeToBind;
                    });
                }
                else {
                    var key = this.data.campusProgramId + "?" + this.data.classId + "?" + this.data.examTypeId
                    this.codeToBind = "";
                    this.repository.GetCodeForAllSections(key).then((r) => {
                        this.codeToBind = r[0].providedString as any;
                        this.data.fullName = "";
                        var code = this.examTypeList.find(
                            (e) => e.examTypeId == this.data.examTypeId
                        ).code;
                        this.data.fullName = code + "-" + this.codeToBind;

                    });
                }

            }

        } else {
            //new incremented code should load if examtype is changed
            this.editFlag++;
            if (this.editFlag > 1) {
                this.codeToBind = "";
                this.repository.GetCode(key).then((r) => {
                    this.codeToBind = r[0].providedString as any;
                    this.data.fullName = "";
                    var code = this.examTypeList.find(
                        (e) => e.examTypeId == this.data.examTypeId
                    ).code;
                    this.data.fullName = code + "-" + this.codeToBind;
                });
            }
        }
    }
    loadFailCriteria() {
        this.failCriteriaList = [];
        this.failCriteriaRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
            this.failCriteriaList = r as Array<IExaminationFailMasterCriteria>;
            this.failCriteriaList.forEach((element) => {
                element.fullName =
                    element.fullName +
                    "-" +
                    element.fail_In +
                    "-" +
                    element.failMarks +
                    "-" +
                    element.absentConsiderFail;
            });
        });
    }

    loadExamType() {

        this.examTypeRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
            this.examTypeList = r as Array<IExaminationExamType>;
        });
    }


    private sectionList: Array<IRegistrationSectionCourseLinkVM> = []
    private course: string = "";
    editFlag = 0;
    isExistingNew = false;
    forAllSection: false;


    beforeModalOpen(event) {
      ; 
      this.$watch('courseLists', this.GetCourseList);
debugger;
        this.activeDayoff = false;
        this.enablebutton = true;
        this.dateselect = false;
        this.disablebuuton = false;
        this.$v.$reset();
        // this.examScheduleList = [];
        // this.examScheduleListCourseName = [];
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
        Object.assign(this.assmentMasterdata, event.params.model);
        this.programDetailId=event.params.model.programDetailId;
        this.classId=event.params.model.classId;
        this.assessmentSectionListEx =event.params.AllData
        this.assessmentSectionMapId=event.params.model.assessmentSectionMapId
        this.checkallsection=event.params.model.chekallsection
        this.assessmentSectionList=event.params.model.sectionlistdata
        this.assessmentSectionList=event.params.model.sectionlistdata

        // this.assessmentSectionListEx = this.assessmentSectionList.map(item => item.assessmentSectionMapId);

        
        this.assessmentSchemeMasterId=event.params.model.assessmentSchemeMasterId

        this.assessmentSchedulingDetailId=event.params.model.assessmentSchedulingDetailId

        this.examName=event.params.model.examName
        
        ;
       // this.loadAssesmentListData();
        // this.getlistdata(masterid);
        if (!this.IsNewRecord) {
     
            
             this.IsNewRecord = false;
             this.programDetailId=event.params.programDetailId;
             this.classId=event.params.classId;
             this.dropdisble=true;
             this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
            //  this.programDetailId=event.params.model.programDetailId;
            //  this.classId=event.params.model.classId;
              var masterid=event.params.model.assessmentSchemeMasterId;
             //this.getlistdata(masterid);
             this.assessmentSchemeMasterId=event.params.assessmentSchemeMasterId


        this.examName=event.params.examName
              this.loadAssesmentListData();
             this.loadAssesmentscduleList();
             this.loadSectionCourse();
            // this.loadAssesmentMasterList(masterid);
            //this.ChangeDate(event.params.model.examDate);
            // this.getListOfCourse = [];
            this.assessmentSectionMapList.push(
              {
                assessmentScheduleId: '',
                assessmentStatus: 8,
                assessmentSchedulingDetailId: '',
                totalMarks: 0,
                programCourseLinkId: '',
                statusId: 1,
                assessmentSectionMapId : '',
                scheduleDate: new Date,
              }
          ) 
          this.assessmentSectionMapListEx=this.assessmentSectionMapList;

         }
        if (this.IsNewRecord) {
          this.loadSectionCourse();
          this.loadAssesmentListData();
        //   this.loadAssesmentscduleList();

            this.dropdisble=false;
            this.assessmentSectionMapList=[];
           this.assessmentSectionMapList.push(
                {
                  assessmentScheduleId: '',
                  assessmentStatus: 8,
                  assessmentSchedulingDetailId: '',
                  totalMarks: 0,
                  programCourseLinkId: '',
                  statusId: 1,
                  assessmentSectionMapId : '',
                  scheduleDate: new Date,
                }
            )
            this.assessmentSectionMapListEx=this.assessmentSectionMapList;
        }
        this.assessmentSectionMapListEx=this.assessmentSectionMapList;

        // this.esNameList = [];
    }



    loadAssesmentListData() {
      this.assementsecdulelist = [];
;
// this.assessmentSchemeMasterId='e8777782-1091-4b69-afe9-8f3fad539462';
// this.assessmentSchedulingDetailId='0d61f893-9859-4816-b26e-a09d9706cce9';
// this.examName='Monthly Test';
     
      
          var key = this.assessmentSchemeMasterId + "?" + this.assessmentSchedulingDetailId + "?" + this.examName;
          this.assementscedulerepo.GetassesmentSceduleData(key)
              .then(r => {
                  this.assementsecdulelist = r as Array<Assesmentsecdulelistdata>
                 this.gradingPolicy=this.assementsecdulelist[0].gradingCriteria;
                 this.passCriteria=this.assementsecdulelist[0].failMasterCriteria;
                 this.totalWeightage=this.assementsecdulelist[0].weightage;
                 this.assessmentName=this.assementsecdulelist[0].assessmentName;
                 this.assessmentType=this.assementsecdulelist[0].assessmentType;
                 this.Month=this.assementsecdulelist[0].month; 
                 this.assessmentSchedulingDetailId=this.assementsecdulelist[0].assessmentSchedulingDetailId;

              });
      
    }


    loadSectionCourse() {
        this.courseLists = [];
  ;
  
       
        if (this.programDetailId.length > 0 && this.classId.length > 0) {
            var key = this.programDetailId + "?" + this.classId
            this.programCourseRepo.GetAllFilterData(key)
                .then(r => {
                    this.courseLists = r as Array<RegistrationProgramCourseLinkVM>
                    this.courseListsEx = r as Array<RegistrationProgramCourseLinkVM>
  
                });
        }
  
    }
  
    getlistdata(id:any)
    {
;
var key = id;
this.AssesmentSchmeDetailRepo.GetAssesmentDetailData(key).then(r => {
  this.assesmentScemeDeatilistEx = r as Array<IAssessmentSchemeDetailListGet>;
  this.academicsArray=r as Array<IAssessmentSchemeDetailListGet>;
console.log(id);
});
    }
    loadAssesmentMasterList(id:any) {
        ;
        var key = id;
        this.AssesmentSchmeDetailRepo.GetAssesmentMasterData(key).then(r => {
          this.assesmentScemeMasterlistEx =  r as Array<IAssessmentSchemeMasterList>;
          const assesmentScemeMasterlist=this.assesmentScemeMasterlistEx[0]
          console.log( this.assesmentScemeMasterlistEx)
        //   this.assesmentScemeMasterlistEx = new IAssessmentSchemeMasterList;
        
        });
      }


    loadSectionCode() {

        this.esNameList = [];
        if (this.IsNewRecord) {
            if (!this.isExistingNew) {


                if (this.data.sectionCourseLinkId.length > 0) {

                    this.SectionCourseLinkIdListarray = this.data.sectionCourseLinkId.toString().replace("[", "").replace("]", "").split(",");
                    this.SectionCourseLinkIdListarray.forEach(sectionCourseLinkId => {
                        var key = this.data.examTypeId + "?" + sectionCourseLinkId;
                        this.codeToBind = "";
                        this.repository.GetCodeSpecificSections(key).then((r) => {

                            this.codeToBind = r[0].providedString as any;
                            this.data.fullName = "";
                            var code = this.examTypeList.find(
                                (e) => e.examTypeId == this.data.examTypeId
                            ).code;

                            this.esNameList.push({ examTypeId: sectionCourseLinkId, fullName: code + "-" + this.codeToBind });
                            this.data.fullName = this.esNameList[0].fullName;

                        });
                    })
                }


                else {

                    ////////////for All sections
                    this.sectionCourseLinkList.forEach(sectionCourseLink => {
                        var key = this.data.examTypeId + "?" + sectionCourseLink.sectionCourseLinkId;
                        this.codeToBind = "";
                        this.repository.GetCodeSpecificSections(key).then((r) => {

                            this.codeToBind = r[0].providedString as any;
                            this.data.fullName = "";
                            var code = this.examTypeList.find(
                                (e) => e.examTypeId == this.data.examTypeId
                            ).code;

                            this.esNameList.push({ examTypeId: sectionCourseLink.sectionCourseLinkId, fullName: code + "-" + this.codeToBind });
                            this.data.fullName = this.esNameList[0].fullName;

                        });


                    })

                }
            }
        }
        else {
            //new incremented code should load if examtype is changed
            this.editFlag++;
            if (this.editFlag > 1) {
                this.data.fullName = this.data.fullName;
            }
        }

    }



    private ids = ""

    cancel() {

        // this.academicsArray.push(
        //     {
        //         assessmentTypeId:'',
        //         assessmentSchemeDetailId:'',
        //         assessmentSchemeMasterId:'', 
        //         examCount: '',
        //         weightage: '',
        //         statusId : 1,

        //     }
        // )
        this.academicsArray = [];
        this.assmentMasterdata={
        assessmentSchemeMasterId :"",
        fullName : "",
        gradingMasterId :"",
        failMasterId : "",
        totalWeightage : 100,
        statusId :0,
        };
        this.$modal.hide("ExamSchedule-add-edit-model");
        this.$emit("submit");
    }


    ///////// changed by Ansa //////

    // ChangeDate(date) {

    //     if (this.IsNewRecord) {
    //         this.dateselect = false;
    //     }
    //     else {
    //         this.dateselect = true;
    //     }

    //     this.exaamdate = new Date(
    //         moment(date).format("YYYY-MM-DD")
    //     );


    //     this.getListOfCourse = [];
    //     if (this.data.sectionCourseLinkId.length > 0) {

    //         var key = this.sessionId + '?' + this.campusid + '?' + this.programDetailId + '?' + this.data.classId + '?' + this.data.sectionCourseLinkId + '?' + this.exaamdate.toLocaleDateString()
    //         this.repository.GetCoursesFromTimetable(key).then((r) => {

    //             this.getListOfCourse = r as Array<GetCourseFromTimetable>;


    //         });
    //     }

    //     else {
    //         //// for All sections///////////

    //         var key = this.sessionId + '?' + this.campusid + '?' + this.programDetailId + '?' + this.data.classId + '?' + this.forAllSectionId + '?' + this.exaamdate.toLocaleDateString()
    //         this.repository.GetCoursesFromTimetable(key).then((r) => {

    //             this.getListOfCourse = r as Array<GetCourseFromTimetable>;


    //         });


    //     }


    // }
    ////////////by Ansa////////
    enablecourselist()
    {
    this.enablelistcourse=true;
    }




    CheckexamMarking() {
        var param = this.courseId + '?' + this.data.sectionCourseLinkId + '?' + this.data.fullName
        this.repository.CheckSubjectExamMarking(param).then((r) => {

            this.exammarking = r as Array<GetCourseListByTimetable>;

            if (this.exammarking.length > 0) {
                this.msgShow = this.exammarking[0].response;
                this.activeDayoff = true;
                this.disablebuuton = true;

            }
            else {
                this.activeDayoff = false;
                this.dateselect = false;
                this.disablebuuton = false;

            }

        });
    }
    

    CheckExamApproved() {
        var param = this.data.sectionCourseLinkId + '?' + this.data.fullName
        this.repository.CheckExamIsApproved(param).then((r) => {

            this.exammarking = r as Array<GetCourseListByTimetable>;

            if (this.exammarking.length > 0) {
                this.msgShow = this.exammarking[0].response;
                this.activeDayoff = true;
                this.disablebuuton = true;

            }
            else {
                this.activeDayoff = false;
                this.dateselect = false;
                this.disablebuuton = false;

            }

        });
    }

    loadAssesmentscduleList() {
      ;
      var key = this.assessmentSchedulingDetailId + '?' + this.assessmentSectionMapId;
      this.assementscedulerepo.GetAssessmentSceduleList(key).then(r => {
        this.assementsecdulelistdata =  r as Array<GetassesmentSceduleData>;
         this.assessmentSectionMapList =  r as Array<GetassesmentSceduleData>;
        //  this.assessmentSectionMapListFilter =  r as Array<GetassesmentSceduleData>;
// console.log(this.assessmentSectionMapListFilter,'New Filter Data')
      //   this.assesmentScemeMasterlistEx = new IAssessmentSchemeMasterList;
      
      });
    }
    


    loadAssesmentListDataex() {
      this.assementsecdulelist = [];
;
// this.assessmentSchemeMasterId='e8777782-1091-4b69-afe9-8f3fad539462';
// this.assessmentSchedulingDetailId='0d61f893-9859-4816-b26e-a09d9706cce9';
// this.examName='Monthly Test';
     
      
          var key = this.assessmentSchedulingDetailId + "?" + this.assessmentSectionMapId ;
          this.assementscedulerepo.GetassesmentSceduleData(key)
              .then(r => {
                  this.assementsecdulelist = r as Array<Assesmentsecdulelistdata>
                 this.gradingPolicy=this.assementsecdulelist[0].gradingCriteria;
                 this.passCriteria=this.assementsecdulelist[0].failMasterCriteria;
                 this.totalWeightage=this.assementsecdulelist[0].weightage;
                 this.assessmentName=this.assementsecdulelist[0].assessmentName;
                 this.assessmentType=this.assementsecdulelist[0].assessmentType;
                 this.Month=this.assementsecdulelist[0].month; 
                 this.assessmentSchedulingDetailId=this.assementsecdulelist[0].assessmentSchedulingDetailId;

              });
      
    }
    //////////changed by Ansa ////////////////
    // dayoffdata(datee) {
      

    //     this.activeDayoff = false;
    //     this.exaamdate = new Date(
    //         moment(datee).format("YYYY-MM-DD")
    //     );
    //     if (!this.IsNewRecord) {

    //         var key = this.sessionId + '?' + this.campusid + '?' + this.programDetailId + '?' + this.data.classId + '?' + this.data.sectionCourseLinkId + '?' + this.exaamdate.toLocaleDateString()

    //         this.repository.GetCoursesbyTimetablee(key).then((r) => {
    //             this.courseList = r as Array<GetCourseListByTimetable>;



    //             if (this.courseList.length == 0) {
    //                 this.activeDayoff = false;
    //             }
    //             else {

    //                 this.msgShow = this.courseList[0].response;

    //                 this.activeDayoff = true;

    //             }


    //         });

    //     }
    // }
    // else 
    GetCourseList(datee) {

        if (this.cousridcheck != '') {
            this.activeDayoff = false;
            this.exaamdate = new Date(
                moment(datee).format("YYYY-MM-DD")
            );
            if (this.data.sectionCourseLinkId.length > 0) {
                ////////check already existance of same subject in examschedual with same date//////
                var param = this.data.courseId  + '?'+this.exaamdate.toLocaleDateString() + '?' + this.data.fullName + '?' + this.data.sectionCourseLinkId

                this.repository.CheckAlreadyExistingSubject(param).then((r) => {
                    this.iscourseentered = r as Array<GetCourseListByTimetable>;

                    if (this.iscourseentered.length > 0) {
                        this.msgShow = this.iscourseentered[0].response;

                        this.activeDayoff = true;
                    }

                });

            }

            //////////////////for all sections///////////
            else {

                var param = this.data.courseId + '?' + this.exaamdate.toLocaleDateString() + '?' + this.data.fullName + '?' + this.forAllSectionId

                this.repository.CheckAlreadyExistingSubject(param).then((r) => {
                    this.iscourseentered = r as Array<GetCourseListByTimetable>;

                    if (this.iscourseentered.length > 0) {
                        this.msgShow = this.iscourseentered[0].response;

                        this.activeDayoff = true;

                    }

                });

            }
        }
        else {
            this.cousridcheck = this.data.courseId;
        }

    }
    //}



    checkdayoff() {
;
        //var checkdayoff = false;
        this.enablelistcourse=false;
        this.activeDayoff = false;
        this.exaamdate = new Date(
            moment(this.data.examDate).format("YYYY-MM-DD")
        );

        if (this.data.sectionCourseLinkId.length > 0) {
            //////// check day off//////////
            var key = this.sessionId + '?' + this.campusid + '?' + this.programDetailId + '?' + this.data.classId + '?' + this.data.sectionCourseLinkId + '?' + this.exaamdate.toLocaleDateString()

            this.repository.GetCoursesbyTimetablee(key).then((r) => {
                this.courseList = r as Array<GetCourseListByTimetable>;


                if (this.courseList.length > 0) {
                    this.msgShow = this.courseList[0].response;

                    this.activeDayoff = true;

                    //return (checkdayoff=true)
                }
                else {

                    this.activeDayoff = false;
                    //return (checkdayoff=false);
                    this.pushToListCourseName();

                }

            });
        }
        else { ///////////check dayyof for all sections
            var key = this.sessionId + '?' + this.campusid + '?' + this.programDetailId + '?' + this.data.classId + '?' + this.forAllSectionId + '?' + this.exaamdate.toLocaleDateString()

            this.repository.GetCoursesbyTimetablee(key).then((r) => {
                this.courseList = r as Array<GetCourseListByTimetable>;


                if (this.courseList.length > 0) {
                    this.msgShow = this.courseList[0].response;

                    this.activeDayoff = true;
                }
                else {

                    this.activeDayoff = false;
                    this.pushToListCourseName();

                }

            });
        }

    }

    addAcademics() {
        

this.assessmentSectionMapListEx=this.assessmentSectionMapList

      this.assessmentSectionMapList.push(
        {
          assessmentScheduleId: '',
          assessmentStatus: 8,
          assessmentSchedulingDetailId: '',
          totalMarks: 0,
          programCourseLinkId: '',
          statusId: 1,
          assessmentSectionMapId : '',
          scheduleDate: new Date,
          //programCourseLinkId: this.courseLists.find(e => e.programCourseLinkId == this.assesmentscedulelistasgin.programCourseLinkId).courseName

        }
    )
    //this.assesmentscedulelistasgin.programCourseLinkId=null;

    }

// addAcademics() {
//     
//     // Check if the selected course already exists in assessmentSectionMapList
//     var  isCourseAlreadySelected =0
//     isCourseAlreadySelected = this.assessmentSectionMapList.filter(item => item.programCourseLinkId === this.assesmentscedulelistasgin.programCourseLinkId).length;
//     console.log('Selected Course Link ID:', this.assesmentscedulelistasgin.programCourseLinkId);
//     console.log('Existing Courses Link IDs:', this.assessmentSectionMapList.map(item => item.programCourseLinkId));
//     if (isCourseAlreadySelected > 1) {
//       this.$store.dispatch(StoreTypes.updateStatusBar, {
//         text: "Record Already Exists",
//         title: "Warning",
//         messageTypeId: PayloadMessageTypes.warning
//       });
//       return; // Return early if the course is already selected
//     }
  
//     this.assessmentSectionMapList.push({
//       assessmentScheduleId: '',
//       assessmentStatus: 8,
//       assessmentSchedulingDetailId: '',
//       totalMarks: 0,
//       programCourseLinkId: this.assesmentscedulelistasgin.programCourseLinkId,
//       statusId: 1,
//       assessmentSectionMapId: '',
//       scheduleDate: new Date(),
//     });
//   }
  

addAcademicsex( index: number) {
    
    {
        const selectedLinkId = this.assesmentscedulelistasgin.programCourseLinkId;
        if(index>0){
    var selectdata
    var dataselect
    dataselect =this.assessmentSectionMapList[index].programCourseLinkId;
   // dataselect =this.assessmentSectionMapList.map(item => item.programCourseLinkId)

    // Check if the selected course already exists in assessmentSectionMapList
    const isCourseAlreadySelected = this.assessmentSectionMapList.find(item => item.programCourseLinkId ===  dataselect);
  
  
    if (isCourseAlreadySelected) {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Record Already Exists",
        title: "Warning",
        messageTypeId: PayloadMessageTypes.error
      });
      return; // Return early if the course is already selected
    }
}
    // this.assessmentSectionMapList.push({
    //   assessmentScheduleId: '',
    //   assessmentStatus: 8,
    //   assessmentSchedulingDetailId: '',
    //   totalMarks: 0,
    //   programCourseLinkId: selectedLinkId,
    //   statusId: 1,
    //   assessmentSectionMapId: '',
    //   scheduleDate: new Date(),
    // });
}
// else
// {
//     
//     this.assessmentSectionMapList.push({
//         assessmentScheduleId: '',
//         assessmentStatus: 8,
//         assessmentSchedulingDetailId: '',
//         totalMarks: 0,
//         programCourseLinkId: '',
//         statusId: 1,
//         assessmentSectionMapId: '',
//         scheduleDate: new Date(),
//       });
// }
  }
  

//   GetCourseListEx(programCourseLinkId : any,index :number)
  
//   {
//     
//     this.courseLists.find(item => item.programCourseLinkId === programCourseLinkId)
//     this.courseLists.splice(index, 1)

//   }

getAvailableCourses(index) {
    
    const selectedCourseIds = this.assessmentSectionMapList
      .slice(0, index) // Get items before the current index
      .map(item => item.programCourseLinkId);

    return this.courseLists.filter(course => selectedCourseIds.indexOf(course.programCourseLinkId) === -1);
  }

getAvailableCoursesex(index) {
    
    // Filter out the selected course from courseLists
    const selectedCourseLinkId = this.assessmentSectionMapList[index].programCourseLinkId;
      return this.courseLists.filter(course => course.programCourseLinkId !== selectedCourseLinkId);
  }

  updateCourseLists(newList) {
    const selectedCourseIds = new Set(newList.map(item => item.programCourseLinkId));
    this.courseLists = this.courseLists.filter(course => !selectedCourseIds.has(course.programCourseLinkId));
  }

    GetCourseListEx(programCourseLinkId : any, index:number) {
        
        return this.courseLists.filter(course => course.programCourseLinkId !== this.assessmentSectionMapList[index].programCourseLinkId);
      // Find the index of the course in the courseLists array
    //   const courseIndex = this.courseLists.findIndex(item => item.programCourseLinkId === programCourseLinkId);
  
    //   if (courseIndex !== -1) {
    //     // Remove the course from the courseLists array using splice
    //     this.courseLists.splice(courseIndex, 1);
  
    //   }
  
    //   // Now, if you also want to update the corresponding item in assessmentSectionMapList:
    // //   if (index >= 0 && index < this.assessmentSectionMapList.length) {
    //  this.assessmentSectionMapList[index].programCourseLinkId =programCourseLinkId; // Clear the selected course
    //   }
    }
  
  



    getTotalWeightage() {
      
      var key= this.academicsArray.reduce((total, item) => total + (item.weightage ? parseFloat(item.weightage) : 0), 0);
      return key;
    }


    // deleteAcademics(i) {
    //     ;
    //     this.assessmentSectionMapList.splice(i, 1)
    //     this.assessmentSectionMapList[i].statusId=2;
    //     console.log( this.assessmentSectionMapList[i],'dataaaaaaaaaaaaaa')
    //     // this.assessmentSectionMapList[i].statusId=2;
    //     this.assementscedulerepo.Update(this.assessmentSectionMapList[i]).then(() => {
    //         this.$store.dispatch(StoreTypes.updateStatusBar, {
    //                     text: "Record has been Deleted successfully",
    //                     title: "Success",
    //                     messageTypeId: PayloadMessageTypes.success
    //                   });
    //                 //   this.cancel();
    //     });
    

    // }
    deleteAcademics(i) {
      
      if (i >= 0 && i < this.assessmentSectionMapList.length) {
          this.assessmentSectionMapList[i].statusId = 2;
          this.assementscedulerepo.Update(this.assessmentSectionMapList[i]).then(() => {
            //   this.$store.dispatch(StoreTypes.updateStatusBar, {
            //       text: "Record has been Deleted successfully",
            //       title: "Success",
            //       messageTypeId: PayloadMessageTypes.success
            //   });
          });
          this.assessmentSectionMapList.splice(i, 1); // Move the splice after modifying the element
      } else {
          console.error("Invalid index provided for deleteAcademics");
      }
  }
  

    
    deleteAcademicsEx(i) {
      ;
      this.academicsArray.splice(i, 1)
      this.academicsArray[i].statusId=2;
      this.AssesmentSchmeDetailRepo.Update(this.academicsArray[i]).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
                      text: "Record has been Deleted successfully",
                      title: "Success",
                      messageTypeId: PayloadMessageTypes.success
                    });
                  //   this.cancel();
      });

  }

    deleteModel() {
        ;
        this.data.statusId = 2;
        this.repository.Update(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been Deleted successfully",
            title: "Deleted",
            messageTypeId: PayloadMessageTypes.success
          });
          this.cancel();
        });
    
        this.cancel();
      }
    saveModelNew() {
       debugger ;
        this.$v.$touch();
        // if (!this.$v.$invalid) {
          if (this.IsNewRecord) {

            let totalWeightage = 0;

            for (var i=0; i < this.academicsArray.length; i++) {

               totalWeightage += parseFloat(this.academicsArray[i].weightage);
               console.log(totalWeightage,'totaldata')
            
           }
           if (totalWeightage >100 || totalWeightage < 100) {
            console.log('kjldsjfldsjfldsjflk')
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select Correct  Weightage",
                title: "Error",
                messageTypeId: PayloadMessageTypes.error
            });
            return 0;
        }

          
            this.assmentMasterdata.assessmentSchemeMasterId = helper.newGuid();
            this.assmentMasterdata.statusId = 1;
            this.AssesmentSchmeMastrRepo.AddOne(this.assmentMasterdata).then(() => {
                ;
               
                
                     });

                     for (var i=0; i < this.academicsArray.length; i++) {

                     if (this.academicsArray[i].assessmentTypeId == '') {
                        console.log('kjldsjfldsjfldsjflk')
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Please enter Correct weitage",
                            title: "Success",
                            messageTypeId: PayloadMessageTypes.error
                          });
                        return 0;
                    }
                    }
                    // var key =   this.assmentMasterdata.assessmentSchemeMasterId + "?" +  JSON.stringify(this.academicsArray) ;
                    // this.AssesmentSchmeDetailRepo.AddassmentDetail(key).then(() => {
                    //     this.$store.dispatch(StoreTypes.updateStatusBar, {
                    //                 text: "Record has been inserted successfully",
                    //                 title: "Success",
                    //                 messageTypeId: PayloadMessageTypes.success
                    //               });
                    //               this.cancel();
                    // });
                        for (var i=0; i < this.academicsArray.length; i++) {
                            ;
                            this.assmentdetaildatalist.assessmentSchemeDetailId= helper.newGuid();
                            this.assmentdetaildatalist.assessmentTypeId=this.academicsArray[i].assessmentTypeId ;
                            this.assmentdetaildatalist.weightage=this.academicsArray[i].weightage ;
                            this.assmentdetaildatalist.examCount=this.academicsArray[i].examCount ;
                            this.assmentdetaildatalist.assessmentSchemeMasterId= this.assmentMasterdata.assessmentSchemeMasterId;
                            this.assmentdetaildatalist.statusId=1;
                            this.AssesmentSchmeDetailRepo.AddOne(this.assmentdetaildatalist).then(() => {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                            text: "Record has been inserted successfully",
                                            title: "Success",
                                            messageTypeId: PayloadMessageTypes.success
                                          });
                                          this.cancel();
                            });
                             
                         }
                    
                
                    // this.AddStudentList.obtainmark.forEach( item => {
                    //   
                    //   if(item.obtainedMarks < this.AddStudentList.passingMarks)
                    //   {
                    //     item.statusId=5
                    //   }
                    //   //item.testDetailId = uuidv4();
                    //   //this.studen
                    //   this.AssesmentSchmeMastrRepo.AddOne(this.assmentMasterdata).then(() => {
                    //     this.$store.dispatch(StoreTypes.updateStatusBar, {
                    //         text: "Record has been inserted successfully",
                    //         title: "Success",
                    //         messageTypeId: PayloadMessageTypes.success
                    //       });
                    //       this.cancel();
          
                    //   })
                    // });
          
          
                   
                
             
          } 
          
          else {
            ;
            if (this.isActive == true) {
              this.data.statusId = 1;
            } else {
              this.data.statusId = 0;
            }
            let totalWeightage = 0;
            for (var i=0; i < this.academicsArray.length; i++) {

                totalWeightage += parseFloat(this.academicsArray[i].weightage);
                console.log(totalWeightage,'totaldata')
             
            }
            if (totalWeightage >100 || totalWeightage < 100) {
             console.log('kjldsjfldsjfldsjflk')
             this.$store.dispatch(StoreTypes.updateStatusBar, {
                 text: "Please select Correct  Weightage",
                 title: "Error",
                 messageTypeId: PayloadMessageTypes.error
             });
             return 0;
            }
            this.assmentMasterdata.statusId = 1;
            this.AssesmentSchmeMastrRepo.Update(this.assmentMasterdata).then(() => {
            });
          

        
            for (var i=0; i < this.academicsArray.length; i++) {
                
                this.assmentdetaildatalist.assessmentSchemeDetailId=this.academicsArray[i].assessmentSchemeDetailId ;
                this.assmentdetaildatalist.assessmentTypeId=this.academicsArray[i].assessmentTypeId ;
                this.assmentdetaildatalist.weightage=this.academicsArray[i].weightage ;
                this.assmentdetaildatalist.examCount=this.academicsArray[i].examCount ;
                this.assmentdetaildatalist.assessmentSchemeMasterId= this.assmentMasterdata.assessmentSchemeMasterId;
                this.assmentdetaildatalist.statusId=1;
                this.AssesmentSchmeDetailRepo.Update(this.assmentdetaildatalist).then(() => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: "Record has been Updated successfully",
                                title: "Success",
                                messageTypeId: PayloadMessageTypes.success
                              });
                              this.cancel();
                });
                 
             }
           
          
          }
    
          this.cancel();
        // }
      }

     
      newsavemodel(){
debugger
        this.$v.$touch();
        
        if (this.IsNewRecord){
            
        if(this.assessmentSectionMapId.length=== 0)
        {
this.assessmentSectionList.forEach (element => {
    debugger;
          for (var i = 0; i < this.assessmentSectionMapList.length; i++) {
            if (this.assessmentSectionMapList[i].programCourseLinkId.length == 0) {
              this.$store.dispatch(StoreTypes.updateStatusBar, {
                  text: "Please select course",
                  title: "Error",
                  messageTypeId: PayloadMessageTypes.error,
              });
              return 0;
          }
          

          
          if (this.assessmentSectionMapList[i].scheduleDate.toString().length == 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Date is mandatory",
                title: "Error",
                messageTypeId: PayloadMessageTypes.error,
            });
            return 0;
        }
        if (this.assessmentSectionMapList[i].totalMarks < 1) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Total Marks should be greater than 0",
                title: "Error",
                messageTypeId: PayloadMessageTypes.error,
            });
            return 0;
        }
        debugger;
        this.assesmentscedulelistasgin.assessmentScheduleId=helper.newGuid();;
        this.assesmentscedulelistasgin.programCourseLinkId=this.assessmentSectionMapList[i].programCourseLinkId;
        this.assesmentscedulelistasgin.totalMarks=this.assessmentSectionMapList[i].totalMarks;
        this.assesmentscedulelistasgin.scheduleDate=this.assessmentSectionMapList[i].scheduleDate;
        this.assesmentscedulelistasgin.statusId=1;
        this.assesmentscedulelistasgin.assessmentStatus=8;
        this.assesmentscedulelistasgin.assessmentSchedulingDetailId=this.assessmentSchedulingDetailId;
        this.assesmentscedulelistasgin.assessmentSectionMapId= element.assessmentSectionMapId;

        
        // const isCombinationExists = this.assessmentSectionListEx.some(item =>
        //     item.assessmentSchedulingDetailId === this.assesmentscedulelistasgin.assessmentSchedulingDetailId &&
        //     item.assessmentSectionMapId === this.assesmentscedulelistasgin.assessmentSectionMapId
        //   );
          
        // if (isCombinationExists) {
        //     const existingItem = this.assessmentSectionListEx.find(item =>
        //       item.assessmentSchedulingDetailId === this.assesmentscedulelistasgin.assessmentSchedulingDetailId &&
        //       item.assessmentSectionMapId === this.assesmentscedulelistasgin.assessmentSectionMapId
        //     );
          
        //     const assessmentName = existingItem.assessmentName;
        //     const sectionName = existingItem.sectionName;
          
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //       text: ` ${assessmentName} has been already  scheduled : ${sectionName}.Kindly use Edit/Delete option to update/delete the record.`,
        //       title: "Error",
        //       messageTypeId: PayloadMessageTypes.error,
        //     });
          
        //     return 0;
        //   }

        
// else
// {

  
//         this.assementscedulerepo.AddOne(this.assesmentscedulelistasgin).then(() => {
//           this.$store.dispatch(StoreTypes.updateStatusBar, {
//                       text: "Record has been inserted successfully",
//                       title: "Success",
//                       messageTypeId: PayloadMessageTypes.success
//                     });
//                     this.cancel();
//       });
//     }
for (let i = 0; i < this.assessmentSectionList.length; i++) {
      const currentSectionMapId = this.assessmentSectionList[i].assessmentSectionMapId;

    // const currentSectionMapId = this.assessmentSectionMapId[i];
    
  
    const isCombinationExists = this.assessmentSectionListEx.some(item =>
      item.assessmentSchedulingDetailId === this.assesmentscedulelistasgin.assessmentSchedulingDetailId &&
      item.assessmentSectionMapId === currentSectionMapId
    );
  
    if (isCombinationExists) {
      const existingItem = this.assessmentSectionListEx.find(item =>
        item.assessmentSchedulingDetailId === this.assesmentscedulelistasgin.assessmentSchedulingDetailId &&
        item.assessmentSectionMapId === currentSectionMapId
      );
  
      const assessmentName = existingItem.assessmentName;
      const sectionName = existingItem.sectionName;
  
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: ` ${assessmentName} has  been already scheduled  for ${sectionName}. Kindly use Edit/Delete option to update/delete the record.`,
        title: "Error",
        messageTypeId: PayloadMessageTypes.error,
      });
  
      return 0;
    }
  }
  
  // If none of the combinations exist, proceed with saving
  this.assementscedulerepo.AddOne(this.assesmentscedulelistasgin).then(() => {
    this.$store.dispatch(StoreTypes.updateStatusBar, {
      text: "Record has been inserted successfully",
      title: "Success",
      messageTypeId: PayloadMessageTypes.success,
    });
    this.cancel();
  });
  

        }
      });
        }

else
{

  this.assessmentSectionMapId.forEach(element => {

    for (var i = 0; i < this.assessmentSectionMapList.length; i++) {
      if (this.assessmentSectionMapList[i].programCourseLinkId.length == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Please select course",
            title: "Error",
            messageTypeId: PayloadMessageTypes.error,
        });
        return 0;
    }

    if (this.assessmentSectionMapList[i].scheduleDate.toString().length == 0) {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Date is mandatory",
          title: "Error",
          messageTypeId: PayloadMessageTypes.error,
      });
      return 0;
  }
  if (this.assessmentSectionMapList[i].totalMarks < 1) {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Total Marks should be greater than 0",
          title: "Error",
          messageTypeId: PayloadMessageTypes.error,
      });
      return 0;
  }
  debugger;

  this.assesmentscedulelistasgin.assessmentScheduleId=helper.newGuid();
  this.assesmentscedulelistasgin.programCourseLinkId=this.assessmentSectionMapList[i].programCourseLinkId;
  this.assesmentscedulelistasgin.totalMarks=this.assessmentSectionMapList[i].totalMarks;
  this.assesmentscedulelistasgin.scheduleDate=this.assessmentSectionMapList[i].scheduleDate;
  this.assesmentscedulelistasgin.statusId=1;
  this.assesmentscedulelistasgin.assessmentStatus=8;
  this.assesmentscedulelistasgin.assessmentSchedulingDetailId=this.assessmentSchedulingDetailId;
  this.assesmentscedulelistasgin.assessmentSectionMapId= element;
debugger;

// const isCombinationExists = this.assessmentSectionListEx.some(item =>
//     item.assessmentSchedulingDetailId === this.assesmentscedulelistasgin.assessmentSchedulingDetailId &&
//     item.assessmentSectionMapId === this.assesmentscedulelistasgin.assessmentSectionMapId
//   );
  
//   if (isCombinationExists) {
//     const existingItem = this.assessmentSectionListEx.find(item =>
//       item.assessmentSchedulingDetailId === this.assesmentscedulelistasgin.assessmentSchedulingDetailId &&
//       item.assessmentSectionMapId === this.assesmentscedulelistasgin.assessmentSectionMapId
//     );
  
//     const assessmentName = existingItem.assessmentName;
//     const sectionName = existingItem.sectionName;
  
//     this.$store.dispatch(StoreTypes.updateStatusBar, {
//       text: ` ${assessmentName} has been already 345 scheduled : ${sectionName}.Kindly use Edit/Delete option to update/delete the record.`,
//       title: "Error",
//       messageTypeId: PayloadMessageTypes.error,
//     });
  
//     return 0;
//   }

//   else
//   {

  
//   this.assementscedulerepo.AddOne(this.assesmentscedulelistasgin).then(() => {
//     this.$store.dispatch(StoreTypes.updateStatusBar, {
//                 text: "Record has been inserted successfully",
//                 title: "Success",
//                 messageTypeId: PayloadMessageTypes.success
//               });
//               this.cancel();
// });
//}
for (let i = 0; i < this.assessmentSectionMapId.length; i++) {
    const currentSectionMapId = this.assessmentSectionMapId[i];
  
    const isCombinationExists = this.assessmentSectionListEx.some(item =>
      item.assessmentSchedulingDetailId === this.assesmentscedulelistasgin.assessmentSchedulingDetailId &&
      item.assessmentSectionMapId === currentSectionMapId
    );
  
    if (isCombinationExists) {
      const existingItem = this.assessmentSectionListEx.find(item =>
        item.assessmentSchedulingDetailId === this.assesmentscedulelistasgin.assessmentSchedulingDetailId &&
        item.assessmentSectionMapId === currentSectionMapId
      );
  
      const assessmentName = existingItem.assessmentName;
      const sectionName = existingItem.sectionName;
  
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: ` ${assessmentName} has  been already  scheduled   for ${sectionName}. Kindly use Edit/Delete option to update/delete the record.`,
        title: "Error",
        messageTypeId: PayloadMessageTypes.error,
      });
  
      return 0;
    }
  }
  
  // If none of the combinations exist, proceed with saving
  this.assementscedulerepo.AddOne(this.assesmentscedulelistasgin).then(() => {
    this.$store.dispatch(StoreTypes.updateStatusBar, {
      text: "Record has been inserted successfully",
      title: "Success",
      messageTypeId: PayloadMessageTypes.success,
    });
    this.cancel();
  });
  }
    
  });
}
  }
  

  else{
    for (var i = 0; i < this.assessmentSectionMapList.length; i++) {
      if (this.assessmentSectionMapList[i].programCourseLinkId.length == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Please select course",
            title: "Error",
            messageTypeId: PayloadMessageTypes.error,
        });
        return 0;
    }

    if (this.assessmentSectionMapList[i].scheduleDate.toString().length == 0) {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Date is mandatory",
          title: "Error",
          messageTypeId: PayloadMessageTypes.error,
      });
      return 0;
  }
  if (this.assessmentSectionMapList[i].totalMarks < 1) {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Total Marks should be greater than 0",
          title: "Error",
          messageTypeId: PayloadMessageTypes.error,
      });
      return 0;
  }

  if(this.assessmentSectionMapList[i].assessmentScheduleId==='')
  {
    this.assesmentscedulelistasgin.assessmentScheduleId=helper.newGuid();
    this.assesmentscedulelistasgin.programCourseLinkId=this.assessmentSectionMapList[i].programCourseLinkId;
    this.assesmentscedulelistasgin.totalMarks=this.assessmentSectionMapList[i].totalMarks;
    this.assesmentscedulelistasgin.scheduleDate=this.assessmentSectionMapList[i].scheduleDate;
    this.assesmentscedulelistasgin.statusId=1;
    this.assesmentscedulelistasgin.assessmentStatus=8;
    this.assesmentscedulelistasgin.assessmentSchedulingDetailId=this.assessmentSchedulingDetailId;
    this.assesmentscedulelistasgin.assessmentSectionMapId= this.assessmentSectionMapId;
    this.assementscedulerepo.AddOne(this.assesmentscedulelistasgin).then(() => {
                this.cancel();
  });
  }
  this.assesmentscedulelistasgin.assessmentScheduleId=this.assessmentSectionMapList[i].assessmentScheduleId;
  this.assesmentscedulelistasgin.programCourseLinkId=this.assessmentSectionMapList[i].programCourseLinkId;
  this.assesmentscedulelistasgin.totalMarks=this.assessmentSectionMapList[i].totalMarks;
  this.assesmentscedulelistasgin.scheduleDate=this.assessmentSectionMapList[i].scheduleDate;
  this.assesmentscedulelistasgin.statusId=1;
  this.assesmentscedulelistasgin.assessmentStatus=8;
  this.assesmentscedulelistasgin.assessmentSchedulingDetailId=this.assessmentSchedulingDetailId;
  this.assesmentscedulelistasgin.assessmentSectionMapId= this.assessmentSectionMapId;
  this.assementscedulerepo.Update(this.assesmentscedulelistasgin).then(() => {
    this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record has been Updated successfully",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
              });
              this.cancel();
});
  }
  }
      }

    saveModel() {
 
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                //INSERT FOR ALL SECTIONS



                if (this.forAllSection) {


                    this.sectionCourseLinkList.forEach(sectionCourseLink => {
                        if (sectionCourseLink.sectionCourseLinkId.length > 10) {
                            for (var i = 0; i < this.examScheduleListCourseName.length; i++) {
                                this.examScheduleListCourseName[i].examScheduleId = helper.newGuid();
                                this.examScheduleListCourseName[i].statusId = 1;
                                this.examScheduleListCourseName[i].sectionCourseLinkId = sectionCourseLink.sectionCourseLinkId;

                                if (this.examScheduleListCourseName[i].courseId.length == 0) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Please select course",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }
                                if (this.examScheduleListCourseName[i].examDate.toString().length == 0) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Date is mandatory",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }
                                if (this.examScheduleListCourseName[i].totalMarks < 1) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Total Marks should be greater than 0",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }
                                if (
                                    this.examScheduleListCourseName.filter((s) => s.fullName == this.examScheduleListCourseName[i].fullName && s.courseId == this.examScheduleListCourseName[i].courseId).length > 1) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Duplicate Course",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }

                                this.examScheduleListCourseName[i].examTypeId = this.data.examTypeId;

                                this.examScheduleListCourseName[i].fullName = this.esNameList.find(e => e.examTypeId == sectionCourseLink.sectionCourseLinkId).fullName;
                                this.examScheduleListCourseName[i].failMasterId = this.data.failMasterId;
                                this.examScheduleListCourseName[i].gradingMasterId = this.data.gradingMasterId;
                                this.examScheduleListCourseName[i].examDate = new Date(moment(this.examScheduleListCourseName[i].examDate).format("YYYY-MM-DD"));
                                this.examScheduleListCourseName[i].month = this.data.month;

                                this.repository.AddOne(this.examScheduleListCourseName[i]).then(() => {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Record has been inserted successfully",
                                        title: "Success",
                                        messageTypeId: PayloadMessageTypes.success,
                                    });
                                    this.$emit("submit");
                                    this.cancel();
                                });
                            }
                        }
                    });




                } //INSERT FOR SINGLE SECTION
                else {
                    this.SectionCourseLinkIdleng = this.data.sectionCourseLinkId.length;
                    this.SectionCourseLinkIdListarray = this.data.sectionCourseLinkId.toString().replace("[", "").replace("]", "").split(",");

                    this.SectionCourseLinkIdListarray.forEach(sectionCourseLinkId => {
                        if (sectionCourseLinkId.length > 10) {
                            for (var i = 0; i < this.examScheduleListCourseName.length; i++) {
                                this.examScheduleListCourseName[i].examScheduleId = helper.newGuid();
                                this.examScheduleListCourseName[i].statusId = 1;
                                this.examScheduleListCourseName[i].sectionCourseLinkId = sectionCourseLinkId;

                                if (this.examScheduleListCourseName[i].courseId.length == 0) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Please select course",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }
                                if (this.examScheduleListCourseName[i].examDate.toString().length == 0) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Date is mandatory",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }
                                if (this.examScheduleListCourseName[i].totalMarks < 1) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Total Marks should be greater than 0",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }
                                if (
                                    this.examScheduleListCourseName.filter((s) => s.fullName == this.examScheduleListCourseName[i].fullName && s.courseId == this.examScheduleListCourseName[i].courseId).length > 1) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Duplicate Course",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }
                                if (!this.isExistingNew) {
                                    this.examScheduleListCourseName[i].examTypeId = this.data.examTypeId;
                                    this.examScheduleListCourseName[i].fullName = this.esNameList.find(e => e.examTypeId == sectionCourseLinkId).fullName;

                                    this.examScheduleListCourseName[i].failMasterId = this.data.failMasterId;
                                    this.examScheduleListCourseName[i].gradingMasterId = this.data.gradingMasterId;
                                    this.examScheduleListCourseName[i].examDate = new Date(moment(this.examScheduleListCourseName[i].examDate).format("YYYY-MM-DD"));
                                    this.examScheduleListCourseName[i].month = this.data.month;
                                }
                                else {

                                    this.examScheduleListCourseName[i].examTypeId = this.data.examTypeId;
                                    this.examScheduleListCourseName[i].fullName = this.data.fullName;

                                    this.examScheduleListCourseName[i].failMasterId = this.data.failMasterId;
                                    this.examScheduleListCourseName[i].gradingMasterId = this.data.gradingMasterId;
                                    this.examScheduleListCourseName[i].examDate = new Date(moment(this.examScheduleListCourseName[i].examDate).format("YYYY-MM-DD"));
                                    this.examScheduleListCourseName[i].month = this.data.month;

                                }
                                this.repository.AddOne(this.examScheduleListCourseName[i]).then(() => {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Record has been inserted successfully",
                                        title: "Success",
                                        messageTypeId: PayloadMessageTypes.success,
                                    });
                                    this.$emit("submit");
                                    this.cancel();
                                });
                            }
                        }
                    });


                }
            }

            else {
            

                if (this.isActive == true) {
                    this.data.statusId = 1;
                } else {
                    this.data.statusId = 0;
                }
                this.data.examDate = new Date(moment(this.data.examDate).format("YYYY-MM-DD"));

                var key = this.data.examScheduleId + '?' + this.data.totalMarks
                this.repository.UpdateExamMasterwithExamschedul(key).then((r) => {

                    this.updatemarks = r as Array<UpdatemarksResponse>;

                    if (this.updatemarks[0].pg_catalog == 0) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Total Marks are Less than from Obtained Marks",
                            title: "Error",
                            messageTypeId: PayloadMessageTypes.error,
                        });

                    }
                    else {

                        this.repository.Update(this.data)
                            .then(() => {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: "Record has been updated successfully",
                                    title: "Success",
                                    messageTypeId: PayloadMessageTypes.success,
                                });
                                this.$emit("submit");
                                this.cancel();
                            });

                    }
                });


            }
            this.cancel();
        }
    }
    get allowSubmit() {
        return true;
    }
    $v: any;

      
     
}
function handler(newList: any) {
    throw new Error("Function not implemented.");
}

