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
  ISetupCampusBuildingLink,
  ISetupBuilding,
  ISetupCampus,
  ICampusCityVM,
  DDLGroupModel,
  DDLModel
} from "../../../../models";
import {
  SetupCampusBuildingLinkService,
  SetupBuildingService,
  SetupCampusService
} from "../../../../service";

import * as helper from "../../../../helper";

import { SetupCampusAddEdit } from "../../Campus/add-edit";
import { SetupBuildingAddEdit } from "../../Building/add-edit";
import { ok } from "assert";

type ValidateSetupCampusBuildingLink = {
  data: ISetupCampusBuildingLink;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupCampusBuildingLink> = {
  data: {
    buildingId: { required },
    campusId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html"),
  components: {
    Campus: SetupCampusAddEdit,
    Building: SetupBuildingAddEdit
  }
})
export class SetupCampusBuildingLinkAddEdit extends Vue {
  private repository: SetupCampusBuildingLinkService;
  private campusrepository: SetupCampusService = null;
  private buildingrepository: SetupBuildingService = null;


  private campusRepo: SetupCampusService = new SetupCampusService(this.$store)

  isActive: boolean = true;
  campusList: Array<ISetupCampus> = [];
  buildingList: Array<ISetupBuilding> = [];
  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];
  private campusCityList: Array<ICampusCityVM> = [];
  private campusId: string = "";
  private subcityId: string = "";

  private data: ISetupCampusBuildingLink = {
    campusBuildingId: "",
    buildingId: "",
    campusId: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SetupCampusBuildingLinkService(this.$store);
    this.campusrepository = new SetupCampusService(this.$store);
    this.buildingrepository = new SetupBuildingService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else if (this.data.statusId == 0) {
      this.isActive = false;
    }
    this.loadCityCampus();
    // this.loadBuilding();
  }

  addNewCampus() {
    this.$modal.show("Campus-add-edit-model", { IsNewRecord: true });
  }

  loadCityCampus() {
    this.campusddl = [];
    this.cityDDL = [];
    let oldObj: ICampusCityVM;
    this.campusRepo.GetCityVM()
      .then(r => {
        this.campusCityList = r as Array<ICampusCityVM>;
      });
  }

  loadBuilding() {
  this.subcityId =  this.campusCityList.find(e=> e.campusId == this.data.campusId).subCityId
    this.buildingrepository.GetFindBy('s=>s.SubCityId.ToString()=="' + this.subcityId +  '" && s.StatusId == 1')
      .then(res => {
        this.buildingList = res as Array<ISetupBuilding>;
      });
  }

  addNewBuilding() {
    this.$modal.show("Building-add-edit-model", { IsNewRecord: true });
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("add-edit-model");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.loggerId = helper.newGuid();
        this.data.campusBuildingId = helper.newGuid();
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
    return this.data.buildingId.length > 0 && this.data.campusId.length > 0;
  }
  $v: any;
}
