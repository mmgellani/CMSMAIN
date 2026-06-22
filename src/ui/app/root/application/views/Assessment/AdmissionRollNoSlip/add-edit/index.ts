/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import * as helper from "../../../../helper";

import {
  CitySubCity,
  ISetupAddress,
  ISetupBuilding,
  ISetupPossession
} from "../../../../models";
import {
  SetupAddressService,
  SetupBuildingService,
  SetupCityService,
  SetupPossessionService
} from "../../../../service";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";
import { maxLength, required } from "vuelidate/lib/validators";

import Component from "vue-class-component";
import { PayloadMessageTypes } from "../../../../../../model";
import { SetupAddressAddEdit } from "../../../Setup/Address/add-edit"
import { SetupPossessionAddEdit } from "../../../Setup/Possession/add-edit";
import { StoreTypes } from "../../../../../../store";
import Vue from "vue";
import { AssessmentSchedulingDeatilService } from "../../../../service/Assessment/AssessmentSchedulingDeatil";
import { IAssessmentSchedulingList, IAssessmentSchedulingListData, IAssessmentSchedulingMasterAdd, IMonthList } from "../../../../models/Assessment/AssessmentSchedulingDetail";
import { AssessmentSchemeMasterService } from "../../../../service/Assessment/AssesmentMaster";
import { IAssessmentSchemeDefinitionAll } from "../../../../models/Setup/AssessmentSchemeDefinition";
import { forEach } from "lodash";
 

@Component({
  mixins: [validationMixin], 
  name: "AssessmentScheduling-add-edit-model",
  template: require("./index.html"),
  components: { 
  }
})
export class AssessmentSchedulingAddEdit extends Vue {
  private repository: AssessmentSchedulingDeatilService;  
  private AssesmentSchmeMastrRepo: AssessmentSchemeMasterService;
  private assesmentScemelist:Array<IAssessmentSchemeDefinitionAll>=[];
  private listdata: Array<IAssessmentSchedulingList> = [];
  private listdataUpdated: Array<IAssessmentSchedulingList> = [];
  private assessmentSchedulingListData: Array<IAssessmentSchedulingListData> = [];
  private assessmentSchedulingMasterAdd: IAssessmentSchedulingMasterAdd[] = [{
    AssessmentSchedulingMasterId: '',
    statusId: 0,
    AssessmentSchemeMasterId: ''
  }];
  
  
  private monthList: Array<IMonthList> = [];
 
  isActive: boolean = true;


   private data: IAssessmentSchedulingList = {
    assessmentSchedulingMasterId: "",
    assessmentSchemeMasterId: "",
    assessmentName: "",
    totalWeightage: 0,
    failCriteris: "",
    gradingPolicy: "",
    statusId: 1,
  };
  private IsNewRecord: boolean = true;
  private showWarning: boolean = false;

  private title: string = "";
  private assessmentMasterId= "";
  private gradingPolicy= "";
  private passCriteria = "";
  private totalWeightage= "";
  private assessmentName= "";
  private CheckOrderExist= 0;


  beforeModalOpen(event) {
     
    this.assessmentSchedulingListData=[];
    this.IsNewRecord = event.params.IsNewRecord; 
    this.assessmentMasterId=event.params.model.assessmentSchedulingMasterId;
    
    if(this.IsNewRecord==false){ 

      if(this.listdata!=undefined)
        this.listdataUpdated=this.listdata.filter(f=>f.assessmentSchemeMasterId==event.params.model.assessmentSchemeMasterId);
        if(this.listdataUpdated!=undefined)
        {
        this.passCriteria = this.listdataUpdated[0].failCriteris;
        this.totalWeightage= this.listdataUpdated[0].totalWeightage.toString();
        this.gradingPolicy= this.listdataUpdated[0].gradingPolicy;
        this.assessmentName= this.listdataUpdated[0].assessmentName;
        }

      this.assessmentMasterId=event.params.model.assessmentSchedulingMasterId; 
      this.repository.EditAssessmentSchedulingData(this.assessmentMasterId)
      .then(response => {
        this.assessmentSchedulingListData = (response as Array<IAssessmentSchedulingListData>);
      });

     
    }
    else{
      this.assessmentSchedulingListData=[];
      this.passCriteria = "";
      this.totalWeightage= "";
      this.gradingPolicy= "";
      this.assessmentName= "";
    }
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
       
  }

