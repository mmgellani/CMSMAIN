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

import { IExaminationGradingPolicy } from '../../../../models';
import { ExaminationGradingPolicyService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateExaminationGradingPolicy = { model: IExaminationGradingPolicy, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateExaminationGradingPolicy> = {
    model: {
        // gradingPolicyId: { required },
        fullName: { required },
        // grading: { required },
        // failMarks: { required },
        // failIn: { required },
        // statusId: { required },
        // loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class ExaminationGradingPolicyAddEdit extends Vue {
    private repository: ExaminationGradingPolicyService;
    private data: IExaminationGradingPolicy = {
        gradingPolicyId: '', fullName: '', fromRange: null, toRange: null, statusId: 0, loggerId: '', remarks: '', classId: '', sectionId: '', campusProgramId: '',
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private isActive: boolean = true;
    private GradingList: Array<IGrading> = []
    private FailRemarksList: Array<IFailRemarks> = []

    private campusId: string;
    private classId: string;
    private campusProgramId: string;
    private sectionId: string;

    created() {
        this.repository = new ExaminationGradingPolicyService(this.$store);
    }

    addGrading() {
        this.GradingList.push({ Grading: '' })
    }

    delGrading(model: IGrading) {
        var index = this.GradingList.indexOf(model);
        this.GradingList.splice(index, 1)
    }

    addFailRemarks() {
        this.FailRemarksList.push({ FailRemarks: '' })
    }

    delFailRemarks(model: IFailRemarks) {
        var index = this.FailRemarksList.indexOf(model);
        this.FailRemarksList.splice(index, 1)
    }
    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);

        this.campusProgramId = event.params.model.campusProgramId;
        this.classId = event.params.model.classId;
        this.sectionId = event.params.model.sectionId;


        //     if (this.IsNewRecord) {

        //         this.GradingList.push({ Grading: '' })
        //         this.FailRemarksList.push({ FailRemarks: '' })
        //     }
        //     else{
        //         this.GradingList=[];
        //         this.FailRemarksList=[];


        //         let list: Array<IGrading> = JSON.parse(this.data.grading)
        //         list.forEach(element => {
        //             this.GradingList.push({ Grading: element.Grading })
        //         });

        //         let FailRemarkslist: Array<IFailRemarks> = JSON.parse(this.data.failRemarks)
        //         FailRemarkslist.forEach(element => {
        //             this.FailRemarksList.push({ FailRemarks: element.FailRemarks })
        //         });
        // }
    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        if (this.IsNewRecord) {
            this.data.gradingPolicyId = helper.newGuid();
            this.data.campusProgramId = this.campusProgramId;
            this.data.classId = this.classId;
            this.data.sectionId = this.sectionId;
            this.data.statusId = 1;
            this.data.loggerId = helper.newGuid();

            this.repository.AddOne(this.data)
                .then(() => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Record has been inserted successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                    this.cancel();
                });
        } else {
            if (this.isActive == true) {
                this.data.statusId = 1
            }
            else {
                this.data.statusId = 0
            }

            // this.data.grading = JSON.stringify(this.GradingList);
            // this.data.failRemarks = JSON.stringify(this.FailRemarksList);
            this.repository.Update(this.data)
                .then(() => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Record has been updated successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                    this.cancel();
                });
        }

        this.cancel();
    }
    get allowSubmit() {
        return true;
        //return  (this.data.failIn > 0) && (this.data.failMarks > 0) && (this.data.fullName.length > 0);
    }
    $v: Vuelidate<any>;

}
export interface IGrading {
    Grading: string
}
export interface IFailRemarks {
    FailRemarks: string
}

