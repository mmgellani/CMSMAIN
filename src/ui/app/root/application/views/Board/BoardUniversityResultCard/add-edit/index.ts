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

import * as helper from "../../../../helper";
import { IBoardCampusStudentLink } from "../../../../models/Board/CampusStudentLink";
import { BoardCampusStudentLinkService } from "../../../../service/Board/CampusStudentLink";
import { IBoardBoardCampus } from "../../../../models/Board/BoardCampus";
import { BoardBoardCampusService } from "../../../../service/Board/BoardCampus";
import { IStudentEnrolledVM, IFeeFeeHead, IFeeChallanType, ISetupBoard } from "../../../../models";
import { RegistrationEnrollmentsService, FeeFeeHeadService, FeeChallanTypeService, SetupBoardService, TransportationVehicleInfoService } from "../../../../service";
import { IReturnType } from "../../../../models/Board/ReturnType";
import { ReturnTypeService } from "../../../../service/Board/ReturnType";
import { IBoardStudentBoardLink, BoardFeePaidStudent, StudentBoardRegistration, BoardUniversityRollData, StudentBoardUniversityRollNoList } from "../../../../models/Board/StudentBoardLink";
import { IBoardProgramCampus } from "../../../../models/Board/ProgramCampus";
import { BoardProgramCampusService } from "../../../../service/Board/ProgramCampus";
import { BoardStudentBoardLinkService } from "../../../../service/Board/BoardStudentBoardLink";
import { RegistrationCodeService } from "../../../../service/Board/registrationCode";
import { IRegistrationCode } from "../../../../models/Board/RegistrationBoard";

type ValidateBoardCampusStudentLink = { model: IBoardCampusStudentLink; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateBoardCampusStudentLink> = {
  model: {
    boardCampusId: { required }
  }
};

export interface BoardUniversityRollDataEx extends BoardUniversityRollData {
  isSelected: boolean;


}

export interface StudentBoardUniversityRollNoListEx extends StudentBoardUniversityRollNoList {
  passFailCriteria: string;
  isSelected: boolean;
}

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'StudentRegistration-add-edit-model',
  template: require('./index.html')
})
export class BoardCampusStudentRegistrationAddEdit extends Vue {
  private repository: BoardStudentBoardLinkService;
  isActive: boolean = true;
  private data: IBoardStudentBoardLink = {
    studentBoardLinkId: '',
    admissionFormId: '',
    returnTypeId: '',
    registrationCodeId: '',
    dueDate: new Date(),
    returnDate: new Date(),
    amount: 0,
    statusId: 1,
    boardUniversityNo: ''
  };
  private IsNewRecord: boolean = true;
  private BoardUniNo: string = "";
  private boardId: string = "";
  private yer = '';
  private examtypeid = '';
  private feeHeadId: string = "";
  private ProgramId: string = '';
  batch = [{ item: 'Pass',show:'Pass' },{ item: 'Fail',show:'Fail'},{item: 'Pending',show:'Pending'}]

  private boardcode: string = '';
  private boardCampusId: string = "";
  private sessionboardfeeid: string = "";
  private boardReturnTypeList: Array<IReturnType> = [];
  private registrationcodelist: Array<IRegistrationCode> = [];
  private ReturnTypeRepo: ReturnTypeService = new ReturnTypeService(this.$store);
  private registratincodeRepo: RegistrationCodeService = new RegistrationCodeService(this.$store);
  private title = '';

  private datalist: Array<StudentBoardUniversityRollNoList> = [];
  private datalistEx: Array<StudentBoardUniversityRollNoListEx> = [];

  private studentList: Array<StudentBoardUniversityRollNoList> = [];
  private studentselectedListEx: Array<StudentBoardUniversityRollNoList> = [];


  private campusId = '';
  private sessionId = '';
  private boardid = '';
  private registrationCodeId = '';
  private registrationCode = '';
  private sessionName = '';

  private programId = '';
  private classId = '';
  private amount = 0;
  private shiftId = '';
  private genderid = '';
  private programDetailIdEx = '';
  private campusStudentList: any = [];
  feeHeadList: Array<IFeeFeeHead> = [];
  repoFeeHead: FeeFeeHeadService = new FeeFeeHeadService(this.$store);
  challanTypeId: string = '';
  challanTypeList: Array<IFeeChallanType> = [];
  repoChallanType: FeeChallanTypeService = new FeeChallanTypeService(this.$store);
  private boardrepo: SetupBoardService = new SetupBoardService(this.$store);
  boardList: Array<ISetupBoard> = [];

  private selectAll: boolean = false;
  private isSelected: boolean = false;



  created() {
    this.repository = new BoardStudentBoardLinkService(this.$store);
  }



  loadEnrolledStudents() {


    this.datalist = [];
    this.datalistEx = [];
    var key = this.sessionId + '?' + this.campusId + '?' + this.programId + '?' + this.classId + '?' + this.programDetailIdEx + '?' + this.examtypeid + '?' + this.yer
    this.repository.GetBoardUniversityRollListEx(key).then(r => {
      this.datalist = r as Array<StudentBoardUniversityRollNoList>

      this.datalist.forEach(element => {
        this.datalistEx.push({
          boardUniRollNoSlipId:element.boardUniRollNoSlipId,
          boardUniversityExamEntryId: element.boardUniversityExamEntryId,
          rollNo: element.rollNo,
          fullName: element.fullName,
          fatherName: element.fatherName,
          boardUniversityNo: element.boardUniversityNo,
          boardRollNo: element.boardRollNo,
          isSelected: false,
          passFailCriteria:'Pass'



        })

      });

    })




  }

  allowsubmit() {
    return this.data.returnTypeId.length > 0 &&
      this.data.registrationCodeId.length > 0


  }

  checkAll() {
    if (this.selectAll == true) {
      this.datalistEx.forEach(element => {
        element.isSelected = true;
      });
    }
    else {
      this.datalistEx.forEach(element => {
        element.isSelected = false;
      });
    }
  }




  beforeModalOpen(event) {
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    this.ProgramId = event.params.PROGRAMID;



    // Object.assign(this.data, event.params.model);
    this.sessionId = event.params.SessionId;
    this.campusId = event.params.CampusId;
    this.programId = event.params.ProgramDetailId;
    this.classId = event.params.ClassId;
    this.programDetailIdEx = event.params.PROGRAMDETAILID;
    this.registrationCodeId = event.params.RegistrationCodeId;
    this.sessionName = event.params.SessionName;
    this.yer = event.params.EXMYEAR;

    this.examtypeid = event.params.EXAMTYPE;


    // var key=this.programId+'?'+this.boardid


      
        
    this.loadEnrolledStudents();
    this.selectAll = false;



  }





  cancel() {


    this.$emit("submit");
    this.$modal.hide('StudentRegistration-add-edit-model');
  }

  saveModel() {


    var z = this.datalistEx.filter(e => e.isSelected == true);


    var res = JSON.stringify(z);
    this.repository.InsertBoardUniversityResultCard(res).then(r=>{
      var msg = r.returnValue;


      this.$store.dispatch(StoreTypes.updateStatusBar, {

        text: msg,
        title: 'success',
        messageTypeId: PayloadMessageTypes.success
      });
      this.cancel();
    })

  }
  get allowSubmit() {
    return this.boardCampusId.length > 0;
  }
  $v: Vuelidate<any>;
}
