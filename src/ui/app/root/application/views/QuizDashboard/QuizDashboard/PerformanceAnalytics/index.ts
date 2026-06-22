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
import { IAcademicCalendarMaster, IAcademicCalendarType, IArvoSubject, IGetSessionBasedSummery, IGetSessionBasedSummeryCityWise, IGetSessionBasedSummeryQuizWise, ILeague, IQuizCityWisePerformance, IQuizLeague, IQuizSubCityOverAllPerformance, IQuizSubjectWisePerformance, IQuizTimeWiseOverAllPerformance, IQuizTopStudentSession, IQuizTopStudentSessionCourse, IQuizWeeklyPerformanceResponse, ISetupCity, ISetupClass, ISetupSession } from '../../../../models';
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

export class PerformanceAnalyticsQuizDashBoard extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
    private courseRepository: AdmissionStudentsService = new AdmissionStudentsService(
        this.$store
    );
    sessionList: Array<ISetupSession> = [];
    private classList: Array<ISetupClass> = [];
    private leagueList: Array<ILeague> = [];
    private subjectList: Array<IArvoSubject> = [];

    private repoClass: SetupClassService = new SetupClassService(this.$store);
    private data: Array<IQuizLeague> = [];


    private cityRepo: SetupCityService = new SetupCityService(
        this.$store
    );
    private quizRepo: QuizService = new QuizService(
        this.$store
    );


    private getQuizTopStudentSessionCourse: Array<IQuizTopStudentSessionCourse> = [];
    private getQuizTopStudentSession: Array<IQuizTopStudentSession> = [];

    private cityList: Array<ISetupCity> = [];
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private showListData: boolean = false;
    private showGraph: boolean = false;
    private showTable: boolean = false;
    private noRecordFound: boolean = true;


    subjectId: string = "";
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
    private showLoader: boolean = false;

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

    repoAcademicCalendarMaster: AcademicCalendarMasterService = new AcademicCalendarMasterService(
        this.$store
    );
    academicCalendarMasterList: IAcademicCalendarMaster[] = [];
    calMasterList: Array<IAcademicCalendarMaster> = [];
    academicCalendarMasterId: string = "";
    private getSessionBasedSummery: Array<IQuizWeeklyPerformanceResponse> = [];
    private getSubjectBasedPerformance: Array<IQuizSubjectWisePerformance> = [];
    private getCityPerformance: Array<IQuizSubjectWisePerformance> = [];
    private getQuizTimeWiseOverAllPerformance: Array<IQuizTimeWiseOverAllPerformance> = [];
    private getSubCityPerformance: Array<IQuizSubCityOverAllPerformance> = [];




    holidayError: boolean = false;
    viewPopUp = false;

    created() {

        this.quizRepo = new QuizService(this.$store);
        this.$watch('sessionId', this.loadCitySubCity);
        this.$watch('cityId', this.loadClass);
        this.$watch('classId', this.loadLeague);
        this.$watch('fullName', this.loadLeagueData);
        this.$watch('subjectId', this.loadSubjectData);


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
        this.subjectId = '';
        this.refreshData();
    }
    loadSubjectData() {
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
        this.subjectList = [];

        this.sessionRepo.QuizSessionGet().then((r) => {

            this.sessionList = r as Array<ISetupSession>;
        });
    }

    loadSubject() {

        this.subjectList = [];
        this.quizRepo.GetArvoSubjectList("e=>e.StatusId==1").then((r) => {
            this.subjectList = r as Array<IArvoSubject>;
        });
    }

    loadClassmounted() {
        this.quizRepo.GetQuizClass().then(res => {
            this.classList = res as Array<ISetupClass>;
        });
    }


    loadClass() {
        this.showListData = false;
        this.classId = '';
        this.fullName = '';
        this.subjectId = '';
        this.quizRepo.GetQuizClass().then(res => {
            this.classList = res as Array<ISetupClass>;
        });
        this.refreshData();
    }

    loadLeague() {
        this.showListData = true;
        this.fullName = '';
        this.subjectId = '';
        if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
            var key = this.sessionId + '?' + this.cityId + '?' + this.classId;

            this.quizRepo.GetLeagueList(key).then((res) => {
                this.leagueList = res as Array<ILeague>;
                this.refreshData();
            });
        }
        this.refreshData();


    }
    loadLeagueEx() {
        this.showListData = true;
        this.leagueList = [];
        if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
            var key = this.sessionId + '?' + this.cityId + '?' + this.classId;

            this.quizRepo.GetLeagueList(key).then((res) => {
                this.leagueList = res as Array<ILeague>;
                this.refreshData();
            });
        }
    }

    loadCitySubCity() {

        this.loadSubject();
        this.showListData = false;
        this.cityId = '';
        this.subjectId = '';
        this.cityList = [];
        this.classId = '';
        this.fullName = '';
        if (this.sessionId.length > 0) {
            this.quizRepo.GetLeagueListSessionBased(this.sessionId).then((res) => {
                this.leagueList = res as Array<ILeague>;
            })
        }
        this.cityRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
            this.cityList = r as Array<ISetupCity>;
        });
        this.refreshData();
        this.loadClassmounted();
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
        this.PerformanceTrend();
    }

    PerformanceTrend() {
        this.getSessionBasedSummery = [];
        this.getSubjectBasedPerformance = [];
        this.getSubCityPerformance = [];
        this.getQuizTimeWiseOverAllPerformance = [];
        this.getCityPerformance = [];

        if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0 && this.fullName.length > 0 && this.subjectId.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;
            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}'' AND ct."ClassId"=''${this.classId}'' AND leag."FullName"=''${this.fullName}'' AND crs."FullName"=''${this.subjectId}''`;
            this.getCityPerformance = [];
            this.quizRepo.QuizTimeWiseOverAllPerformance(keys).then((res) => {
                this.getQuizTimeWiseOverAllPerformance = res as Array<IQuizTimeWiseOverAllPerformance>;
                if (this.getQuizTimeWiseOverAllPerformance.length > 0 && +this.getQuizTimeWiseOverAllPerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                    this.generateChartOverAll();
                }
                else {
                    this.noRecordFound = true;
                }
            })
            this.quizRepo.QuizSubCityOverAllPerformance(keys).then((res) => {
                this.getSubCityPerformance = res as Array<IQuizSubCityOverAllPerformance>;
                // this.generateChartCity(); 
            })
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getSubjectBasedPerformance = res as Array<IQuizSubjectWisePerformance>;
                this.generateChartSubject();
            })
            this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                this.generateChartQuizWise();
                this.showLoader = false;
            })
        }
        else if (this.sessionId.length > 0 && this.classId.length > 0 && this.fullName.length > 0 && this.subjectId.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;
            var keys = `where ct."SessionId" =''${this.sessionId}''  AND ct."ClassId"=''${this.classId}'' AND leag."FullName"=''${this.fullName}'' AND crs."FullName"=''${this.subjectId}''`;
            this.getCityPerformance = [];
            this.quizRepo.QuizTimeWiseOverAllPerformance(keys).then((res) => {
                this.getQuizTimeWiseOverAllPerformance = res as Array<IQuizTimeWiseOverAllPerformance>;
                if (this.getQuizTimeWiseOverAllPerformance.length > 0 && +this.getQuizTimeWiseOverAllPerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                    this.generateChartOverAll();
                }
                else {
                    this.noRecordFound = true;
                }
            })
            this.quizRepo.QuizCityWisePerformance(keys).then((res) => {
                this.getCityPerformance = res as Array<IQuizCityWisePerformance>;
                this.generateChartCity();
            })
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getSubjectBasedPerformance = res as Array<IQuizSubjectWisePerformance>;
                this.generateChartSubject();
            })
            this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                this.generateChartQuizWise();
                this.showLoader = false;
            })
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0 && this.subjectId.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;
            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}'' AND ct."ClassId"=''${this.classId}'' AND crs."FullName"=''${this.subjectId}''`;
            this.getCityPerformance = [];
            this.quizRepo.QuizTimeWiseOverAllPerformance(keys).then((res) => {
                this.getQuizTimeWiseOverAllPerformance = res as Array<IQuizTimeWiseOverAllPerformance>;
                if (this.getQuizTimeWiseOverAllPerformance.length > 0 && +this.getQuizTimeWiseOverAllPerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                    this.generateChartOverAll();
                }
                else {
                    this.noRecordFound = true;
                }
            })
            this.quizRepo.QuizSubCityOverAllPerformance(keys).then((res) => {
                this.getSubCityPerformance = res as Array<IQuizSubCityOverAllPerformance>;
                // this.generateChartCity(); 
            })
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getSubjectBasedPerformance = res as Array<IQuizSubjectWisePerformance>;
                this.generateChartSubject();
            })
            this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                this.generateChartQuizWise();
                this.showLoader = false;
            })
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0 && this.fullName.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}'' AND ct."ClassId"=''${this.classId}'' AND leag."FullName"=''${this.fullName}''`;
            this.getCityPerformance = [];
            this.quizRepo.QuizTimeWiseOverAllPerformance(keys).then((res) => {
                this.getQuizTimeWiseOverAllPerformance = res as Array<IQuizTimeWiseOverAllPerformance>;
                if (this.getQuizTimeWiseOverAllPerformance.length > 0 && +this.getQuizTimeWiseOverAllPerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                    this.generateChartOverAll();

                }
                else {
                    this.noRecordFound = true;
                }
            })
            this.quizRepo.QuizSubCityOverAllPerformance(keys).then((res) => {
                this.getSubCityPerformance = res as Array<IQuizSubCityOverAllPerformance>;
                //this.generateChartCity(); 
            })
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getSubjectBasedPerformance = res as Array<IQuizSubjectWisePerformance>;
                this.generateChartSubject();
            })
            this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                this.generateChartQuizWise();
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.classId.length > 0 && this.fullName.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."ClassId"=''${this.classId}'' AND leag."FullName"=''${this.fullName}''`;
            this.getCityPerformance = [];
            this.quizRepo.QuizTimeWiseOverAllPerformance(keys).then((res) => {
                this.getQuizTimeWiseOverAllPerformance = res as Array<IQuizTimeWiseOverAllPerformance>;
                if (this.getQuizTimeWiseOverAllPerformance.length > 0 && +this.getQuizTimeWiseOverAllPerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                    this.generateChartOverAll();

                }
                else {
                    this.noRecordFound = true;
                }
            })
            this.quizRepo.QuizCityWisePerformance(keys).then((res) => {
                this.getCityPerformance = res as Array<IQuizCityWisePerformance>;
                this.generateChartCity();
            })
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getSubjectBasedPerformance = res as Array<IQuizSubjectWisePerformance>;
                this.generateChartSubject();
            })
            this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                this.generateChartQuizWise();
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.fullName.length > 0 && this.subjectId.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            this.showLoader = true;
            var keys = `where ct."SessionId" =''${this.sessionId}''  AND leag."FullName"=''${this.fullName}'' AND crs."FullName"=''${this.subjectId}''`;
            this.getCityPerformance = [];
            this.quizRepo.QuizTimeWiseOverAllPerformance(keys).then((res) => {
                this.getQuizTimeWiseOverAllPerformance = res as Array<IQuizTimeWiseOverAllPerformance>;
                if (this.getQuizTimeWiseOverAllPerformance.length > 0 && +this.getQuizTimeWiseOverAllPerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                    this.generateChartOverAll();

                }
                else {
                    this.noRecordFound = true;
                }
            })
            this.quizRepo.QuizCityWisePerformance(keys).then((res) => {
                this.getCityPerformance = res as Array<IQuizCityWisePerformance>;
                this.generateChartCity();
            })
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getSubjectBasedPerformance = res as Array<IQuizSubjectWisePerformance>;
                this.generateChartSubject();
            })
            this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                this.generateChartQuizWise();
                this.showLoader = false;
            })
        } 
        else if (this.sessionId.length > 0 && this.classId.length > 0 && this.subjectId.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            this.showLoader = true;
            var keys = `where ct."SessionId" =''${this.sessionId}''  AND ct."ClassId"=''${this.classId}''  AND crs."FullName"=''${this.subjectId}''`;
            this.getCityPerformance = [];
            this.quizRepo.QuizTimeWiseOverAllPerformance(keys).then((res) => {
                this.getQuizTimeWiseOverAllPerformance = res as Array<IQuizTimeWiseOverAllPerformance>;
                if (this.getQuizTimeWiseOverAllPerformance.length > 0 && +this.getQuizTimeWiseOverAllPerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                    this.generateChartOverAll();
                }
                else {
                    this.noRecordFound = true;
                }
            })
            this.quizRepo.QuizCityWisePerformance(keys).then((res) => {
                this.getCityPerformance = res as Array<IQuizCityWisePerformance>;
                this.generateChartCity();
            })
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getSubjectBasedPerformance = res as Array<IQuizSubjectWisePerformance>;
                this.generateChartSubject();
            })
            this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                this.generateChartQuizWise();
                this.showLoader = false;
            })
        } 
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}'' AND ct."ClassId"=''${this.classId}''`;
            this.getCityPerformance = [];
            this.quizRepo.QuizTimeWiseOverAllPerformance(keys).then((res) => {
                this.getQuizTimeWiseOverAllPerformance = res as Array<IQuizTimeWiseOverAllPerformance>;
                if (this.getQuizTimeWiseOverAllPerformance.length > 0 && +this.getQuizTimeWiseOverAllPerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                    this.generateChartOverAll();

                }
                else {
                    this.noRecordFound = true;
                }
            })
            this.quizRepo.QuizSubCityOverAllPerformance(keys).then((res) => {
                this.getSubCityPerformance = res as Array<IQuizSubCityOverAllPerformance>;
                //this.generateChartCity(); 
            })
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getSubjectBasedPerformance = res as Array<IQuizSubjectWisePerformance>;
                this.generateChartSubject();
            })
            this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                this.generateChartQuizWise();
                this.showLoader = false;

            })
        } 
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.subjectId.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;
            var keys = `where ct."SessionId" =''${this.sessionId}''  AND ct."CityId"=''${this.cityId}'' AND crs."FullName"=''${this.subjectId}''`;
            this.getCityPerformance = [];
            this.quizRepo.QuizTimeWiseOverAllPerformance(keys).then((res) => {
                this.getQuizTimeWiseOverAllPerformance = res as Array<IQuizTimeWiseOverAllPerformance>;
                if (this.getQuizTimeWiseOverAllPerformance.length > 0 && +this.getQuizTimeWiseOverAllPerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                    this.generateChartOverAll();
                }
                else {
                    this.noRecordFound = true;
                }
            })
            this.quizRepo.QuizCityWisePerformance(keys).then((res) => {
                this.getCityPerformance = res as Array<IQuizCityWisePerformance>;
                this.generateChartCity();
            })
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getSubjectBasedPerformance = res as Array<IQuizSubjectWisePerformance>;
                this.generateChartSubject();
            })
            this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                this.generateChartQuizWise();
                this.showLoader = false;
            })
        }
        else if (this.sessionId.length > 0 && this.subjectId.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}'' AND crs."FullName"=''${this.subjectId}''`;
            this.getCityPerformance = [];
            this.quizRepo.QuizTimeWiseOverAllPerformance(keys).then((res) => {
                this.getQuizTimeWiseOverAllPerformance = res as Array<IQuizTimeWiseOverAllPerformance>;
                if (this.getQuizTimeWiseOverAllPerformance.length > 0 && +this.getQuizTimeWiseOverAllPerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                    this.generateChartOverAll();

                }
                else {
                    this.noRecordFound = true;
                }
            })
            this.quizRepo.QuizCityWisePerformance(keys).then((res) => {
                this.getCityPerformance = res as Array<IQuizCityWisePerformance>;
                this.generateChartCity();
            })
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getSubjectBasedPerformance = res as Array<IQuizSubjectWisePerformance>;
                this.generateChartSubject();
            })
            this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                this.generateChartQuizWise();
                this.showLoader = false;
            })
        }
        else if (this.sessionId.length > 0 && this.fullName.length > 0) {
            this.noRecordFound = true;
            this.showTable = false;
            this.showGraph = true;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}''  AND leag."FullName"=''${this.fullName}''`;
            this.quizRepo.QuizTimeWiseOverAllPerformanceSessionBased(keys).then((res) => {
                this.getQuizTimeWiseOverAllPerformance = res as Array<IQuizTimeWiseOverAllPerformance>;
                if (this.getQuizTimeWiseOverAllPerformance.length > 0 && +this.getQuizTimeWiseOverAllPerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                    this.generateChartOverAll();

                }
                else {
                    this.noRecordFound = true;
                }
            })
            this.quizRepo.QuizCityWisePerformance(keys).then((res) => {
                this.getCityPerformance = res as Array<IQuizCityWisePerformance>;
                this.generateChartCity();
            })
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getSubjectBasedPerformance = res as Array<IQuizSubjectWisePerformance>;
                this.generateChartSubject();
            })
            this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                this.generateChartQuizWise();
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.classId.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}''  AND ct."ClassId"=''${this.classId}''`;
            this.getCityPerformance = [];
            this.quizRepo.QuizTimeWiseOverAllPerformance(keys).then((res) => {
                this.getQuizTimeWiseOverAllPerformance = res as Array<IQuizTimeWiseOverAllPerformance>;
                if (this.getQuizTimeWiseOverAllPerformance.length > 0 && +this.getQuizTimeWiseOverAllPerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                    this.generateChartOverAll();

                }
                else {
                    this.noRecordFound = true;
                }
            })
            this.quizRepo.QuizCityWisePerformance(keys).then((res) => {
                this.getCityPerformance = res as Array<IQuizCityWisePerformance>;
                this.generateChartCity();
            })
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getSubjectBasedPerformance = res as Array<IQuizSubjectWisePerformance>;
                this.generateChartSubject();
            })
            this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                this.generateChartQuizWise();
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}''`;
            this.quizRepo.QuizTimeWiseOverAllPerformance(keys).then((res) => {
                this.getCityPerformance = [];
                this.getQuizTimeWiseOverAllPerformance = res as Array<IQuizTimeWiseOverAllPerformance>;
                if (this.getQuizTimeWiseOverAllPerformance.length > 0 && +this.getQuizTimeWiseOverAllPerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                    this.generateChartOverAll();

                }
                else {
                    this.noRecordFound = true;
                }
            })
            this.quizRepo.QuizSubCityOverAllPerformance(keys).then((res) => {
                this.getSubCityPerformance = res as Array<IQuizSubCityOverAllPerformance>;
                //this.generateChartCity(); 
            })
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getSubjectBasedPerformance = res as Array<IQuizSubjectWisePerformance>;
                this.generateChartSubject();
            })
            this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                this.generateChartQuizWise();
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0) {
            this.noRecordFound = true;
            this.showLoader = true;
            this.showTable = false;
            this.showGraph = true;

            var keys = `where ct."SessionId" =''${this.sessionId}''`;
            this.quizRepo.QuizTimeWiseOverAllPerformanceSessionBased(keys).then((res) => {
                this.getQuizTimeWiseOverAllPerformance = res as Array<IQuizTimeWiseOverAllPerformance>;
                if (this.getQuizTimeWiseOverAllPerformance.length > 0 && +this.getQuizTimeWiseOverAllPerformance[0].percentage > 0) {
                    this.noRecordFound = false;
                    this.generateChartOverAll();

                }
                else {
                    this.noRecordFound = true;
                }
            })
            this.quizRepo.QuizCityWisePerformance(keys).then((res) => {
                this.getCityPerformance = res as Array<IQuizCityWisePerformance>;
                this.generateChartCity();
            })
            this.quizRepo.QuizSubjectWisePerformance(keys).then((res) => {
                this.getSubjectBasedPerformance = res as Array<IQuizSubjectWisePerformance>;
                this.generateChartSubject();
            })
            this.quizRepo.QuizWeeklyPerformanceResponse(keys).then((res) => {
                this.getSessionBasedSummery = res as Array<IQuizWeeklyPerformanceResponse>;
                this.generateChartQuizWise();
                this.showLoader = false;

            })
        }




        if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0 && this.fullName.length > 0 && this.subjectId.length > 0) {
            this.showGraph = false;
            this.showTable = true;
        }
        else if (this.sessionId.length > 0 && this.subjectId.length > 0 && this.classId.length > 0 && this.fullName.length > 0) {
            this.showGraph = true;
            this.showTable = false;
        }

        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0 && this.fullName.length > 0 && this.subjectId.length > 0) {
            this.showGraph = false;
            this.showTable = true;
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.fullName.length > 0 && this.subjectId.length > 0) {
            this.showGraph = false;
            this.showTable = true;
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.fullName.length > 0) {
            this.showGraph = false;
            this.showTable = true;
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
            this.showGraph = false;
            this.showTable = true;
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0 && this.fullName.length > 0) {
            this.showGraph = false;
            this.showTable = true;
        }

        else if (this.sessionId.length > 0 && this.subjectId.length > 0 && this.fullName.length > 0) {
            this.showGraph = true;
            this.showTable = false;
        }
        else if (this.sessionId.length > 0 && this.subjectId.length > 0 && this.classId.length > 0) {
            this.showGraph = true;
            this.showTable = false;
        }
        else if (this.sessionId.length > 0 && this.subjectId.length > 0) {
            this.showGraph = true;
            this.showTable = false;
        }
        else if (this.sessionId.length > 0 && this.classId.length > 0) {
            this.showGraph = true;
            this.showTable = false;
        }
        else if (this.sessionId.length > 0 && this.fullName.length > 0) {
            this.showGraph = true;
            this.showTable = false;
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0) {
            this.showGraph = false;
            this.showTable = true;
        }
        else if (this.sessionId.length > 0) {
            this.showGraph = true;
            this.showTable = false;
        }

    }

    private generateChartOverAll() {
        this.sessionEx = '';
        this.morningEx = '';
        if (this.getQuizTimeWiseOverAllPerformance.length > 0) {
            this.getQuizTimeWiseOverAllPerformance.forEach((element: any) => {
                const parsedPercentage = parseFloat(element.percentage.replace('%', ''));
                this.sessionEx += `${parsedPercentage},`;
                const timeParts = element.time.split('.');
                const parsedTime =
                    parseInt(timeParts[0]) + (parseInt(timeParts[1]) || 0) / 60;
                this.morningEx += `${parsedTime.toFixed(2)},`;
            });

            this.sessionEx = this.sessionEx.slice(0, -1);
            this.sessionEx = Math.round(+this.sessionEx).toString();
            this.morningEx = this.morningEx.slice(0, -1);
        }


        const chartOptions = this.OverAlloptionsEx
            .replace('@Performance', this.sessionEx)
            .replace('@Time', this.morningEx);

        try {
            this.optionsTempOverAlloptionsEx = JSON.parse(chartOptions);
            console.log('Parsed Chart Options:', this.optionsTempOverAlloptionsEx);
        } catch (error) {
            console.error('Error parsing chart options:', error, chartOptions);
        }

        this.showGraph = true;
    }


    private generateChartCity() {
        this.sessionEx = '';
        this.morningEx = '';
        if (this.getCityPerformance.length > 0) {
            this.getCityPerformance.forEach((element: any) => {
                if (!this.sessionEx.includes(`"${element.city}"`)) {
                    this.sessionEx += `"${element.city}",`;
                }
                this.morningEx += `${element.percentage},`;
            });

            this.sessionEx = `${this.sessionEx.slice(0, -1)}`;
            this.morningEx = `${this.morningEx.slice(0, -1)}`;
        }
        const chartOptions = this.CityoptionsEx
            .replace('@City', this.sessionEx)
            .replace('@Performance', this.morningEx);

        try {
            this.optionsTempCity = JSON.parse(chartOptions);
            console.log('Parsed Chart Options:', this.optionsTempEx);
        } catch (error) {
            console.error('Error parsing chart options:', error, chartOptions);
        }
        this.showGraph = true;
    }

    private generateChartSubject() {
        this.sessionEx = '';
        this.morningEx = '';
        if (this.getSubjectBasedPerformance.length > 0) {
            this.getSubjectBasedPerformance.forEach((element: any) => {
                if (!this.sessionEx.includes(`"${element.course}"`)) {
                    this.sessionEx += `"${element.course}",`;
                }
                this.morningEx += `${element.percentage},`;
            });

            this.sessionEx = `${this.sessionEx.slice(0, -1)}`;
            this.morningEx = `${this.morningEx.slice(0, -1)}`;
        }
        const chartOptions = this.subjectoptionsEx
            .replace('@Subejct', this.sessionEx)
            .replace('@Performance', this.morningEx);

        try {
            this.optionsTempEx = JSON.parse(chartOptions);
            console.log('Parsed Chart Options:', this.optionsTempEx);
        } catch (error) {
            console.error('Error parsing chart options:', error, chartOptions);
        }
        this.showGraph = true;
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
                this.rate += `"${element.responseRate}",`;
                this.performance += `${element.percentage},`;
            });

            this.quiz = `${this.quiz.slice(0, -1)}`;
            this.rate = `${this.rate.slice(0, -1)}`;
            this.performance = `${this.performance.slice(0, -1)}`;
        }

        const chartOptions = this.optionsQuizWise
            .replace('@City', this.quiz)
            .replace('@Performance', this.performance);

        try {
            this.optionsQuizWiseGraph = JSON.parse(chartOptions);
        } catch (error) {
            console.error('Error parsing chart options:', error, chartOptions);
        }
        this.showGraph = true;
    }
    OverAlloptionsEx = `{
    "chart": { "type": "column" },
    "title": { "text": "" },
    "xAxis": {
        "categories": ["Average Marks", "Average Time"]
    },
    "yAxis": {
        "min": 0,
        "title": { "text": "" }
    },
    "tooltip": {
        "useHTML": true,
        "headerFormat": "<b>{point.category}</b><br/>",
        "pointFormat": "{series.name}: {point.y}"
    },
    "plotOptions": {
        "column": {
            "grouping": true,
            "dataLabels": { "enabled": true }
        }
    },
    "series": [
        {
            "name": "Average Marks",
            "data": [@Performance],
            "color": "#19a4e0"
        },
        {
            "name": "Average Time",
            "data": [@Time],
            "color": "#a4a4e0"
        }
    ]
}

