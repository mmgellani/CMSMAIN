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
  model: ISetupCampusProgramLink;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupCampusProgramLink> = {
  model: {
    programDetailId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html")
})
export class SetupCampusProgramLinkAddEditBulk extends Vue {

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
  private programDetailCbList: any = []
  created() {
    this.repository = new SetupCampusProgramLinkService(this.$store);

  }

  // loadProgramDetail() {
  //   this.programDetailRepo.GetFindBy("e=>e.StatusId==1").then(r => {
  //     this.programDetailList = r as Array<ISetupProgramDetails>;
  //   });
  // }

  // loadProgramsOfCampus() {

  //   var key = this.sessionId + "?" + this.campusId;
  //   this.campusProgramLinkRepo.GetAllVM(key)
  //     .then(r => {
  //       this.campusProgramLinkList = r as Array<ISetupCampusProgramLinkVM>;
  //     });
  // }

  loadProgramsOfCampus() {
    this.programDetailId = ''
    this.ddl = [];
    this.programDDL = [];
    this.programDetailCbList = []
    let oldObj: ISetupProgramDetailsVM;
    this.programDetailRepo.GetAllVM('2')
      .then(r => {
        this.programDetailList = r as Array<ISetupProgramDetailsVM>
        this.programDetailList.forEach(e => {
          this.programDetailCbList.push({ programDetailId: e.programDetailId, description: e.description, isChecked: false })
        })
      })
  }
  oldkey = ''
  beforeModalOpen(event) {
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model) as ISetupCampusProgramLink;
    this.campusId = event.params.model.campusId;
    this.sessionId = event.params.model.sessionId;

    this.loadProgramsOfCampus();

    if (this.IsNewRecord) {

    } else {
      this.oldkey = this.sessionId + "?" + this.campusId + "?" + this.data.programDetailId

      if (this.data.statusId == 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    }
  }
  get isDisabled() {
    return this.programDetailCbList.filter(s => s.isChecked).length == 0 ? true : false
  }
  cancel() {
    this.$modal.hide("add-edit-modelBulk");
    this.$emit("submit");
  }

  saveModel() {
    if (this.IsNewRecord) {
      this.data.loggerId = helper.newGuid();
      this.data.campusProgramId = helper.newGuid();
      this.data.statusId = 1;
      var key = this.sessionId + "?" + this.campusId + "?" + JSON.stringify(this.programDetailCbList.filter(e => e.isChecked))
      this.repository.AddBulk(key)
        .then(r => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been inserted successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
          this.cancel();
        })
        
      // var key = this.sessionId + "?" + this.campusId + "?" + this.data.programDetailId
      // this.repository.GetAllActive(key)
      //   .then(r => {
      //     var data = r as Array<any>
      //     if (data.length > 0) {
      //       this.$store.dispatch(StoreTypes.updateStatusBar, {
      //         text: "Record already Exist",
      //         title: "Duplicate",
      //         messageTypeId: PayloadMessageTypes.error
      //       });
      //     }
      //     else {
      //       this.repository.AddOne(this.data).then(() => {
      //         this.$store.dispatch(StoreTypes.updateStatusBar, {
      //           text: "Record has been inserted successfully",
      //           title: "Success",
      //           messageTypeId: PayloadMessageTypes.success
      //         });
      //         this.cancel();
      //       });
      //     }
      //   })

    } else {
      var key = this.sessionId + "?" + this.campusId + "?" + this.data.programDetailId

      if (this.isActive == true) {
        this.data.statusId = 1;
      } else {
        this.data.statusId = 0;
      }
      if (key == this.oldkey) {
        this.repository.Update(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been updated successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
          this.cancel();
        });
      }
      else {
        this.repository.GetAllActive(key)
          .then(r => {
            var data = r as Array<any>
            // if(key!=this.oldkey){

            // }
            if (data.length > 0) {
              this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already Exist",
                title: "Duplicate",
                messageTypeId: PayloadMessageTypes.error
              });
            }
            else {
              this.repository.Update(this.data).then(() => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                  text: "Record has been updated successfully",
                  title: "Success",
                  messageTypeId: PayloadMessageTypes.success
                });
                this.cancel();
              });
            }
          })
      }


    }

  }
  get allowSubmit() {
    return this.data.programDetailId.length > 0;
  }
  $v: Vuelidate<any>;
}
