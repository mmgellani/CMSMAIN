import * as helper from "../../../../helper";

import { SetupBoardService, SetupGenderService } from "../../../../service";

import { BoardProgramCampusService } from "../../../../service/Board/ProgramCampus";
import { BoardStudentBoardLinkService } from "../../../../service/Board/BoardStudentBoardLink";
import Component from "vue-class-component";
import { IBoardProgramCampus } from "../../../../models/Board/ProgramCampus";
import { IBoardStudentBoardLink, StudentBoardRegistration, StudentBoardExamEntry, BoardUniRolNoslip, boardUniResultCards } from "../../../../models/Board/StudentBoardLink";
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
import { SessionBoardExamTypeService } from "../../../../service/Board/BoardExamType";
import { IBoardExamType } from "../../../../models/Board/BoardExamType";
import { BoardUniversityResultCard } from "../list";

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
  
  private SessionBoardExamTyperepository: SessionBoardExamTypeService;
    private ExamTypedata: Array<IBoardExamType> = [];

    batch = [{ item: 'Pass',show:'Pass' },{ item: 'Fail',show:'Fail'},{item: 'Pending',show:'Pending'}]





  private data: boardUniResultCards = {
    
   
    boardUniRollNoSlipId:'',
    boardUniResultCardId:'',
    passFailCriteria:'',
    statusId:1
  };
  private title: string = "Edit Record";
  private refresh: Array<IBoardStudentBoardLink> = [];


  created() {
    this.repository = new BoardStudentBoardLinkService(this.$store);
    this.SessionBoardExamTyperepository=new SessionBoardExamTypeService(this.$store)


  }
  

  beforeModalOpen(event) {
    // Object.assign(this.data, event.params.model);
    this.data.boardUniResultCardId=event.params.model.boardUniResultCardId;
    this.data.boardUniRollNoSlipId=event.params.model.boardUniRollNoSlipId;
    this.data.passFailCriteria=event.params.model.passFailCriteria
    


   
 
    
  }


  

  cancel() {
    this.$emit("submit");
    this.$modal.hide("delete-model");
  }

  saveModel() {
    
    
    this.repository.UpdateboardUniResultCard((this.data)).then(r => {

      


      this.$store.dispatch(StoreTypes.updateStatusBar, {

        text: 'Data Updated SuccessFully',
        title: 'success',
        messageTypeId: PayloadMessageTypes.success
      });
      this.cancel();
    })

   
   




  }
}
