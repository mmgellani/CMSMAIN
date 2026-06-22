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

import { ISetupMedium, CampusProgramData, IExaminationExamType } from "../../../../models";
import { SetupMediumService, SetupCampusProgramLinkService, ExaminationExamTypeService } from "../../../../service";

import * as helper from "../../../../helper";
import { IExaminationCampusGradingMapping } from "../../../../models/Examination/CampusGradingMapping";
import { ExaminationCampusGradingMappingService } from "../../../../service/Examination/CampusGradingMapping";
import { ExaminationGradingMasterService } from "../../../../service/Examination/GradingMaster";
import { GradingMasterDetailData } from "../../../../models/Examination/GradingCriteria";
import { ISetupMonth } from "../../../../models/Setup/Month";
import { SetupMonthService } from "../../../../service/Setup/Month";

type ValidateIExaminationCampusGradingMapping = { data: IExaminationCampusGradingMapping; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateIExaminationCampusGradingMapping> = {
  data: {
    gradingMasterId: { required },
    examTypeId: { required }

  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'add-edit-model',
  template: require('./index.html')
})
export class ExaminationCampusGradingMappingAddEdit extends Vue {
  private repository: ExaminationCampusGradingMappingService = null;
  private CampusProgramlinkrepository: SetupCampusProgramLinkService = null;
  private GradingMasterrepository: ExaminationGradingMasterService = null;
  private monthRepo: SetupMonthService = new SetupMonthService(this.$store);
  private examTypeRepo: ExaminationExamTypeService = new ExaminationExamTypeService(this.$store)


  private CampusProgramLinkList: Array<CampusProgramData> = [];

  private GradingMasterDetailData: Array<GradingMasterDetailData> = [];
  private datestring: Date = new Date();
  private monthList: Array<ISetupMonth> = [];
  private examTypeId = '';
  private examTypeList: Array<IExaminationExamType> = [];
  private date: Date = new Date();

  isActive: boolean = true;
  private data: IExaminationCampusGradingMapping = {
    campusGradingLinkId: "",
    campusProgramId: "",
    gradingMasterId: "",
    statusId: 1,
    loggerId: "",
    examTypeId: "",
    month: new Date()
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new ExaminationCampusGradingMappingService(this.$store);
    this.CampusProgramlinkrepository = new SetupCampusProgramLinkService(this.$store);
    this.GradingMasterrepository = new ExaminationGradingMasterService(this.$store);
    this.datestring = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    // this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.CampusProgramLinkList = [];
    this.GradingMasterDetailData = [];
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);

    this.GradingMasterrepository.GetGradingMasterDetail().then(r => {
      this.GradingMasterDetailData = r as Array<GradingMasterDetailData>
    });
    this.loadExamType();
    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else {
      this.isActive = false;
    }
  }

  cancel() {
    this.$modal.hide('add-edit-model');

    this.data = {
      campusGradingLinkId: "",
      campusProgramId: "",
      gradingMasterId: "",
      statusId: 1,
      loggerId: "",
      examTypeId: "",
      month: new Date()
    };

    this.$emit('submit');
  }
  loadMonth() {
    this.monthList = [];
    this.monthRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.monthList = r as Array<ISetupMonth>
      })
  }
  loadExamType() {
    this.examTypeRepo.GetFindBy('s=>s.StatusId!=2')
      .then(r => { this.examTypeList = r as Array<IExaminationExamType> });
  }
  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.campusGradingLinkId = helper.newGuid();
        this.data.month = new Date(this.datestring.getFullYear(), this.datestring.getMonth(), 10);
        this.data.statusId = 1;
        this.data.loggerId = helper.newGuid();
        this.repository.AddOne(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been inserted successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
          this.cancel();
        });
      } else {
        this.data.month = new Date(this.datestring.getFullYear(), this.datestring.getMonth(), 10);
        if (this.isActive == true) {
          this.data.statusId = 1;
        } else {
          this.data.statusId = 0;
        }
        this.repository.Update(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been updated successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
          this.cancel();
        });
      }

      // this.cancel();
    }
  }
  get allowSubmit() {
    return (
      this.data.campusProgramId.length > 0 &&
      this.data.gradingMasterId.length > 0

    );
  }
  $v: any;
}