  created() {
    this.repository = new AssessmentSchedulingDeatilService(this.$store);
    this.AssesmentSchmeMastrRepo = new AssessmentSchemeMasterService(this.$store);

    this.passCriteria = "";
    this.totalWeightage= "";
    this.gradingPolicy= "";
    this.listdataUpdated=[];
    this.listdata = [];
    this.assesmentScemelist = []; 
    this.refreshData();
    this.showWarning=false;
  }
  
  refreshData() {
    this.listdata = [];
    this.repository.AssessmentSchedulingListData()
        .then(response => this.listdata = (response as Array<IAssessmentSchedulingList>));

        this.assesmentScemelist = [];
        this.AssesmentSchmeMastrRepo.GetAll()
            .then(response => {
                this.assesmentScemelist = response as Array<IAssessmentSchemeDefinitionAll>; 
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
            this.monthList=[];
            this.repository.MonthList()
            .then(response => this.monthList = (response as Array<IMonthList>));

}
AssesmentSchmeMastrlistdata() { 
  this.assessmentSchedulingListData=[];
  this.AssesmentSchmeMastrRepo.GetAll()
      .then(response => {
          this.assesmentScemelist = response as Array<IAssessmentSchemeDefinitionAll>;
          
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
}
loadData() { 
  
  this.assessmentSchedulingListData=[];
  if(this.assessmentMasterId.length>0)
  {  
    this.listdataUpdated=[];
    if(this.listdata!=undefined)
    this.listdataUpdated=this.listdata.filter(f=>f.assessmentSchedulingMasterId==this.assessmentMasterId);
    if(this.listdataUpdated!=undefined){
    this.passCriteria = this.listdataUpdated[0].failCriteris;
    this.totalWeightage= this.listdataUpdated[0].totalWeightage.toString();
    this.gradingPolicy= this.listdataUpdated[0].gradingPolicy;
  }
  }
    this.assessmentSchedulingListData=[];
    this.repository.AssessmentSchedulingData(this.assessmentMasterId)
    .then(response => this.assessmentSchedulingListData = (response as Array<IAssessmentSchedulingListData>));
}
   
checkOrderExist(){
  
    //   var check = this.assessmentSchedulingListData.filter(f=>f.assessmentSchedulingDetailId!=model.assessmentSchedulingDetailId && f.order==model.order);
    // if(check!=null && check != undefined){
    //   this.showWarning=true;
    // }
    // else {
    //   this.showWarning=false;
    // }

 }
  cancel() {
    this.$emit("submit");
    this.$modal.hide("AssessmentScheduling-add-edit-model");
  } 
  cancelWarning() {
    this.showWarning=false;
  } 
  private hasDuplicateOrderNumbers(data: IAssessmentSchedulingListData[]): boolean {
    const orderNumbersSet = new Set<number>();

    
    for (const item of data) {
        if (orderNumbersSet.has(parseInt(item.order.toString()))) {
            return true;  
        }
        orderNumbersSet.add(parseInt(item.order.toString()));
    }

    return false;  
}
  saveModel() {


    if (this.hasDuplicateOrderNumbers(this.assessmentSchedulingListData)) {
       
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Duplicate order numbers found. Please correct before saving.",
        title: "Duplicate order numbers",
        messageTypeId: PayloadMessageTypes.error
      }); 
      
  } 
  else {
    
    
if(this.IsNewRecord==true){
  this.assessmentSchedulingMasterAdd=[];
  var key= JSON.stringify(this.assessmentSchedulingListData);
 this.repository.AddAssessmentSchedulingData(key).then(r=>{
  this.$store.dispatch(StoreTypes.updateStatusBar, {
    text: "Record has been Saved successfully",
    title: "Saved",
    messageTypeId: PayloadMessageTypes.warning
  });
  this.cancel();
 });

 
}
else{
  this.assessmentSchedulingMasterAdd=[];
  var key= JSON.stringify(this.assessmentSchedulingListData);
 this.repository.UpdateAssessmentSchedulingData(key).then(r=>{
  this.$store.dispatch(StoreTypes.updateStatusBar, {
    text: "Record has been Updated successfully",
    title: "Updated",
    messageTypeId: PayloadMessageTypes.warning
  });
  this.cancel();
 });
 
}  
    this.cancel();
  }
}
  
  $v: any;
}
