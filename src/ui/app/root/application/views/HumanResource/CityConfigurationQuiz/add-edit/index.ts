/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { State } from 'vuex-class';

import { StoreTypes } from '../../../../../../store';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import { IHumanResourceDepartments, ILeague, ILeagueAddModel, ILeagueInsertModel, IQuizConfigrationInsert, IQuizLeague, ISetupCity, ISetupClass, ISetupSession } from '../../../../models';
import { AdmissionStudentsService, QuizService, SetupCityService, SetupClassService, SetupSessionService } from '../../../../service';

import * as helper from '../../../../helper';
import { isThisTypeNode } from 'typescript';
import { IRootStoreState } from '../../../../../store';
import moment from 'moment';
import { config } from 'process';


type ValidateHumanResourceDepartments = { datas: IQuizConfigrationInsert, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateHumanResourceDepartments> = {
    datas: {
        sessionId: { required },
        cityId: { required },
        classId: { required },
        statusId: {},
        fromdate: {},
        todate: {},
        quizName: {required  },
        fromDate: {required },
        toDate: {required },
        calendarFromDate: { required },
        calendarToDate: { required },
        testFrequency: { required },
        processedOn: { required },
        timePerQuestion: { required },
        marksPerQuestion: { required },
    },

};



@Component({
    mixins: [validationMixin],
    validations: {
        datas: {
            sessionId: { required },
            cityId: { required },
            classId: { required },
            statusId: {},
            fromdate: {},
            todate: {},
            quizName: { required },
            fromDate: { required },
            toDate: { required },
            calendarFromDate: { required },
            calendarToDate: { required },
            testFrequency: { required },
            processedOn: { required },
            timePerQuestion: { required },
            marksPerQuestion: { required },
        },
    },
    name: 'Configration-add-edit-model',
    template: require('./index.html')
})
export class ConfigrationAddEdit extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
    private courseRepository: AdmissionStudentsService = new AdmissionStudentsService(
        this.$store
    );
    sessionList: Array<ISetupSession> = [];
    private classList: Array<ISetupClass> = [];
    private leagueList: Array<ILeague> = [];
    private repoClass: SetupClassService = new SetupClassService(this.$store);
    private data: Array<ILeagueAddModel> = [];
    private datas: IQuizConfigrationInsert = {
        sessionId: '',
        cityId: '',
        classId: '',
        configurationId: '',
        fromDate: '',
        toDate: '',
        testFrequency: 0,
        calendarFromDate: '',
        calendarToDate: '',
        statusId: 0,
        isProcessed: 0,
        isActive: 0,
        processedOn: '',
        quizName: '',
        timePerQuestion: 0,
        marksPerQuestion: 0,
        notificationDescription:''

    };

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
    private processdate = new Date();
    private processdatechek = new Date();

    private currDate = new Date();

    private useCreationPopup = false;
    private useDetailPopup = false;
    viewBtn: boolean = false;
    holidayError: boolean = false;
    viewPopUp = false;
    isActive: boolean = true;
    showparentid = false;
    private IsNewRecord: boolean = true;
    private title: string = '';
    created() {
        this.quizRepo = new QuizService(this.$store);
        this.$watch('fromdate', this.proceDateCheck);
        this.$watch('todate', this.processToDate);
        this.$watch('calendarfromdate', this.processCalenderFromDate);
        this.$watch('calendartodate', this.processCalenderToDate);
        this.$watch('processdate', this.processDateImpe);

    }
    mounted() {
        this.loadSession();
        this.loadCitySubCity();
        this.loadClass();
    }


    proceDateCheck() {
        debugger
        this.datas.fromDate= moment(this.fromdate).format("YYYY-MM-DD HH:mm:ss");
        this.datas.processedOn = '';
        let date = new Date(this.datas.fromDate);
        date.setDate(date.getDate() + 1);
        this.processdatechek = date;
        this.processdate=date;
    }
    processToDate() { 
        this.datas.toDate= moment(this.todate).format("YYYY-MM-DD HH:mm:ss"); 
    }
    processCalenderFromDate() { 
        this.datas.calendarFromDate= moment(this.calendarfromdate).format("YYYY-MM-DD HH:mm:ss"); 
    }

    processCalenderToDate() { 
        this.datas.calendarToDate= moment(this.calendartodate).format("YYYY-MM-DD HH:mm:ss"); 
    }
    processDateImpe() { 
        this.datas.processedOn= moment(this.processdate).format("YYYY-MM-DD HH:mm:ss"); 
    }
    beforeModalOpen(event) {

        this.$v.$reset();
        this.quizName = '';
        this.sessionId = '';
        this.classId = '';
        this.cityId = '';
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        this.datas.sessionId = event.params.model.sessionId;
        this.datas.classId = event.params.model.classId;
        this.datas.cityId = event.params.model.cityId;
        this.datas.fromDate = '';
        this.datas.toDate = '';
        this.datas.quizName = '';
        this.datas.calendarFromDate = '';
        this.datas.calendarToDate = '';
        this.datas.processedOn = '';
        this.datas.timePerQuestion = 0;
        this.datas.marksPerQuestion = 0;
        this.datas.testFrequency = 0;
        this.datas.processedOn = '';
        this.fromdate=new Date();
        this.todate=new Date();
        this.processdate=new Date();
        this.calendartodate =new Date();
        this.calendarfromdate=new Date();
        let date = new Date();
        date.setDate(date.getDate() + 1);
        this.processdatechek = date;

        Object.assign(this.data, event.params.model);

        console.log(this.data);
        this.loadSession();
        this.loadCitySubCity();
        this.loadClass();

    }

    loadSession() {
        this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
            this.sessionList = r as Array<ISetupSession>;


        });


    }


    loadClass() {
        this.showListData = false;
        this.repoClass.GetFindBy("e=>e.StatusId==1").then((res) => {
            this.classList = res as Array<ISetupClass>;
        });
    }

    loadCitySubCity() {
        this.cityRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
            this.cityList = r as Array<ISetupCity>;
        });
    }
    cancel() {
        this.$modal.hide('Configration-add-edit-model');
        this.$emit("submit");
    }
    allowshow() {
        if (
            this.sessionId.length > 0 &&
            this.cityId.length > 0 &&
            this.classId.length > 0 &&
            this.fromdate.toString().length > 0 &&
            this.todate.toString().length > 0 &&
            this.quizName.length > 0

        )
            return true;
        return false;
    }
    save() {

        this.datas.configurationId = '1231';
        this.datas.isActive = 0;
        this.datas.statusId = 0;
        this.datas.isProcessed = 0;
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                var key = JSON.stringify(this.datas);

                this.cityRepo.SaveQuizConfigration(key).then(() => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: "Record has been inserted successfully",
                        title: "Success",
                        messageTypeId: PayloadMessageTypes.success
                    });
                    this.cancel();
                });
                this.cancel();
            }
            this.cancel();
        }
        else {
            return;
        }
    }

    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}