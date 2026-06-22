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
  IFeeConcessionDetail,
  IFeeConcessionDetailVM,
  ISetupSession,
  ISetupShift,
  ISetupCampus,
  IStudentModel,
  ISetupProgramDetails,
  DDLGroupModel,
  DDLModel,
  ISetupProgramDetailsVM,
  IFeeConcession,
  IFeeScholarshipCriteriaVM,
  ISetupAdmissionType,
  ICampusCityVM,
  IStudentModelCB,
  ISetupCampusProgramVM,
  ISetupGender
} from "../../../../models";
import {
  FeeConcessionDetailService,
  SetupCampusService,
  SetupSessionService,
  SetupShiftService,
  FeeConcessionService,
  SetupProgramDetailsService,
  FeeScholarshipCriteriaService,
  SetupAdmissionTypeService,
  SetupCampusProgramLinkService,
  SetupGenderService
} from "../../../../service";
export interface IStudentModelCB2 {
  admissionFormId: string;
  studentId: string;
  rollNo: string;
  referrenceNo: string;
  fullName: string;
  fatherName: string;
  studentCNIC: string;
  studentContactNo: string;
  percentage: number;
  zoneId: number;
  isChecked: boolean;
  gender: string;
  obtainedMarks: number;
  totalMarks: number;
}
export interface IStudentModel2 {
  admissionFormId: string;
  studentId: string;
  rollNo: string;
  referrenceNo: string;
  fullName: string;
  fatherName: string;
  studentCNIC: string;
  studentContactNo: string;
  percentage: number;
  zoneId: number;
  gender: string;
  obtainedMarks: number;
  totalMarks: number;
}
import { FeeApplyConcessionBulkAddEdit } from "../add-edit";
import { FeeApplyConcessionBulkDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";
import { ReportEngine } from "../../../../../../components";
import { IAcademicInfo } from '../../../../models/Admission/AdmissionForm';
import { stringify } from "querystring";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": FeeApplyConcessionBulkAddEdit,
    "delete-model": FeeApplyConcessionBulkDelete,
    // "report-engine": ReportEngine
  }
})
export class FeeApplyConcessionBulk extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: FeeConcessionDetailService;

  private datas: Array<IStudentModel2> = [];
  private filterString: string = "";
  private campusId = "";
  private sessionId = "";
  private programDetailId = "";
  private CprogramDetailId = "";
  private shiftId = "";
  private percentageFrom = 1;
  private percentageTo = 99;
  private scholarshipCriteriaId = "";
  private admissionTypeId = "";
  private academyModel: Array<IAcademicInfo> = [];
  //private academyService:

  private campusList: Array<ISetupCampus> = [];
  private sessionList: Array<ISetupSession> = [];
  private programDetailList: Array<ISetupProgramDetailsVM> = [];
  private shiftList: Array<ISetupShift> = [];
  private programDDL: Array<DDLGroupModel> = [];
  private ddl: Array<DDLModel> = [];
  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];
  private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = [];
  private admissionTypeList: Array<ISetupAdmissionType> = [];
  private campusCityList: Array<ICampusCityVM> = [];
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    this.$store
  );

  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private sessionRepo: SetupSessionService = new SetupSessionService(
    this.$store
  );
  private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(
    this.$store
  );
  private concessionRepo: FeeConcessionService = new FeeConcessionService(
    this.$store
  );
  private shiftRepo: SetupShiftService = new SetupShiftService(this.$store);
  private concessionDetailRepo: FeeConcessionDetailService = new FeeConcessionDetailService(
    this.$store
  );
  private scholarshipCriteriaRepo: FeeScholarshipCriteriaService = new FeeScholarshipCriteriaService(
    this.$store
  );
  private admissionTypeRepo: SetupAdmissionTypeService = new SetupAdmissionTypeService(
    this.$store
  );
  private genderlist: Array<ISetupGender> = [];

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private selected: Array<IStudentModelCB2> = [];
  private reportData: any = [];
  private report: String = "";
  private $vs: any;
  private installmentNo = 1;

  private columns = [
    { key: 'referrenceNo', caption: "ReferenceNo" },
    { key: 'fullName', caption: 'Student Name' },
    { key: 'fatherName', caption: 'Father Name' },
    { key: 'obtainedMarks', caption: 'Obtained Marks' },
    { key: 'totalMarks', caption: 'Total Marks' },
    { key: 'gender', caption: 'Gender' },
    { key: 'percentage', caption: 'Percentage' },
    { key: 'isChecked', caption: 'Check' }
  ];
  private genderrepository:SetupGenderService=new SetupGenderService(this.$store);

  selectAll = false;
  maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }];
  gendr = '';
  created() {
    this.loadGender();
    this.repository = new FeeConcessionDetailService(this.$store);
    this.loadCampus();
    this.loadSession();
    //this.loadProgramDetails();
    this.loadShift();
    this.loadAdmissionType();
    this.loadCityCampus();
    // this.loadScholarship();
    this.$watch('selectAll', this.selectAllCb)
    this.$watch('gendr', this.filterGender)
  }
  filterGender() {
    this.selected=this.orignalList.filter(s=>s.gender==this.gendr)
  }
  selectAllCb() {
    if (this.selectAll) {
      this.selected.forEach(s => {
        s.isChecked = true;
      })
    } else {
      this.selected.forEach(s => {
        s.isChecked = false;
      })
    }
  }

  loadGender() {
    this.genderrepository.GetFindBy('e=>e.StatusId==1').then(r => {
      this.genderlist = r as Array<ISetupGender>
    })


  }
  loadCityCampus() {
    this.campusddl = [];
    this.cityDDL = [];
    let oldObj: ICampusCityVM;
    this.campusRepo.GetCityVM().then(r => {
      this.campusCityList = r as Array<ICampusCityVM>;
    });
  }
  loadAdmissionType() {
    this.admissionTypeRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.admissionTypeList = r as Array<ISetupAdmissionType>;
    });
  }
  mounted() {
    this.validatePage();
    this.refreshData();
  }
  loadCampus() {
    this.campusRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.campusList = r as Array<ISetupCampus>;
    });
  }
  loadSession() {
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }
  loadShift() {
    this.shiftRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.shiftList = r as Array<ISetupShift>;
    });
  }

  loadScholarship() {
    // this.concessionId = ''

    // alert(JSON.stringify(this.programDetailId));

    // var programDetailid = this.campusProgramLinkList.find(
    //   s => s.campusProgramId == this.programDetailId
    // ).programDetailId;

    // this.CprogramDetailId = programDetailid;
    // alert(programDetailid)

    this.scholarshipCriteriaList = [];

    if (
      this.sessionId.length > 0 &&
      this.campusId.length > 0 &&
      this.programDetailId.length > 0 &&
      this.shiftId.length > 0
    ) {
      var key =
        this.sessionId +
        "?" +
        this.campusId +
        "?" +
        this.programDetailId +
        "?" +
        this.shiftId
      //  +
      // "?" +
      // this.admissionTypeId;

      // var programid = this.programDetailList.find(s => s.programDetailId == this.programDetailId).programId
      this.scholarshipCriteriaRepo.GetAllVMBy(key).then(r => {
        this.scholarshipCriteriaList = r as Array<IFeeScholarshipCriteriaVM>;
        //  alert(JSON.stringify(this.scholarshipCriteriaList))
      });
    }
  }

  loadProgramsOfCampus() {
    this.ddl = [];
    this.programDDL = [];
    let oldObj: ISetupCampusProgramVM;
    var key = this.sessionId + "?" + this.campusId;
    this.campusProgramLinkRepo.GetAllVM(key).then(r => {
      this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
    });
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("feeApplyConcessionBulk" in this.user.claims == true) {
        if (this.user.claims["feeApplyConcessionBulk"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["feeApplyConcessionBulk"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["feeApplyConcessionBulk"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["feeApplyConcessionBulk"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }
  orignalList: IStudentModelCB2[] = []
  refreshData() {
    this.datas = [];


    if (
      this.campusId.length > 0 &&
      this.sessionId.length > 0 &&
      this.programDetailId.length > 0 &&
      this.shiftId.length > 0 &&
      this.percentageFrom > 0 &&
      this.percentageTo > 0
    ) {
      var key =
        this.campusId +
        "?" +
        this.sessionId +
        "?" +
        this.programDetailId +
        "?" +
        this.shiftId +
        "?" +
        this.percentageFrom +
        "?" +
        this.percentageTo
      // +
      // "?" +
      // this.admissionTypeId;
      this.repository.GetStudents(key).then(response => {
        this.selected = [];
        this.datas = response as Array<IStudentModel2>;
        this.datas.forEach(e => {
          this.selected.push({
            fullName: e.fullName,
            admissionFormId: e.admissionFormId,
            fatherName: e.fatherName,
            isChecked: false,
            percentage: e.percentage,
            referrenceNo: e.referrenceNo,
            rollNo: e.rollNo,
            studentCNIC: e.studentCNIC,
            studentContactNo: e.studentContactNo,
            studentId: e.studentId,
            zoneId: e.zoneId,
            gender: e.gender,
            obtainedMarks: e.obtainedMarks,
            totalMarks: e.totalMarks
          });
        });
        this.orignalList=this.selected;
        this.filterGender();
        console.log(this.datas.length)
        console.log(this.selected)
        // if (this.datas.length > 0) {
        //   this.loadScholarship();
        // }
      });
    }
  }
  insertModel() {
    var list = this.selected.filter(s => s.isChecked == true);
    if (this.selected.length > 0) {
      var key = this.scholarshipCriteriaId + "?" + JSON.stringify(list) + "?" + this.installmentNo;
      // alert(JSON.stringify(key));
      this.concessionDetailRepo.ApplyConcessionBulkViaInstallmentNew(key).then(r => {
        // console.log('done')
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Record has been updated successfully",
          title: "Success",
          messageTypeId: PayloadMessageTypes.success
        });
      });
    }
  }

  save() {
    this.$vs.notify({
      title: "Function click",
      text: "Click on me",
      color: "primary",
      fixed: true,
      click: () => {
        this.$vs.notify({
          title: "Secondary function",
          text: "Executed the function when clicking",
          color: "success",
          icon: "check_box"
        });
      }
    });
  }

  getListReport() {
    var totalList = [];

    var list = this.selected.filter(s => s.isChecked == true);

    list.forEach(element => {
      totalList.push({
        admissionType: this.admissionTypeList.find(e => e.admissionTypeId == this.admissionTypeId).fullName,
        scholarshipName: this.scholarshipCriteriaList.find(e => e.scholarshipCriteriaId == this.scholarshipCriteriaId).fullName,
        from: this.percentageFrom,
        to: this.percentageTo,
        referrenceNo: element.referrenceNo,
        fullName: element.fullName,
        percentage: element.percentage,
        campus: this.campusList.find(f => f.campusId == this.campusId).fullName,
        session: this.sessionList.find(f => f.sessionId == f.sessionId).fullName,
        program: this.campusProgramLinkList.find(f => f.programDetailId == f.programDetailId).description,
      });
    });

    this.reportData = totalList
    this.report =
      "assets/Reports/Resource/Fee/ScholarshipStudents.xml";
    this.$modal.show("report-viewer-eng");
  }

  editModel(model: IFeeConcessionDetail) {
    this.$modal.show("add-edit-model", {
      model: model,
      IsNewRecord: false,
      CampusId: this.campusId,
      sessionId: this.sessionId,
      ProgramDetailId: this.programDetailId
    });
  }

  deleteModel(model: IFeeConcessionDetail) {
    this.$modal.show("delete-model", { model: model });
  }
}
