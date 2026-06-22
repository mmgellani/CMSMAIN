/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { required, maxLength, minLength } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { IAdmissionBulitanSale, ISetupProgramDetails, ISetupGender, IAdmissionSaleType, ISetupCampusProgramVM, DDLModel, DDLGroupModel } from "../../../../models";
import { AdmissionBulitanSaleService, SetupProgramDetailsService, SetupGenderService, AdmissionSaleTypeService, SetupCampusProgramLinkService } from "../../../../service";

import * as helper from "../../../../helper";

import { AdmissionSaleTypeAddEdit } from "../../SaleType/add-edit";
import { IAdmissionInquiry } from "../../../../models/Admission/Inquiry";
import { AdmissionInquiryService } from "../../../../service/Admission/Inquiry";

type ValidateAdmissionInquiry = {
  data: IAdmissionInquiry;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateAdmissionInquiry> = {
  data: {
    inquiryNo: {
      required,
      maxLength: maxLength(50)
    },
    fullName: {
      required,
      maxLength: maxLength(100)
    },
    fatherName: {
      required,
      maxLength: maxLength(100)
    },
    contact: { required },
    dated: { required },
    campusProgramId: {required}
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html"),
})
export class AdmissionInquiryAddEdit extends Vue {
  private repository: AdmissionInquiryService;
  isActive: boolean = true;

  private data: IAdmissionInquiry = {
    inquiryId: "",
    campusProgramId: "",
    inquiryNo: 0,
    dated: new Date(),
    reference: "",
    fullName: "",
    fatherName: "",
    institution: "",
    email: "",
    area: "",
    academicInfo: "",
    statusId: 0,
    contact: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private campusId = ''
  private sessionId = ''
  private campusProgramId = '';
  private programDetailId = ''

  private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
  private ddl: Array<DDLModel> = []
  private programDDL: Array<DDLGroupModel> = []

  created() {
    this.repository = new AdmissionInquiryService(this.$store);
    // this.repository2 = new SetupProgramDetailsService(this.$store);
    // this.repository3 = new SetupGenderService(this.$store);
    // this.repository4 = new AdmissionSaleTypeService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    this.sessionId= event.params.SessionId;
    this.campusId= event.params.CampusId;
    this.loadProgramsOfCampus();
    Object.assign(this.data, event.params.model);
    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else if (this.data.statusId == 0) {
      this.isActive = false;
    }
  }

  loadProgramsOfCampus() {
    if (this.campusId.length > 0) {
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionId + "?" + this.campusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
        });
    }

}

  cancel() {
    this.$modal.hide("add-edit-model");
    this.$emit("submit");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.inquiryId = helper.newGuid();
        this.data.statusId = 1;
        this.repository.AddOne(this.data).then(() => {
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
