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
  ISetupBoard,
  ISetupProvince,
  ISetupBoardType
} from "../../../../models";
import {
  SetupBoardService,
  SetupProvinceService,
  SetupBoardTypeService
} from "../../../../service";

import * as helper from "../../../../helper";

import { SetupBoardTypeAddEdit } from "../../BoardType/add-edit";
import { SetupProvinceAddEdit } from "../../Province/add-edit";

type ValidateSetupBoard = { data: ISetupBoard; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupBoard> = {
  data: {
    fullName: {
      required,
      maxLength: maxLength(100)
    },
    provinceId: { required },
    boardTypeId: { required },
    description: {
      maxLength: maxLength(200)
    }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html"),
  components: {
    BoardType: SetupBoardTypeAddEdit,
    Province: SetupProvinceAddEdit
  }
})
export class SetupBoardAddEdit extends Vue {
  private repository: SetupBoardService;
  private data: ISetupBoard = {
    boardId: "",
    fullName: "",
    description: "",
    provinceId: "",
    boardTypeId: "",
    statusId: 0,
    loggerId: "",
    boardNo: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private isActive = false;
  private provinceList: Array<ISetupProvince> = [];
  private boardTypeList: Array<ISetupBoardType> = [];
  provinceRepo: SetupProvinceService = new SetupProvinceService(this.$store);
  boardTypeRepo: SetupBoardTypeService = new SetupBoardTypeService(this.$store);
  created() {
    this.repository = new SetupBoardService(this.$store);

  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else {
      this.isActive = false;
    }
    this.loadBoardTypeList();
    this.loadProvinceList();

  }

  loadBoardTypeList() {
    this.boardTypeRepo.GetFindBy("e=>e.StatusId==1").then(res => {
      this.boardTypeList = res as Array<ISetupBoardType>;
    });
  }
  loadProvinceList() {
    this.provinceRepo.GetFindBy("e=>e.StatusId==1").then(res => {
      this.provinceList = res as Array<ISetupProvince>;
    });
  }
  addNewBoardType() {
    this.$modal.show("BoardType-add-edit-model", { IsNewRecord: true });
  }
  addNewProvince() {
    this.$modal.show("Province-add-edit-model", { IsNewRecord: true });
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
        this.data.boardId = helper.newGuid();
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
        this.repository.Update(this.data).then(() =>
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been updated successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          })
        );
      }
      this.cancel();
    }
  }
  // get allowSubmit() {
  //   return (
  //     this.data.provinceId.length > 0 &&
  //     this.data.boardTypeId.length > 0 &&
  //     this.data.fullName.length > 0 &&
  //     this.data.description.length > 0
  //   );
  // }
  $v: any;
}
