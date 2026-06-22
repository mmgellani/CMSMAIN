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

import {
  IAdmissionAdmissionForm,
  IAdmissionStudents,
  ISetupGender,
  IAcademicInfo,
  IAddressJsonB,
  ISetupBloodGroup,
  ISetupReligion,
  ISetupAdmissionType,
  IGuardianJsonB,
  IAdmissionAdmissionFormVM,
  ISetupCampusProgramLinkVM,
  IAdmissionEligibilityCriteria,
  IAdmissionEligibilityCriteriaVM,
  CheckFeeExist,
  ISetupBoard,
  IFeeStudentChallan,
  StudentReportData,
  ICampusCityVM,
  DDLModel,
  ISetupCampusProgramLink,
  IMarks,
  StudentChallanReport,
  ICampusBank,
  IFeeCampusChallanNoteLinkVM,
  IAdmissionFormData,
  ISetupClass,
  IRegistrationSectionCourseLinkList
} from "../../../../models";
import {
  AdmissionAdmissionFormService,
  SetupGenderService,
  AdmissionStudentsService,
  SetupBloodGroupService,
  SetupReligionService,
  SetupAdmissionTypeService,
  SetupCampusProgramLinkService,
  AdmissionEligibilityCriteriaService,
  SetupBoardService,
  FeeStudentChallanService,
  SetupCampusService,
  FeeStudentFeeStructureService,
  FeeCampusBankLinkService,
  FeeCampusChallanNoteLinkService,
  SetupClassService,
  RegistrationSectionCourseLinkService
} from "../../../../service";

import * as helper from "../../../../helper";
import { ISetupDegree } from "../../../../models/Setup/Degree";
import { ISetupGroup } from "../../../../models/Setup/Group";
import { ISetupPassStatus } from "../../../../models/Setup/PassStatus";
import { SetupDegreeService } from "../../../../service/Setup/Degree";
import { SetupGroupService } from "../../../../service/Setup/Group";
import { SetupPassStatusService } from "../../../../service/Setup/PassStatus";
import { IPhoneNumber } from "../../../Setup/Address/add-edit";
import { JwtBearerFlow } from "client-oauth2";
import { DEFAULT_ECDH_CURVE } from "tls";
import { StringifyOptions } from "querystring";
import { ReportsService } from "../../../../service/Reports/AdmissionReports";
import { ReportEngine } from "../../../../../../components/report/report-engine";
import { IRootStoreState } from "../../../../../store";
import { State } from "vuex-class";

