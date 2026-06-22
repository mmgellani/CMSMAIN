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

import { IFeeConcessionDetail, IFeeConcession, IFeeFeeHead, IFeeFeeStructure, IFeeStructureVM, IScholarshipStudentModel } from '../../../../models';
import { FeeConcessionDetailService, FeeConcessionService, FeeFeeHeadService, FeeFeeStructureService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateFeeConcessionDetail = { model: IFeeConcessionDetail, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeConcessionDetail> = {
    model: {
        concessionDetailId: { required },
        concessionId: { required },
        feeHeadId: { required },
        percentage: { required },
        feeAmount: { required },
        statusId: { required },
        loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class FeeApplyScholarshipAddEdit extends Vue {
    isActive: boolean = true;
    private repository: FeeConcessionDetailService;

    private data:Array<IScholarshipStudentModel>=[]
    title='';
    
    created() {
      
    }

    beforeModalOpen(event) {
      this.data=[]
        this.title = 'Student Details'
        Object.assign(this.data, event.params.model);
        

        // this.repos.GetFindBy('e=>e.StatusId!=2').then(res => {
        //     this.feeHeadList = res as Array<IFeeFeeHead>

        // })
    }

 
    
    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    

    
   

    saveModel() {
        

        this.cancel();
    }
    $v: Vuelidate<any>;
}