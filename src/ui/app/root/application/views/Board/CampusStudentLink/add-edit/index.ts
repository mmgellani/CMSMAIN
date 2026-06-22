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
import { IStudentEnrolledVM } from "../../../../models";
import { RegistrationEnrollmentsService } from "../../../../service";

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
  private repository: BoardCampusStudentLinkService;
  isActive: boolean = true;
  private data: IBoardCampusStudentLink = {
    campusStudentLinkId: '',
    admissionFormId: '',
    boardCampusId: '',
    statusId: 0
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  private boardCampusId: string = "";
  private boardCampusList: Array<IBoardBoardCampus> = [];
  private boardCampusRepo: BoardBoardCampusService = new BoardBoardCampusService(this.$store);

  private studentList: Array<IStudentEnrolledVM> = [];
  private enrolledStudentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store);

  private campusId = '';
  private sessionId = '';
  private programDetailId = '';
  private classId = '';
  private sectionId = '';
  private campusStudentList: any = [];

  private selectAll: boolean = false;
  private isSelected: boolean = false;



  created() {
    this.repository = new BoardCampusStudentLinkService(this.$store);
    this.loadBoardCampus();
    // this.isChecked();
    // this.loadEnrolledStudents();
  }

  loadBoardCampus() {
    this.boardCampusList = [];
    this.boardCampusRepo.GetBoardCampus('e=>e.StatusId==1')
      .then(r => {
        this.boardCampusList = r as Array<IBoardBoardCampus>
      })
  }

  loadEnrolledStudents() {
    this.studentList = [];
    var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + this.classId + "?" + this.sectionId

    this.enrolledStudentRepo.GetStudentsByEnrollment(key)
      .then(r => {
        this.studentList = r as Array<IStudentEnrolledVM>
      })
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
    Object.assign(this.data, event.params.model);
    this.sessionId = event.params.SessionId;
    this.campusId = event.params.CampusId;
    this.programDetailId = event.params.ProgramDetailId;
    this.classId = event.params.ClassId;
    this.sectionId = event.params.SectionId;
    this.loadEnrolledStudents();
    this.selectAll = false;
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide('CampusStudentLink-add-edit-model');
  }

  saveModel() {
    if (this.IsNewRecord) {
      var list = [];
      this.campusStudentList = [];
      this.studentList.filter(s => s.isSelected).forEach(r => {
        list.push({ admissionFormId: r.admissionFormId, boardCampusId: this.boardCampusId })
      })
      this.repository.AddMany(JSON.stringify(list)).then(() => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Record has been inserted successfully",
          title: "Success",
          messageTypeId: PayloadMessageTypes.success
        });
        this.cancel();
      });
    } else {
      if (this.isActive == true) {
        this.data.statusId = 1;
      } else {
        this.data.statusId = 0;
      }

      this.repository.Update(list).then(() => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Record has been updated successfully",
          title: "Success",
          messageTypeId: PayloadMessageTypes.success
        });
        this.cancel();
      });
    }

    this.cancel();
  }
  get allowSubmit() {
    return this.boardCampusId.length > 0;
  }
  $v: Vuelidate<any>;
}
