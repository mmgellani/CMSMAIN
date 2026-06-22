import Vue from "vue";
import Component from "vue-class-component";

import Highcharts from "highcharts";
import loadMap from "highcharts/modules/map.js";
import { genComponent } from "vue-highcharts";
import { ISetupProgram, IFeeStudentChallan, IAdmissionAdmissionForm, IRegistrationEnrollments, AdmissionsCount, FeeStudentChallanCount, EnrollmentsCount, ISetupCity, ISetupSubCity } from "../../../application/models";
import { SetupProgramService, AdmissionAdmissionFormService, FeeStudentChallanService, RegistrationEnrollmentsService, SetupCityService, SetupSubCityService } from "../../../application/service";
import WidgetBox from "../../widget-box";

loadMap(Highcharts);

@Component({
  template: require("./index.html"),
  components: {
    Highcharts: genComponent("Highcharts", Highcharts),
    Highmaps: genComponent("Highmaps", Highcharts),
    'widget-box': WidgetBox
  }
})
export class FormCollectionWidget extends Vue {
  // private data: any = [];
  // private service: SetupProgramService = null;
  // private v: number = 0;
  // private opt: string = "";
  // private options: any = {};
  // private series: string = "";
  // private open: any = {};

  // private chartString = ``;

  private admissionRepository: AdmissionAdmissionFormService;
  private FeeChallanrepository: FeeStudentChallanService = null;
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
  private cityRepo: SetupCityService = new SetupCityService(this.$store)
  private subCityRepo: SetupSubCityService = new SetupSubCityService(this.$store)


  // private paidData: Array<IFeeStudentChallan> = [];
  // private data: Array<IAdmissionAdmissionForm> = [];
  // private EnrollData: Array<IRegistrationEnrollments> = [];
  private cityList: Array<ISetupCity> = []
  private subCityList: Array<ISetupSubCity> = []
  private paidData: Array<FeeStudentChallanCount> = [];
  private data: Array<AdmissionsCount> = [];
  private EnrollData: Array<EnrollmentsCount> = [];
  private admissionCount: number = 0;
  private paidChallanCount: number = 0;
  private enrollmentCount: number = 0;
  private cityId: string = '';
  private subCityId: string = '';
  private check: boolean = false;


  created() {
    this.admissionRepository = new AdmissionAdmissionFormService(this.$store);
    this.FeeChallanrepository = new FeeStudentChallanService(this.$store);
  }

  refreshData() {

    if (this.check && this.cityId.length && this.subCityId.length) {
      this.cityWiseData();

    }
    else {
      this.cityId='';
      this.subCityId='';
      this.admissionWidgetData();

    }
  }

  admissionWidgetData() {
    this.data = [];
    this.paidData = [];
    this.EnrollData = [];
    this.admissionCount = 0;
    this.paidChallanCount = 0;
    this.enrollmentCount = 0;
    this.admissionRepository.GetAdmissionWidgetData()
      .then(r => {

        this.data = r.admissionForm as Array<AdmissionsCount>;
        this.paidData = r.studentChallan as Array<FeeStudentChallanCount>;
        this.EnrollData = r.enrollments as Array<EnrollmentsCount>;
        this.admissionCount = this.data[0].admissionCount;
        this.paidChallanCount = this.paidData[0].paidChallanCount;
        this.enrollmentCount = this.EnrollData[0].enrollmentCount;
      })
  }

  cityWiseData() {
    this.data = [];
    this.paidData = [];
    this.EnrollData = [];
    this.admissionCount = 0;
    this.paidChallanCount = 0;
    this.enrollmentCount = 0;
    var key = this.cityId + '?' + this.subCityId;
    this.admissionRepository.GetCityWise(key)
      .then(r => {

        this.data = r.admissionForm as Array<AdmissionsCount>;
        this.paidData = r.studentChallan as Array<FeeStudentChallanCount>;
        this.EnrollData = r.enrollments as Array<EnrollmentsCount>;
        this.admissionCount = this.data[0].admissionCount;
        this.paidChallanCount = this.paidData[0].paidChallanCount;
        this.enrollmentCount = this.EnrollData[0].enrollmentCount;
      })
  }

  loadCity() {
    this.cityRepo.GetAll()
      .then(r => {
        this.cityList = r as Array<ISetupCity>

      })
  }
  loadSubCity() {
    this.subCityRepo.GetFindBy('e=>e.CityId.ToString()=="' + this.cityId + '"')
      .then(r => {
        this.subCityList = r as Array<ISetupSubCity>
      })

  }



  mounted() {
    this.refreshData();
    this.loadCity();



    // this.service = new SetupProgramService(this.$store);
    // this.service.GetAll().then(response => {
    //   this.data = response as Array<ISetupProgram>;

    //   var names = '';
    //   var datas = [];

    //   var allOpt = [];
    //   this.data.forEach(element => {

    //     for(var i = 0; i < 10; i ++) {
    //         datas.push(Math.floor(Math.random() * 5500) + 1 );
    //     }

    //     allOpt.push({
    //         name: element.fullName,
    //         data:  datas
    //     });
    //       datas = [];
    //   });

    //   this.options = {
    //     title: { text: "" },

    //     colors: 
    //       ['#39B54A', '#25ABE2', '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#180902', '#EE207C', '#27368E']
    //     ,

    //     xAxis: { title: { text: "Session" } },

    //     yAxis: { title: { text: "Number of Students" } },
    //     legend: { layout: "vertical", align: "right", verticalAlign: "middle" },

    //     plotOptions: { series: { label: { connectorAllowed: false }, pointStart: 2010 } },
    //     series: allOpt,

    //     responsive: { rules: [ { condition: { maxWidth: 500 }, chartOptions: { legend: { layout: "horizontal", align: "center", verticalAlign: "bottom", display: false } } } ] }
    //   };
    // });
  }




}
