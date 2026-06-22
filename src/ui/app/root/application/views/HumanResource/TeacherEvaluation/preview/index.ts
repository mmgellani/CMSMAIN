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

import { EvaluationDetail, IExaminationExamType, IHumanResourceEvaluationDetail, IHumanResourceEvaluationMaster, ISurveyMaster, optionsls, SurveyDetail, SurveyDetail2 } from '../../../../models';
import { ExaminationExamTypeService, HumanResourceStaffService } from '../../../../service';

import * as helper from '../../../../helper';
import { IExaminationFailMasterCriteria, IExaminationFailDetailCriteria } from '../../../../models/Examination/FailCriteria';
import { ExaminationFailCriteriaService } from '../../../../service/Examination/FailCriteria';
import { isArrayLiteralExpression } from 'typescript';
import { SurveyDashboardDetailService } from '../../../../service/DashBoard/dashboardsurveydetail';
import { Console } from 'console';

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
    name: 'preview',
    template: require('./index.html')
})
export class PreviewClass extends Vue {
    private controltypelist = [{ controlType: "TextArea" }, { controlType: "Select" }, { controlType: "checkbox" }, { controlType: "radio" }, { controlType: "text" }, { controlType: "Rating" }]
    private querylist = [{ name: "courses" }, { name: "General" }]

