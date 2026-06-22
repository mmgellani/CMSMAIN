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

import { ISetupRoom, ISetupBuilding, ISetupRoomType } from "../../../../models";
import {
  SetupRoomService,
  SetupRoomTypeService,
  SetupBuildingService
} from "../../../../service";

import * as helper from "../../../../helper";
import { SetupRoomTypeList } from "../../../../views";

import { SetupRoomTypeAddEdit } from '../../RoomType/add-edit';
import { SetupBuildingAddEdit } from '../../Building/add-edit';
import { max } from "moment";

type ValidateSetupRoom = { data: ISetupRoom, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupRoom> = {
  data: {
    buildingId: { required },
    fullName: {
      required,
      maxLength: maxLength(50)
    },
    description: {
      required,
      maxLength: maxLength(50)
    },
    capacity: { required },
    roomTypeId: { required },
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'Room-add-edit-model',
  template: require('./index.html'),
  components: {
    'RoomType': SetupRoomTypeAddEdit,
    'Building': SetupBuildingAddEdit
  }
})
export class SetupRoomAddEdit extends Vue {
  private repository: SetupRoomService;
  private RoomTyperepository: SetupRoomTypeService = null;
  private BuildingRepository: SetupBuildingService = null;
  isActive: boolean = true;
  RoomTypeList: Array<ISetupRoomType> = []
  BuidingList: Array<ISetupBuilding> = []
  private data: ISetupRoom = {
    roomId: '', fullName: '', description: '', capacity: 0, roomTypeId: '', statusId: 0, loggerId: '', buildingId: '',
  };
  private IsNewRecord: boolean = true;
  private title: string = '';

  created() {
    this.repository = new SetupRoomService(this.$store);
    this.RoomTyperepository = new SetupRoomTypeService(this.$store);
    this.BuildingRepository = new SetupBuildingService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
    Object.assign(this.data, event.params.model);
    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else if (this.data.statusId == 0) {
      this.isActive = false;
    }
    this.RoomTyperepository.GetFindBy('s=>s.StatusId==1').
      then(res => {
        this.RoomTypeList = res as Array<ISetupRoomType>

      });
    this.BuildingRepository.GetFindBy('s=>s.StatusId==1').then(res => {
      this.BuidingList = res as Array<ISetupBuilding>
    });


  }

  loadBuilding() {
    this.BuildingRepository.GetFindBy('s=>s.StatusId==1').then(res => {
      this.BuidingList = res as Array<ISetupBuilding>
    });

  }

  addNewBuilding() {
    this.$modal.show('Building-add-edit-model', { IsNewRecord: true });

  }

  loadRoomType() {
    this.RoomTyperepository.GetFindBy('s=>s.StatusId==1').
      then(res => {
        this.RoomTypeList = res as Array<ISetupRoomType>

      });
  }

  addNewRoomType() {
    this.$modal.show('RoomType-add-edit-model', { IsNewRecord: true });
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("Room-add-edit-model");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.roomId = helper.newGuid();
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
  get allowSubmit() {
    return (
      this.data.description.length > 0 &&
      this.data.fullName.length > 0 &&
      this.data.roomTypeId.length > 0 &&
      this.data.capacity > 0 &&
      this.data.buildingId.length > 0
    );
  }
  $v: any;
}
