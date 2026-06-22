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


@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        Highcharts: genComponent('Highcharts', Highcharts),
        'form-collection-p': charts.FormCollectionPieWidget,
        collapsibleWidget,
    }
})

export class ResponseRateQuizDashBoard extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
    private courseRepository: AdmissionStudentsService = new AdmissionStudentsService(
        this.$store
    );
    sessionList: Array<ISetupSession> = [];
    private classList: Array<ISetupClass> = [];
    private leagueList: Array<ILeague> = [];
    private getSessionBasedSummery: Array<IGetSessionBasedSummery> = [];
    private getSessionBasedSummeryCityWise: Array<IGetSessionBasedSummeryCityWise> = [];
    private getSessionBasedSummeryQuizWise: Array<IGetSessionBasedSummeryQuizWise> = [];
    private getSessionBasedSummerySubCityWise: Array<IGetSessionBasedSummeryCityWise> = [];



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
    private noRecordFound: boolean = true;
    private showLoader: boolean = false;
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
        this.loadSession();
        this.loadClassmounted();
        // this.loadCitySubCity();
        // this.loadClass();
        // this.viewBtn = false;
        // this.data = [];
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
        this.fullName = '';
        this.leagueList = [];

        this.sessionRepo.QuizSessionGet().then((r) => {
            this.sessionList = r as Array<ISetupSession>;

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
        this.refreshData();
        this.quizRepo.GetQuizClass().then(res => {
            this.classList = res as Array<ISetupClass>;
        });
    }


    loadLeague() {
        this.showListData = true;
        this.fullName = '';
        this.refreshData();
        if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
            var key = this.sessionId + '?' + this.cityId + '?' + this.classId;

            this.quizRepo.GetLeagueList(key).then(res => {
                this.leagueList = res as Array<ILeague>;
                this.refreshData();
            });
        }


    }
    loadLeagueEx() {
        this.showListData = true;
        this.leagueList = [];
        if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
            var key = this.sessionId + '?' + this.cityId + '?' + this.classId;

            this.quizRepo.GetLeagueList(key).then(res => {
                this.leagueList = res as Array<ILeague>;
                this.refreshData();
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
            this.quizRepo.GetLeagueListSessionBased(this.sessionId).then(res => {
                this.leagueList = res as Array<ILeague>;

            })
        }
        this.refreshData();
        this.cityRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
            this.cityList = r as Array<ISetupCity>;
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
        this.getSessionBasedSummerySubCityWise = [];
        this.getSessionBasedSummeryQuizWise = [];
        this.getSessionBasedSummeryCityWise = [];
        this.getSessionBasedSummery = [];
        if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0 && this.fullName.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}'' AND ct."ClassId"=''${this.classId}'' AND leag."FullName"=''${this.fullName}''`;
            this.quizRepo.GetSessionBasedSummery(keys).then(res => {
                this.getSessionBasedSummery = res as Array<IGetSessionBasedSummery>;
                if (this.getSessionBasedSummery.length > 0 && this.getSessionBasedSummery[0].totalPush > 0) {
                    this.noRecordFound = false;

                    this.generateChart(this.getSessionBasedSummery);
                }
                else {
                    this.noRecordFound = true;
                }

            })
            this.quizRepo.GetQuizSummeryDataCityWise(keys).then(res => {
                this.getSessionBasedSummeryCityWise = res as Array<IGetSessionBasedSummeryCityWise>;
                
                this.generateChartEx();
            })
            this.quizRepo.GetQuizSummeryDataQuizWise(keys).then(res => {
                this.getSessionBasedSummeryQuizWise = res as Array<IGetSessionBasedSummeryQuizWise>;
                this.generateChartQuizWise();
            })
            this.quizRepo.GetQuizSummeryDataSubCityWise(keys).then(res => {
                this.getSessionBasedSummerySubCityWise = res as Array<IGetSessionBasedSummeryCityWise>;
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}'' AND ct."ClassId"=''${this.classId}''`;
            this.quizRepo.GetSessionBasedSummery(keys).then(res => {
                this.getSessionBasedSummery = res as Array<IGetSessionBasedSummery>;
                if (this.getSessionBasedSummery.length > 0 && this.getSessionBasedSummery[0].totalPush > 0) {
                    this.noRecordFound = false;

                    this.generateChart(this.getSessionBasedSummery);
                }
                else {
                    this.noRecordFound = true;
                }
                // this.generateChart(res);
            })
            this.quizRepo.GetQuizSummeryDataCityWise(keys).then(res => {
                this.getSessionBasedSummeryCityWise = res as Array<IGetSessionBasedSummeryCityWise>;
                this.generateChartEx();
            })
            this.quizRepo.GetQuizSummeryDataQuizWise(keys).then(res => {
                this.getSessionBasedSummeryQuizWise = res as Array<IGetSessionBasedSummeryQuizWise>;
                this.generateChartQuizWise();
            })
            this.quizRepo.GetQuizSummeryDataSubCityWise(keys).then(res => {
                this.getSessionBasedSummerySubCityWise = res as Array<IGetSessionBasedSummeryCityWise>;
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}''`;
            this.quizRepo.GetSessionBasedSummery(keys).then(res => {
                this.getSessionBasedSummery = res as Array<IGetSessionBasedSummery>;
                if (this.getSessionBasedSummery.length > 0 && this.getSessionBasedSummery[0].totalPush > 0) {
                    this.noRecordFound = false;

                    this.generateChart(this.getSessionBasedSummery);
                }
                else {
                    this.noRecordFound = true;
                }
                // this.generateChart(res);
            })
            this.quizRepo.GetQuizSummeryDataCityWise(keys).then(res => {
                this.getSessionBasedSummeryCityWise = res as Array<IGetSessionBasedSummeryCityWise>;
                this.generateChartEx();
            })
            this.quizRepo.GetQuizSummeryDataQuizWise(keys).then(res => {
                this.getSessionBasedSummeryQuizWise = res as Array<IGetSessionBasedSummeryQuizWise>;
                this.generateChartQuizWise();
            })
            this.quizRepo.GetQuizSummeryDataSubCityWise(keys).then(res => {
                this.getSessionBasedSummerySubCityWise = res as Array<IGetSessionBasedSummeryCityWise>;
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.fullName.length > 0) {
            this.showLoader = true;
            var keys = `where ct."SessionId" =''${this.sessionId}''  AND leag."FullName"=''${this.fullName}''`;
            this.quizRepo.GetSessionBasedSummery(keys).then(res => {
                this.getSessionBasedSummery = res as Array<IGetSessionBasedSummery>;
                if (this.getSessionBasedSummery.length > 0 && this.getSessionBasedSummery[0].totalPush > 0) {
                    this.noRecordFound = false;

                    this.generateChart(this.getSessionBasedSummery);
                }
                else {
                    this.noRecordFound = true;
                }
                //  this.generateChart(res);
            })
            this.quizRepo.GetQuizSummeryDataCityWise(keys).then(res => {
                this.getSessionBasedSummeryCityWise = res as Array<IGetSessionBasedSummeryCityWise>;
                this.generateChartEx();
            })
            this.quizRepo.GetQuizSummeryDataQuizWise(keys).then(res => {
                this.getSessionBasedSummeryQuizWise = res as Array<IGetSessionBasedSummeryQuizWise>;
                this.generateChartQuizWise();
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0) {

            this.showLoader = true;
            var keys = `where ct."SessionId" =''${this.sessionId}''`;
            this.quizRepo.GetSessionBasedSummery(keys).then(res => {
                this.getSessionBasedSummery = res as Array<IGetSessionBasedSummery>;
                if (this.getSessionBasedSummery.length > 0 && this.getSessionBasedSummery[0].totalPush > 0) {
                    this.noRecordFound = false;
                    this.generateChart(this.getSessionBasedSummery);
                }
                else {
                    this.noRecordFound = true;
                }
                //  this.generateChart(res);
            })
            this.quizRepo.GetQuizSummeryDataCityWise(keys).then(res => {
                this.getSessionBasedSummeryCityWise = res as Array<IGetSessionBasedSummeryCityWise>;
                this.generateChartEx();
                this.showGraph = true;
                this.showTable = false;
            })
            this.quizRepo.GetQuizSummeryDataQuizWise(keys).then(res => {
                this.getSessionBasedSummeryQuizWise = res as Array<IGetSessionBasedSummeryQuizWise>;
                this.generateChartQuizWise();
                this.showLoader = false;

            })
        }

    }

    refreshSummery() {
        this.showLoader = true;
        this.getSessionBasedSummery = [];
        if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0 && this.fullName.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}'' AND ct."ClassId"=''${this.classId}'' AND leag."FullName"=''${this.fullName}''`;
            this.quizRepo.GetSessionBasedSummery(keys).then(res => {
                this.getSessionBasedSummery = res as Array<IGetSessionBasedSummery>;
                if (this.getSessionBasedSummery.length > 0 && this.getSessionBasedSummery[0].totalPush > 0) {
                    this.noRecordFound = false;

                    this.generateChart(this.getSessionBasedSummery);

                    this.showLoader = false;
                }
                //  this.generateChart(res);
            })
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}'' AND ct."ClassId"=''${this.classId}''`;
            this.quizRepo.GetSessionBasedSummery(keys).then(res => {
                this.getSessionBasedSummery = res as Array<IGetSessionBasedSummery>;
                if (this.getSessionBasedSummery.length > 0 && this.getSessionBasedSummery[0].totalPush > 0) {
                    this.noRecordFound = false;

                    this.generateChart(this.getSessionBasedSummery);

                    this.showLoader = false;
                }
                // this.generateChart(res);
            })
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0) {
            this.showTable = true;
            this.showGraph = false;
            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}''`;
            this.quizRepo.GetSessionBasedSummery(keys).then(res => {
                this.getSessionBasedSummery = res as Array<IGetSessionBasedSummery>;
                if (this.getSessionBasedSummery.length > 0 && this.getSessionBasedSummery[0].totalPush > 0) {
                    this.noRecordFound = false;

                    this.generateChart(this.getSessionBasedSummery);

                    this.showLoader = false;
                }
                //  this.generateChart(res);
            })
        }
        else if (this.sessionId.length > 0 && this.classId.length > 0 && this.fullName.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."ClassId"=''${this.classId}'' AND leag."FullName"=''${this.fullName}''`;
            this.quizRepo.GetSessionBasedSummery(keys).then(res => {
                this.getSessionBasedSummery = res as Array<IGetSessionBasedSummery>;

                if (this.getSessionBasedSummery.length > 0 && this.getSessionBasedSummery[0].totalPush > 0) {
                    this.noRecordFound = false;

                    this.generateChart(this.getSessionBasedSummery);

                    this.showLoader = false;
                }
                //this.generateChart(res);
            })
        }

        else if (this.sessionId.length > 0 && this.classId.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."ClassId"=''${this.classId}''`;
            this.quizRepo.GetSessionBasedSummery(keys).then(res => {
                this.getSessionBasedSummery = res as Array<IGetSessionBasedSummery>;

                if (this.getSessionBasedSummery.length > 0 && this.getSessionBasedSummery[0].totalPush > 0) {
                    this.noRecordFound = false;

                    this.generateChart(this.getSessionBasedSummery);

                    this.showLoader = false;
                }
                //this.generateChart(res);
            })
        }

        else if (this.sessionId.length > 0 && this.fullName.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            var keys = `where ct."SessionId" =''${this.sessionId}'' AND leag."FullName"=''${this.fullName}''`;
            this.quizRepo.GetSessionBasedSummery(keys).then(res => {
                this.getSessionBasedSummery = res as Array<IGetSessionBasedSummery>;

                if (this.getSessionBasedSummery.length > 0 && this.getSessionBasedSummery[0].totalPush > 0) {
                    this.noRecordFound = false;

                    this.generateChart(this.getSessionBasedSummery);

                    this.showLoader = false;
                }
                //this.generateChart(res);
            })
        }

        else if (this.sessionId.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            var keys = `where ct."SessionId" =''${this.sessionId}''`;
            this.quizRepo.GetSessionBasedSummery(keys).then(res => {
                this.getSessionBasedSummery = res as Array<IGetSessionBasedSummery>;

                if (this.getSessionBasedSummery.length > 0 && this.getSessionBasedSummery[0].totalPush > 0) {
                    this.noRecordFound = false;
                    this.generateChart(this.getSessionBasedSummery);

                    this.showLoader = false;
                }
                //  this.generateChart(res);
            })
        }


    }

    private generateChartEx() {
        
        this.sessionEx = '';
        this.morningEx = '';

        if (this.getSessionBasedSummeryCityWise.length > 0) {
            this.getSessionBasedSummeryCityWise.forEach((element: any) => {
                if (!this.sessionEx.includes(`"${element.cityName}"`)) {
                    this.sessionEx += `"${element.cityName}",`;
                }
                this.morningEx += `${element.responseRate},`;
            });
            this.sessionEx = `${this.sessionEx.slice(0, -1)}`;
            this.morningEx = `${this.morningEx.slice(0, -1)}`;
            this.morningEx =  this.morningEx;
        }
        const chartOptions = this.optionsEx
            .replace('@City', this.sessionEx)
            .replace('@ResponseRate', this.morningEx);

        try {
            this.optionsTempEx = JSON.parse(chartOptions);
            console.log('Parsed Chart Options:', this.optionsTempEx);
        } catch (error) {
            console.error('Error parsing chart options:', error, chartOptions);
        }
        this.showGraph = true;
    }
    private generateChart(res: any) {

        if (res !== null && res.length > 0 && res[0] !== null) {
            this.session = '';
            if (res[0].responseRate !== undefined) {
                var resrate = Math.round(+res[0].responseRate).toString();

                if (resrate === undefined || resrate === null || resrate === "" || resrate === '0') {
                    resrate = '0';
                }
                try {
                    this.optionsTemp = JSON.parse(
                        this.options.replace('@ResponseRate', `[${resrate}]`));
                    console.log('Parsed Chart Options:', this.optionsTemp);
                } catch (error) {
                    console.error('Error parsing chart options:', error, "");
                }
                this.showGraph = true;
            }
        }
    }

    private generateChartQuizWise() {
        this.quiz = '';
        this.rate = '';
        if (this.getSessionBasedSummeryQuizWise.length > 0) {
            this.getSessionBasedSummeryQuizWise.forEach((element: any) => {
                if (!this.quiz.includes(`"${element.quizName}"`)) {
                    this.quiz += `"${element.quizName} (${element.totalSubmmited})",`;
                }
                this.rate += `${element.responseRate},`;
            });
            this.quiz = `${this.quiz.slice(0, -1)}`;
            this.rate = `${this.rate.slice(0, -1)}`;
        }


        const chartOptions = this.optionsQuizWise
            .replace('@City', this.quiz)
            .replace('@ResponseRate', this.rate);

        try {
            this.optionsQuizWiseGraph = JSON.parse(chartOptions);
        } catch (error) {
            console.error('Error parsing chart options:', error, chartOptions);
        }
        this.showGraph = true;
    }


    options = `{
    "chart": { "type": "column" },
    "title": { "text": "" },
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
                "name": "OverAll Response %",
                "data": [@ResponseRate],
                "color": "#0fb3eb"
            }
        ]
    }`;
    optionsTemp = JSON.parse(
        this.options.replace('@ResponseRate', '[62]')
    );

    optionsEx = `{
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
                "name": "OverAll Response %",
                "data": [@ResponseRate],
                "color": "#05bb7b"
            }
        ]
    }`;

    optionsTempEx = JSON.parse(
        this.optionsEx
            .replace('@City', '["Kasur","Test City"]')
            .replace('@ResponseRate', '[62,11]')
    );

    optionsQuizWise = `{
        "chart": { "type": "line" },
        "title": { "text": "" },
        "xAxis": { "categories": [@City] },
        "yAxis": {
            "min": 0,
            "title": { "text": "" }
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
                "stacking": "normal",
                "dataLabels": { "enabled": true }
            }
        },
        "series": [
            {
                "name": "Quizzes",
                "data": [@ResponseRate],
                "color": "#2d4f8a"
            }
        ]
    }`;

    optionsQuizWiseGraph = JSON.parse(
        this.optionsQuizWise
            .replace('@City', '["Kasur","Test City"]')
            .replace('@ResponseRate', '[62,11]')
    );

}