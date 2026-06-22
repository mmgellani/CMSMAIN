import Vue from "vue";
import Component from "vue-class-component";
import { ISetupFranchise } from "../../../../models/Setup/Franchise";
import { SetupFranchiseService } from "../../../../service/Setup/Franchise";
import * as helper from "../../../../helper";
import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

type ValidateSetupFranchise = { data: ISetupFranchise; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupFranchise> = {
  data: {
    description: {
      required,
      maxLength: maxLength(200)
    }
  }
};
@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html")
})
export class FranchiseAddEdit extends Vue {
  private model: Array<ISetupFranchise> = [];
  private service: SetupFranchiseService = null;
  private description: string = "";
  private checker: string = "";
  private operation: boolean = false;

  isActive: boolean = true;
  private data: ISetupFranchise = {
    franchiseId: "",
    description: "",
    companyOperated: false,
    loggerId: "",
    statusId: 0
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.service = new SetupFranchiseService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.data = event.params.model as ISetupFranchise;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    if (this.data.statusId == 1) {
      this.isActive = true;
    } else if (this.data.statusId == 0) {
      this.isActive = false;
    }
  }

  beforeModalOpenTest(event) {
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
        this.data.franchiseId = helper.newGuid();
        this.data.statusId = 1;
        this.service.AddOne(this.data).then(() => {
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
        this.service.Update(this.data).then(() => {
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
      this.data.description.length > 0
    );
  }

  $v: any;
}
