/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';
import Highcharts from "highcharts";
import { genComponent } from 'vue-highcharts';
import collapsibleWidget from '../../../../../../components/collapsibleWidget';
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';
import * as charts from '../../../../../home/admission-role';
import { IAcademicCalendarMaster, IAcademicCalendarType, IGetSessionBasedSummery, IGetSessionBasedSummeryCityWise, IGetSessionBasedSummeryQuizWise, ILeague, IQuizLeague, ISetupCity, ISetupClass, ISetupSession } from '../../../../models';
import { AcademicCalendarMasterService, AcademicCalendarService, AcademicCalendarTypeService, AdmissionStudentsService, HumanResourceDepartmentsService, HumanResourceStaffService, QuizService, SetupCityService, SetupClassService, SetupSessionService } from '../../../../service';

import { StoreTypes } from '../../../../../../store';
import moment from 'moment';
import { ResponseRateQuizDashBoard } from '../ResponseRate';
import { TopStudentQuizDashBoard } from '../TopStudents';
import { WeeklyQuizPerformanceQuizDashBoard } from '../WeeklyQuizPerformance';
import { PerformanceAnalyticsQuizDashBoard } from '../PerformanceAnalytics';
 

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'response-rate': ResponseRateQuizDashBoard,
        'top-student': TopStudentQuizDashBoard,
        'weekly-quiz-performance': WeeklyQuizPerformanceQuizDashBoard,
        'performance-analytics':PerformanceAnalyticsQuizDashBoard,
        Highcharts: genComponent('Highcharts', Highcharts),
        'form-collection-p': charts.FormCollectionPieWidget,
        collapsibleWidget,
    }
})

export class QuizDashBoard extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
    private courseRepository: AdmissionStudentsService = new AdmissionStudentsService(
        this.$store
    );
    sessionList: Array<ISetupSession> = [];

    private cityRepo: SetupCityService = new SetupCityService(
        this.$store
    );
    private quizRepo: QuizService = new QuizService(
        this.$store
    );

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    repoAcademicCalendarType: AcademicCalendarTypeService = new AcademicCalendarTypeService(
        this.$store
    );
    acadmiccalendarepo: AcademicCalendarService = new AcademicCalendarService(
        this.$store
    );
    viewBtn: boolean = false;

    repoAcademicCalendarMaster: AcademicCalendarMasterService = new AcademicCalendarMasterService(
        this.$store
    );
    academicCalendarMasterList: IAcademicCalendarMaster[] = [];
    calMasterList: Array<IAcademicCalendarMaster> = [];
    academicCalendarMasterId: string = "";

    holidayError: boolean = false;
    viewPopUp = false;

    created() {

        this.quizRepo = new QuizService(this.$store);

    }
    mounted() {
        this.validatePage();
        this.viewBtn = false;
    }



    validatePage() {
        if (this.user.roles.indexOf("admin") >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        } else {
            if ("quizDashboard" in this.user.claims == true) {
                if (this.user.claims["quizDashboard"].indexOf("R") >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims["quizDashboard"].indexOf("C") >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims["quizDashboard"].indexOf("U") >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims["quizDashboard"].indexOf("D") >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push("Home");
            }
        }
    }


}