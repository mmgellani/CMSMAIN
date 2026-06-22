import * as helper from "../../../../helper";

import {
  ISetupBuilding,
  ISetupRoom,
  ISetupRoomBuildingLink
} from "../../../../models";
import {
  SetupBuildingService,
  SetupRoomBuildingLinkService,
  SetupRoomService
} from "../../../../service";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";
import { maxLength, required } from "vuelidate/lib/validators";

import Component from "vue-class-component";
import { Login } from './../../../../../../components/login/login';
import { PayloadMessageTypes } from "../../../../../../model";
import { SetupBuildingAddEdit } from "../../Building/add-edit";
import { SetupRoomAddEdit } from "../../Room/add-edit";
import { StoreTypes } from "../../../../../../store";
import Vue from "vue";

/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */















type ValidateSetupRoomBuildingLink = {
  data: ISetupRoomBuildingLink;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupRoomBuildingLink> = {
  data: {
    roomId: { required },
    buildingId: { required },
    remarks: {
      required,
      maxLength: maxLength(100)
    }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html"),
  components: {
    Room: SetupRoomAddEdit,
    Building: SetupBuildingAddEdit
  }
})
export class SetupRoomBuildingLinkAddEdit extends Vue {
  private repository: SetupRoomBuildingLinkService;
  private Roomrepository: SetupRoomService;
  private Buildingrepository: SetupBuildingService;

  isActive: boolean = true;
  roomList: Array<ISetupRoom> = [];
  buildingList: Array<ISetupBuilding> = [];
  private data: ISetupRoomBuildingLink = {
    roomBuildingLinkId: "",
    roomId: "",
    buildingId: "",
    remarks: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private subCityId: string = '';

  created() {
    this.repository = new SetupRoomBuildingLinkService(this.$store);
    this.Roomrepository = new SetupRoomService(this.$store);
    this.Buildingrepository = new SetupBuildingService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    if(this.IsNewRecord==false)
    {
      this.data.roomBuildingLinkId=event.params.model.roomBuildingLinkId;
      this.data.buildingId=event.params.model.buildingId;
      this.data.roomId=event.params.model.roomId;
      this.data.remarks=event.params.model.remarks;
      this.data.statusId=event.params.model.statusId;
      this.data.loggerId=event.params.model.loggerId;
    }
    //Object.assign(this.data, event.params.model);
    this.subCityId = event.params.SubCityId;
    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else if (this.data.statusId == 0) {
      this.isActive = false;
    }
    this.loadRoom();
    this.loadBuilding();

  }

  cancel() {
    this.$modal.hide('add-edit-model');
    this.$emit("submit");
  }

  addNewRoom() {
    this.$modal.show("Room-add-edit-model", { IsNewRecord: true });
  }
  loadRoom() {
    this.Roomrepository.GetFindBy("e=>e.StatusId==1").then(res => {
      this.roomList = res as Array<ISetupRoom>;
    });
  }

  loadBuilding() {
    this.Buildingrepository.GetFindBy('s=>s.SubCityId.ToString()=="' + this.subCityId + '" && s.StatusId == 1').then(res => {
      this.buildingList = res as Array<ISetupBuilding>;
    });
  }

  addNewBuilding() {
    this.$modal.show("Building-add-edit-model", { IsNewRecord: true });
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.roomBuildingLinkId = helper.newGuid();
        this.data.loggerId = helper.newGuid();
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

      this.cancel();
    }
  }
  // saveModel() {
  //   this.$v.$touch();
  //   if (!this.$v.$invalid) {
  //     if (this.IsNewRecord) {
  //       this.data.roomBuildingLinkId = helper.newGuid();
  //       this.data.loggerId = helper.newGuid();
  //       this.data.statusId = 1;
  //       //alert(JSON.stringify(this.data))
  //       this.repository.AddOne(this.data).then(() => {
  //         this.$store.dispatch(StoreTypes.updateStatusBar, {
  //           text: "Record has been inserted successfully",
  //           title: "Success",
  //           messageTypeId: PayloadMessageTypes.success
  //         });
  //         this.cancel();
  //       });
  //     } else {
  //       if (this.isActive == true) {
  //         this.data.statusId = 1;
  //       } else {
  //         this.data.statusId = 0;
  //       }
  //       this.repository.Update(this.data).then(() => {
  //         this.$store.dispatch(StoreTypes.updateStatusBar, {
  //           text: "Record has been updated successfully",
  //           title: "Success",
  //           messageTypeId: PayloadMessageTypes.success
  //         });
  //         this.cancel();
  //       });
  //     }

  //     this.cancel();
  //   }
  // }
  // get allowSubmit() {
  //   return (
  //     this.data.roomId.length > 0 &&
  //     this.data.buildingId.length > 0 &&
  //     this.data.remarks.length > 0
  //   );
  // }
  $v: any;
}
