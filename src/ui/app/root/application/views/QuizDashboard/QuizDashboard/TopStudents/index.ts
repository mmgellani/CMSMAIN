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
import { IAcademicCalendarMaster, IAcademicCalendarType, IArvoSubject, IGetSessionBasedSummery, IGetSessionBasedSummeryCityWise, IGetSessionBasedSummeryQuizWise, ILeague, IQuizLeague, IQuizTopStudentSession, IQuizTopStudentSessionCourse, IQuizTopStudentSessionCourseEx, IQuizTopStudentSessionEx, ISetupCity, ISetupClass, ISetupSession } from '../../../../models';
import { AcademicCalendarMasterService, AcademicCalendarService, AcademicCalendarTypeService, AdmissionStudentsService, HumanResourceDepartmentsService, HumanResourceStaffService, QuizService, SetupCityService, SetupClassService, SetupSessionService } from '../../../../service';

import { StoreTypes } from '../../../../../../store';
import moment from 'moment';
import * as helper from "../../../../helper";
import { FailMasterPreview } from '../../../Examination/ExamSchedule/failMasterPreview';


@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        Highcharts: genComponent('Highcharts', Highcharts),
        'form-collection-p': charts.FormCollectionPieWidget,
        collapsibleWidget,
    }
})

export class TopStudentQuizDashBoard extends Vue {
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


    private getQuizTopStudentSessionCourse: Array<IQuizTopStudentSessionCourseEx> = [];
    private getQuizTopStudentSession: Array<IQuizTopStudentSessionEx> = [];

    private cityList: Array<ISetupCity> = [];
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private showListData: boolean = false;
    private showGraph: boolean = false;
    private showTable: boolean = false;
    private noRecordFound: boolean = true;
    private showLoader = false;

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
    chartKey: 0;
    private fromdate = new Date();
    private todate = new Date();
    private calendarfromdate = new Date();
    private calendartodate = new Date();
    private csvdata: any = [];

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
    private isDisabled = true;
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
        this.noRecordFound = true;
        this.showListData = false;
        this.classId = '';
        this.fullName = '';
        this.subjectId = '';

