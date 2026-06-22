import Vue from 'vue';
import Component from 'vue-class-component';
import { IAttendenceDashboard, ConcessionDashboardEx } from '../../../models/Attendance/attendenceDashboard';
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
    name: 'concessionGraph',
    template: require('./index.html'),
    components: {

        Highcharts: genComponent('Highcharts', Highcharts),
        'form-collection-p': charts.FormCollectionPieWidget,
        collapsibleWidget

    }
})

export class ConcessionGraph extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    private data: Array<ConcessionDashboardEx> = [];
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
        this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '' };

        this.campusId = '00000000-0000-0000-0000-000000000000';

        if (this.sessionId.length > 0) {
            // if (this.sessionId.length > 0 && this.cityId.length > 0 && this.programDetailId.length) {
            //   var key =  this.user.userId;
            this.repository.GetConcessionDashboardDataExx(this.sessionId + '?' + this.user.userId).then(r => {
                this.data = r as Array<ConcessionDashboardEx>;
                this.students = this.data[0].students;
                this.challan = this.data[0].challan;
                this.actualAmount = this.data[0].actualAmount;
                this.paidAmount = this.data[0].paidAmount;
                this.discountAmount = this.data[0].discountAmount;
                this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '' };
                this.data.forEach(e => {
                    this.barData.challan += e.challan;
                    this.barData.students += e.students;
                    this.barData.paidAmount += e.paidAmount;
                    this.barData.actualAmount += e.actualAmount;
                    this.barData.discountAmount += e.discountAmount;
                    this.barData.cityName = this.sessionList[0].fullName + " Concession";

                })

                this.options = chartPerser.getChartJson(this.barData, 'horizontalBar');

            })
        }
        // }
    }
    options = {
        chart: {
            type: 'bar'
        },
        colors:
            ['#00FF00'],
        title: {
            text: 'No Data Found',
            align: 'left'
        },
        xAxis: {
            categories: ['Lahore'],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            max: 97038386,
            title: {
                text: 'PKR',
                align: 'high'
            },
            plotLines: [{
                color: '#F5B038',
                dashStyle: 'shortdash',
                width: 2,
                value: 0,
                zIndex: 5
            }]
        },
        tooltip: {
            valueSuffix: ' PKR'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Concession Amount',
            data: [0]
        }]

    };

}