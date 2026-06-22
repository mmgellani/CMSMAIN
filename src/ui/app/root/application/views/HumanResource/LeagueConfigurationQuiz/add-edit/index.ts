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

import { IHumanResourceDepartments, ILeague, ILeagueAddModel, ILeagueInsertModel, IQuizLeague, ISetupCity, ISetupClass, ISetupSession } from '../../../../models';
import { AdmissionStudentsService, QuizService, SetupCityService, SetupClassService, SetupSessionService } from '../../../../service';

import * as helper from '../../../../helper';
import { isThisTypeNode } from 'typescript';
import { IRootStoreState } from '../../../../../store';
import moment from 'moment';


type ValidateHumanResourceDepartments = { datas: ILeagueInsertModel, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateHumanResourceDepartments> = {
    datas: {
        sessionId: { required },
        cityId: { required },
        classId: { required },
        statusId: { required },
        fromdate: { required },
        todate: { required },
        quizName: { required },
    },

};



@Component({
    mixins: [validationMixin],
    validations: {
        datas: {
            sessionId: { required },
            cityId: { required },
            classId: { required },
            statusId: { required },
            fromdate: { required },
            todate: { required },
            quizName: { required },
        },
    },
    name: 'League-add-edit-model',
    template: require('./index.html')
})
export class LeagueAddEdit extends Vue {
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
    private datas: ILeagueInsertModel = {
        sessionId: '',
        cityId: '',
        classId: '',
        fromdate: '',
        todate: '',
        quizName: '',
        statusId: 1
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
    }
    private dataList: Array<IQuizLeague> = [];

    mounted() {
        this.loadSession();
        this.loadCitySubCity();
        this.loadClass();
    }
    beforeModalOpen(event) {

        this.$v.$reset();
        this.quizName = '';
        this.sessionId = '';
        this.classId = '';
        this.cityId = '';
        this.fromdate = new Date();
        this.todate = new Date();

        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';

        this.datas.sessionId = event.params.model.sessionId;
        this.datas.classId = event.params.model.classId;
        this.datas.cityId = event.params.model.cityId;
        this.datas.fromdate = new Date().toString();
        this.datas.todate = new Date().toString();
        this.quizName = '';

        Object.assign(this.data, event.params.model);

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
        this.$modal.hide('League-add-edit-model');
        this.$emit("submit");
    }
    allowshow() {
        if (
            this.sessionId.length > 0 &&
            this.cityId.length > 0 &&
            this.classId.length > 0 &&
            this.fromdate.toString().length > 0 &&
            this.todate.toString().length > 0 &&
            this.quizName.length > 0 &&
            (moment(this.datas.todate).format("YYYY-MM-DD HH:mm:ss"))>=moment(this.datas.fromdate).format("YYYY-MM-DD HH:mm:ss")

        )  
        return true;
        return false;
    }
    save() {
        
        this.dataList = [];

        if (moment(this.datas.todate).format("YYYY-MM-DD HH:mm:ss") <= moment(this.datas.fromdate).format("YYYY-MM-DD HH:mm:ss")) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "To Date could not be less then From Date",
                title: "Success",
                messageTypeId: PayloadMessageTypes.error
            });
        }
        else {
            var key = this.datas.sessionId + '?' + this.datas.cityId + '?' + this.datas.classId;
            if (key !== undefined) {
                this.quizRepo.GetLeagueListDataWithoutLeague(key).then((res) => {

                    this.dataList = res as Array<IQuizLeague>;
                    var checkexist = this.dataList.filter(f => f.leagueName.toLowerCase().trim() === this.datas.quizName.toLowerCase().trim() && f.sessionId === this.datas.sessionId && f.cityId === this.datas.cityId && f.classId === this.datas.classId);
                    if (checkexist.length === 0) {
                        this.$v.$touch();
                        if (!this.$v.$invalid) {
                            if (this.IsNewRecord) {
                                var key = this.datas.sessionId + '?' + this.datas.cityId + '?' + this.datas.classId + '?' + moment(this.datas.fromdate).format("YYYY-MM-DD HH:mm:ss") + '?' + moment(this.datas.todate).format("YYYY-MM-DD HH:mm:ss") + '?' + this.datas.quizName;
                                    
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
                        }
                    }
                    else {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "League Name Already Exist",
                            title: "Success",
                            messageTypeId: PayloadMessageTypes.error
                        });
                    }
                });


            }
            else {
                return;
            }
        }
    }

    // save() {

    //     var key = this.sessionId + '?' + this.cityId + '?' + this.classId + '?' + moment(this.fromdate).format("YYYY-MM-DD HH:mm:ss") + '?' + moment(this.todate).format("YYYY-MM-DD HH:mm:ss") + '?' + this.quizName;

    //     this.cityRepo.SaveLeagueConfigration(key).then(() => {
    //         this.$store.dispatch(StoreTypes.updateStatusBar, {
    //             text: "Record has been inserted successfully",
    //             title: "Success",
    //             messageTypeId: PayloadMessageTypes.success
    //         });
    //         this.cancel();
    //     });
    //     this.cancel();
    // }

    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}