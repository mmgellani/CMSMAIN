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

import { ISetupMedium, ISurveyMaster, SurveyDetail } from "../../../../models";
import {  } from "../../../../service";

import * as helper from "../../../../helper";
import { SurveyDashboardMasterService } from "../../../../service/DashBoard/dashboardsurveymaster";
import { SurveyDashboardDetailService } from "../../../../service/DashBoard/dashboardsurveydetail";
import { trimCharsStart } from "lodash/fp";
import { Console } from "console";

type ValidateSetupMedium = { data: ISetupMedium; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupMedium> = {
  data: {
   
    description: {
      required
    },
    question: {
      required
    },
    query:{
      required
    },controlType:{
      required
    }
   
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'preview',
  template: require('./index.html')
})
export class SetupPreview extends Vue {
  private repository: SurveyDashboardDetailService;
  private masterrepository: SurveyDashboardMasterService;
  private surveymastlist:Array<ISurveyMaster>=[];
  private controltypelist=[{controlType:"TextArea"},{controlType:"Select"},{controlType:"checkbox"},{controlType:"radio"},{controlType:"text"}]

  isActive: boolean = true;
  private data: SurveyDetail = {
    surveyDetailId: '',
    question:'',
    query:'',
    controlType:'',
    surveyMasterId:'',
    operation:[],
    description: '',

    statusId:1,
    order:1
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SurveyDashboardDetailService(this.$store);
    this.masterrepository=new SurveyDashboardMasterService(this.$store);
    this.masterrepository.GetFindBy('e=>e.StatusId==1').then(r=>{
      this.surveymastlist= r as Array<ISurveyMaster>
    })

  }

  beforeModalOpen(event) {
    this.$v.$reset();

    this.IsNewRecord = event.params.IsNewRecord;
    this.title = "Preview Record";
    Object.assign(this.data, event.params.model);

    if(this.IsNewRecord==true)
    {
      this.data.operation.push(


        { order: 1, option: "" }
      )


    }
    
    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else if (this.data.statusId == 0) {
      this.isActive = false;
    }



    if(this.IsNewRecord==false)
    {
       this.data.surveyMasterId=event.params.model.surveyMasterId;
       this.data.surveyDetailId=event.params.model.surveyDetailId;        
       this.data.query=event.params.model.query;        
       this.data.question=event.params.model.question;        
       this.data.description=event.params.model.description;         
       this.data.statusId=event.params.model.statusId; 
       this.data.operation=JSON.parse(event.params.model.operation) as any;


    }

    

  }

  cancel() {
    this.data = {
      surveyDetailId: '',
      question:'',
      query:'',
      controlType:'',
      surveyMasterId:'',
      operation:[],
      description: '',
  
      statusId:1,
      order:1
    };
    this.$emit("submit");
    this.$modal.hide('preview');

  }

  
  addDetail(listobj) {

  
  this.data.operation.push({ order: (listobj.length) + 1, option: "" })




}

removeDetail(index:number)
{
    this.data.operation.splice(index,1);



}

  saveModel() {
   
    
      if (this.IsNewRecord) {
        this.data.surveyDetailId = helper.newGuid();
        this.data.statusId = 1;

        var z='['+JSON.stringify(this.data)+']'+'?'+'0';

        console.log(JSON.stringify(z));
      
        this.repository.InsertSurveyDetail(z).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been inserted successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
          this.cancel();
        });
      } 
      
      
      
      else {
        if (this.isActive == true) {
          this.data.statusId = 1;
        } else {
          this.data.statusId = 0;
        }
        var z='['+JSON.stringify(this.data)+']'+'?'+'1';

        console.log(JSON.stringify(z));
      
        this.repository.InsertSurveyDetail(z).then(() => {
       
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
  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
  }
  $v: any
}
