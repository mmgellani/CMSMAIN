/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { required, maxLength, maxValue } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes, IUser } from "../../../../../../model";

import {
  IAdmissionEligibilityCriteria,
  ISetupAdmissionType,
  ISetupCampusBuildingLink,
  ISetupCampusProgramLink,
  ISetupCampusProgramLinkVM,
  ISetupGender,
  IAdmissionEligibilityCriteriaVM
} from "../../../../models";
import {
  AdmissionEligibilityCriteriaService,
  SetupAdmissionTypeService,
  SetupCampusProgramLinkService,
  SetupGenderService
} from "../../../../service";

import * as helper from "../../../../helper";
import { ISetupCampusBuildingLinkVM } from "../../../../models/Setup/CampusBuildingLinkVM";

import { SetupAdmissionTypeAddEdit } from "../../../Setup/AdmissionType/add-edit";
import { IRootStoreState } from "../../../../../store";
import { State } from "vuex-class";
import moment from "moment";

type ValidateAdmissionEligibilityCriteria = {
  data: IAdmissionEligibilityCriteria;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateAdmissionEligibilityCriteria> = {
  data: {
    campusProgramId: { required },
    admissionTypeId: { required },
    genderId: { required },
    markPercentage: {
      required,
      maxValue: maxValue(100)
    },
    minPassingYear: { required },
    fromDob: { required },
    toDob: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html"),
  components: {
    AdmissionType: SetupAdmissionTypeAddEdit
  }
})
export class AdmissionEligibilityCriteriaAddEdit extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AdmissionEligibilityCriteriaService;
  private Admissiontyperepository: SetupAdmissionTypeService = null;
  AdmissiontypeList: Array<ISetupAdmissionType> = [];
  CampusProgramList: Array<ISetupCampusProgramLinkVM> = [];
  GenderList: Array<ISetupGender> = [];
  private CampusProgramrepository: SetupCampusProgramLinkService = null;
  private Genderrepository: SetupGenderService = null;
  private isActive: boolean = true;
  private data: IAdmissionEligibilityCriteria = {
    eligibilityCriteriaId: "",
    campusProgramId: "",
    admissionTypeId: "",
    genderId: "",
    markPercentage: 0,
    minPassingYear: new Date(),
    fromDob: new Date(),
    toDob: new Date(),
    statusId: 0,
    loggerId: ""
  };
  private sessionid: string = "";
  private campusid: string = "";
  private IsNewRecord: boolean = true;
  private title: string = "";
  private eligibiltyCriteriaModel: Array<IAdmissionEligibilityCriteriaVM> = [];
  private currentDate: Date = new Date();
  private canAdd: boolean = false;
  private datas: Array<IAdmissionEligibilityCriteriaVM> = [];

  created() {
    this.repository = new AdmissionEligibilityCriteriaService(this.$store);
    this.Admissiontyperepository = new SetupAdmissionTypeService(this.$store);
    this.CampusProgramrepository = new SetupCampusProgramLinkService(
      this.$store
    );
    this.Genderrepository = new SetupGenderService(this.$store);
    this.validatePage();
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    this.sessionid = event.params.sessionId;
    this.campusid = event.params.campusId;

    Object.assign(this.data, event.params.model);
    // this.repository.GetAll().then(
    //     res => {
    //         this.eligibiltyCriteriaModel = res as Array<IAdmissionEligibilityCriteriaVM>
    //     }
    // )
    this.Admissiontyperepository.GetFindBy("e=>e.StatusId==1").then(res => {
      this.AdmissiontypeList = res as Array<ISetupAdmissionType>;
    });
    this.CampusProgramrepository.GetAllVM(
      this.sessionid + "?" + this.campusid
    ).then(res => {
      this.CampusProgramList = res as Array<ISetupCampusProgramLinkVM>;
    });
    this.Genderrepository.GetFindBy("e=>e.StatusId==1").then(res => {
      this.GenderList = res as Array<ISetupGender>;
    });
    if (this.data.statusId == 1) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  }

  addNewAdmissionType() {
    this.$modal.show("AdmissionType-add-edit-model", { IsNewRecord: true });
  }
  loadAdmissionType() {
    this.Admissiontyperepository.GetFindBy("e=>e.StatusId==1").then(res => {
      this.AdmissiontypeList = res as Array<ISetupAdmissionType>;
    });
  }

  cancel() {
    this.$modal.hide("add-edit-model");
    this.$emit("submit");
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = true;
    } else {
      if ("setupAdmissionType" in this.user.claims == true) {
        if (this.user.claims["setupAdmissionType"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
      }
    }
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.datas = [];
        this.repository.GetEligibiltyCriteriaBySession(this.sessionid + "?" + this.campusid)
          .then(response => {
            this.datas = (response as Array<IAdmissionEligibilityCriteriaVM>)
            var dupData = 0;
            dupData = this.datas.filter(e => e.markPercentage == this.data.markPercentage && e.campusProgramId == this.data.campusProgramId && e.admissionTypeId == this.data.admissionTypeId && e.genderId == this.data.genderId && moment(e.fromDob).format('YYYY-MM-DD') == moment(this.data.fromDob).format('YYYY-MM-DD') && moment(e.toDob).format('YYYY-MM-DD') == moment(this.data.toDob).format('YYYY-MM-DD')).length;
            //   && moment(e.minPassingYear).format('YYYY-MM-DD') == moment(this.data.minPassingYear).format('YYYY-MM-DD')
            if (dupData > 0) {
              this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record Already Exist",
                title: "Warning",
                messageTypeId: PayloadMessageTypes.warning
              });
            }
            else {
              this.data.eligibilityCriteriaId = helper.newGuid();
              this.data.statusId = 1;
              this.data.loggerId = helper.newGuid();
              this.data.minPassingYear = new Date(moment(this.data.minPassingYear).format('YYYY-MM-DD'));
              // this.data.fromDob = new Date(this.data.fromDob);
              // this.data.toDob = new Date(this.data.toDob);
              this.data.toDob = new Date(moment(this.data.toDob).format('YYYY-MM-DD'));
              this.data.fromDob = new Date(moment(this.data.fromDob).format('YYYY-MM-DD'));
              if (new Date(this.data.minPassingYear) <= new Date(this.currentDate)) {
                this.repository.AddOne(this.data).then(() => {
                  this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Record has been inserted successfully",
                    title: "Success",
                    messageTypeId: PayloadMessageTypes.success
                  });
                  this.cancel();
                });
              } else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                  text: "Passing Year is Incorrect",
                  title: "Failed",
                  messageTypeId: PayloadMessageTypes.error
                });
              }
            }
          });
      } else {
        if (this.isActive == true) {
          this.data.statusId = 1;
        } else {
          this.data.statusId = 0;
        }
        // this.data.minPassingYear = new Date(this.data.minPassingYear);
        // this.data.fromDob = new Date(this.data.fromDob);
        // this.data.toDob = new Date(this.data.toDob);
        this.data.minPassingYear = new Date(moment(this.data.minPassingYear).format('YYYY-MM-DD'));
        this.data.toDob = new Date(moment(this.data.toDob).format('YYYY-MM-DD'));
        this.data.fromDob = new Date(moment(this.data.fromDob).format('YYYY-MM-DD'));

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
