/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser, PayloadMessageTypes } from "../../../../../model";
import { IRootStoreState } from "../../../../store";

import { IGeneral, IComparisonData, IAverageDashboard } from "../../../models";
import { ComparisonService } from "../../../service";

import Highcharts from "highcharts";
import { genComponent } from 'vue-highcharts';

import collapsibleWidget from '../../../../../components/collapsibleWidget';
import { debug } from "util";
import tableGraph from "../../../../../components/table-graph";

@Component({
    name: 'comparison-dashboard',
    template: require('./index.html'),
    components: {
        Highcharts: genComponent('Highcharts', Highcharts),
        'collapsible-widget': collapsibleWidget,
        'table-graph': tableGraph,
    }
})
export class ComparisonDashboard extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: ComparisonService = new ComparisonService(this.$store);

    private sessionList: Array<IGeneral> = [];
    private campusTypeList: Array<IGeneral> = [];
    private cityList: Array<IGeneral> = [];
    private subCityList: Array<IGeneral> = [];
    private programList: Array<IGeneral> = [];

    private finalData: Array<IComparisonData> = [];
    private averageData: Array<IAverageDashboard> = [];

    private sessionId: string = '2023';
    private cityId: string = '';
    private typeId: string = '';
    private subcityId: string = '';
    private programId: string = '';

    private cityChk: boolean = false;
    private typeChk: boolean = false;
    private subcityChk: boolean = false;
    private programChk: boolean = false;

    public tabOne: boolean = false;
    public tabTwo: boolean = true;
    private tabRef = '';

    changedEvent() {
        if (this.tabRef == 'Table') {

            this.tabOne = true;
            this.tabTwo = false;

        }
        else if (this.tabRef == 'Graph') {

            this.tabOne = false;
            this.tabTwo = true;
        }
    }

    mounted() {
        //this.getData('session');
        this.getData('type');
        this.getData('city');
        this.getData('program');
    }

    getData(module: string, param: string = '0') {
        if (module == 'city') {
            if (this.typeChk == true) {
                if (this.typeId.length > 0) {
                    param = `WHERE "CampusType"='${this.typeId}'`;
                } else {
                    alert("Please Chose Posission Type.");
                    return;
                }
            } else {
                param = '';
            }
        }

        this.repository.ParamsDashboard(`${module}:${param}`)
            .then(response => {
                switch (module) {
                    case 'session':
                        this.sessionList = [];
                        this.sessionList = response as Array<IGeneral>;
                        break;
                    case 'type':
                        this.campusTypeList = [];
                        this.campusTypeList = response as Array<IGeneral>;
                        break;
                    case 'city':
                        this.cityList = [];
                        this.cityList = response as Array<IGeneral>;
                        break;
                    case 'subcity':
                        this.subCityList = [];
                        this.subCityList = response as Array<IGeneral>;
                        break;
                    case 'program':
                        this.programList = [];
                        this.programList = response as Array<IGeneral>;
                        break;
                    case 'result':
                        this.finalData = [];
                        this.finalData = response as Array<IComparisonData>;

                        this.generateChart();
                        this.getComparisonEx();
                        break;
                    default:
                        console.error(JSON.stringify(response));
                }
            });
    }

    private averageEx = [];
    private getComparisonEx() {
        this.averageEx = [];
        this.repository.AverageDashboardEx()
            .then(result => {
                this.averageEx = result;
            });
    }

    private session: string = ``;
    private morning: string = ``;
    private evening: string = ``;

    private sessionEx: string = ``;
    private morningEx: string = ``;
    private eveningEx: string = ``;

    private index: number = 0;

    private refreshData() {
        var whereClause: string = 'WHERE ';

        if (this.sessionId.length > 0) {
            whereClause += `"Session" <= ${this.sessionId}`;
        } else {
            alert("Please Select Session.");

            return;
        }

        if (this.typeChk == true) {
            if (this.typeId.length > 0) {
                whereClause += ` AND "CampusType" = '${this.typeId}'`;
            } else {
                alert("Please select Possession Type");
                return;
            }
        }

        if (this.cityChk == true) {
            if (this.cityId.length > 0) {
                whereClause += `AND "City" = '${this.cityId}'`;
            } else {
                alert("Please select City");
                return;
            }
        }

        if (this.subcityChk == true) {
            if (this.subcityId.length > 0) {
                whereClause += `AND "SubCity" = '${this.subcityId}'`;
            } else {
                alert("Please select Sub-City");
                return;
            }
        }

        if (this.programChk == true) {
            if (this.programId.length > 0) {
                whereClause += `AND "Program" = '${this.programId}'`;
            } else {
                alert("Please select Program");
                return;
            }
        }

        this.getData('result', whereClause);
        this.averData();
    }

    private averData() {
        this.averageData = [];
        var whereClause: string = 'WHERE ';

        if (this.sessionId.length > 0) {
            whereClause += `"Session" <= ${this.sessionId}`;
        } else {
            alert("Please Select Session.");

            return;
        }

        if (this.typeChk == true) {
            if (this.typeId.length > 0) {
                whereClause += ` AND "Possession" = '${this.typeId}'`;
            } else {
                alert("Please select Possession Type");
                return;
            }
        }

        this.repository.AverageDashboard(whereClause)
            .then(response => {
                this.averageData = response as Array<IAverageDashboard>;
                this.generateChartEx();
            });
    }

    private generateChart() {
        this.session = this.morning = this.evening = '';

        this.finalData.forEach((element: IComparisonData) => {

            if (this.session.indexOf(element.session.toString()) < 0)
                this.session += `"${element.session}",`;

            if (element.shift == 'Morning') {
                this.morning += `${element.total},`;
            } else {
                this.evening += `${element.total},`;
            }
        });

        this.session = this.session.substring(0, this.session.length - 1);
        this.morning = this.morning.substring(0, this.morning.length - 1);
        this.evening = this.evening.substring(0, this.evening.length - 1);

        this.optionsTemp = JSON.parse(this.options
            .replace('@Session', this.session)
            .replace('@Morning', this.morning)
            .replace('@Afternoon', this.evening)
        );

        this.index++;
    }

    private generateChartEx() {
        this.sessionEx = this.morningEx = this.eveningEx = '';

        this.averageData.forEach((element: IAverageDashboard) => {

            if (this.sessionEx.indexOf(element.session.toString()) < 0)
                this.sessionEx += `"${element.session}",`;

            if (element.possession == 'Owned') {
                this.morningEx += `${element.average},`;
            } else {
                this.eveningEx += `${element.average},`;
            }
        });

        this.sessionEx = this.sessionEx.substring(0, this.sessionEx.length - 1);
        this.morningEx = this.morningEx.substring(0, this.morningEx.length - 1);
        this.eveningEx = this.eveningEx.substring(0, this.eveningEx.length - 1);

        this.optionsTempEx = JSON.parse(this.optionsEx
            .replace('@Session', this.sessionEx)
            .replace('@Morning', this.morningEx)
            .replace('@Afternoon', this.eveningEx)
        );
    }

    options = `{
   "chart":{
      "type":"column"
   },
   "title":{
      "text":""
   },
   "xAxis":{
      "categories":[@Session]
   },
   "yAxis":{
      "min":0,
      "title":{
         "text":"No. of Admissions"
      },
      "stackLabels":{
         "enabled":true,
         "style":{
            "fontWeight":"bold",
            "color": "gray"
         }
      }
   },
   "legend":{
      "align":"center",
      "verticalAlign":"bottom",
      "y":24,
      "floating":true,
      "backgroundColor": "white",
      "borderColor":"#CCC",
      "borderWidth":0,
      "shadow":false
   },
   "tooltip":{
       "useHTML": "true",
      "headerFormat":"<b>{point.x}</b><br/>",
      "pointFormat":"{series.name}:<span>{point.y:.0f}</span><br/>Total: {point.stackTotal}"
   },
   "plotOptions":{
      "column":{
         "stacking":"normal",
         "dataLabels":{
            "enabled":true
         }
      }
   },
   "series":[
      {
         "name":"Morning",
         "data":[@Morning],
         "color": "#38A3A5"
      },
      {
         "name":"Evening",
         "data":[@Afternoon],
         "color": "#22577A"
      }
   ]
}`;

    optionsEx = `{
   "chart":{
      "type":"column"
   },
   "title":{
      "text":""
   },
   "xAxis":{
      "categories":[@Session]
   },
   "yAxis":{
      "min":0,
      "title":{
         "text":"No. of Admissions"
      },
      "stackLabels":{
         "enabled":true,
         "style":{
            "fontWeight":"bold",
            "color": "gray"
         }
      }
   },
   "legend":{
      "align":"center",
      "verticalAlign":"bottom",
      "y":25,
      "floating":true,
      "backgroundColor": "white",
      "borderColor":"#CCC",
      "borderWidth":0,
      "shadow":false
   },
   "tooltip":{
       "useHTML": "true",
      "headerFormat":"<b>{point.x}</b><br/>",
      "pointFormat":"{series.name}:<span>{point.y:.0f}</span><br/>Total: {point.stackTotal}"
   },
   "plotOptions":{
      "column":{
         "stacking":"normal",
         "dataLabels":{
            "enabled":true
         }
      }
   },
   "series":[
      {
         "name":"Owned",
         "data":[@Morning],
         "color": "#38A3A5"
      },
      {
         "name":"Franchise",
         "data":[@Afternoon],
         "color": "#22577A"
      }
   ]
}`;

    optionsTemp = JSON.parse(this.options
        .replace('@Session', this.session)
        .replace('@Morning', this.morning)
        .replace('@Afternoon', this.evening));

    optionsTempEx = JSON.parse(this.optionsEx
        .replace('@Session', this.sessionEx)
        .replace('@Morning', this.morningEx)
        .replace('@Afternoon', this.eveningEx));
}