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

import {
  ISetupCampusProgramLink,
  ISetupProgramDetails,
  ISetupCampus,
  ISetupSession,
  IAttendenceData,
  DDLModel,
  DDLGroupModel,
  ISetupCampusProgramVM,
  ISetupProgramDetailsVM,
  ISetupCampusProgramLinkVM
} from "../../../../models";
import {
  SetupCampusProgramLinkService,
  SetupProgramDetailsService,
  SetupCampusService,
  SetupProgramService,
  SetupSessionService
} from "../../../../service";

import * as helper from "../../../../helper";

type ValidateSetupCampusProgramLink = {
  data: ISetupCampusProgramLink;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupCampusProgramLink> = {
  data: {
    programDetailId: { required }
  }

};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html")
})
export class SetupCampusProgramLinkAddEdit extends Vue {

  private programDetailId = ''
  private datas: Array<IAttendenceData> = [];
  private ddl: Array<DDLModel> = []
  private programDDL: Array<DDLGroupModel> = []
  private campusId: string = "";
  private sessionId: string = "";
  private campusProgramLinkList: Array<ISetupCampusProgramLinkVM> = [];
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    this.$store
  );

  private isActive: boolean = true;
  private repository: SetupCampusProgramLinkService;

  private programDetailList: Array<ISetupProgramDetailsVM> = [];
  private campusList: Array<ISetupCampus> = [];
  private sessionList: Array<ISetupSession> = [];

  private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(this.$store);
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private sessionRepo: SetupSessionService = new SetupSessionService(
    this.$store
  );

  private data: ISetupCampusProgramLink = {
    campusProgramId: "",
    campusId: "",
    programDetailId: "",
    statusId: 0,
    loggerId: "",
    sessionId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private dataEx: Array<ISetupCampusProgramLinkVM> = [];

  created() {
    this.repository = new SetupCampusProgramLinkService(this.$store);

  }

  loadProgramsOfCampus() {
    this.programDetailId = ''
    this.ddl = [];
    this.programDDL = [];
    let oldObj: ISetupProgramDetailsVM;
    this.programDetailRepo.GetAllVM('2')
      .then(r => {
        this.programDetailList = r as Array<ISetupProgramDetailsVM>
      })
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model) as ISetupCampusProgramLink;
    this.campusId = event.params.model.campusId;
    this.sessionId = event.params.model.sessionId;

    this.loadProgramsOfCampus();

    if (this.IsNewRecord) {

    } else {
      if (this.data.statusId == 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
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
        this.dataEx = [];
        this.repository.GetAllVM(this.sessionId + "?" + this.campusId)
          .then(res => {
            this.dataEx = (res as Array<ISetupCampusProgramLinkVM>)
            var dupData = 0;
            dupData = this.dataEx.filter(e => e.programDetailId == this.data.programDetailId).length;
            if (dupData > 0) {
              this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record Already Exists",
                title: "Warning",
                messageTypeId: PayloadMessageTypes.warning
              });
            }
            else {
              this.data.loggerId = helper.newGuid();
              this.data.campusProgramId = helper.newGuid();
              this.data.statusId = 1;
              this.repository.AddOne(this.data).then(() => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                  text: "Record has been inserted successfully",
                  title: "Success",
                  messageTypeId: PayloadMessageTypes.success
                });
                this.cancel();
              });
            }
          });
      }
      else {
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
  $v: any
}