        this.quizRepo.GetQuizClass().then(res => {
            this.classList = res as Array<ISetupClass>;
            this.refreshData();
        });
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
            this.refreshData();
        });
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
        this.getQuizTopStudentSession = [];
        this.getQuizTopStudentSessionCourse = [];
        if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0 && this.fullName.length > 0 && this.subjectId.length > 0) {
            this.getQuizTopStudentSession = [];
            this.showTable = true;
            this.showGraph = false;
            this.isDisabled = true;
            this.showLoader = true;
            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}'' AND ct."ClassId"=''${this.classId}'' AND leag."FullName"=''${this.fullName}'' AND crs."FullName"=''${this.subjectId}''`;
            this.quizRepo.QuizTopStudentSessionCourseEx(keys).then((res) => {
                this.getQuizTopStudentSessionCourse = res as Array<IQuizTopStudentSessionCourseEx>;
                if (this.getQuizTopStudentSessionCourse.length > 0 && +this.getQuizTopStudentSessionCourse[0].responseRate > 0) {
                    this.noRecordFound = false;
                    this.isDisabled = false;
                }
                else if (this.getQuizTopStudentSessionCourse.length == 0) {
                    this.noRecordFound = true;
                }
                this.showLoader = false;

            })
        }
       else if (this.sessionId.length > 0 && this.classId.length > 0 && this.fullName.length > 0 && this.subjectId.length > 0) {
            this.getQuizTopStudentSession = [];
            this.showTable = true;
            this.showGraph = false;
            this.isDisabled = true;
            this.showLoader = true;
            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."ClassId"=''${this.classId}'' AND leag."FullName"=''${this.fullName}'' AND crs."FullName"=''${this.subjectId}''`;
            this.quizRepo.QuizTopStudentSessionCourseEx(keys).then((res) => {
                this.getQuizTopStudentSessionCourse = res as Array<IQuizTopStudentSessionCourseEx>;
                if (this.getQuizTopStudentSessionCourse.length > 0 && +this.getQuizTopStudentSessionCourse[0].responseRate > 0) {
                    this.noRecordFound = false;
                    this.isDisabled = false;
                }
                else if (this.getQuizTopStudentSessionCourse.length == 0) {
                    this.noRecordFound = true;
                }
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0 && this.subjectId.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            this.showLoader = true;
            this.getQuizTopStudentSessionCourse = [];
            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}'' AND ct."ClassId"=''${this.classId}'' AND crs."FullName"=''${this.subjectId}''`;
            this.quizRepo.QuizTopStudentSessionCourseEx(keys).then((res) => {
                this.getQuizTopStudentSession = res as Array<IQuizTopStudentSessionEx>;

                if (this.getQuizTopStudentSession.length > 0 && +this.getQuizTopStudentSession[0].responseRate > 0) {
                    this.noRecordFound = false;
                    this.isDisabled = false;
                }
                else if (this.getQuizTopStudentSession.length == 0) {
                    this.noRecordFound = true;
                }
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0 && this.fullName.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            this.showLoader = true;
            this.getQuizTopStudentSessionCourse = [];
            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}'' AND ct."ClassId"=''${this.classId}'' AND leag."FullName"=''${this.fullName}''`;
            this.quizRepo.QuizTopStudentSessionEx(keys).then((res) => {
                this.getQuizTopStudentSession = res as Array<IQuizTopStudentSessionEx>;

                if (this.getQuizTopStudentSession.length > 0 && +this.getQuizTopStudentSession[0].responseRate > 0) {
                    this.noRecordFound = false;
                    this.isDisabled = false;
                }
                else if (this.getQuizTopStudentSession.length == 0) {
                    this.noRecordFound = true;
                }
                this.showLoader = false;

            })
        } 
        else if (this.sessionId.length > 0 && this.classId.length > 0 && this.fullName.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            this.showLoader = true;
            this.getQuizTopStudentSessionCourse = [];
            var keys = `where ct."SessionId" =''${this.sessionId}''  AND ct."ClassId"=''${this.classId}'' AND leag."FullName"=''${this.fullName}''`;
            this.quizRepo.QuizTopStudentSessionEx(keys).then((res) => {
                this.getQuizTopStudentSession = res as Array<IQuizTopStudentSessionEx>;

                if (this.getQuizTopStudentSession.length > 0 && +this.getQuizTopStudentSession[0].responseRate > 0) {
                    this.noRecordFound = false;
                    this.isDisabled = false;
                }
                else if (this.getQuizTopStudentSession.length == 0) {
                    this.noRecordFound = true;
                }
                this.showLoader = false;

            })
        } 
        else if (this.sessionId.length > 0 && this.subjectId.length > 0 && this.fullName.length > 0) {
            this.getQuizTopStudentSession = [];
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}''   AND crs."FullName"=''${this.subjectId}''  AND leag."FullName"=''${this.fullName}''`;
            this.quizRepo.QuizTopStudentSessionCourseEx(keys).then((res) => {
                this.getQuizTopStudentSessionCourse = res as Array<IQuizTopStudentSessionCourseEx>;

                if (this.getQuizTopStudentSessionCourse.length > 0 && +this.getQuizTopStudentSessionCourse[0].responseRate > 0) {
                    this.noRecordFound = false;
                    this.isDisabled = false;
                }
                else if (this.getQuizTopStudentSessionCourse.length == 0) {
                    this.noRecordFound = true;
                }
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.subjectId.length > 0 && this.classId.length > 0) {
            this.getQuizTopStudentSession = [];
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}''   AND crs."FullName"=''${this.subjectId}''  AND ct."ClassId"=''${this.classId}''`;
            this.quizRepo.QuizTopStudentSessionCourseEx(keys).then((res) => {
                this.getQuizTopStudentSessionCourse = res as Array<IQuizTopStudentSessionCourseEx>;

                if (this.getQuizTopStudentSessionCourse.length > 0 && +this.getQuizTopStudentSessionCourse[0].responseRate > 0) {
                    this.noRecordFound = false;
                    this.isDisabled = false;
                }
                else if (this.getQuizTopStudentSessionCourse.length == 0) {
                    this.noRecordFound = true;
                }
                this.showLoader = false;

            })
        } 
        else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            this.showLoader = true;

            this.getQuizTopStudentSessionCourse = [];
            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}'' AND ct."ClassId"= ''${this.classId}''`;

            this.quizRepo.QuizTopStudentSessionEx(keys).then((res) => {
                this.getQuizTopStudentSession = res as Array<IQuizTopStudentSessionEx>;

                if (this.getQuizTopStudentSession.length > 0 && +this.getQuizTopStudentSession[0].responseRate > 0) {
                    this.noRecordFound = false;
                    this.isDisabled = false;
                }
                else if (this.getQuizTopStudentSession.length == 0) {
                    this.noRecordFound = true;
                }
                this.showLoader = false;

            })
        }  
        else if (this.sessionId.length > 0 && this.subjectId.length > 0 && this.cityId.length > 0) {
            this.getQuizTopStudentSession = [];
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}''   AND crs."FullName"=''${this.subjectId}''  AND ct."CityId"=''${this.cityId}''`;
            this.quizRepo.QuizTopStudentSessionCourseEx(keys).then((res) => {
                this.getQuizTopStudentSessionCourse = res as Array<IQuizTopStudentSessionCourseEx>;

                if (this.getQuizTopStudentSessionCourse.length > 0 && +this.getQuizTopStudentSessionCourse[0].responseRate > 0) {
                    this.noRecordFound = false;
                    this.isDisabled = false;
                }
                else if (this.getQuizTopStudentSessionCourse.length == 0) {
                    this.noRecordFound = true;
                }
                this.showLoader = false;

            })
        } 
        else if (this.sessionId.length > 0 && this.subjectId.length > 0) {
            this.getQuizTopStudentSession = [];
            this.showTable = true;
            this.showGraph = false;
            this.showLoader = true;

            var keys = `where ct."SessionId" =''${this.sessionId}''   AND crs."FullName"=''${this.subjectId}''`;
            this.quizRepo.QuizTopStudentSessionCourseEx(keys).then((res) => {
                this.getQuizTopStudentSessionCourse = res as Array<IQuizTopStudentSessionCourseEx>;

                if (this.getQuizTopStudentSessionCourse.length > 0 && +this.getQuizTopStudentSessionCourse[0].responseRate > 0) {
                    this.noRecordFound = false;
                    this.isDisabled = false;
                }
                else if (this.getQuizTopStudentSessionCourse.length == 0) {
                    this.noRecordFound = true;
                }
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.fullName.length > 0) {
            var keys = `where ct."SessionId" =''${this.sessionId}''  AND leag."FullName"=''${this.fullName}''`;
            this.showTable = false;
            this.showGraph = true;
            this.showLoader = true;

            this.getQuizTopStudentSessionCourse = [];
            this.quizRepo.QuizTopStudentSessionEx(keys).then((res) => {
                this.getQuizTopStudentSession = res as Array<IQuizTopStudentSessionEx>;

                if (this.getQuizTopStudentSession.length > 0 && +this.getQuizTopStudentSession[0].responseRate > 0) {
                    this.noRecordFound = false;
                    this.isDisabled = false;
                }
                else if (this.getQuizTopStudentSession.length == 0) {
                    this.noRecordFound = true;
                }

                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.classId.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            this.showLoader = true;
            this.getQuizTopStudentSessionCourse = [];
            var keys = `where ct."SessionId" =''${this.sessionId}''  AND ct."ClassId"=''${this.classId}''`;
            this.quizRepo.QuizTopStudentSessionEx(keys).then((res) => {
                this.getQuizTopStudentSession = res as Array<IQuizTopStudentSessionEx>;

                if (this.getQuizTopStudentSession.length > 0 && +this.getQuizTopStudentSession[0].responseRate > 0) {
                    this.noRecordFound = false;
                    this.isDisabled = false;
                }
                else if (this.getQuizTopStudentSession.length == 0) {
                    this.noRecordFound = true;
                }
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0 && this.cityId.length > 0) {
            this.showTable = false;
            this.showGraph = true;
            this.showLoader = true;

            this.getQuizTopStudentSessionCourse = [];
            var keys = `where ct."SessionId" =''${this.sessionId}'' AND ct."CityId"=''${this.cityId}''`;
            this.quizRepo.QuizTopStudentSessionEx(keys).then((res) => {
                this.getQuizTopStudentSession = res as Array<IQuizTopStudentSessionEx>;

                if (this.getQuizTopStudentSession.length > 0 && +this.getQuizTopStudentSession[0].responseRate > 0) {
                    this.noRecordFound = false;
                    this.isDisabled = false;
                }
                else if (this.getQuizTopStudentSession.length == 0) {
                    this.noRecordFound = true;
                }
                this.showLoader = false;

            })
        }
        else if (this.sessionId.length > 0) {

            this.showTable = false;
            this.showGraph = true;
            this.showLoader = true;

            this.getQuizTopStudentSessionCourse = [];
            var keys = `where ct."SessionId" =''${this.sessionId}''`;
            this.quizRepo.QuizTopStudentSessionEx(keys).then((res) => {
                this.getQuizTopStudentSession = res as Array<IQuizTopStudentSessionEx>;

                if (this.getQuizTopStudentSession.length > 0 && +this.getQuizTopStudentSession[0].responseRate > 0) {
                    this.noRecordFound = false;
                    this.isDisabled = false;
                }
                else if (this.getQuizTopStudentSession.length == 0) {
                    this.noRecordFound = true;
                }
                this.showLoader = false;


            })
        }


    }

    loadcsv() {


        if (this.getQuizTopStudentSessionCourse.length > 0) {
            this.csvdata = [];
            this.getQuizTopStudentSessionCourse.forEach(element => {
                this.csvdata.push({
                    SerialNumber: element.serialNumber,
                    Course: element.course,
                    RollNo: element.rollNo,
                    StudentName: element.studentName,
                    City: element.city,
                    TimeDifference: element.timeDifference,
                    Percentage: element.percentage,
                    ResponseRate: element.responseRate,
                    AverageTime:element.averageTime

                });

            });
            this.isDisabled = false;
            helper.exportToCsv('Top Students Data.csv', this.csvdata);
        }
        else if (this.getQuizTopStudentSession.length > 0) {
            this.csvdata = [];
            this.getQuizTopStudentSession.forEach(element => {
                this.csvdata.push({
                    SerialNumber: element.serialNumber,
                    RollNo: element.rollNo,
                    StudentName: element.studentName,
                    City: element.city,
                    TimeDifference: element.timeDifference,
                    Percentage: element.percentage,
                    ResponseRate: element.responseRate,
                    AverageTime:element.averageTime
                });

            });
            this.isDisabled = false;
            helper.exportToCsv('Top Students Data.csv', this.csvdata);
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'No Data Found',
                title: 'warning',
                messageTypeId: PayloadMessageTypes.warning
            });
        }
    }

    insertModel() {

    }


}