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
// import { ISessionDuration } from "../../../../models/Examination/CampusFailCriteriaMapping";
// import { SessionDurationService } from "../../../../service/Examination/CampusFailCriteriaMapping";
import { IExaminationFailMasterCriteria, IExaminationVWFailMasterCriteria } from "../../../../models/Examination/FailCriteria";
import { ExaminationFailCriteriaService } from "../../../../service/Examination/FailCriteria";
import { IExaminationExamType } from "../../../../models";
import { ExaminationExamTypeService } from "../../../../service";
import { SessionDurationService } from "../../../../service/Attendance/SessionDuration";
import { ISessionDuration } from "../../../../models/Attendance/SessionDuration";

type ValidateSessionDuration = { data: ISessionDuration; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSessionDuration> = {
  data: {
   
    startDate: { required },
    endDate: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'SessionDuration-add-edit-model',
  template: require('./index.html')
})
export class SessionDuration extends Vue {
  private repository: SessionDurationService;
  isActive: boolean = true;
  private data: ISessionDuration = {
    sessionDurationId: "",
    campusProgramId: "",
    classId: "",
    startDate: new Date(),
    endDate: new Date(),
    statusId: 0,
  };

  private failCriteriaList: Array<IExaminationVWFailMasterCriteria> = [];
  private failCriteriaRepo: ExaminationFailCriteriaService = new ExaminationFailCriteriaService(this.$store);

  private failMasterId: string = "";
  private datestring: Date = new Date();
  private examTypeId: string = "";


  private examTypeList: Array<IExaminationExamType> = [];
  private examTypeRepo: ExaminationExamTypeService = new ExaminationExamTypeService(this.$store);

  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SessionDurationService(this.$store);

    this.datestring = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    this.loadFailCriteria();
    this.loadExamType();
    if (this.data.statusId == 1) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  }

  loadFailCriteria() {
    this.failCriteriaList = [];
    this.failCriteriaRepo.GetFindBy('s=>s.StatusId==1')
      .then(r => {
        this.failCriteriaList = r as Array<IExaminationFailMasterCriteria>
        this.failCriteriaList.forEach(element => {

          element.fullName=element.fullName+'-'+element.fail_In+'-'+element.failMarks+'-'+element.absentConsiderFail
          
        });
      })
  }

  loadExamType() {
    this.examTypeList = [];
    this.examTypeRepo.GetFindBy('s=>s.StatusId==1')
      .then(r => { this.examTypeList = r as Array<IExaminationExamType> });
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide('SessionDuration-add-edit-model');
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.sessionDurationId = helper.newGuid();
        // this.data.failMasterId = this.failMasterId;
        this.data.statusId = 1;
        // this.data.loggerId = helper.newGuid();
        // this.data.examTypeId = this.examTypeId; datestringdatestring
        this.data.startDate = new Date(helper.formateDate(this.data.startDate));
        this.data.endDate = new Date(helper.formateDate(this.data.endDate));

        this.repository.AddOne(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been inserted successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
          this.cancel();
        });
      } else {
        this.data.startDate = new Date(helper.formateDate(this.data.startDate));
        this.data.endDate = new Date(helper.formateDate(this.data.endDate));
        if (this.isActive == true) {
          this.data.statusId = 1;
        } else {
          this.data.statusId = 0;
        }
        // this.data.failMasterId = this.failMasterId;
        this.repository.Update(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been updated successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
          this.cancel();
        });
      }
    }
  }
  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
  }
  $v: any;
}
