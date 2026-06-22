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
import { PayloadMessageTypes, IUser } from "../../../../../../model";

import {
  ISetupBusinessUnit,
  ISetupBusinessGroup,
  ISetupAddress
} from "../../../../models";
import {
  SetupBusinessUnitService,
  SetupBusinessGroupService,
  SetupAddressService
} from "../../../../service";

import * as helper from "../../../../helper";

import { SetupAddressAddEdit } from "../../Address/add-edit";
import { SetupBusinessGroupAddEdit } from "../../BusinessGroup/add-edit";
import { State } from "vuex-class";
import { IRootStoreState } from "../../../../../store";

type ValidateSetupBusinessUnit = {
  data: ISetupBusinessUnit;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupBusinessUnit> = {
  data: {
    fullName: { required },
    businessGroupId: { required },
    addressId: { required },
    digitCode:{required},
    description:{required}
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "BusinessUnit-add-edit-model",
  template: require("./index.html"),
  components: {
    Address: SetupAddressAddEdit,
    BusinessGrp: SetupBusinessGroupAddEdit
  }
})
export class SetupBusinessUnitAddEdit extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private isActive: boolean = false;
  private repository: SetupBusinessUnitService;
  private businessGroupList: Array<ISetupBusinessGroup> = [];
  private addressList: Array<ISetupAddress> = [];
  private canAddAddress: boolean = false;
  private canAddBusinessGroup: boolean = false;


  private businessGroupRepo: SetupBusinessUnitService = new SetupBusinessGroupService(
    this.$store
  );
  private addressRepo: SetupAddressService = new SetupAddressService(
    this.$store
  );
  private data: ISetupBusinessUnit = {
    businessUnitId: "",
    fullName: "",
    description: "",
    businessGroupId: "",
    addressId: "",
    logo: "",
    statusId: 0,
    loggerId: "",
    digitCode:""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SetupBusinessUnitService(this.$store);
    
  }
  addNewAddress() {
    this.$modal.show("Address-add-edit-model", { IsNewRecord: true });
  }

  addNewBusinessGrp() {
    this.$modal.show("BusinessGrp-add-edit-model", { IsNewRecord: true });
  }

  loadAddress() {
    this.addressRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.addressList = r as Array<ISetupAddress>;
    });
  }
  loadBusinessGroup() {
    this.businessGroupRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.businessGroupList = r as Array<ISetupBusinessGroup>;
    });
  }

  validatePage() {
    if (this.user.roles.indexOf('admin') >= 0) {
      this.canAddAddress = this.canAddBusinessGroup = true;
    }
    else {
      if (('setupAddress' in this.user.claims) == true) {
        if (this.user.claims['setupAddress'].indexOf('C') >= 0) {
          this.canAddAddress = true;
        }
      }

      if (('setupBusinessGroup' in this.user.claims) == true) {
        if (this.user.claims['setupBusinessGroup'].indexOf('C') >= 0) {
          this.canAddBusinessGroup = true;
        }
      }
    }
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);

    this.loadAddress();
    this.loadBusinessGroup();
    this.validatePage();

    if (!this.IsNewRecord) {
      if (this.data.statusId == 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    }
  }

  cancel() {
    this.data={
      businessUnitId: "",
      fullName: "",
      description: "",
      businessGroupId: "",
      addressId: "",
      logo: "",
      statusId: 0,
      loggerId: "",
      digitCode:""
    };
    this.$emit("submit");
    this.$modal.hide("BusinessUnit-add-edit-model");
  }

  onFileChange(e) {
    //alert(JSON.stringify(e));
    var files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    this.createImage(files[0]);
  }

  createImage(file) {
    var $this = this;
    helper.resizeImage({ file: file, maxSize: 120 }).then(resizeImage => {
      $this.data.logo = resizeImage as string;
    });
  }

  removeImage() {
    if (this.data.logo.length != 0) {
      this.data.logo = "";
    }
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.businessUnitId = helper.newGuid();
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
  // get allowSubmit() {
  //   let error = this.$v.data.$error || this.$v.data.$invalid;
  //   return !error;
  // }
  $v: any;
}
