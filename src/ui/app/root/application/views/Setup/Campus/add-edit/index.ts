/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { required, maxLength, minLength } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import {
  ISetupCampus,
  ISetupInstitution,
  ISetupZoneCityLink,
  ISetupAddress,
  ISetupZoneCityLinkVM,
  ISetupSubCity,
  ISetupCity,
  ISetupBusinessUnit,
  ISetupCitySubCityLink
} from "../../../../models";
import {
  SetupCampusService,
  SetupAddressService,
  SetupInstitutionService,
  SetupZoneCityLinkService,
  SetupSubCityService,
  SetupCityService,
  SetupBusinessUnitService
} from "../../../../service";

import * as helper from "../../../../helper";

import { SetupInstitutionAddEdit } from "../../Institution/add-edit";
import { SetupSubCityAddEdit } from "../../SubCity/add-edit";
import { SetupAddressAddEdit } from "../../Address/add-edit";
import { SetupCityAddEdit } from "../../City/add-edit";
import { ISetupFranchise } from "../../../../models/Setup/Franchise";
import { SetupFranchiseService } from "../../../../service/Setup/Franchise";
import { MessageService } from "../../../../service/Message/message-service";
import { ISmsAPI } from "../../../../models/Message/message";

type ValidateSetupCampus = { data: ISetupCampus; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupCampus> = {
  data: {
    fullName: {
      required,
      maxLength: maxLength(100)
    },
    code: { required },
    description: {
      required,
      maxLength: maxLength(100)
    },
    institutionId: { required },
    businessUnitId:{required},
    digitCode: {
      required,
      minLength: minLength(3)
    },
    customerCode: { required },
    subCityId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "Campus-add-edit-model",
  template: require("./index.html"),
  components: {
    institution: SetupInstitutionAddEdit,
    SubCity: SetupSubCityAddEdit,
    Address: SetupAddressAddEdit,
    'City': SetupCityAddEdit
  }
})
export class SetupCampusAddEdit extends Vue {
  private isActive: boolean;
  private repository: SetupCampusService;
  private addressList: Array<ISetupAddress> = [];
  private institutionList: Array<ISetupInstitution> = [];
  private subCityList: Array<ISetupSubCity> = [];
  private citylist: Array<ISetupCity> = [];
  private franchiseData: Array<ISetupFranchise> = [];
  private citySubCityList: Array<ISetupCitySubCityLink> = [];
  private franchiseService: SetupFranchiseService = null;
  private addressRepo: SetupAddressService = new SetupAddressService(
    this.$store
  );
  private institutionRepo: SetupInstitutionService = new SetupInstitutionService(
    this.$store
  );
  private messagerepository: MessageService = new MessageService(this.$store);

  private subCityRepo: SetupSubCityService = new SetupSubCityService(
    this.$store
  );
  private cityrepository: SetupCityService = null;
  private businessUnitRepo: SetupBusinessUnitService = new SetupBusinessUnitService(
    this.$store
  );

  private data: ISetupCampus = {
    campusId: "",
    fullName: "",
    code: "",
    description: "",
    franchiseId: "",
    institutionId: "",
    digitCode: "",
    subCityId: "",
    statusId: 0,
    logo: "",
    loggerId: "",
    customerCode: "",
    isTestCampus: 0,
    businessUnitId: "",
    smsApId: "",
    emailPrefix:'',
    isEbook:false,
    isMerchandise:false,
    isDelivery:false

  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private cityId: string = "";
  private subCityId: string = "";
  // private franchiseID: string = "";
  private camCode: any;
  private campusModel: Array<ISetupCampus> = [];
  private businessUnitList: Array<ISetupBusinessUnit> = [];
  private smsapilist: Array<ISmsAPI> = [];


  created() {
    this.repository = new SetupCampusService(this.$store);
    this.franchiseService = new SetupFranchiseService(this.$store);
    this.cityrepository = new SetupCityService(this.$store);
    // this.$watch('businessUnitId',this.changeTbl);
  }

  // refreshdata() {
  //   this.loadInstitution();
  // }

  // addNewCity() {
  //   this.$modal.show("City-add-edit-model", { IsNewRecord: true });
  // }
  // loadCampus() {
  //   this.repository.GetAll()
  //     .then(
  //       response => this.campusModel = (response as Array<ISetupCampus>)
  //     );
  // }
  loadCity() {
    this.cityrepository.GetFindBy("e=>e.StatusId==1").then(res => {
      this.citylist = res as Array<ISetupCity>;
    });
  }

  changeTbl() {
  if (!this.IsNewRecord)   
     return;
    if (this.data.subCityId.length > 0 && this.data.institutionId.length > 0) {
      this.data.fullName = this.institutionList.find(e => e.institutionId == this.data.institutionId).fullName + ' ' + this.citySubCityList.find(e => e.subCityId == this.data.subCityId).subCityName;

      this.data.code = this.institutionList.find(e => e.institutionId == this.data.institutionId).code + this.citySubCityList.find(e => e.subCityId == this.data.subCityId).code;  
    }
  }



  loadFranchise() {
    this.franchiseService.GetFindBy("f => f.StatusId != 2")
      .then(
        response => (this.franchiseData = response as Array<ISetupFranchise>)
      );
  }

  loadInstitution() {
    this.institutionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.institutionList = r as Array<ISetupInstitution>;
    });
  }
  loadSubCity() {
    if (this.cityId.length > 0) {
      this.subCityRepo.GetFindBy('e=> e.CityId.ToString()=="' + this.cityId + '" && e.StatusId!=2').then(r => {
        this.subCityList = r as Array<ISetupSubCity>;
      });
    }
  }

  loadCitySubCity() {
    this.citySubCityList = [];
    this.subCityRepo.GetFindByCitySubCity("e=>e.StatusId==1")
      .then(r => {
        this.citySubCityList = r as Array<ISetupCitySubCityLink>;
      });
  }
  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    this.subCityId = event.params.model.subCityId;
    this.loadInstitution();
    this.loadCity();
    this.loadFranchise();
    this.loadMessageAPI();
    this.loadBusinessUnit();

    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else {
      this.isActive = false;
    }
    this.loadCitySubCity();
    // if (!this.IsNewRecord) {
    //   this.subCityRepo.GetFindBy("e=>e.StatusId!=2")
    //     .then(r => {
    //       this.subCityList = r as Array<ISetupSubCity>;
    //     });
    //   this.cityId = this.subCityList.find(e => e.subCityId == this.subCityId).cityId;
    //   this.subCityRepo.GetFindBy('e=> e.CityId.ToString()=="' + this.cityId + '" && e.StatusId!=2')
    //     .then(r => {
    //       this.subCityList = r as Array<ISetupSubCity>;
    //     });
    // }



  }

  loadBusinessUnit() {
    this.businessUnitRepo.GetFindBy('e=> e.StatusId ==1').then(r => {
      this.businessUnitList = r as Array<ISetupBusinessUnit>;
    });
  }



  loadMessageAPI() {
    this.messagerepository.GetAll()
      .then(response => this.smsapilist = (response as Array<ISmsAPI>));
  }
  //Called to show new Institute insertion popup

  cancel() {
     this.close();
    this.$emit("submit");
    this.$modal.hide("Campus-add-edit-model");
  }
  close() {
    this.data = {
      campusId: "",
      fullName: "",
      code: "",
      description: "",
      franchiseId: "",
      institutionId: "",
      digitCode: "",
      subCityId: "",
      statusId: 0,
      logo: "",
      loggerId: "",
      customerCode: "",
      isTestCampus: 1,
      businessUnitId: "",
      smsApId: "",
      emailPrefix:'',
      isEbook:false,
      isMerchandise:false,
      isDelivery:false
    };
  }

  onFileChange(e) {
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
        this.data.loggerId = helper.newGuid();
        this.data.campusId = helper.newGuid();
        this.data.statusId = 1;

        if (this.campusModel.find(e => e.digitCode == this.data.digitCode)) {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Digit Code already used",
            title: "Error",
            messageTypeId: PayloadMessageTypes.error
          });
        }
        else {
          this.repository.AddOne(this.data).then(() => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "Record has been inserted successfully",
              title: "Success",
              messageTypeId: PayloadMessageTypes.success
            });
            this.cancel();
          });
        }
      }
      else {
        if (this.isActive == true) {
          this.data.statusId = 1;
        } else {
          this.data.statusId = 0;
        }
        this.repository.Update(this.data).then(() => {

          if (this.campusModel.find(e => e.digitCode == this.data.digitCode)) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "Record already exist",
              title: "Error",
              messageTypeId: PayloadMessageTypes.error
            });
          }
          else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "Record has been updated successfully",
              title: "Success",
              messageTypeId: PayloadMessageTypes.success
            });
          }
          this.cancel();
        });
      }
    }
  }
  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
  }
  $v: any;
}
