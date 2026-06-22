/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { DDLGroupModel, DDLModel, EvaluationDetail, ICampusCityVM, IExaminationExamType, IHumanResourceEvaluationDetail, IHumanResourceEvaluationMaster, INotificationCredntialsEx, IQueryType, IRegistrationSectionCourseLinkVM, ISetupCampus, ISetupCampusProgramVM, ISetupClass, ISetupSession, ISurveyMaster, ISurveyMasterNew,optionsls, optionsls2, SurveyDetail, SurveyDetail2 } from '../../../../models';
import { ExaminationExamTypeService, HumanResourceStaffService, notificationService, SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupProgramDetailsService, SetupSessionService } from '../../../../service';

import * as helper from '../../../../helper';
import { IExaminationFailMasterCriteria, IExaminationFailDetailCriteria } from '../../../../models/Examination/FailCriteria';
import { ExaminationFailCriteriaService } from '../../../../service/Examination/FailCriteria';
import { isArrayLiteralExpression } from 'typescript';
import { SurveyDashboardDetailService } from '../../../../service/DashBoard/dashboardsurveydetail';
import { Console } from 'console';
import { SurveyDashboardMasterService } from '../../../../service/DashBoard/dashboardsurveymaster';

type ValidateExaminationFailCriteria = { evalMaster: IHumanResourceEvaluationMaster, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateExaminationFailCriteria> = {
    evalMaster: {
        name: { required },
        description: { required }

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'sendnotification-add-edit-model',
    template: require('./index.html')
})
export class SendNotificationAddEdit extends Vue {
    private controltypelist = [{ controlType: "TextArea" }, { controlType: "Select" }, { controlType: "checkbox" }, { controlType: "radio" }, { controlType: "text" }, { controlType: "Rating" }]
    private querylist = [{ name: "courses" }, { name: "General" }, { name: "Other" }]

    private IsNewRecord: boolean = true;
    evaluationdetaildata: Array<SurveyDetail2> = [];
    evaluiondetaillist: Array<SurveyDetailEx> = [];
    private title: string = '';
    private queryTypeList: IQueryType[] = []
    private repoSurveyMaster: SurveyDashboardMasterService = new SurveyDashboardMasterService(this.$store)

    private repoNotification: notificationService = new notificationService(this.$store)


    // private evalMaster: ISurveyMaster = {
    //     surveyMasterId: '',
    //     name: '',
    //     description: '',
    //     statusId: 1
    // };

    private evalMaster: ISurveyMasterNew = {
        surveyMasterId: '',
        name: '',
        description: '',
        popupDescription:'',
        statusId: 1
    };
    private evalDetail: SurveyDetail = {

        surveyDetailId: '',
        question: '',
        description: '',
        query: '',
        controlType: '',
        operation: [],
        statusId: 1,
        surveyMasterId: '',
        order: 1
    }

    private notificationModel: INotificationCredntialsEx = {

        sesseion: '',
        campus: '0',
        program: '0',
        classstudent: '0',
        section: '0',
        rollno: '0',
        notification: '',
        popupNotification:'',
        type: 'Survey Form',
        title: '0',
        image: '0',
        id: '0',
        mandatory: 'true',
        fromDate: '',
        toDate: '',
    }
    //private optionsls: Array<optionsls> = [];
    private detailLength = 0;
    private repo: SurveyDashboardDetailService = new SurveyDashboardDetailService(this.$store)


    private sessionModel: Array<ISetupSession> = [];
    private campusModel: Array<ISetupCampus> = [];
    private cityDDL: Array<DDLGroupModel> = [];
    private campusddl: Array<DDLModel> = [];
    private campusCityList: Array<ICampusCityVM> = [];
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private campusProgramId = '';
    private campusRepo: SetupCampusService;
    private sessionRepo: SetupSessionService;
    private classRepo: SetupClassService;
    private programRepo: SetupProgramDetailsService;

    private fromDate = new Date();
    private toDate = new Date();

    tag: string = "";

    classList: Array<ISetupClass> = [];
    programDetailId: string = "";
    ddl: Array<DDLModel> = [];
    programDDL: Array<DDLGroupModel> = [];
    sesseion: string = "";
    campus: string = "0";
    classstudent: string = "0";

    program: string = "0";

    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    campusProgramLinkList: Array<ISetupCampusProgramVM> = [];

    private iscampus = false;
    private isprogram = false;
    private isclass = false;

    sessiontag: string = "";
    campustag: string = "";
    programtag: string = "";
    classtag: string = "";




    created() {
        this.sessionRepo = new SetupSessionService(this.$store);
        this.campusRepo = new SetupCampusService(this.$store);
        this.programRepo = new SetupProgramDetailsService(this.$store);
        this.classRepo = new SetupClassService(this.$store);
        this.loadSession()
        this.loadClass()
        this.tag = ''
        this.sessiontag = ''
        this.campustag = ''
        this.programtag = ''
        this.classtag = ''

    }

    changestate() {
        if (this.iscampus == false) {
            this.notificationModel.campus = '0'
        }
        if (this.isprogram == false) {
            this.notificationModel.program = '0'
        }
        if (this.isclass == false) {
            this.notificationModel.classstudent = '0'
        }
    }

    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionModel = r as Array<ISetupSession>
            })
    }

    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }

    loadProgramsOfCampus() {
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.notificationModel.sesseion + "?" + this.notificationModel.campus;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
        });
    }

    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }

    beforeModalOpen(event) {
        debugger;
        this.$v.$reset();
        this.loadQueryType();
        //this.optionsls = []

        this.notificationModel = {

            sesseion: '',
            campus: '0',
            program: '0',
            classstudent: '0',
            section: '0',
            rollno: '0',
            notification: '',
            popupNotification:'',
            type: 'Survey Form',
            title: '0',
            image: '0',
            id: '0',
            mandatory: 'true',
            fromDate: '',
            toDate: '',
        }

        this.iscampus = false;
        this.isprogram = false;
        this.isclass = false;

        this.fromDate = new Date();
        this.toDate = new Date();

        this.IsNewRecord = event.params.IsNewRecord;
        this.title = 'Send Notification';

        if (this.IsNewRecord == false) {
            this.evalMaster.surveyMasterId = event.params.EvaluationMaster.surveyMasterId;
            this.evalMaster.name = event.params.EvaluationMaster.surveyMaster;
            this.evalMaster.description = event.params.EvaluationMaster.surveyDescription;
            this.evalMaster.popupDescription = event.params.EvaluationMaster.popupDescription;

            this.evalMaster.statusId = event.params.EvaluationMaster.statusId;
            this.repo.GetEvaluationDetail(this.evalMaster.surveyMasterId).then(r => {
                this.evaluationdetaildata = r as Array<SurveyDetail2>
                this.evaluiondetaillist = [];
                this.evaluationdetaildata.forEach(element => {
                    this.queryTypeListEx = []
                    //  this.repoSurveyMaster.GetQueryType()
                    //  .then(r => {
                    //this.queryTypeList = r as IQueryType[]
                    this.queryTypeList.forEach(s => {
                        this.queryTypeListEx.push({ fullName: s.fullName, isChecked: false, queryTypeId: s.queryTypeId })
                    })
                    // })
                    if (element.query.startsWith('[')) {
                        let obj: IQueryModel[] = []
                        obj = JSON.parse(element.query)
                        //let obj2: IQueryTypeEx[] = []
                        this.queryTypeListEx.forEach(s => {
                            if (obj.find(a => a.CourseName == s.fullName)) {
                                s.isChecked = true;
                            }
                        })
                    }



                    this.evaluiondetaillist.push(
                        {
                            surveyDetailId: element.surveyDetailId,
                            surveyMasterId: this.evalMaster.surveyMasterId,
                            operation: JSON.parse((element.operation.toString())),
                            statusId: element.statusId,
                            question: element.question,
                            query: element.query.startsWith('[') ? 'Other' : element.query,
                            description: element.description,
                            controlType: element.controlType,

                            order: this.evaluiondetaillist.length + 1
                            , query2: '',
                            queryTypeList: this.queryTypeListEx

                        }
                    )

                });



            })


        }
        //Object.assign(this.failMaster, event.params.failMaster);

        // var failMasterId = event.params.failMasterId;

        if (this.IsNewRecord == true) {
            //this.optionsls.push({ order: 1, option: "" })
            this.evaluiondetaillist.push(
                {
                    surveyDetailId: '',
                    question: '',
                    description: '',
                    query: '',
                    controlType: '',
                    operation: [{ order: 1, option: "" }],
                    statusId: 1,
                    surveyMasterId: '',
                    order: 1,
                    query2: ''
                    , queryTypeList: this.queryTypeListEx
                })
        }
        // else {
        //     // this.repo.GetFailDetailById(this.failMaster.failMasterId)
        //     //     .then(r => {
        //     //         this.failDetailList = r as Array<IExaminationFailDetailCriteria>;
        //     //         this.detailLength = this.failDetailList.length;
        //     //     })
        // }

    }
    queryTypeListEx: IQueryTypeEx[] = []
    loadQueryType() {
        this.queryTypeListEx = []
        this.repoSurveyMaster.GetQueryType()
            .then(r => {
                this.queryTypeList = r as IQueryType[]
                this.queryTypeList.forEach(s => {
                    this.queryTypeListEx.push({ fullName: s.fullName, isChecked: false, queryTypeId: s.queryTypeId })
                })
            })
        console.log(this.queryTypeListEx)
    }


    addDetail(listobj: any) {

        listobj.operation.push({ order: (listobj.operation.length) + 1, option: "" })




    }

    showVal(item: SurveyDetail) {
        if (item.query == 'Other') {

        }
    }
    addDetail2(list: any) {
        this.queryTypeListEx = []
        this.queryTypeList.forEach(s => {
            this.queryTypeListEx.push({ fullName: s.fullName, isChecked: false, queryTypeId: s.queryTypeId })
        })

        if (this.IsNewRecord == true) {
            this.evaluiondetaillist.push(
                {
                    surveyDetailId: '',
                    question: '',
                    description: '',
                    query: '',
                    controlType: '',
                    operation: [{ order: 1, option: "" }],
                    statusId: 1,
                    surveyMasterId: '',
                    order: this.evaluiondetaillist.length + 1,
                    query2: ''
                    , queryTypeList: this.queryTypeListEx
                })
        }
        if (this.IsNewRecord == false) {

            this.evaluiondetaillist.push(
                {
                    surveyDetailId: '',
                    question: '',
                    description: '',
                    query: '',
                    controlType: '',
                    operation: [{ order: 1, option: "" }],
                    statusId: 1,
                    surveyMasterId: this.evalMaster.surveyMasterId,
                    order: this.evaluiondetaillist.length + 1
                    , query2: ''
                    , queryTypeList: this.queryTypeListEx
                })




        }






    }

    ShowOptions(control) {
        if (control == 'TextArea' || control == 'text')
            return false;
        return true;


    }
    // checkItem(item:IQueryTypeEx){

    // }
    removeDetail2(index: number, list: any) {

        if (this.IsNewRecord == true) {


            this.evaluiondetaillist.splice(index, 1);

        }
        if (this.IsNewRecord == false) {
            var ls = this.evaluiondetaillist.filter(e => e.surveyDetailId == list.surveyDetailId);
            var z = (JSON.stringify(ls) + '$' + JSON.stringify(this.evalMaster)) + '$' + '3'
            console.log(JSON.stringify(z))
            this.repo.InsertTeacherEvaluation(z).then(r => {
                this.evaluiondetaillist.splice(index, 1);
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: r,
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                })

                //this.cancel();

            })


        }



    }






    removeDetail(index: number, listobj: any) {
        listobj.operation.splice(index, 1)


        //this.optionsls.splice(index, 1)
        // if (index <= this.detailLength - 1) {
        //     item.statusId = 2;
        //     this.repo.DeleteFailDetail(item)
        //         .then(r => {
        //             this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                 text: 'Record has been deleted successfully',
        //                 title: 'Success',
        //                 messageTypeId: PayloadMessageTypes.success
        //             })
        //         })
        // }
    }

    cancel() {

        this.evaluiondetaillist = [];
        //this.optionsls = [];
        this.evalMaster = {
            surveyMasterId: '',
            name: '',
            description: '',
            popupDescription:'',
            statusId: 1

        }
        // this.evalDetail = {
        //     evaluationDetailId: '',
        //     evaluationId: '',
        //     options: '',
        //     statusId: 1,
        //     questions: ''
        // }
        // this.failMaster = {
        //     absentConsiderFail: false, failMarks: 0, failMasterId: '',
        //     fail_In: 0, loggerId: helper.newGuid(), statusId: 1, fullName: ''
        // }
        // this.detailLength = 0;
        this.$modal.hide('sendnotification-add-edit-model');
        // this.$emit("submit");
    }
    queryModel: IQueryModel[] = []
    saveModel() {

        if (this.notificationModel.classstudent != "0") {
            this.classtag = this.classList.find(e => e.classId == this.notificationModel.classstudent).fullName;
        }
        if (this.notificationModel.program != "0") {
            this.programtag = this.campusProgramLinkList.find(e => e.campusProgramId == this.notificationModel.program).description;

            this.programtag = this.programtag.split('(')[0];
        }
        if (this.notificationModel.campus != "0") {
            this.campustag = this.campusCityList.find(e => e.campusId == this.notificationModel.campus).campusName;
        }
        if (this.notificationModel.sesseion != "0") {
            this.sessiontag = this.sessionModel.find(e => e.sessionId == this.notificationModel.sesseion).fullName;
        }

        this.tag =this.sessiontag;

        if(this.iscampus){
            this.tag = this.tag + this.campustag
        }
        if (this.isprogram)
        {
            this.tag = this.tag + this.programtag

        }

        if (this.isclass)
        {
            this.tag = this.tag + this.classtag

        }


        this.tag = this.tag.replace(/[- )(]/g, '');
        this.tag = this.tag.toLocaleLowerCase();
         console.log(this.tag);


debugger;
        this.notificationModel.id = this.evalMaster.surveyMasterId
        this.notificationModel.title = this.evalMaster.name;
        this.notificationModel.notification = this.evalMaster.description;
        this.notificationModel.popupNotification = this.evalMaster.popupDescription;
        this.notificationModel.fromDate = helper.formateDate(this.fromDate);
        this.notificationModel.toDate = helper.formateDate(this.toDate);

        this.repo.InsertNotification(JSON.stringify(this.notificationModel)).then(r => {

            this.repoNotification.pushNotification(this.notificationModel.title + "?" + this.notificationModel.notification + "?" + this.tag + "?Student")

                .then(r => {

                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: r,
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                })

            this.cancel();
        })

    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}



declare interface SurveyDetailEx {



    surveyDetailId: string;
    question: string;
    description: string;
    query: string;
    query2: string;
    controlType: string;
    queryTypeList: IQueryTypeEx[]

    operation: Array<optionsls2>;

    statusId: number;
    surveyMasterId: string;
    order: number;





}

declare interface IQueryTypeEx {
    queryTypeId: string;
    fullName: string;
    isChecked: boolean
}

declare interface IQueryModel {
    CourseName: string;
}