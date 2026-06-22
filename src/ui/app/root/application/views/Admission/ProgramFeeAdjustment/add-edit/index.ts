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

import { IProgramFeeAdjustment, ISetupCampusProgramVM } from '../../../../models';
import { ProgramFeeAdjustmentService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateProgramFeeAdjustment = { data: IProgramFeeAdjustment, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateProgramFeeAdjustment> = {
    data: {
        //fullName: { required },
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'programFeeAdjustment-add-edit-model',
    template: require('./index.html')
})
export class ProgramFeeAdjustmentAddEdit extends Vue {
    private repository: ProgramFeeAdjustmentService;
    isActive: boolean = true;
    private data: IProgramFeeAdjustment = {
        campusProgramId: '', isEnabled: false, programFeeAdjustmentId: '', statusId: 0
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private cbList: Array<ICbModel> = []
    private isCheckAll=false;
    private dataList:Array< IProgramFeeAdjustment> = []
    created() {
        this.repository = new ProgramFeeAdjustmentService(this.$store);
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.cbList=[]
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        this.campusProgramLinkList = event.params.list;
        this.campusProgramLinkList.forEach(s => {
            this.cbList.push({ campusProgramId: s.campusProgramId, programDetailName: s.description, isChecked: false })
        })
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else if (this.data.statusId == 0) {
            this.isActive = false;
        }
    }

    markAllChecked(){
        if(this.markAllChecked){
            this.cbList.forEach(s=>{
                s.isChecked=true;
            })
        }else{
            this.cbList.forEach(s=>{
                s.isChecked=false;
            })
        }
        
    }
    cancel() {
        this.$modal.hide('programFeeAdjustment-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.cbList.filter(s=>s.isChecked).forEach(x=>{
                    this.dataList.push({statusId:1,isEnabled:true,campusProgramId:x.campusProgramId,programFeeAdjustmentId:helper.newGuid()})
                })
                
                this.repository.AddMany(this.dataList)
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
                    this.data.statusId = 1;
                }

                else {
                    this.data.statusId = 0;
                }
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
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any


}

declare interface ICbModel {
    campusProgramId: string;
    programDetailName: string;
    isChecked: boolean;
}