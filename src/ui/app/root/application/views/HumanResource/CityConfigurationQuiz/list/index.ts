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

import { IAcademicCalendarMaster, IAcademicCalendarType, ILeague, IQuizConfigration, IQuizLeague, ISetupCity, ISetupClass, ISetupSession } from '../../../../models';
import { AcademicCalendarMasterService, AcademicCalendarService, AcademicCalendarTypeService, AdmissionStudentsService, HumanResourceDepartmentsService, HumanResourceStaffService, QuizService, SetupCityService, SetupClassService, SetupSessionService } from '../../../../service';

import { ConfigrationAddEdit } from '../add-edit';
import { StoreTypes } from '../../../../../../store';
import moment from 'moment';


@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Configration-add-edit-model': ConfigrationAddEdit,
    }
})

export class CityConfigurationQuiz extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
    private courseRepository: AdmissionStudentsService = new AdmissionStudentsService(
        this.$store
    );
    sessionList: Array<ISetupSession> = [];
    private classList: Array<ISetupClass> = [];
    private leagueList: Array<ILeague> = [];
    private repoClass: SetupClassService = new SetupClassService(this.$store);
    private data: Array<IQuizConfigration> = [];


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
        this.$watch('classId', this.cityConfigrationData); 

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
        { key: 'quizName', caption: 'Configration Name' },
        { key: 'fromDate', caption: 'From Date' },
        { key: 'toDate', caption: 'ToDate' },
        { key: 'calendarFromDate', caption: 'CalendarFromDate' },
        { key: 'calendarToDate', caption: 'CalendarToDate' }, 
        { key: 'isProcessed', caption: 'IsProcessed' },
        { key: 'isActive', caption: 'IsActive' },
        { key: 'statusId', caption: 'StatusId' },
        { key: 'processedOn', caption: 'ProcessedOn' }, 
        { key: 'timePerQuestion', caption: 'TimePerQuestion' },
        { key: 'marksPerQuestion', caption: 'MarksPerQuestion' },

    ];

    cityConfigrationData() {
        
            if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {

                this.showListData = true;
                var key = this.sessionId + '?' + this.cityId + '?' + this.classId;
                this.quizRepo.GetCityConfigrationData(key).then((res) => {
                    this.data = res as Array<IQuizConfigration>;
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


    loadSession() {
        this.showListData = false;
        this.cityId = '';
        this.cityList = [];
        this.classId = '';
        this.classList = []; 
        this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
            this.sessionList = r as Array<ISetupSession>;
        });
    }


    loadClass() {
        this.showListData = false;
        this.classId = '';
        this.classList = []; 
        this.repoClass.GetFindBy("e=>e.StatusId==1").then((res) => {
            this.classList = res as Array<ISetupClass>;
        });
    } 

    loadCitySubCity() {
        this.showListData = false;
        this.cityId = '';
        this.cityList = [];
        this.classId = '';
        this.classList = []; 
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
        this.refreshData();
    }


    validatePage() {
        if (this.user.roles.indexOf("admin") >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        } else {
            if ("cityConfigurationQuiz" in this.user.claims == true) {
                if (this.user.claims["cityConfigurationQuiz"].indexOf("R") >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims["cityConfigurationQuiz"].indexOf("C") >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims["cityConfigurationQuiz"].indexOf("U") >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims["cityConfigurationQuiz"].indexOf("D") >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push("Home");
            }
        }
    }


    refreshData() {
        this.cityConfigrationData();
    }

    insertModel() {
        
        this.$modal.show('Configration-add-edit-model',
            {
                model:
                {
                    sessionId: this.sessionId ,
                    cityId: this.cityId,
                    classId: this.classId,
                    statusId: 0
                }
                , IsNewRecord: true
            });
    }

}