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

import { EvaluationDetail, IExaminationExamType, IHumanResourceEvaluationDetail, IHumanResourceEvaluationMaster, IQueryType, ISurveyMaster,ISurveyMasterNew, optionsls, optionsls2, SurveyDetail, SurveyDetail2 } from '../../../../models';
import { ExaminationExamTypeService, HumanResourceStaffService } from '../../../../service';

import * as helper from '../../../../helper';
import { IExaminationFailMasterCriteria, IExaminationFailDetailCriteria } from '../../../../models/Examination/FailCriteria';
import { ExaminationFailCriteriaService } from '../../../../service/Examination/FailCriteria';
import { isArrayLiteralExpression } from 'typescript';
import { SurveyDashboardDetailService } from '../../../../service/DashBoard/dashboardsurveydetail';
import { Console } from 'console';
import { SurveyDashboardMasterService } from '../../../../service/DashBoard/dashboardsurveymaster';
import { VueEditor } from "vue2-editor";

type ValidateExaminationFailCriteria = { evalMaster: IHumanResourceEvaluationMaster, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateExaminationFailCriteria> = {
    evalMaster: {
        name: { required },
        description: { required },
        popupDescription: { required }

    }
};

@Component({
    components: {
        VueEditor
    },
    mixins: [validationMixin],
    validations: customValidation,
    name: 'FailCriteria-add-edit-model',
    template: require('./index.html')
})
export class FailCriteriaAddEdit extends Vue {
    private controltypelist = [{ controlType: "TextArea" }, { controlType: "Select" }, { controlType: "checkbox" }, { controlType: "radio" }, { controlType: "text" }, { controlType: "Rating" }]
    private querylist = [{ name: "courses" }, { name: "General" }, { name: "Other" },{name:"Books"}]

    private IsNewRecord: boolean = true;
    evaluationdetaildata: Array<SurveyDetail2> = [];
    evaluiondetaillist: Array<SurveyDetailEx> = [];
    private title: string = '';
    private queryTypeList: IQueryType[] = []
    private repoSurveyMaster: SurveyDashboardMasterService = new SurveyDashboardMasterService(this.$store)
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
    //private optionsls: Array<optionsls> = [];
    private detailLength = 0;
    private repo: SurveyDashboardDetailService = new SurveyDashboardDetailService(this.$store)

    created() {
    }

    beforeModalOpen(event) {
      debugger;
        this.$v.$reset();
        this.loadQueryType();
        //this.optionsls = []
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';

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

                            order: element.order,
                            query2: '',
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
        this.$modal.hide('failCriteria-add-edit-model');
        // this.$emit("submit");
    }
    queryModel: IQueryModel[] = []
    saveModel() {
        this.evaluiondetaillist.forEach(s => {
            this.queryModel = []
            if (s.query == 'Other') {
                s.queryTypeList.filter(j => j.isChecked).forEach(a => {
                    this.queryModel.push({ CourseName: a.fullName })
                })
                s.query = JSON.stringify(this.queryModel)
            }

            s.operation.forEach(e => {
                e.order = +e.order
            })
        })
        console.log(JSON.stringify(this.evaluiondetaillist))

        if (this.IsNewRecord == true) {
            var z = (JSON.stringify(this.evaluiondetaillist) + '$' + JSON.stringify(this.evalMaster)) + '$' + '0'
            this.repo.InsertTeacherEvaluation(z).then(r => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: r,
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                })

                this.cancel();

            })
        }
        if (this.IsNewRecord == false) {
            var z = (JSON.stringify(this.evaluiondetaillist) + '$' + JSON.stringify(this.evalMaster)) + '$' + '1'
            console.log(JSON.stringify(z))
            this.repo.InsertTeacherEvaluation(z).then(r => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: r,
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                })

                this.cancel();

            })



        }


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