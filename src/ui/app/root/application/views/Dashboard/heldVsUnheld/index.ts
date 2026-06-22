import Vue from 'vue';
import Component from 'vue-class-component';
import { IAttendenceDashboard } from '../../../models/Attendance/attendenceDashboard';
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
    name: 'heldVsUnheld',
    template: require('./index.html'),
    components: {
       
        Highcharts: genComponent('Highcharts', Highcharts),
        'form-collection-p': charts.FormCollectionPieWidget,
        collapsibleWidget
    
      }
})

export class HeldVsUnheld extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    private data: Array<IAttendenceDashboard> = [];
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
              this.loadClass();
            });
    
      }
    
      loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId==1')
          .then(r => {
            this.classList = r as Array<ISetupClass>
            // this.classList.sort((a: any, b: any) => b.fullName - a.fullName);
            var classId = this.classList.find(e=> e.fullName == 'Part-I').classId;
            this.classId = classId;
            this.refreshData();
            // this.classId = this.classList[0].classId;
          });
      }

    refreshData() {

        this.data = [];

        this.campusId = '00000000-0000-0000-0000-000000000000';


        if (this.sessionId.length > 0 && this.classId.length > 0) {
            // var dated = (new Date(this.datestring).getFullYear()) + '-' + (new Date(this.datestring).getMonth() + 1) + '-' + (new Date(this.datestring).getDate());
            var key = this.sessionId + '?00000000-0000-0000-0000-000000000000?00000000-0000-0000-0000-000000000000?' + moment(this.date).format('YYYY-MM-DD') + '?SESSION' + '?' + this.user.userId + '?' + this.classId;
            this.repository.GetAttendenceDashboardData(key).then(r => {
                this.data = r as Array<IAttendenceDashboard>;



                //  alert(JSON.stringify(this.goBack));

                this.sumDataPie(this.data);
            })
        }
    }

    sumDataPie(list: Array<IAttendenceDashboard>) {
        this.sumData = { scheduled: 0, held: 0, approved: 0, unApproved: 0 };
        list.forEach(e => {
            this.sumData.scheduled += e.scheduled;
            this.sumData.approved += e.approved;
            this.sumData.held += e.held;
            this.sumData.unApproved += e.unApproved;

        })

        this.options = chartPerser.getChartJson(this.sumData, 'approvedPie');
        this.optionsH = chartPerser.getChartJson(this.sumData, 'heldPie');
        //  console.log(JSON.stringify(this.options));
        // 
    }
    options = {
        title: { text: "" },
        colors:
            ['#39B54A', '#25ABE2', '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#FFF200', '#EE207C', '#27368E']
        , credits: {
            enabled: false
        }
    };

    optionsH = {
        title: { text: "" },
        colors:
            ['#39B54A', '#25ABE2', '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#FFF200', '#EE207C', '#27368E']
        , credits: {
            enabled: false
        }
    };
}