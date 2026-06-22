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
import { IBoardStudentBoardLink, BoardFeePaidStudent } from "../../../../models/Board/StudentBoardLink";
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

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'CampusStudentLink-add-edit-model',
  template: require('./index.html')
})
export class BoardCampusStudentLinkAddEdit extends Vue {
  private repository: BoardStudentBoardLinkService;
  isActive: boolean = true;
  private data: IBoardStudentBoardLink = {
    studentBoardLinkId: '',
    admissionFormId: '',
    returnTypeId: '',
    registrationCodeId: '',
    dueDate:new Date(),
    returnDate: new Date(),
    amount:0,
    statusId: 1,
    boardUniversityNo:''
  };
  private IsNewRecord: boolean = true;
  private BoardUniNo: string = "";
  private SerialNo: string = "";
  private boardId: string = "";
  private feeHeadId: string = "";
  private ProgramId: string = '';
  
  private boardcode: string = '';
  private boardCampusId: string = "";
  private sessionboardfeeid: string = "";
  private boardReturnTypeList: Array<IReturnType> = [];
  private registrationcodelist: Array<IRegistrationCode> = [];
  private ReturnTypeRepo: ReturnTypeService = new ReturnTypeService(this.$store);
  private registratincodeRepo: RegistrationCodeService = new RegistrationCodeService(this.$store);
  private title = '';


  private studentList: Array<BoardFeePaidStudent> = [];
  private studentselectedList: Array<BoardFeePaidStudent> = [];


  private campusId = '';
  private sessionId = '';
  private boardid = '';
  private programId = '';
  private classId = '';
  private amount = 0;
  private shiftId = '';
  private genderid='';
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

    // this.ProgramCampusRepo.GetFindBy(this.ProgramId).then(r=>{
    //   this.programCampusList=r as Array<IBoardProgramCampus>


    // })
    // this.isChecked();
    // this.loadEnrolledStudents();
  }

  loadBoardCampus() {
  
      this.boardReturnTypeList = [];
      this.ReturnTypeRepo.GetFindBy('e=>e.StatusId==1')
        .then(r => {
          this.boardReturnTypeList = r as Array<IReturnType>
        });

    

  }

  loadEnrolledStudents() {
    this.studentList = [];
    var key = this.sessionId + "?" + this.campusId + "?" + this.programId + "?" + this.classId + "?" + this.shiftId+'?'+this.genderid;
    
    this.repository.BoardFeePaidStudent(key)
      .then(r => {
        this.studentList = r as Array<BoardFeePaidStudent>
      })
  }

  allowsubmit() {
    return this.data.returnTypeId.length > 0 &&
      this.data.registrationCodeId.length > 0 


  }

  checkAll() {
    if (this.selectAll == true) {
      this.studentList.forEach(element => {
        element.isSelected = true;
      });
    }
    else {
      this.studentList.forEach(element => {
        element.isSelected = false;
      });
    }
  }




  beforeModalOpen(event) {
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    this.ProgramId = event.params.PROGRAMID;
   


    Object.assign(this.data, event.params.model);
    this.sessionId = event.params.SessionId;
    this.campusId = event.params.CampusId;
    this.programId = event.params.ProgramDetailId;
    this.classId = event.params.ClassId;
    this.shiftId = event.params.SHIFTID;
    this.boardid = event.params.BOARDID;
    this.genderid= event.params.GENDERID

    var key=this.programId+'?'+this.boardid


    this.registratincodeRepo.GetFindBy(key).then(r => {
      this.registrationcodelist = r as Array<IRegistrationCode>
     
    });
     this.loadEnrolledStudents();
    this.selectAll = false;

    this.loadBoardCampus();
    this.loadBoard();
    this.loadChallanTypeList();

  }

  loadChallanTypeList() {
    this.repoChallanType.GetFindBy('s=>s.StatusId==1')
      .then(r => {
        this.challanTypeList = r as Array<IFeeChallanType>
        var index1 = this.challanTypeList.indexOf(this.challanTypeList.find(s => s.fullName.toLowerCase().startsWith('edu')))
        this.challanTypeList.splice(index1, 1);
        var index2 = this.challanTypeList.indexOf(this.challanTypeList.find(s => s.fullName.toLowerCase().startsWith('trans')))

        this.challanTypeList.splice(index2, 1);

      })
  }
  GetBoardFee() {
    if (this.sessionId.length > 0 && this.boardId && this.challanTypeId && this.feeHeadId) {
      var z = this.sessionId + '?' + this.boardId + '?' + this.challanTypeId + '?' + this.feeHeadId
      this.repository.GetBoardFee(z).then(r => {
        if (r.length > 0) {
        
          
        }

        else {
          this.amount = 0;
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'No Fee Against this Selection',
            title: 'warning',
            messageTypeId: PayloadMessageTypes.warning
          });


        }

      })
    }




  }

  

  loadBoard() {
    this.boardrepo.GetFindBy('s=>s.StatusId==1')
      .then(r => {
        this.boardList = r as Array<ISetupBoard>
      })
  }
  loadFeeHeads() {

    if (this.challanTypeId.length > 0) {
      this.repoFeeHead.GetFindBy('s=>s.ChallanTypeId.ToString()=="' + this.challanTypeId + '"')
        .then(r => {
          this.feeHeadList = r as Array<IFeeFeeHead>
        })

    }
  }

  cancel() {

    this.data = {
      studentBoardLinkId: '',
      admissionFormId: '',
      returnTypeId: '',
      registrationCodeId: '',
      dueDate:new Date(),
      returnDate: new Date(),
      amount:0,
      statusId: 1,
      boardUniversityNo:''
    };

    this.boardId = '';
    this.challanTypeId = '';
    this.feeHeadId = '';
    this.amount = 0

    this.$modal.hide('CampusStudentLink-add-edit-model');
  }

  saveModel() {

    this.studentselectedList = [];
    this.studentselectedList = this.studentList.filter(e => e.isSelected == true);

    // this.studentselectedList.forEach(element => {
    //   //element.boardRegistrationNo=this.sessioncode+this.boardcode+element.boardRegistrationNo
    //   element.boardRegistrationNo=element.boardRegistrationNo+'-'+this.sessioncode+'-'+this.boardcode

    // });

    var dated = this.data.returnDate.getFullYear() + '/' + (this.data.returnDate.getMonth() + 1) + '/' + this.data.returnDate.getDate();
    if(this.data.amount>0)
    {
    
    var res = JSON.stringify(this.studentselectedList) + '?' + this.data.returnTypeId + '?' + this.data.registrationCodeId + '?' + helper.formateDate(this.data.dueDate) + '?' + this.data.amount + '?' + helper.formateDate(this.data.returnDate);
    this.repository.InsertStudentBoardLink((res)).then(r => {

      var msg = r.returnValue;


      this.$store.dispatch(StoreTypes.updateStatusBar, {

        text: msg,
        title: '',
        messageTypeId: PayloadMessageTypes.success
      });
      this.cancel();
    })
  }
  else

  {
    this.$store.dispatch(StoreTypes.updateStatusBar, {

      text: 'Please Enter Valid  Fee',
      title: '',
      messageTypeId: PayloadMessageTypes.error
    });


  }

  }
  get allowSubmit() {
    return this.boardCampusId.length > 0;
  }
  $v: Vuelidate<any>;
}
