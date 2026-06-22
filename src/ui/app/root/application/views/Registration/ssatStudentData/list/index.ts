/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";
import {
  IssatStudentData
} from "../../../../models"; 
import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";
import { StoreTypes } from "../../../../../../store";
import { IStudentProfile } from "../../../../models/Admission/studentProfile";
import { ReportsService } from "../../../../service/Reports/AdmissionReports";
import { MessageService } from "../../../../service/Message/message-service"; 
import * as helper from '../../../../helper';
import moment from "moment";
@Component({
  name: "models-form-list",
  template: require("./index.html"),
})
export class ssatStudentData extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private messageService: MessageService = new MessageService(
    this.$store
  );
  private typeId: string = "";
  private dated: string = "";
  private check: boolean = false;  
  private date: Date = new Date();
  
  private campusTypeList: any=[{
    "fullName":"Online"
  },
{
  "fullName":"Physical",
    
}];
  private allstudentdata: Array<IssatStudentData> = [];
  private columns = [
    {key: 'provinceName', caption: 'ProvinceName' },
    {key: 'cityName', caption: 'CityName' } ,
    { key: 'refferenceNo', caption: 'RefferenceNo' },
    { key: 'date', caption: 'Date' },
    { key: 'studentName', caption: 'StudentName' },
    { key: 'fatherName', caption: 'FatherName' },
    { key: 'phoneNo', caption: 'PhoneNo' }, 
    { key: 'email', caption: 'Email' },
    { key: 'programDetail', caption: 'ProgramDetail' },
    

];

  mounted() {
    this.validatePage();
    this.dated = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);

  }
  clear(){
    this.allstudentdata=[];
  }
  refreshData() {

     if(this.typeId.length>0 ){

      if(this.typeId=='Online'){
        this.typeId="00000000-0000-0000-0000-000000000000";
       
        var key=this.typeId+'?'+moment(this.dated).format('YYYY-MM-DD') ;
this.messageService.ssatStudentData(key).then(response=>{
  this.allstudentdata = response as Array<IssatStudentData>;
  this.check=true;

});
      }
      else {
        this.typeId="00000000-0000-0000-0000-000000000001";
        var key=this.typeId+'?'+moment(this.dated).format('YYYY-MM-DD') ;
this.messageService.ssatStudentData(key).then(response=>{
  this.allstudentdata = response as Array<IssatStudentData>;
  this.check=true;
  
});
      }

     
     }
    }
    loadcsv() {
debugger
      if( this.allstudentdata.length>0){
       
        
          if(this.typeId==="00000000-0000-0000-0000-000000000000"){
          this.typeId='Online_';
        }
          else {
            this.typeId='Physical_';
          }

        var newname="SSATStudentData "+ this.typeId+moment(this.dated).format('YYYY-MM-DD') +".csv";
          helper.exportToCsv(newname, this.allstudentdata);
      }
      else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'No Data Found',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
          });
      }
  }
     
  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("ssatStudentData" in this.user.claims == true) {
        if (this.user.claims["ssatStudentData"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["ssatStudentData"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["ssatStudentData"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["ssatStudentData"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }


}
