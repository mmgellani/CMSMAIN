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
import { IAcademicCalendarMaster, IAcademicCalendarType, IGetSessionBasedSummery, IGetSessionBasedSummeryCityWise, IGetSessionBasedSummeryQuizWise, ILeague, IQuizLeague, IQuizSubjectWisePerformance, IQuizWeeklyPerformanceResponse, ISetupCity, ISetupClass, ISetupSession } from '../../../../models';
import { AcademicCalendarMasterService, AcademicCalendarService, AcademicCalendarTypeService, AdmissionStudentsService, HumanResourceDepartmentsService, HumanResourceStaffService, QuizService, SetupCityService, SetupClassService, SetupSessionService } from '../../../../service';

import { StoreTypes } from '../../../../../../store';
import moment from 'moment';


@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        Highcharts: genComponent('Highcharts', Highcharts),
        'form-collection-p': charts.FormCollectionPieWidget,
        collapsibleWidget,
    }
})

export class WeeklyQuizPerformanceQuizDashBoard extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
    private courseRepository: AdmissionStudentsService = new AdmissionStudentsService(
        this.$store
    );
    sessionList: Array<ISetupSession> = [];
    private classList: Array<ISetupClass> = [];
    private leagueList: Array<ILeague> = [];
    private getSessionBasedSummery: Array<IQuizWeeklyPerformanceResponse> = [];
    private getQuizSubjectWisePerformance: Array<IQuizSubjectWisePerformance> = [];





    private repoClass: SetupClassService = new SetupClassService(this.$store);
    private data: Array<IQuizLeague> = [];


    private cityRepo: SetupCityService = new SetupCityService(
        this.$store
    );
    private quizRepo: QuizService = new QuizService(
        this.$store
    );

    private cityList: Array<ISetupCity> = [];
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private showListData: boolean = false;
    private showGraph: boolean = false;
    private showTable: boolean = false;
    private showLoader = false;


    sessionId: string = "";
    campusId: string = "";
    holidaytypeid: string = "";
    topicId: string = "";
    boardId: string = "";
    classId: string = "";
    fullName: string = "";
    cityId: string = "";
    quizName: string = "";
    testFrequency: string = "";
    responseRate: string = "50";
    private session: string = ``;
    private morning: string = ``;
    private sessionEx: string = ``;
    private morningEx: string = ``;
    private quiz: string = ``;
    private rate: string = ``;
    private performance: string = ``;
    chartKey: 0;
    private fromdate = new Date();
    private todate = new Date();
    private calendarfromdate = new Date();
    private calendartodate = new Date();

    private currDate = new Date();
    academicCalendarTypeList: IAcademicCalendarType[] = [];
    repoAcademicCalendarType: AcademicCalendarTypeService = new AcademicCalendarTypeService(
        this.$store
    );
    acadmiccalendarepo: AcademicCalendarService = new AcademicCalendarService(
        this.$store
    );
    private useCreationPopup = false;
    private useDetailPopup = false;
    viewBtn: boolean = false;
    private noRecordFound: boolean = true;
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
        this.$watch('sessionId', this.loadCitySubCity);
        this.$watch('cityId', this.loadClass);
        this.$watch('classId', this.loadLeague);
        this.$watch('fullName', this.loadLeagueData);
        this.loadSession();
        this.loadCitySubCity();
        this.loadClassmounted();
        this.viewBtn = false;
        this.data = [];

    }
    mounted() {
    }

    private columns = [
        { key: 'sessionName', caption: 'Session Name' },
        { key: 'cityName', caption: 'City Name' },
        { key: 'className', caption: 'Class Name' },
        { key: 'leagueName', caption: 'League Name' },
        { key: 'quizName', caption: 'Quiz Name' },
        { key: 'fromDate', caption: 'FromDate' },
        { key: 'toDate', caption: 'ToDate' },
        { key: 'statusId', caption: 'Status' },

    ];

    loadLeagueData() {
        this.noRecordFound = true;
        this.refreshData();
    }
    submit() {
        //  this.loadLeagueEx();
    }

    loadSession() {
        this.showListData = false;
        this.cityId = '';
        this.cityList = [];
        this.classId = '';
        this.classList = [];
        this.fullName = '';
        this.leagueList = [];

        this.sessionRepo.QuizSessionGet().then((r) => {

            this.sessionList = r as Array<ISetupSession>;
            this.refreshData();
        });

    }

    loadClassmounted() {
        this.quizRepo.GetQuizClass().then(res => {
            this.classList = res as Array<ISetupClass>;
        });
    }


    loadClass() {
        this.noRecordFound = true;
        this.showListData = false;
        this.classId = '';
        this.fullName = '';
        this.refreshData();
        this.quizRepo.GetQuizClass().then(res => {
            this.classList = res as Array<ISetupClass>;
        });
    }

    loadLeague() {
        this.noRecordFound = true;
        this.showListData = true;
        this.fullName = '';
        this.refreshData();
        if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
            var key = this.sessionId + '?' + this.cityId + '?' + this.classId;

            this.quizRepo.GetLeagueList(key).then((res) => {
                this.leagueList = res as Array<ILeague>;
            });
        }
    }
    loadLeagueEx() {
        this.showListData = true;
        this.leagueList = [];
        this.refreshData();
        if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
            var key = this.sessionId + '?' + this.cityId + '?' + this.classId;
            this.quizRepo.GetLeagueList(key).then((res) => {
                this.leagueList = res as Array<ILeague>;
            });
        }
    }

    loadCitySubCity() {
        this.showListData = false;
        this.cityId = '';
        this.cityList = [];
        this.classId = '';
        this.fullName = '';
        if (this.sessionId.length > 0) {
            this.quizRepo.GetLeagueListSessionBased(this.sessionId).then((res) => {
                this.leagueList = res as Array<ILeague>;
            })
        }
        this.refreshData();
        this.cityRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
            this.cityList = r as Array<ISetupCity>;
            this.loadClassmounted();
        });
    }
    allowshow() {
        if (
            this.sessionId.length > 0
        )
            return true;
        return false;
    }

    cancel() {
        this.fromdate = new Date();
        this.todate = new Date();
        this.calendarfromdate = new Date();
        this.calendartodate = new Date();
        this.testFrequency = "";
        this.quizName = "";
        this.showListData = false;
        this.loadLeagueEx();
        this.refreshData();
    }

    save() {
    }


    refreshData() {
        this.getSessionBasedSummery = [];
        if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0 && this.fullName.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;


            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}'' AND ct."ClassId"=''${this.classId}'' AND leag."FullName"=''${this.fullName}''`;
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getQuizSubjectWisePerformance = res as Array<IQuizSubjectWisePerformance>;
                if (this.getQuizSubjectWisePerformance.length > 0 && +this.getQuizSubjectWisePerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                }
                else {
                    this.noRecordFound = true;
                }
                this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                    this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                    this.generateChartQuizWise();
                })
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}'' AND ct."ClassId"=''${this.classId}''`;
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getQuizSubjectWisePerformance = res as Array<IQuizSubjectWisePerformance>;
                if (this.getQuizSubjectWisePerformance.length > 0 && +this.getQuizSubjectWisePerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                }
                else {
                    this.noRecordFound = true;
                }
                this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                    this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                    this.generateChartQuizWise();
                })
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.classId.length > 0 && this.fullName.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;


            var keys = `where ct."SessionId" =''${this.sessionId}''  AND ct."ClassId"=''${this.classId}'' AND leag."FullName"=''${this.fullName}''`;
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getQuizSubjectWisePerformance = res as Array<IQuizSubjectWisePerformance>;
                if (this.getQuizSubjectWisePerformance.length > 0 && +this.getQuizSubjectWisePerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                }
                else {
                    this.noRecordFound = true;
                }
                this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                    this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                    this.generateChartQuizWise();
                })
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.fullName.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;


            var keys = `where ct."SessionId" =''${this.sessionId}''  AND ct."CityId"=''${this.cityId}'' AND leag."FullName"=''${this.fullName}''`;
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getQuizSubjectWisePerformance = res as Array<IQuizSubjectWisePerformance>;
                if (this.getQuizSubjectWisePerformance.length > 0 && +this.getQuizSubjectWisePerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                }
                else {
                    this.noRecordFound = true;
                }
                this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                    this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                    this.generateChartQuizWise();
                })
                this.showLoader = false;

            })
        }  
        else if (this.sessionId.length > 0 && this.fullName.length > 0) {
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}''  AND leag."FullName"=''${this.fullName}''`;
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getQuizSubjectWisePerformance = res as Array<IQuizSubjectWisePerformance>;
                if (this.getQuizSubjectWisePerformance.length > 0 && +this.getQuizSubjectWisePerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                }
                else {
                    this.noRecordFound = true;
                }
                this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                    this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                    this.generateChartQuizWise();
                })
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.classId.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;


            var keys = `where ct."SessionId" =''${this.sessionId}''  AND ct."ClassId"=''${this.classId}''`;
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getQuizSubjectWisePerformance = res as Array<IQuizSubjectWisePerformance>;
                if (this.getQuizSubjectWisePerformance.length > 0 && +this.getQuizSubjectWisePerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                }
                else {
                    this.noRecordFound = true;
                }
                this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                    this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                    this.generateChartQuizWise();
                })
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;


            var keys = `where ct."SessionId" =''${this.sessionId}''  AND ct."CityId"=''${this.cityId}''`;
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getQuizSubjectWisePerformance = res as Array<IQuizSubjectWisePerformance>;
                if (this.getQuizSubjectWisePerformance.length > 0 && +this.getQuizSubjectWisePerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                }
                else {
                    this.noRecordFound = true;
                }
                this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                    this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                    this.generateChartQuizWise();
                })
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0) {
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}''`;
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getQuizSubjectWisePerformance = res as Array<IQuizSubjectWisePerformance>;
                if (this.getQuizSubjectWisePerformance.length > 0 && +this.getQuizSubjectWisePerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                }
                else {
                    this.noRecordFound = true;
                }
                this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                    this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                    this.generateChartQuizWise();
                    this.showLoader = false;

                })
            })
        }


    }



    private generateChartQuizWise() {
        this.quiz = '';
        this.rate = '';
        this.performance = '';
        if (this.getSessionBasedSummery.length > 0) {
            this.getSessionBasedSummery.forEach((element: any) => {
                if (!this.quiz.includes(`"${element.quizName}"`)) {
                    this.quiz += `"${element.quizName} (${element.totalSubmmited})",`;
                }
                this.rate += `${element.responseRate},`;
                this.performance += `${element.percentage},`;
            });

            this.quiz = `${this.quiz.slice(0, -1)}`;
            this.rate = `${this.rate.slice(0, -1)}`;
            this.performance = `${this.performance.slice(0, -1)}`;
        }
        const chartOptions = this.optionsQuizWise
            .replace('@City', this.quiz)
            .replace('@ResponseRate', this.rate)
            .replace('@Performance', this.performance);

        try {
            this.optionsQuizWiseGraph = JSON.parse(chartOptions);
        } catch (error) {
            console.error('Error parsing chart options:', error, chartOptions);
        }
        this.showGraph = true;
    }



    optionsQuizWise = `{
        "chart": { "type": "line" },
        "title": { "text": "" },
        "xAxis": { "categories": [@City] },
        "yAxis": {
            "min": 0,
            "title": { "text": "" },
            "stackLabels": {
                "enabled": true,
                "style": { "fontWeight": "bold", "color": "gray" }
            }
        },
        "legend": {
            "align": "center",
            "verticalAlign": "bottom",
            "y": 25,
            "floating": true,
            "backgroundColor": "white",
            "borderColor": "#CCC",
            "borderWidth": 0,
            "shadow": false
        },
        "tooltip": {
            "useHTML": true,
            "headerFormat": "<b>{point.x}</b><br/>"
        },
        "plotOptions": {
            "column": {
                "stacking": "normal",
                "dataLabels": { "enabled": true }
            }
        },
        "series": [
            {
                "name": "Performance %",
                "data": [@Performance],
                "color": "#ff0019"
            },
             {
                "name": "Response Rate %",
                "data": [@ResponseRate],
                "color": "#341f8f"
            }
        ]
    }`;

    optionsQuizWiseGraph = JSON.parse(
        this.optionsQuizWise
            .replace('@City', '["Kasur","Test City"]')
            .replace('@ResponseRate', '[62,11]')
            .replace('@Performance', '[62,11]')
    );

}