`;

    optionsTempOverAlloptionsEx = JSON.parse(
        this.OverAlloptionsEx
            .replace('@Performance', '["Kasur","Test City"]')
            .replace('@Time', '[62,11]')
    );


    CityoptionsEx = `{
    "chart": { "type": "column" },
    "title": { "text": "" },
    "xAxis": {
        "categories": [@City]
    },
   "yAxis": {
        "min": 0,
        "title": { "text": "" }
    },
    "tooltip": {
        "useHTML": true,
        "headerFormat": "<b>{point.category}</b><br/>",
        "pointFormat": "{series.name}: {point.y}"
    },
    "plotOptions": {
        "column": {
            "grouping": true,
            "dataLabels": { "enabled": true }
        }
    },
    "series": [
        {
            "name": "City-Wise Performance",
            "data": [@Performance],
            "color": "#39cf8f"
        }
        
    ]
}`;

    optionsTempCity = JSON.parse(
        this.CityoptionsEx
            .replace('@City', '["Kasur","Test City"]')
            .replace('@Performance', '[62,11]')
    );

    subjectoptionsEx = `{
        "chart": { "type": "column" },
        "title": { "text": "" },
        "xAxis": { "categories": [@Subejct] },
       "yAxis": {
        "min": 0,
        "title": { "text": "" }
    },
    "tooltip": {
        "useHTML": true,
        "headerFormat": "<b>{point.category}</b><br/>",
        "pointFormat": "{series.name}: {point.y}"
    },
    "plotOptions": {
        "column": {
            "grouping": true,
            "dataLabels": { "enabled": true }
        }
    },
        "series": [
            {
                "name": "Subject-Wise Performance",
                "data": [@Performance],
                "color": "#002489"
            }
        ]
    }`;

    optionsTempEx = JSON.parse(
        this.subjectoptionsEx
            .replace('@Subejct', '["Kasur","Test City"]')
            .replace('@Performance', '[62,11]')
    );

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
        "headerFormat": "<b>{point.category}</b><br/>",
        "pointFormat": "{series.name}: {point.y}"
    },
    "plotOptions": {
        "column": {
            "grouping": true,
            "dataLabels": { "enabled": true }
        }
    },
        "series": [
            {
                "name": "Weekly Quiz Performance",
                 "data": [@Performance],
                "color": "#2d4f8a"
            }
             
        ]
    }`;

    optionsQuizWiseGraph = JSON.parse(
        this.optionsQuizWise
            .replace('@City', '["Kasur","Test City"]')
            .replace('@Performance', '[62,11]')
    );

}
