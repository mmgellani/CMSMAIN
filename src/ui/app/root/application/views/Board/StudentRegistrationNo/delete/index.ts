import * as helper from "../../../../helper";

import { SetupBoardService, SetupGenderService } from "../../../../service";

import { BoardProgramCampusService } from "../../../../service/Board/ProgramCampus";
import { BoardStudentBoardLinkService } from "../../../../service/Board/BoardStudentBoardLink";
import Component from "vue-class-component";
import { IBoardProgramCampus } from "../../../../models/Board/ProgramCampus";
import { IBoardStudentBoardLink, StudentBoardRegistration } from "../../../../models/Board/StudentBoardLink";
import { IRegistrationCode } from "../../../../models/Board/RegistrationBoard";
import { IReturnType } from "../../../../models/Board/ReturnType";
import { ISessionBoardFeeVM } from "../../../../models/Board/sessionboardfee";
import { ISetupGender } from "../../../../models/Setup/Gender";
import { PayloadMessageTypes } from "../../../../../../model";
import { RegistrationCodeService } from "../../../../service/Board/registrationCode";
import { ReturnTypeService } from "../../../../service/Board/ReturnType";
import { SessionBoardFeeService } from "../../../../service/Board/sessionboardfee";
import { StoreTypes } from "../../../../../../store";
import Vue from "vue";

/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */





















@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class BoardStudentBoardLinkEdit extends Vue {
  private repository: BoardStudentBoardLinkService;
  programId:string='';
  boardid:string='';
  private ReturnTypeRepo: ReturnTypeService = new ReturnTypeService(this.$store);
  private GenderRepo: SetupGenderService = new SetupGenderService(this.$store);
  private dataex: Array<ISessionBoardFeeVM> = [];
  private boardReturnTypeList: Array<IReturnType> = [];
  private registrationcodelist: Array<IRegistrationCode> = [];
  private Genderlist: Array<ISetupGender> = [];
  private genderid='';
  private registratincodeRepo: RegistrationCodeService = new RegistrationCodeService(this.$store);


private registrationCode = '';
private boardUniversityNo = '';
private sessionName = '';
private registrationCodeId = '';

  private data: StudentBoardRegistration = {
    
    admissionFormId: '',
    rollNo: '',
    fullName: '',
    fatherName: '',
    boardUniversityNo: '',
    sectionName:''
  };
  private title: string = "Edit Record";
  private refresh: Array<IBoardStudentBoardLink> = [];


  created() {
    this.repository = new BoardStudentBoardLinkService(this.$store);
    // this.loadBoardCampus();

  }

  beforeModalOpen(event) {
    Object.assign(this.data, event.params.model);
    
    // this.programId = event.params.PROGRAMID;
    // this.boardid = event.params.BOARDID;
    this.registrationCodeId = event.params.RegistrationCodeId;
    this.sessionName = event.params.SessionName;
    this.registratincodeRepo.GetAll().then(r => {
      this.registrationcodelist = r as Array<IRegistrationCode>
      this.registrationCode = this.registrationcodelist.find(e => e.registrationCodeId == this.registrationCodeId).title
      this.sessionName = this.sessionName.substring(0, 4);
     this.boardUniversityNo =  this.sessionName + '-' + this.registrationCode + '-'

    });
    


    // this.loadBoardCampus();
    // this.loadGender();
    
  }


  loadBoardCampus() {
    this.boardReturnTypeList = [];
    this.ReturnTypeRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.boardReturnTypeList = r as Array<IReturnType>
      })
  }

  loadGender() {
    this.Genderlist = [];
    this.GenderRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.Genderlist = r as Array<ISetupGender>
      })
  }



  cancel() {
    this.$emit("submit");
    this.$modal.hide("delete-model");
  }

  saveModel() {
    this.data.boardUniversityNo =   this.boardUniversityNo;

    var res = '[' + JSON.stringify(this.data) + ']';
    this.repository.InsertStudentRegistration((res)).then(r => {

      var msg = r.returnValue;


      this.$store.dispatch(StoreTypes.updateStatusBar, {

        text: msg,
        title: 'success',
        messageTypeId: PayloadMessageTypes.success
      });
      this.cancel();
    })

   
    // var key=this.data.studentBoardLinkId+'?'+this.data.returnTypeId+'?'+this.data.registrationCodeId+'?'+helper.formateDate(this.data.dueDate)+'?'+this.data.amount+'?'+helper.formateDate(this.data.returnDate)+'?'+this.data.boardUniversityNo+'?'+'1'
    // this.repository.UpdateStudentBoardLink(key).then(r=>{
      
    //   this.$store.dispatch(StoreTypes.updateStatusBar, {
    //     text: r.returnValue,
    //     title: 'Success',
    //     messageTypeId: PayloadMessageTypes.success
    // });
    //  this.$modal.hide('delete-model');

    // })




  }
}
