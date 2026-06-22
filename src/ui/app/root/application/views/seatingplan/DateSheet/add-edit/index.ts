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

import { ISetupMedium, ISetupSession, DDLGroupModel, DDLModel, ICampusCityVM, ISetupCampusProgramLinkVM, ISetupRoomTypeBuildingVM, RoomBuildingLinkVM } from "../../../../models";
import { SetupMediumService, SeatingPlanDateSheetService, SetupSessionService, SetupCampusService, SetupCampusProgramLinkService, SetupRoomBuildingLinkService } from "../../../../service";

import * as helper from "../../../../helper";
import { ISeatingPlanDateSheet } from "../../../../models/Seating Plan/datesheet";
import { formulateSingle } from "../../../../helper";

type ValidateSeatingPlanDateSheet = { data: ISeatingPlanDateSheet; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSeatingPlanDateSheet> = {
  data: {
    // campusProgramId: { required },
    // examName: { required },
    roomBuildingLinkId: { required },
    // sessionId: { required },
    // campusId: { required },
    campusProgramId: { required },
    examName: {
      required,
      maxLength: maxLength(30)
    }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'datesheet-add-edit-model',
  template: require('./index.html')
})
export class DateSheetAddEdit extends Vue {
  private repository: SeatingPlanDateSheetService;
  private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
  private sessionList: Array<ISetupSession> = []
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
  private roombuildingserv: SetupRoomBuildingLinkService = new SetupRoomBuildingLinkService(this.$store)


  isActive: boolean = true;
  private data: ISeatingPlanDateSheet = {
    dateSheetId: '',
    campusProgramId: '',
    examName: '',
    roomBuildingLinkId: '',
    statusId: 1
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private sessionId: string = "";
  private campusId: string = "";
  private campusProgramId: string = "";
  private roomBuildingLinkId: string = "";
  private cityDDL: Array<DDLGroupModel> = []
  private campusddl: Array<DDLModel> = []
  campusCityList: ICampusCityVM[];
  indexId = 0;
  cities: any[];
  campusProgramLinkList: Array<ISetupCampusProgramLinkVM> = [];
  roombuildingdata: Array<RoomBuildingLinkVM> = [];

  created() {
    this.repository = new SeatingPlanDateSheetService(this.$store);
    this.campusCityList = [];
    // this.loadCityCampus();

  }

  beforeModalOpen(event) {
    // debugger;
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    if (this.IsNewRecord == false) {

      this.data.dateSheetId = event.params.model.dateSheetId;
      this.data.campusProgramId = event.params.model.campusProgramId;
      this.data.examName = event.params.model.examName;
      this.data.roomBuildingLinkId = event.params.model.roomBuildingLinkId;
      this.data.statusId = event.params.model.statusId;
      this.campusId = event.params.model.campusId;
      this.sessionId = event.params.model.sessionId;
      // this.loadProgramsOfCampus();
    }
    else {
      Object.assign(this.data, event.params.model);
    }
    
    this.$v.$reset();
    this.loadSession();
    this.loadCityCampus();
    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else {
      this.isActive = false;
    }
  }

  cancel() {
    this.$emit("submit");
    this.sessionId = '';
    this.campusId = '';
    this.$modal.hide('datesheet-add-edit-model');
  }

  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionList = r as Array<ISetupSession>
      })
  }

  LoadRoomBuildingLink() {
    if (this.data.campusProgramId.length > 0) {
      this.roombuildingdata = [];
      this.roombuildingserv.GetAllRoomBuildingLink(this.campusId).then(r => {
        this.roombuildingdata = r as Array<RoomBuildingLinkVM>;


        this.roombuildingdata.forEach(element => {
          element.name = element.name + '-' + element.fullName + '-' + element.capacity
        });
        this.options.data = formulateSingle(this.roombuildingdata, "roomBuildingLinkId", "name");
      });
    }
  }

  private formatFunction(state) {
    var oneItem = this.roombuildingdata.filter(e => e.roomBuildingLinkId == state.id);

    var $state = $(
      oneItem ? oneItem.length > 0 ?
        '<span><strong>Room:</strong>: ' + oneItem[0].name + ' <strong>Campus:</strong>: ' + oneItem[0].fullName + ' <strong>Capacity:</strong>: ' + oneItem[0].capacity + '</span>' : '' : ''
    );
    return $state;
  }
  options = {
    templateResult: this.formatFunction,
    templateSelection: this.formatFunction,
    data: []
  };
  private selectTemplate = "name,fullName,capacity,<strong>Room</strong>: {0} <strong>Campus</strong>: {1} <strong>Capacity</strong>: {2}";


  loadProgramsOfCampus() {
    if (this.campusId.length > 0) {
      var key = this.sessionId + "?" + this.campusId;
      this.campusProgramLinkList = [];
      this.campusProgramLinkRepo.GetAllVM(key).then(r => {
        this.campusProgramLinkList = r as Array<ISetupCampusProgramLinkVM>;
      });
    }
  }

  // loadCityCampus() {
  //   if (this.sessionId.length > 0) {
  //     this.campusddl = [];
  //     this.cityDDL = [];
  //     let oldObj: ICampusCityVM;
  //     this.campusRepo.GetCityVM()
  //       .then(r => {
  //         this.campusCityList = r as Array<ICampusCityVM>;
  //         this.cities = [];
  //         this.campusCityList.forEach(element => {
  //           if (this.cities.indexOf(element.cityName) == -1) {
  //             this.cities.push(element.cityName);
  //           }
  //         });
  //       })
  //   }
  // }

  loadCityCampus() {
    if (this.sessionId.length > 0) {
      this.campusddl = [];
      this.cityDDL = [];
      let oldObj: ICampusCityVM;
      this.campusRepo.GetCityVM().then(r => {
        this.campusCityList = r as Array<ICampusCityVM>;
      });
    }
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.dateSheetId = helper.newGuid();
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

      // this.cancel();
    }
  }
  get allowSubmit() {
    return (
      this.data.campusProgramId.length > 0 &&
      this.data.examName.length > 0 &&
      this.data.roomBuildingLinkId.length > 0
    );
  }
  $v: any;
}
