/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IAcademicCalendarMaster, IAcademicCalendarType, ILeague, IQuizLeague, ISetupCity, ISetupClass, ISetupSession } from '../../../../models';
import { AcademicCalendarMasterService, AcademicCalendarService, AcademicCalendarTypeService, AdmissionStudentsService, HumanResourceDepartmentsService, HumanResourceStaffService, QuizService, SetupCityService, SetupClassService, SetupSessionService } from '../../../../service';

import { LeagueAddEdit } from '../add-edit';
import { StoreTypes } from '../../../../../../store';
import moment from 'moment';


@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'League-add-edit-model': LeagueAddEdit,
    }
})

export class LeagueConfigurationQuiz extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
    private courseRepository: AdmissionStudentsService = new AdmissionStudentsService(
        this.$store
    );
    sessionList: Array<ISetupSession> = [];
    private classList: Array<ISetupClass> = [];
    private leagueList: Array<ILeague> = [];
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
    sessionId: string = "";
    campusId: string = "";
    holidaytypeid: string = "";
    topicId: string = "";
    boardId: string = "";
    classId: string = "";
    leagueId: string = "";
    cityId: string = "";
    quizName: string = "";
    testFrequency: string = "";
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
        this.$watch('leagueId', this.loadLeagueData);

    }
    mounted() {
        this.validatePage();
        this.loadSession();
        this.loadCitySubCity();
        this.loadClass();
        this.viewBtn = false;
        this.data = [];
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
        this.loadLeagueEx();
        this.data=[];
        if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0 && this.leagueId.length > 0) {
            this.showListData = true;
            var key = this.sessionId + '?' + this.cityId + '?' + this.classId + '?' + this.leagueId;
            this.quizRepo.GetLeagueListData(key).then((res) => {
                this.data = res as Array<IQuizLeague>; 
               

            });
        }
        else {
            if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {

                this.showListData = true;
                var key = this.sessionId + '?' + this.cityId + '?' + this.classId;
                this.quizRepo.GetLeagueListDataWithoutLeague(key).then((res) => {
                    this.data = res as Array<IQuizLeague>;
                   

                });
            }
            else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Please Select All Dropdown",
                    title: "Error",
                    messageTypeId: PayloadMessageTypes.error
                });
            }
        }
    }
    submit(){
        this.loadLeagueEx();
    }

    loadSession() {
        this.showListData = false;
        this.cityId = '';
        this.cityList = [];
        this.classId = '';
        this.classList = [];
        this.leagueId = '';
        this.leagueList = [];
        this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
            this.sessionList = r as Array<ISetupSession>;
        });
    }


    loadClass() {
        this.showListData = false;
        this.classId = '';
        this.classList = [];
        this.leagueId = '';
        this.leagueList = [];
        this.repoClass.GetFindBy("e=>e.StatusId==1").then((res) => {
            this.classList = res as Array<ISetupClass>;
        });
    }

    loadLeague() {
        this.showListData = true;
        this.leagueId = '';
        this.leagueList = [];
        if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
            var key = this.sessionId + '?' + this.cityId + '?' + this.classId;

            this.quizRepo.GetLeagueList(key).then((res) => {
                this.leagueList = res as Array<ILeague>;
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
            });
        }
     }

    loadCitySubCity() {
        this.showListData = false;
        this.cityId = '';
        this.cityList = [];
        this.classId = '';
        this.classList = [];
        this.leagueId = '';
        this.leagueList = [];
        this.cityRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
            this.cityList = r as Array<ISetupCity>;
        });
    }
    allowshow() {
        if (
            this.sessionId.length > 0 &&
            this.cityId.length > 0 &&
            this.classId.length > 0 &&
            this.fromdate.toString().length > 0 &&
            this.todate.toString().length > 0 &&
            this.calendarfromdate.toString().length > 0 &&
            this.calendartodate.toString().length > 0 &&
            this.testFrequency.length > 0 &&
            this.quizName.length > 0

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

        var key = this.sessionId + '?' + this.cityId + '?' + this.classId + '?' + moment(this.fromdate).format("YYYY-MM-DD HH:mm:ss") + '?' + moment(this.todate).format("YYYY-MM-DD HH:mm:ss") + '?' + this.quizName;

        this.cityRepo.SaveLeagueConfigration(key).then(() => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record has been inserted successfully",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            }); 
            this.cancel();
        });
        this.cancel();
    }

    validatePage() {
        if (this.user.roles.indexOf("admin") >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        } else {
            if ("leagueConfigurationQuiz" in this.user.claims == true) {
                if (this.user.claims["leagueConfigurationQuiz"].indexOf("R") >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims["leagueConfigurationQuiz"].indexOf("C") >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims["leagueConfigurationQuiz"].indexOf("U") >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims["leagueConfigurationQuiz"].indexOf("D") >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push("Home");
            }
        }
    }


    refreshData() {
        this.loadLeagueData();
    }

    insertModel() {

        this.$modal.show('League-add-edit-model',
            {
                model:
                {
                    sessionId: this.sessionId, sessionName: '',
                    cityId: this.cityId, cityName: '',
                    classId: this.classId, className: '',
                    statusId: 0
                }
                , IsNewRecord: true
            });
    }

}