    private IsNewRecord: boolean = true;
    evaluationdetaildata: Array<SurveyDetail2> = [];
    evaluiondetaillist: Array<SurveyDetail> = [];
    private title: string = '';
    private evalMaster: ISurveyMaster = {
        surveyMasterId: '',
        name: '',
        description: '',
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
    private repo: SurveyDashboardDetailService = new SurveyDashboardDetailService(this.$store);
    private courses = [
        { subject: 'Math', options: ['radio', 'radio', 'radio', 'radio', 'radio'] },
        { subject: 'Urdu', options: ['radio', 'radio', 'radio', 'radio', 'radio'] },
        { subject: 'English', options: ['radio', 'radio', 'radio', 'radio', 'radio'] },
        { subject: 'Pak.std', options: ['radio', 'radio', 'radio', 'radio', 'radio'] }
    ]
    private messageText = '';
    private option='';
    created() {
    }

    parser = (e) => JSON.parse(e)

    beforeModalOpen(event) {
        this.$v.$reset();
        //this.optionsls = []
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';

        if (this.IsNewRecord == false) {
            this.evalMaster.surveyMasterId = event.params.EvaluationMaster.surveyMasterId;
            this.evalMaster.name = event.params.EvaluationMaster.surveyMaster;
            this.evalMaster.description = event.params.EvaluationMaster.surveyDescription;
            this.evalMaster.statusId = event.params.EvaluationMaster.statusId;
            this.repo.GetEvaluationDetail(this.evalMaster.surveyMasterId).then(r => {
                this.evaluationdetaildata = r as Array<SurveyDetail2>
                this.evaluiondetaillist = [];
                this.evaluationdetaildata.forEach(element => {

                    this.evaluiondetaillist.push(
                        {
                            surveyDetailId: element.surveyDetailId,
                            surveyMasterId: this.evalMaster.surveyMasterId,
                            operation: JSON.parse((element.operation.toString())),
                            statusId: element.statusId,
                            question: element.question,
                            query: element.query,
                            description: element.description,
                            controlType: element.controlType,

                            order: this.evaluiondetaillist.length + 1


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
                    order: 1
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

    addDetail(listobj: any) {

        listobj.operation.push({ order: (listobj.operation.length) + 1, option: "" })




    }
    addDetail2(list: any) {

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
                    order: this.evaluiondetaillist.length + 1
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
                    surveyMasterId: '',
                    order: this.evaluiondetaillist.length + 1
                })




        }






    }

    ShowOptions(control) {
        if (control == 'TextArea' || control == 'text')
            return false;
        return true;


    }

    removeDetail2(index: number, list: any) {

        if (this.IsNewRecord == true) {


            this.evaluiondetaillist.splice(index, 1);

        }
        if (this.IsNewRecord == false) {
            var ls = this.evaluiondetaillist.filter(e => e.surveyDetailId == list.surveyDetailId);
            var z = (JSON.stringify(ls) + '$' + JSON.stringify(this.evalMaster)) + '$' + '3'
            console.log(JSON.stringify(z))
            // this.repo.InsertTeacherEvaluation(z).then(r => {
            //     this.evaluiondetaillist.splice(index, 1);
            //     this.$store.dispatch(StoreTypes.updateStatusBar, {
            //         text: r,
            //         title: 'Success',
            //         messageTypeId: PayloadMessageTypes.success
            //     })

            //     //this.cancel();

            // })


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
        this.$modal.hide('preview');
        // this.$emit("submit");
    }

    saveModel() {
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
            // this.repo.InsertTeacherEvaluation(z).then(r => {
            //     this.$store.dispatch(StoreTypes.updateStatusBar, {
            //         text: r,
            //         title: 'Success',
            //         messageTypeId: PayloadMessageTypes.success
            //     })

            //     this.cancel();

            // })



        }

        // this.evalDetail.options = JSON.stringify(this.optionsls);

        // console.log(JSON.stringify(this.evalMaster) + '?' + JSON.stringify(this.evalDetail));



        // this.$v.$touch();
        // if (!this.$v.$invalid) {
        //     if (this.IsNewRecord) {
        //         this.failMaster.failMasterId = helper.newGuid();
        //         this.failDetailList.forEach(s => {
        //             s.failMasterId = this.failMaster.failMasterId
        //         })
        //         if (this.failMaster.failMarks >= 0 && this.failMaster.failMarks <= 100 && this.failMaster.fail_In >= 0 && this.failMaster.fail_In <= 100) {
        //             var key = JSON.stringify(this.failMaster) + "?" + JSON.stringify(this.failDetailList);
        //             console.log(key)
        //             this.repo.AddBulkCriteria(key).then(r => {
        //                 this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                     text: 'Record has been inserted successfully',
        //                     title: 'Success',
        //                     messageTypeId: PayloadMessageTypes.success
        //                 })
        //                 this.cancel();
        //             });
        //         }
        //         else {

        //             this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                 text: 'Please Enter Fail Percentage and Exam Fail Count In Valid  Range (0-100)',
        //                 title: 'Warning',
        //                 messageTypeId: PayloadMessageTypes.warning
        //             })




        //         }
        //     }
        //     else {
        //         if (this.failDetailList.length > this.detailLength) {
        //             this.failDetailList.slice(this.detailLength, this.failDetailList.length).forEach(s => {
        //                 this.newfailDetailList.push({ statusId: 1, loggerId: helper.newGuid(), fail_In: s.fail_In, failMasterId: this.failMaster.failMasterId, description: s.description, failDetailId: helper.newGuid() })
        //             })
        //         }

        //         if (this.failMaster.failMarks >= 0 && this.failMaster.failMarks <= 100 && this.failMaster.fail_In >= 0 && this.failMaster.fail_In <= 100) {
        //             var key = JSON.stringify(this.failMaster) + "?" + JSON.stringify(this.failDetailList) + "?" + JSON.stringify(this.newfailDetailList);

        //             this.repo.EditBulkCriteria(key).then(r => {
        //                 this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                     text: 'Record has been Updated successfully',
        //                     title: 'Success',
        //                     messageTypeId: PayloadMessageTypes.success
        //                 })
        //                 this.cancel();
        //             });
        //         }
        //         else {

        //             this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                 text: 'Please Enter Fail Percentage and Exam Fail Count In Valid  Range (0-100)',
        //                 title: 'Warning',
        //                 messageTypeId: PayloadMessageTypes.warning
        //             })


        //         }
        //     }
        // }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}



