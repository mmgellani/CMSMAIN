import Vue from 'vue';
import Component from 'vue-class-component';
import { IAttendenceDashboard, ConcessionDashboardEx, IRevenueDashboard } from '../../../models/Attendance/attendenceDashboard';
import { AttendanceAttendenceStatusService, SetupSessionService, SetupClassService } from '../../../service';
import * as chartPerser from '../../../../home/admission-role/index';
import { ISetupSession, ISetupClass } from '../../../models';
import Highcharts from "highcharts";
import { genComponent } from 'vue-highcharts';
import * as charts from '../../../../home/admission-role';
import collapsibleWidget from '../../../../../components/collapsibleWidget';
import moment from "moment";
import { State } from 'vuex-class';
import { IRootStoreState } from '../../../../store';
import { IUser } from '../../../../../model';

@Component({
    name: 'revenueGraph',
    template: require('./index.html'),
    components: {

        Highcharts: genComponent('Highcharts', Highcharts),
        'form-collection-p': charts.FormCollectionPieWidget,
        collapsibleWidget

    }
})

export class RevenueGraph extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    private data: Array<IRevenueDashboard> = [];
    private sessionId: string = '';
    // private datestring: string = "";
    private date: Date = new Date();
    private classId = '';
    campusId: string = '00000000-0000-0000-0000-000000000000';


    private sessionList: Array<ISetupSession> = [];
    private repositorySession: SetupSessionService;

    private repository: AttendanceAttendenceStatusService;
    private sumData = { scheduled: 0, held: 0, approved: 0, unApproved: 0 }
    private classRepo: SetupClassService = new SetupClassService(this.$store);
    private classList: Array<ISetupClass> = []

    private students: number = 0;
    private challan: number = 0;
    private actualAmount: number = 0;
    private paidAmount: number = 0;
    private discountAmount: number = 0;
    private barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '' }



    created() {
        this.repository = new AttendanceAttendenceStatusService(this.$store);
        this.repositorySession = new SetupSessionService(this.$store);
    }

    mounted() {
        this.getSession();
    }

    getSession() {
        this.sessionList = [];
        this.repositorySession
            .GetFindBy("e => e.StatusId==1")
            .then(
                response => {
                    this.sessionList = response as Array<ISetupSession>
                    this.sessionList.sort((a: any, b: any) => b.fullName - a.fullName);
                    this.sessionId = this.sessionList[0].sessionId;
                    this.refreshData();
                });

    }

    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.classList = r as Array<ISetupClass>
                // this.classList.sort((a: any, b: any) => b.fullName - a.fullName);
                var classId = this.classList.find(e => e.fullName == 'Part-I').classId;
                this.classId = classId;
                // this.classId = this.classList[0].classId;
            });
    }

    refreshData() {
   
        this.data = [];
        // this.sessionId = this.sessionList[0].sessionId; 
    
        if (this.sessionId.length > 0) {
    
          var key = this.sessionId + '?' + this.user.userId;
          this.repository.GetRevenueDashboardData(key).then(r => {
            this.data = r as Array<IRevenueDashboard>;
            this.options = chartPerser.getChartJson(this.data, 'revenueBar');
    
          })
          // this.viewAttendance = true;
        }
      }
      options = {
        chart: {
          type: 'column'
        },
        colors:
          ['#8b8abb', '#ff9dab', '#a2a0fe', '#ffc1ca'],
        title: {
          text: 'Sample Data'
        },
        subtitle: {
          text: null
        },
        xAxis: {
          categories: [
            'Lahore',
            'Rawalpindi',
            'Faisalabad',
            'Gujranwala'
          ],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Total Students'
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y} Students</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -5,
          y: 40,
          floating: true,
          borderWidth: 1,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
          shadow: true
        },
        series: [{
          name: '2016',
          data: [18000, 14000, 13000, 9000]
    
        }, {
          name: '2017',
          data: [19000, 15000, 14000, 10000]
    
        }, {
          name: '2018',
          data: [20000, 16000, 15000, 11000]
    
        }, {
          name: '2019',
          data: [21000, 17000, 16000, 12000]
    
        }]
      };

}