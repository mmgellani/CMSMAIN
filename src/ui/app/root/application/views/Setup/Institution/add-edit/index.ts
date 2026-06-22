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
  ISetupInstitution,
  ISetupZone,
  ISetupBusinessUnit,
  ISetupInstitutionType
} from "../../../../models";
import {
  SetupInstitutionService,
  SetupZoneService,
  SetupInstitutionTypeService,
  SetupBusinessUnitService
} from "../../../../service";

import * as helper from "../../../../helper";
import { SetupBusinessUnitAddEdit } from "../../BusinessUnit/add-edit";
import { SetupZoneAddEdit } from "../../Zone/add-edit";
import { SetupInstitutionTypeAddEdit } from "../../InstitutionType/add-edit";

type ValidateSetupInstitution = {
  data: ISetupInstitution;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupInstitution> = {
  data: {
    fullName: {
      required,
      maxLength: maxLength(100)
    },
    description: {
      required,
      maxLength: maxLength(200)
    },
    businessUnitID: { required },
    institutionTypeId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "institution-add-edit-model",
  template: require("./index.html"),
  components: {
    BusinessUnit: SetupBusinessUnitAddEdit,
    Zone: SetupZoneAddEdit,
    InstitutionType: SetupInstitutionTypeAddEdit
  }
})
export class SetupInstitutionAddEdit extends Vue {
  private repository: SetupInstitutionService;
  private zonerepository: SetupZoneService = null;
  private BuisnessUnitrepository: SetupBusinessUnitService = null;
  private InstitutionTyperepository: SetupInstitutionTypeService = null;
  ZoneList: Array<ISetupZone> = [];
  BuisnessUnitList: Array<ISetupBusinessUnit> = [];
  InstitutionTypeList: Array<ISetupInstitutionType> = [];
  private isActive: boolean = true;
  private data: ISetupInstitution = {
    institutionId: "",
    fullName: "",
    description: "",
    businessUnitID: "",
    code: "",
    institutionTypeId: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SetupInstitutionService(this.$store);
    this.zonerepository = new SetupZoneService(this.$store);

    this.BuisnessUnitrepository = new SetupBusinessUnitService(this.$store);

    this.InstitutionTyperepository = new SetupInstitutionTypeService(
      this.$store
    );
  }

  // addNewBusinessUnit() {
  //   this.$modal.show("BusinessUnit-add-edit-model", { IsNewRecord: true });
  // }
  loadBusinessUnit() {
    this.BuisnessUnitrepository.GetFindBy("s=>s.StatusId==1").then(res => {
      this.BuisnessUnitList = res as Array<ISetupBusinessUnit>;
    });
  }

  // addNewZone() {
  //   this.$modal.show("Zone-add-edit-model", { IsNewRecord: true });
  // }
  // loadZone() {
  //   this.zonerepository.GetFindBy("s=>s.StatusId==1").then(res => {
  //     this.ZoneList = res as Array<ISetupZone>;
  //   });
  // }

  // addNewInstitutionType() {
  //   this.$modal.show("InstitutionType-add-edit-model", { IsNewRecord: true });
  // }
  loadInstitutionType() {
    this.InstitutionTyperepository.GetFindBy("s=>s.StatusId==1").then(res => {
      this.InstitutionTypeList = res as Array<ISetupInstitutionType>;
    });
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);

    if (this.data.statusId == 1) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }

    this.loadBusinessUnit();
    this.loadInstitutionType();
    // this.data.fullName = event.params.model.fullName;
    // this.data.code = event.params.model.code;
    // this.data.description = event.params.model.description;
    // this.data.businessUnitID = event.params.model.businessUnitID;
    // this.data.institutionTypeId = event.param.model.institutionTypeId;
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("institution-add-edit-model");
  }

  saveModel() {

    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.institutionId = helper.newGuid();
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
  // get allowSubmit() {
  //   if (this.data) {
  //     return (
  //       this.data.fullName.length > 0 &&
  //       this.data.description.length > 0 &&
  //       this.data.businessUnitID.length > 0 &&
  //       this.data.code.length > 0 &&
  //       this.data.institutionTypeId.length > 0
  //     );
  //   } else {
  //     return false;
  //   }
  // }
  $v: any;
}
