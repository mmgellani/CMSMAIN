/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser, PayloadMessageTypes  
} from "../../../../../../model";
import {
  ITeacherRatingGraph,ITeacherRatingGraphMonth,
 } from "../../../../models";
import { IRootStoreState } from "../../../../../store";

import {
  INotificationRatingGraph,
  ISubjectRatingList,
  ISurvey, ISurveyCampusList, ISurveyCourseList, ISurveyList, ISurveySubCityList, ISurveySubjectList, ITeacherRatingList, ITopTeachers,
} from "../../../../models";
import * as helper from "../../../../helper";
import { PublicVWDashBoardVMService } from "../../../../service/DashBoard/DashBoard";
import collapsibleWidget from '../../../../../../components/collapsibleWidget';
import * as charts from '../../../../../home/admission-role';
import Highcharts from "highcharts";
import { genComponent } from 'vue-highcharts';
import * as chartPerser from '../../../../../home/admission-role/index';
import { StoreTypes } from "../../../../../../store";
import { IStudentfeedback,IStudentfeedbackagainststudent 
} from "../../../../models";

@Component({
  name: "notification-overall",
  template: require("./index.html"),
  components: {
    Highcharts: genComponent('Highcharts', Highcharts),
    'form-collection-p': charts.FormCollectionPieWidget,
    collapsibleWidget,
  }
})
export class StudentFeedback extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;


  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private isDisabled: boolean = false;
  private showmodel: boolean = false;
  private fromDate = new Date("2022-10-01"); 
  
  private data: Array<IStudentfeedback> = [];
  private dataex: Array<IStudentfeedbackagainststudent> = [];
  
  private checkfeedback: boolean = false;
  private show: boolean = false;
  
  private csvdata: any = [];
  dueDate=new Date();
  private toDate = new Date();
  private repository: PublicVWDashBoardVMService = new PublicVWDashBoardVMService(this.$store);


  private columns = [
    { key: "date", caption: "Date" },
    { key: "plateForm", caption: "PlateForm" },
    { key: "feedBack", caption: "FeedBack" }
  ];

  private breadcrums = new Array();
  private secondBreadcrums = new Array();
  User = [{ item: 'Student' }, { item: 'Parent' } ]

  created() {
     }

  mounted() {
    this.validatePage();
    this.showmodel = false;
  }
  reset(){
    this.isDisabled=false;
    this.show=false;
    this.fromDate=new Date();
    this.toDate=new Date();
}
  loadData(){
    if(this.fromDate>this.toDate) {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'From Date can not be greater then Todate',
        title: 'error',
        messageTypeId: PayloadMessageTypes.warning
      });
      this.isDisabled=false;
    this.show=false;
    }
else{

    var key = helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.user.userId;
    this.repository.GetStudentFeedBack(key)
    .then(response =>{ this.data = (response as Array<IStudentfeedback>)
      this.isDisabled=true;
      this.show=true;
      this.csvdata = [];
      if (this.data.length > 0) {
        this.data.forEach(element => {
          this.csvdata.push({
            Date:element.date,
            Platform:element.plateForm,
            Feedback:element.feedBack,
            SubCity:element.subCity,
            RollNo:element.rollNo,
            Student_name:element.name,
            Program:element.program,
            ParentNo:element.parentNo,
            StudentNo:element.studentNo
          });
        });
      }
    });

  }
  }
  toggel(){
    this.showmodel = !this.showmodel;
  }
  Savedata(admissionformid,index){

  this.showmodel = true;
  
 
    this.dataex =[];
    var key =admissionformid+"?"+ helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.user.userId;
    this.repository.GetStudentFeedBackAgainstStudent(key)
    .then(response => this.dataex = (response as Array<IStudentfeedbackagainststudent>));
    this.isDisabled=true;
    this.show=true;
  }
  togle(){
this.checkfeedback=!this.checkfeedback;
  }
  loadcsv() {
    this.csvdata = [];
    debugger
    if (this.data.length > 0) {
      this.data.forEach(element => {
        this.csvdata.push({
          Date:element.date,
          Platform:element.plateForm,
          Feedback:element.feedBack,
          SubCity:element.subCity,
          RollNo:element.rollNo,
          Student_name:element.name,
          Program:element.program,
          ParentNo:element.parentNo,
          StudentNo:element.studentNo

        });

      });
      helper.exportToCsv('StudentFeedBack.csv', this.csvdata);
      this.isDisabled=false;
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
      if ("studentfeedback" in this.user.claims == true) {
        if (this.user.claims["studentfeedback"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["studentfeedback"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["studentfeedback"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["studentfeedback"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

}