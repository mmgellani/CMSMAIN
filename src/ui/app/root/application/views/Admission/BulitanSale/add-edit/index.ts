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
  IAdmissionBulitanSale,
  ISetupProgramDetails,
  ISetupGender,
  IAdmissionSaleType
} from "../../../../models";
import {
  AdmissionBulitanSaleService,
  SetupProgramDetailsService,
  SetupGenderService,
  AdmissionSaleTypeService
} from "../../../../service";

import * as helper from "../../../../helper";

import { AdmissionSaleTypeAddEdit } from "../../SaleType/add-edit";
import moment from "moment";

type ValidateAdmissionBulitanSale = {
  data: IAdmissionBulitanSale;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateAdmissionBulitanSale> = {
  data: {
    // bulitanSaleId: { required },
    programDetailId: { required },
    formNumber: { required,
    maxLength: maxLength(10) },
    fullName: {
      required,
      maxLength: maxLength(100)
    },
    fatherName: { required,
    maxLength: maxLength(100) },
    genderId: { required },
    mobileNumber: { required,
    minLength: minLength(11) },
    saleTypeId: { required },
    saleDate: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html"),
  components: {
    SaleType: AdmissionSaleTypeAddEdit
  }
})
export class AdmissionBulitanSaleAddEdit extends Vue {
  private repository: AdmissionBulitanSaleService;
  private repository2: SetupProgramDetailsService;
  private repository3: SetupGenderService;
  isActive: boolean = true;
  programDetailList: Array<ISetupProgramDetails> = [];
  genderList: Array<ISetupGender> = [];
  saleTypeList: Array<IAdmissionSaleType> = [];
  private repository4: AdmissionSaleTypeService;
  private data: IAdmissionBulitanSale = {
    bulitanSaleId: "",
    programDetailId: "",
    saleDate: new Date(),
    formNumber: 0,
    fullName: "",
    fatherName: "",
    genderId: "",
    mobileNumber: "",
    saleTypeId: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    console.log(moment(new Date()).format('HH:mm:ss'))
    console.log(new Date().getTime())

    console.log(new Date().toISOString())
    this.repository = new AdmissionBulitanSaleService(this.$store);
    this.repository2 = new SetupProgramDetailsService(this.$store);
    this.repository3 = new SetupGenderService(this.$store);
    this.repository4 = new AdmissionSaleTypeService(this.$store);
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
    this.repository2.GetFindBy("s=>s.StatusId==1").then(res => {
      this.programDetailList = res as Array<ISetupProgramDetails>;
    });
    this.repository3.GetFindBy("s=>s.StatusId==1").then(res => {
      this.genderList = res as Array<ISetupGender>;
    });
    this.repository4.GetFindBy("s=>s.StatusId==1").then(res => {
      this.saleTypeList = res as Array<IAdmissionSaleType>;
    });
  }

  cancel() {
    this.$modal.hide("add-edit-model");
    this.$emit("submit");
  }

  addNewSaleType() {
    this.$modal.show("SaleType-add-edit-model", { IsNewRecord: true });
  }
  loadSaleType() {
    this.repository4.GetFindBy("s=>s.StatusId==1").then(res => {
      this.saleTypeList = res as Array<IAdmissionSaleType>;
    });
  }
  getCurrenTime(date:any){
    // var time= (new Date().getHours().toString().length==1?'0'+new Date().getHours():new Date().getHours())+':'
    // +(new Date().getMinutes().toString().length==1?'0'+new Date().getMinutes():new Date().getMinutes())+':'
    // +(new Date().getSeconds().toString().length==1?'0'+new Date().getSeconds():new Date().getSeconds())
   return moment(moment(date).format('YYYY-MM-DD')+ ' '+moment(new Date()).format('HH:mm:ss')).format('YYYY-MM-DDTHH:mm:ss')+'z'
  }
  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      let dt:Date;
      //console.log(this.getCurrenTime())
    
      this.data.saleDate=this.getCurrenTime(this.data.saleDate)
      //moment(moment(this.data.saleDate).format('YYYY-MM-DD')+ ' '+this.getCurrenTime()).format('YYYY-MM-DDTHH:mm:ss')+'z'
      if (this.IsNewRecord) {
        this.data.loggerId = helper.newGuid();
        this.data.bulitanSaleId = helper.newGuid();
        this.data.statusId = 1;
        // console.log(new Date(this.data.saleDate).toLocaleString())
        // console.log(this.data.saleDate.toLocaleString())
        // this.data.saleDate=new Date(this.data.saleDate).toLocaleString()
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
      this.data.fullName.length > 0 &&
      this.data.fatherName.length > 0 &&
      this.data.mobileNumber.length > 0 &&
      this.data.programDetailId.length > 0 &&
      this.data.genderId.length > 0 &&
      this.data.saleTypeId.length > 0 &&
      this.data.formNumber > 0
    );
  }
  $v: any;
}