type ValidateAdmissionAdmissionForm = {
  model: IAdmissionAdmissionForm;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateAdmissionAdmissionForm> = {
  model: {
    fullName: { required },
    fatherName: { required }
  }
};

export interface IAdmissionCollect {
  AdmissionForm: IAdmissionAdmissionForm;
  Student: IAdmissionStudents;
  ClassId: string;
  Sectioncourseid:string;
  Enroll:boolean;
  GenerateFee:boolean;
}

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html"),
  components: {
    // "report-engine": ReportEngine
  }
})
export class AdmissionAdmissionFormAddEdit extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  campusId: string = "";
  sessionId: string = "";
  private repository: AdmissionAdmissionFormService;
  private SectionCourseLinkService: RegistrationSectionCourseLinkService = null;
  SectionCourseLinkLIst: Array<IRegistrationSectionCourseLinkList> = [];
  generateFee:boolean=false;


  private genderRepo: SetupGenderService = new SetupGenderService(this.$store);
  private degreeRepo: SetupDegreeService = new SetupDegreeService(this.$store);
  private groupRepo: SetupGroupService = new SetupGroupService(this.$store);
  private PassStatusRepo: SetupPassStatusService = new SetupPassStatusService(this.$store);
  private studentRepo: AdmissionStudentsService = new AdmissionStudentsService(this.$store);
  private bloodGroupRepo: SetupBloodGroupService = new SetupBloodGroupService(this.$store);
  private ReligionRepo: SetupReligionService = new SetupReligionService(this.$store);
  private admisisonTypeRepo: SetupAdmissionTypeService = new SetupAdmissionTypeService(this.$store);
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store);
  private EligibilityCriteriakRepo: AdmissionEligibilityCriteriaService = new AdmissionEligibilityCriteriaService(
    this.$store
  );
  private BoardRepository: SetupBoardService = new SetupBoardService(
    this.$store
  );
  private repo: FeeStudentChallanService = new FeeStudentChallanService(this.$store);
  private challanrepository: FeeStudentChallanService;
  private campusCityList: Array<ICampusCityVM> = [];
  private campusddl: Array<DDLModel> = [];
  classList: Array<ISetupClass> = [];
  private repoClass = new SetupClassService(this.$store);
  private classid: string = '';
  private SectionCourseLinkId: string = '';



  private cityDDL: Array<DDLModel> = [];
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private studentfeeRepo: FeeStudentFeeStructureService = new FeeStudentFeeStructureService(this.$store)

  private genderList: Array<ISetupGender> = [];
  private academicInfoList: Array<IAcademicInfo> = [];
  private degreeList: Array<ISetupDegree> = [];
  private groupList: Array<ISetupGroup> = [];
  private stdContactList: Array<IPhoneNumber> = [];
  private parentContactList: Array<IPhoneNumber> = [];
  private addressList: Array<IAddressJsonB> = [];
  private bloodGroupList: Array<ISetupBloodGroup> = [];
  private religionList: Array<ISetupReligion> = [];
  private admissionTypeList: Array<ISetupAdmissionType> = [];
  private campusProgramLinkList: Array<ISetupCampusProgramLinkVM> = [];
  private PassStatusList: Array<ISetupPassStatus> = [];
  private BoardList: Array<ISetupBoard> = [];
  private guardianList: Array<IGuardianJsonB> = [];
  private TempCampusProgramId: string = '';
  private TempAdmissionTypeId: string = '';
  private flag: number = 0;
  private criteria: boolean = false;
  private savedisable: boolean = true;
  private feeDefined: boolean = false;
  private percentage: number = 0;
  private stringedST: string;
  private stringedAD: string;
  private stringed: string;
  private templist: Array<ISetupCampusProgramLink> = [];
  private degreeStatus: boolean = false;
  errorMessage: string = "";
  shouldenroll: boolean = false;
  private val: any;

  private admissionFormModel: Array<IAdmissionAdmissionFormVM> = [];

  private EligibilityCriteriaList: Array<IAdmissionEligibilityCriteriaVM> = [];

  private data: IAdmissionAdmissionForm = {
    admissionFormId: "",
    campusProgramId: "",
    studentId: "",
    admissionTypeId: "",
    admissionDate: new Date(),
    rollNo: "",
    refferenceNo: "",
    statusId: 0,
    loggerId: "",
    studentType:"",
    formNo:"",
    operation:""
  };

  private admissionformVM: IAdmissionAdmissionFormVM = {
    admissionFormId: "",
    campusProgramId: "",
    studentId: "",
    admissionTypeId: "",
    rollNo: "",
    refferenceNo: "",
    academicInfo: "",
    statusId: 0,
    loggerId: "",
    fatherName: "",
    guardians: "",
    dateOfBirth: new Date(),
    studentContactNo: "",
    parentContactNo: "",
    address: "",
    fullName: "",
    bloodGroupId: "",
    genderId: "",
    parentCNIC: "",
    religionId: "",
    studentCNIC: "",
    studentLoggerId: "",studentType:"",formNo:""
  };

  private studentModel: IAdmissionStudents = {
    studentId: "",
    fullName: "",
    fatherName: "",
    studentCNIC: "00000-00000000-0",
    parentCNIC: "",
    studentContactNo: "",
    parentContactNo: "",
    guardians: "",
    genderId: "",
    dateOfBirth: new Date(),
    address: "",
    bloodGroupId: "00000000-0000-0000-0000-000000000000",
    religionId: "",
    statusId: 0,
    loggerId: "",
    academicInfo: "",
    image: "",
    operation:""
  };

  private guardianJson: IGuardianJsonB = {
    name: ""
  };
  private IsNewRecord: boolean = true;
  private FeeList: Array<CheckFeeExist> = [];
  private title: string = "";


  private nextChallan: any = [];
  private nextDuedate: any = [];
  private subAmount: any = [];
  private TempChallandata: Array<IFeeStudentChallan> = [];
  private TempStudentRecordReportList: any = [];
  private subinstallmentArray: any = [];
  private StudentRecordReportList: Array<StudentReportData> = [];
  private repositories: ReportsService;
  private MarksList: Array<IMarks> = [];
  private AdmissionFormDataList: Array<IAdmissionFormData> = [];

  private feeChallanList: Array<StudentChallanReport> = [];
  private campusBankList: Array<ICampusBank> = [];
  private campusChallanList: Array<IFeeCampusChallanNoteLinkVM> = [];
  private challanNote: string = '';
  private challanFooter: any = [{ challanNote: '', customerCode: '', challanNo: '', userName: '' }];
  private challanRData: any = [];

  // private StudentChallanRepository: FeeStudentChallanService;
  private campusBankRepository: FeeCampusBankLinkService;
  private campusChallanRepository: FeeCampusChallanNoteLinkService;


  private reportData: any = [];
  private report: String =
    "assets/Reports/Resource/Admission/admissionReport.xml";
  private reportRepo: ReportsService;

  cities = [];
  loadCities(city) {
    if (this.campusCityList) {
      if (this.campusCityList.length > 0) {
        return this.campusCityList.filter(e => e.cityName == city);
      }
    }
  }

  loadCityCampus() {
    this.campusddl = [];
    this.cityDDL = [];
    let oldObj: ICampusCityVM;
    this.campusRepo.GetCityVM()
      .then(r => {
        this.campusCityList = r as Array<ICampusCityVM>;
        this.cities = [];
        this.campusCityList.forEach(element => {
          if (this.cities.indexOf(element.cityName) == -1) {
            this.cities.push(element.cityName);
          }
        });
      })
  }

  created() {
    this.repository = new AdmissionAdmissionFormService(this.$store);
    this.reportRepo = new ReportsService(this.$store);
    this.campusBankRepository = new FeeCampusBankLinkService(this.$store);
    this.SectionCourseLinkService = new RegistrationSectionCourseLinkService(this.$store);
    this.campusChallanRepository = new FeeCampusChallanNoteLinkService(this.$store);
    this.repoClass.GetFindBy('e=>e.StatusId==1').then(res => {
      this.classList = res as Array<ISetupClass>

    });

    this.initialize();
  }

  initialize() {
    // this.loadDegree();
    this.loadCityCampus();
    // this.loadGroup();
    // this.loadPasStatus();
    // this.loadGender();
    // this.loadBloodGroup();
    // this.loadMarks();
    // this.loadReligion();
    // this.loadAdmissionType();
    // this.loadBoard();
    this.loadAdmissionData();
    this.academicInfoList.push({
      board: "",
      degreeId: "",
      groupId: "",
      institute: "",
      obtainMarks: 0,
      passStatusId: "",
      registrationNo: "",
      rollNo: "",
      totalMarks: 0,
      year: "",
      classLevel: 0
    });
    this.stdContactList.push({ phoneNo: "" });
    this.parentContactList.push({ phoneNo: "" });
    this.addressList.push({ address: "", addressType: "Mailing" });
    this.addressList.push({ address: "", addressType: "Permanent" });
  }


  loadSections() {

    this.SectionCourseLinkLIst=[];
    var key = this.data.campusProgramId + '?' + this.classid;
   
    this.SectionCourseLinkService.GetAllSectionsClass(key).then(
      r => {
        this.SectionCourseLinkLIst = r as Array<IRegistrationSectionCourseLinkList>

      }
    )



  }

  loadProgramsOfCampus() {
    var key = this.sessionId + "?" + this.campusId;
    this.campusProgramLinkRepo.GetAllVM(key).then(r => {

      this.campusProgramLinkList = r as Array<ISetupCampusProgramLinkVM>;
    });
  }
  loadAdmissionData() {
    this.admissionTypeList = [];
    this.genderList = [];
    this.religionList = [];
    this.degreeList = [];
    this.groupList = [];
    this.MarksList = [];
    this.BoardList = [];
    this.PassStatusList = [];
    this.bloodGroupList = [];

    this.repository.GetAdmissionFormData()
      .then(r => {
        this.admissionTypeList = r.admissionType as Array<ISetupAdmissionType>;

        this.genderList = r.gender as Array<ISetupGender>;
        this.religionList = r.religion as Array<ISetupReligion>;
        if (this.religionList) {
          if (this.religionList.length > 0) {
            this.studentModel.religionId = this.religionList[0].religionId;
          }
        }
        this.degreeList = r.degree as Array<ISetupDegree>;
        this.groupList = r.group as Array<ISetupGroup>;
        this.MarksList = r.totalMarks as Array<IMarks>;
        this.BoardList = r.board as Array<ISetupBoard>;
        this.PassStatusList = r.passStatus as Array<ISetupPassStatus>;
        this.bloodGroupList = r.bloodGroup as Array<ISetupBloodGroup>;

      })
  }
  // loadMarks() {

  //   this.repository.GetMarks().then(r => {
  //     this.MarksList = r as Array<IMarks>
  //   })
  // }
  addAcademicInfo() {
    this.academicInfoList.push({
      board: "",
      degreeId: "",
      groupId: "",
      institute: "",
      obtainMarks: 0,
      passStatusId: "",
      registrationNo: "",
      rollNo: "",
      totalMarks: 0,
      year: (new Date().getFullYear()).toString(),
      classLevel: 0
    });
  }

  delAcademicInfo(data: any) {
    var index = this.academicInfoList.indexOf(data);
    this.academicInfoList.splice(index, 1);
  }
  addStdPhoneNo() {
    this.stdContactList.push({ phoneNo: "" });
  }

  delParentPhoneNo(data: any) {
    var index = this.parentContactList.indexOf(data);
    this.parentContactList.splice(index, 1);
  }

  addParentPhoneNo() {
    this.parentContactList.push({ phoneNo: "" });
  }

  delStdPhoneNo(data: any) {
    var index = this.stdContactList.indexOf(data);
    this.stdContactList.splice(index, 1);
  }
  // loadDegree() {
  //   this.degreeRepo.GetFindBy("s=>s.StatusId==1").then(r => {
  //     this.degreeList = r as Array<ISetupDegree>;
  //   });
  // }
  // loadGroup() {
  //   this.groupRepo.GetFindBy("s=>s.StatusId==1").then(r => {
  //     this.groupList = r as Array<ISetupGroup>;
  //   });
  // }
  // loadPasStatus() {
  //   this.PassStatusRepo.GetFindBy("s=>s.StatusId==1").then(r => {
  //     this.PassStatusList = r as Array<ISetupPassStatus>;
  //   });
  // }
  getStatusDegree(val: string) {
    if (val == '00000000-0000-0000-0000-000000000000') {
      this.degreeStatus = true;
    }
    else {
      this.degreeStatus = false;
    }

  }

  // loadBoard() {
  //   this.BoardRepository.GetFindBy("s=>s.StatusId==1").then(r => {
  //     this.BoardList = r as Array<ISetupBoard>;
  //   });
  // }
  // loadGender() {
  //   this.genderRepo.GetFindBy("s=>s.StatusId==1").then(r => {
  //     this.genderList = r as Array<ISetupGender>;
  //   });
  // }
  // loadAdmissionType() {
  //   this.admisisonTypeRepo.GetFindBy("s=>s.StatusId==1").then(r => {
  //     this.admissionTypeList = r as Array<ISetupAdmissionType>;
  //   });
  // }
  // loadBloodGroup() {
  //   this.bloodGroupRepo.GetFindBy("s=>s.StatusId==1").then(r => {
  //     this.bloodGroupList = r as Array<ISetupBloodGroup>;
  //   });
  // }

  loadReligion() {
    this.ReligionRepo.GetFindBy("s=>s.StatusId==1").then(r => {
      this.religionList = r as Array<ISetupReligion>;

      if (this.religionList) {
        if (this.religionList.length > 0) {
          this.studentModel.religionId = this.religionList[0].religionId;
        }
      }
    });
  }

  beforeModalOpen(event) {

    //this.savedisable = true;
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    //this.campusId = event.params.campusId;
    this.sessionId = event.params.sessionId;
    //this.loadProgramsOfCampus();
    if (this.IsNewRecord) {
      Object.assign(this.data, event.params.model) as IAdmissionAdmissionForm;
      this.academicInfoList = [];
      this.loadReligion();
      this.addAcademicInfo();
    }
    else {

      Object.assign(this.admissionformVM, event.params.model) as IAdmissionAdmissionFormVM;
      // this.repository.GetAll().then(res => {
      //   this.admissionFormModel = res as Array<IAdmissionAdmissionFormVM>;
      // });

      this.studentModel.studentId = this.admissionformVM.studentId;
      this.studentModel.fatherName = this.admissionformVM.fatherName;
      //this.studentModel.bloodGroupId = this.admissionformVM.bloodGroupId;
      this.studentModel.dateOfBirth = this.admissionformVM.dateOfBirth;
      this.studentModel.fullName = this.admissionformVM.fullName;
      this.studentModel.genderId = this.admissionformVM.genderId;
      this.studentModel.parentCNIC = this.admissionformVM.parentCNIC;
      this.studentModel.religionId = this.admissionformVM.religionId;
      this.studentModel.studentCNIC = this.admissionformVM.studentCNIC;
      this.studentModel.statusId = 1;
      this.studentModel.loggerId = this.admissionformVM.studentLoggerId;
      this.data.admissionTypeId = "";
      //this.data.admissionTypeId = this.admissionformVM.admissionTypeId;

      this.stdContactList = JSON.parse(this.admissionformVM.studentContactNo);
      this.parentContactList = JSON.parse(this.admissionformVM.parentContactNo);
      this.guardianJson = JSON.parse(this.admissionformVM.guardians)[0];
      this.addressList = JSON.parse(this.admissionformVM.address);
      this.academicInfoList = JSON.parse(this.admissionformVM.academicInfo);

      console.log(this.academicInfoList);

      if (this.academicInfoList) {
        if (this.academicInfoList.length > 0) {
          this.getStatusDegree(this.academicInfoList[0].degreeId)
        }
      }
      this.data.admissionFormId = this.admissionformVM.admissionFormId;
      this.data.studentId = this.admissionformVM.studentId;
      this.data.refferenceNo = this.admissionformVM.refferenceNo;
      this.data.rollNo = this.admissionformVM.rollNo;
      this.data.campusProgramId = this.admissionformVM.campusProgramId;
      //save campusprogram id for program tranfer
      this.TempCampusProgramId = this.data.campusProgramId;
      //temp admission type for change admission type

      this.data.admissionTypeId = this.admissionformVM.admissionTypeId;

      this.TempAdmissionTypeId = this.data.admissionTypeId;

      this.data.statusId = 1;
      this.data.loggerId = this.admissionformVM.loggerId;
      this.data.admissionDate = new Date();

      if (this.campusId.length == 0) {
        this.campusProgramLinkRepo.GetFindBy(`e => (e.CampusProgramId.ToString() == "` + this.data.campusProgramId + `") && e.StatusId==1`)
          .then(res => {
            this.templist = res as Array<ISetupCampusProgramLink>;
            this.campusId = this.templist.find(e => e.campusProgramId == this.data.campusProgramId).campusId;
            this.loadProgramsOfCampus();
            this.indexId++;
          });
      }
    }

  }

  indexId = 1;

  getFeeStatus() {
    if ((this.data.admissionTypeId.length > 0) && (this.data.campusProgramId.length > 0)) {
      var keystr =
        this.campusId +
        "?" +
        this.sessionId +
        "?" +
        this.data.campusProgramId +
        "?" +
        "-I";
      this.repository.CheckFeeStructure(keystr).then(res => {
        this.FeeList = res as Array<CheckFeeExist>;
        this.FeeList.length > 0
          ? (this.feeDefined = true)
          : (this.feeDefined = false);
      });
    } else {
      // this.errorMessage = this.errorMessage + "Please Seclect Admission type";
      this.flag = 1;
    }

    // if (this.flag == 1) {
    //   this.$store.dispatch(StoreTypes.updateStatusBar, {
    //     text: this.errorMessage,
    //     title: "Danger",
    //     messageTypeId: PayloadMessageTypes.error
    //   });

    //   this.errorMessage = "";
    //   this.flag = 0;
    // }
  }

  CheckCriteria() {
    this.getFeeStatus();

    this.EligibilityCriteriaList = [];
    if (this.data.campusProgramId.length > 0 && this.studentModel.genderId.length > 0 && this.data.admissionTypeId.length > 0) {
      var key =
        this.data.campusProgramId +
        "?" +
        this.studentModel.genderId +
        "?" +
        this.data.admissionTypeId;

      this.EligibilityCriteriakRepo.GetEligibiltyCriteria(key).then(res => {

        this.EligibilityCriteriaList = res as Array<IAdmissionEligibilityCriteriaVM>;
        this.EligibilityCriteriaList.length > 0
          ? (this.criteria = true)
          : (this.criteria = false);
      });
    }
  }

  get allowSubmit() {

    // alert(JSON.stringify(this.data.campusProgramId.length+ '-' +
    //   (this.studentModel.fullName.length )+ '-'
    //   + (this.studentModel.fatherName.length )+ '-'
    //   + (this.studentModel.genderId.length )+ '-'
    //     + (this.studentModel.studentCNIC.length )+ '-'
    //      + (this.studentModel.parentCNIC.length )+ '-'
    //       + (this.studentModel.dateOfBirth.toDateString().length )+ '-'
    //       + (this.addressList[0].address.length )+ '-'
    //         + (this.addressList[1].address.length )+ '-'
    //          + (this.studentModel.religionId.length )+ '-'
    //           + (this.parentContactList[0].phoneNo.length )+ '-'
    //             + (this.academicInfoList[0].degreeId.length)));

    // return this.flag < 1 ;
    if (this.IsNewRecord == true) {
      return (this.data.campusProgramId.length > 0)
        && (this.studentModel.fullName.length > 0)
        && (this.studentModel.fatherName.length > 0)
        && (this.studentModel.genderId.length > 0)
        && (this.studentModel.studentCNIC.length > 0)
        && (this.studentModel.parentCNIC.length > 0)
        && (this.studentModel.dateOfBirth.toDateString().length > 0)
        && (this.studentModel.religionId.length > 0)
        && (this.parentContactList[0].phoneNo.length > 0)
        && (this.academicInfoList[0].degreeId.length > 0)
        && (this.academicInfoList[0].groupId.length > 0)
        && (this.academicInfoList[0].rollNo.length > 0)
        && (this.academicInfoList[0].year.length > 0)
        && (this.academicInfoList[0].obtainMarks.toString().length > 0)
        && (this.academicInfoList[0].totalMarks.toString().length > 0)
        && (this.academicInfoList[0].board.length > 0);
    }
    else {
      return 1;
    }

  }

  cancel() {
    this.studentModel = {
      studentId: "",
      fullName: "",
      fatherName: "",
      studentCNIC: "00000-00000000-0",
      parentCNIC: "",
      studentContactNo: "",
      parentContactNo: "",
      guardians: "",
      genderId: "",
      dateOfBirth: new Date(),
      address: "",
      bloodGroupId: "00000000-0000-0000-0000-000000000000",
      religionId: "",
      statusId: 0,
      loggerId: "",
      academicInfo: "",
      image: "",
      operation:""
    };
    this.guardianJson = {
      name: ""
    };

    this.addressList = [];

    this.stdContactList = [];
    this.parentContactList = [];
    this.academicInfoList = [];

    this.stdContactList.push({ phoneNo: "" });
    this.parentContactList.push({ phoneNo: "" });
    this.addressList.push({ address: "", addressType: "Mailing" });
    this.addressList.push({ address: "", addressType: "Permanent" });

    this.$modal.hide("add-edit-model");
    //stop refresh on cancel button 
    //this.$emit("submit");
  }

  daysDiff = (dateOne, dateTwo) => {
    var one_day = 1000 * 60 * 60 * 24;
    var date1_ms = dateOne.getTime();
    var date2_ms = dateTwo.getTime();
    var difference_ms = date2_ms - date1_ms;
    return Math.round(difference_ms / one_day);
  };

  get dateBlur() {
    var isOk: boolean = true;

    if (this.EligibilityCriteriaList.length > 0) {
      if (
        this.daysDiff(
          new Date(this.EligibilityCriteriaList[0].fromDob),
          new Date(this.studentModel.dateOfBirth)
        ) < 0
      ) {
        this.errorMessage +=
          "Age must be greater than " + this.EligibilityCriteriaList[0].fromDob;
        isOk = false;
      }

      if (
        this.daysDiff(
          new Date(this.EligibilityCriteriaList[0].toDob),
          new Date(this.studentModel.dateOfBirth)
        ) > 0
      ) {
        this.errorMessage +=
          "Age must be less than " + this.EligibilityCriteriaList[0].toDob;
        isOk = false;
      }
    }

    return isOk;
  }

  loadReport() {
    this.reportData = [];
    var key = this.sessionId + "?" + this.campusId + "?" + this.data.studentId;
    this.reportRepo.GetAdmissionSlip(key).then(response => {
      this.reportData = response as any;

      this.$modal.show("report-viewer-eng");
    });
  }

  getStudentReportData(challlanNo: any) {
    var resut = this.admissionTypeList.find(e => e.admissionTypeId == this.data.admissionTypeId).code;

    if (resut == 'R') {

      this.feeChallanList = [];
      this.campusBankList = [];
      this.campusChallanList = [];
      this.challanNote = '';
      this.challanFooter = [{ challanNote: '', customerCode: '', challanNo: '', userName: '' }];
      this.challanRData = [];
      this.repo.GetFeeRData(challlanNo)
        .then(res => {
          this.feeChallanList = res as Array<StudentChallanReport>
          // console.log(JSON.stringify(this.feeChallanList));


          var key = this.feeChallanList[0].campusId + '?' + this.feeChallanList[0].programDetailId + '?' + this.feeChallanList[0].admissionFormId
          this.campusBankRepository.GetBankEx(key)
            .then(res => {
              this.campusBankList = res as Array<ICampusBank>
              // console.log(JSON.stringify(this.campusBankList));

              this.campusChallanRepository.GetData(this.feeChallanList[0].campusId)
                .then(res => {
                  this.campusChallanList = res as Array<IFeeCampusChallanNoteLinkVM>
                  // console.log(JSON.stringify(this.campusChallanList));


                  var i = 0;
                  this.campusChallanList.forEach(e => {
                    this.challanNote = this.challanNote + '<li>' + this.campusChallanList[i].description + '</li>';
                    i++;
                  }

                  );
                  // alert(JSON.stringify(this.challanNote));

                  var docNo = this.feeChallanList[0].challanNo.substring(this.feeChallanList[0].challanNo.length - 7, this.feeChallanList[0].challanNo.length);
                  // alert(docNo);

                  var today = new Date();

                  this.challanFooter = [{ challanNote: this.challanNote, customerCode: this.feeChallanList[0].customerCode, challanNo: this.feeChallanList[0].challanNo, userName: this.user.email, docNo: docNo, today: today }];

                  // console.log(JSON.stringify(this.challanFooter));

                  this.challanRData = '[' + JSON.stringify(this.challanFooter) + ',' + JSON.stringify(this.feeChallanList) + ',' + JSON.stringify(this.campusBankList) + ']';
                  // console.log(this.challanRData);

                  this.challanRData = JSON.parse(this.challanRData);

                  this.$modal.hide("add-edit-model");
                  this.$emit("submit", { report: "assets/Reports/Resource/Admission/Report1.xml", data: this.challanRData });

                });

            });
        });
    }

    if (resut == 'S') {
      this.reportRepo.GetAdmissionSlip(this.sessionId + '?' + this.campusId + '?' + this.data.studentId)
        .then(response => {

          this.$modal.hide("add-edit-model");
          this.$emit("submit", { report: "assets/Reports/Resource/Admission/Scholorship_Report.xml", data: response });
        });
    }
  }

  saveModel() {

    this.guardianList = [];
    this.flag = 0;
    this.stringed =
      "StudentString = " +
      this.stringedST +
      "??" +
      "AdmissionString = " +
      this.stringedAD;
    //New record
    if (this.IsNewRecord) {
      //Check Fee defined \
      this.newRecordInsert();
    }
    //edit record
    else {
      this.updateRecord();
    }
  }

  newRecordInsert() {
    this.savedisable = false;
    this.SectionCourseLinkId='00000000-0000-0000-0000-000000000000'

    if (this.feeDefined == true) {

      this.studentModel.studentId = helper.newGuid();
      this.studentModel.loggerId = helper.newGuid();
      this.studentModel.statusId = 1;
      if (this.studentModel.parentCNIC.length == 0) {
        this.studentModel.parentCNIC = '00000-0000000-0'

      }
      this.studentModel.address = JSON.stringify(this.addressList);
      this.studentModel.parentContactNo = JSON.stringify(
        this.parentContactList
      );
      this.studentModel.studentContactNo = JSON.stringify(
        this.stdContactList
      );
      this.studentModel.dateOfBirth = new Date(this.studentModel.dateOfBirth);
      this.guardianList.push(this.guardianJson);
      this.studentModel.guardians = JSON.stringify(this.guardianList);

      this.studentModel.academicInfo = JSON.stringify(this.academicInfoList);
      this.stringedST =
        "DateOfBirth: " +
        this.studentModel.dateOfBirth.toDateString() +
        "?" +
        "Address: " +
        this.studentModel.address +
        "?" +
        "AcademicInfo: " +
        this.studentModel.academicInfo +
        "?" +
        "BloodGroupId: " +
        this.studentModel.bloodGroupId +
        "?" +
        "FatherName: " +
        this.studentModel.fatherName.toUpperCase() +
        "?" +
        "FullName: " +
        this.studentModel.fullName.toUpperCase() +
        "?" +
        "GenderId: " +
        this.studentModel.genderId +
        "?" +
        "Guardians: " +
        this.studentModel.guardians +
        "?" +
        "ParentCNIC: " +
        this.studentModel.parentCNIC +
        "?" +
        "ParentContactNo: " +
        this.studentModel.parentContactNo +
        "?" +
        "ReligionId: " +
        this.studentModel.religionId +
        "?" +
        "StudentCNIC: " +
        this.studentModel.studentCNIC +
        "?" +
        "StudentContactNo: " +
        this.studentModel.studentContactNo +
        "?" +
        "StudentId: " +
        this.studentModel.studentId +
        "?" +
        "StatusId: " +
        this.studentModel.statusId;

      if (this.criteria == false) {
        this.errorMessage = this.errorMessage + "Eligibility Criteria not defined";
        this.flag = 1;
      }
      else {
        for (var i = 0; i < this.academicInfoList.length; i++) {
          this.percentage = (this.academicInfoList[i].obtainMarks / this.academicInfoList[i].totalMarks) * 100;
          this.percentage = Number(parseFloat(this.percentage.toString()).toFixed(2));
          if (this.degreeStatus == false) {
            if (this.percentage < this.EligibilityCriteriaList[0].markPercentage) {
              this.flag = 1;
              this.errorMessage += "Marks are less required for Admission ";
            }

            if (this.academicInfoList[i].year < this.EligibilityCriteriaList[0].minPassingYear.slice(0, 4)) {
              this.flag = 1;
              this.errorMessage += "Year is less than Minimum Passing Year ";
            }

            if (parseInt(this.academicInfoList[i].totalMarks.toString()) < parseInt(this.academicInfoList[i].obtainMarks.toString())) {
              this.flag = 1;
              this.errorMessage += "Obtained Marks cannot be greater than Total Marks ";
            }
          }
        }
      }

      this.flag = this.flag == 0 ? (this.dateBlur ? 0 : 1) : 1;

      if (this.flag == 0) {
        var student: IAdmissionCollect = {
          Student: this.studentModel,
          AdmissionForm: this.data,
          ClassId: this.classid,
          Sectioncourseid:this.SectionCourseLinkId,
          Enroll:this.shouldenroll,
          GenerateFee:this.generateFee

        };

        student.Student.statusId = 1;
        student.AdmissionForm.admissionFormId = helper.newGuid();
        student.AdmissionForm.loggerId = helper.newGuid();
        student.AdmissionForm.studentId = this.studentModel.studentId;
        student.AdmissionForm.statusId = 1;
        console.log(JSON.stringify(student));
        this.repository.InsertAdmissionEx(JSON.stringify(student))
          .then(e => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "Record has been inserted successfully",
              title: "Success",
              messageTypeId: PayloadMessageTypes.success
            })
            // this.$parent["childKey"] = this.studentModel.studentId;
            // this.repository.GetChallaNo(student.AdmissionForm.admissionFormId)
            //   .then(r => {

            //     var challanNo = r.providedString as any;
            //     this.getStudentReportData(challanNo);
            //     this.cancel();
            //   });
            this.cancel();
          });
      }
      else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: this.errorMessage,
          title: "Danger",
          messageTypeId: PayloadMessageTypes.error
        });

        this.errorMessage = "";
        this.flag = 0;
      }
    }
    else {
      this.errorMessage =
        this.errorMessage +
        "Fee Structure Not Defined for this Zone and Program";
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: this.errorMessage,
        title: "Danger",
        messageTypeId: PayloadMessageTypes.error
      });
      this.errorMessage = "";
    }

    //this.savedisable = true;

  }

  updateRecord() {
    this.savedisable = false;
    this.feeDefined = true;
    //Check Fee Defined  True
    if (this.feeDefined == true) {
      this.studentModel.address = JSON.stringify(this.addressList);
      this.studentModel.parentContactNo = JSON.stringify(
        this.parentContactList
      );
      this.studentModel.studentContactNo = JSON.stringify(
        this.stdContactList
      );
      this.guardianList.push(this.guardianJson);
      this.studentModel.guardians = JSON.stringify(this.guardianList);
      this.studentModel.loggerId = helper.newGuid();
      this.studentModel.academicInfo = JSON.stringify(this.academicInfoList);
      this.studentModel.dateOfBirth = new Date(this.studentModel.dateOfBirth);
      this.stringedST =
        "DateOfBirth: " +
        this.studentModel.dateOfBirth.toDateString() +
        "?" +
        "Address: " +
        this.studentModel.address +
        "?" +
        "AcademicInfo: " +
        this.studentModel.academicInfo +
        "?" +
        "BloodGroupId: " +
        this.studentModel.bloodGroupId +
        "?" +
        "FatherName: " +
        this.studentModel.fatherName.toUpperCase() +
        "?" +
        "FullName: " +
        this.studentModel.fullName.toUpperCase() +
        "?" +
        "GenderId: " +
        this.studentModel.genderId +
        "?" +
        "Guardians: " +
        this.studentModel.guardians +
        "?" +
        "ParentCNIC: " +
        this.studentModel.parentCNIC +
        "?" +
        "ParentContactNo: " +
        this.studentModel.parentContactNo +
        "?" +
        "ReligionId: " +
        this.studentModel.religionId +
        "?" +
        "StudentCNIC: " +
        this.studentModel.studentCNIC +
        "?" +
        "StudentContactNo: " +
        this.studentModel.studentContactNo +
        "?" +
        "StudentId: " +
        this.studentModel.studentId +
        "?" +
        "StatusId: " +
        this.studentModel.statusId;

      this.EligibilityCriteriaList = [];
      if (this.data.campusProgramId.length > 0 && this.studentModel.genderId.length > 0 && this.data.admissionTypeId.length > 0) {
        var key =
          this.data.campusProgramId +
          "?" +
          this.studentModel.genderId +
          "?" +
          this.data.admissionTypeId;

        this.EligibilityCriteriakRepo.GetEligibiltyCriteria(key).then(res => {

          this.EligibilityCriteriaList = res as Array<IAdmissionEligibilityCriteriaVM>;
          this.EligibilityCriteriaList.length > 0
            ? (this.criteria = true)
            : (this.criteria = false);

          if (this.criteria == false) {
            this.errorMessage =
              this.errorMessage + "Eligibility Criteria not defined";
            this.flag = 1;
          }

          if (this.criteria == true) {
            for (var i = 0; i < this.academicInfoList.length; i++) {
              this.percentage =
                (this.academicInfoList[i].obtainMarks /
                  this.academicInfoList[i].totalMarks) *
                100;
              this.percentage = Number(parseFloat(this.percentage.toString()).toFixed(2));


              if (
                this.percentage < this.EligibilityCriteriaList[0].markPercentage
              ) {
                this.flag = 1;
                this.errorMessage += "Marks are less required for Admission ";
              }

              if (
                this.academicInfoList[i].year <
                this.EligibilityCriteriaList[0].minPassingYear.slice(0, 4)
              ) {
                this.flag = 1;
                this.errorMessage += "Year is less than Minimum Passing Year ";
              }

              if (
                parseInt(this.academicInfoList[i].totalMarks.toString()) <
                parseInt(this.academicInfoList[i].obtainMarks.toString())
              ) {
                this.flag = 1;
                this.errorMessage +=
                  "Obtained Marks cannot be greater than Total Marks ";
              }
            }
          }

          if (this.flag == 0) {
            this.studentRepo.Update(this.studentModel).then(r => {
              this.repository.Update(this.data).then(() => {

                this.stateChange();
                this.programTransfer();

                this.$store.dispatch(StoreTypes.updateStatusBar, {
                  text: "Record has been updated successfully",
                  title: "Success",
                  messageTypeId: PayloadMessageTypes.success
                })
              });
            });

            this.cancel();
          }
          //Flag Status 1
          else if (this.flag == 1) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: this.errorMessage,
              title: "Danger",
              messageTypeId: PayloadMessageTypes.error
            });

            this.errorMessage = "";
            this.flag = 0;
          }
        });
      }
    }
    //Fee Defined False
    else if (this.feeDefined == false) {
      this.errorMessage = "";
      this.errorMessage =
        this.errorMessage +
        "Fee Structure Not Defined for this Zone and Program";
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: this.errorMessage,
        title: "Danger",
        messageTypeId: PayloadMessageTypes.error
      });
    }
    //this.savedisable = true;

  }

  programTransfer() {
    if (this.TempCampusProgramId != this.data.campusProgramId) {
      var programdetailid = this.campusProgramLinkList.find(e => e.campusProgramId == this.data.campusProgramId && e.campusId == this.campusId && e.sessionId == this.sessionId).programDetailId
      var key = this.data.admissionFormId + '?' + this.data.campusProgramId
      this.studentfeeRepo.ProgramTransfer(key);
    }
  }

  stateChange() {
    if (this.TempAdmissionTypeId != this.data.admissionTypeId) {
      var admissionType = this.admissionTypeList.find(e => e.admissionTypeId == this.data.admissionTypeId).code;
      var StateTransferkey = admissionType + '?' + this.data.admissionFormId;
      this.studentfeeRepo.StateChange(StateTransferkey);
    }
  }

  checkUpdatConditions() {
    if (this.feeDefined == true) {
      this.studentModel.address = JSON.stringify(this.addressList);
      this.studentModel.parentContactNo = JSON.stringify(
        this.parentContactList
      );
      this.studentModel.studentContactNo = JSON.stringify(this.stdContactList);
      this.guardianList.push(this.guardianJson);
      this.studentModel.guardians = JSON.stringify(this.guardianList);
      this.studentModel.loggerId = helper.newGuid();
      this.studentModel.academicInfo = JSON.stringify(this.academicInfoList);
      this.studentModel.dateOfBirth = new Date(this.studentModel.dateOfBirth);
      this.stringedST =
        "DateOfBirth: " +
        this.studentModel.dateOfBirth +
        "?" +
        "Address: " +
        this.studentModel.address +
        "?" +
        "BloodGroupId: " +
        this.studentModel.bloodGroupId +
        "?" +
        "FatherName: " +
        this.studentModel.fatherName +
        "?" +
        "FullName: " +
        this.studentModel.fullName +
        "?" +
        "GenderId: " +
        this.studentModel.genderId +
        "?" +
        "Guardians: " +
        this.studentModel.guardians +
        "?" +
        "ParentCNIC: " +
        this.studentModel.parentCNIC +
        "?" +
        "ParentContactNo: " +
        this.studentModel.parentContactNo +
        "?" +
        "ReligionId: " +
        this.studentModel.religionId +
        "?" +
        "StudentCNIC: " +
        this.studentModel.studentCNIC +
        "?" +
        "StudentContactNo: " +
        this.studentModel.studentContactNo +
        "?" +
        "StudentId: " +
        this.studentModel.studentId +
        "?" +
        "StatusId: " +
        this.studentModel.statusId;
      //console.log(JSON.stringify(this.stringedST));
      //this.CheckCriteria();
      //this.criteria=true;

      if (this.criteria == false) {
        this.errorMessage =
          this.errorMessage + "Eligibility Criteria not defined";
        this.flag = 1;
      }

      if (this.criteria == true) {
        for (var i = 0; i < this.academicInfoList.length; i++) {
          this.percentage =
            (this.academicInfoList[i].obtainMarks /
              this.academicInfoList[i].totalMarks) *
            100;
          // this.percentage = Math.round(this.percentage);
          this.percentage = Number(parseFloat(this.percentage.toString()).toFixed(2));


          if (
            this.percentage < this.EligibilityCriteriaList[0].markPercentage
          ) {
            this.flag = 1;
            this.errorMessage += "Marks are less required for Admission ";
          }

          if (
            this.academicInfoList[i].year <
            this.EligibilityCriteriaList[0].minPassingYear.slice(0, 4)
          ) {
            this.flag = 1;
            this.errorMessage += "Year is less than Minimum Passing Year ";
          }

          if (
            parseInt(this.academicInfoList[i].totalMarks.toString()) <
            parseInt(this.academicInfoList[i].obtainMarks.toString())
          ) {
            this.flag = 1;
            this.errorMessage +=
              "Obtained Marks cannot be greater than Total Marks ";
          }
        }
      }

      if (this.flag == 0) {
        this.studentRepo.Update(this.studentModel).then(r => {
          this.repository.Update(this.data).then(() =>
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "Record has been updated successfully",
              title: "Success",
              messageTypeId: PayloadMessageTypes.success
            })
          );
          //this.loadReport(this.studentModel.studentId);
        });
        this.reportRepo = new ReportsService(this.$store);

        // var key = this.sessionId + '?' + this.campusId + '?' + this.data.studentId;
        // this.reportRepo.GetAdmissionSlip(key).then(response => {
        //   this.reportDate = response as any;
        //   this.report = "assets/Reports/Resource/Admission/AdmissionReport.xml";
        //   this.$modal.show("report-viewer-eng");
        // });
        this.stringed;
        this.cancel();
      } else if (this.flag == 1) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: this.errorMessage,
          title: "Danger",
          messageTypeId: PayloadMessageTypes.error
        });

        this.errorMessage = "";
        this.flag = 0;
      }
    } else if (this.feeDefined == false) {
      this.errorMessage = "";
      this.errorMessage =
        this.errorMessage +
        "Fee Structure Not Defined for this Zone and Program";
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: this.errorMessage,
        title: "Danger",
        messageTypeId: PayloadMessageTypes.error
      });
    }
  }

  $v: Vuelidate<any>;
}
