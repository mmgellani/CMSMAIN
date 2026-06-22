/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { maxLength, required ,alphaNum,alpha} from 'vuelidate/lib/validators';

import Component from 'vue-class-component';
import { ExaminationExamTypeService } from '../../../../service';
import { IExaminationExamType } from '../../../../models';
import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import { noWhiteSpace, registered } from '../../../../../../validation';
import { LevelDefinitionService } from '../../../../service/Assessment/LevelDefinition';
import { ILevelDefinition } from '../../../../models/Assessment/LevelDefinition';

type ValidateExaminationExamType = { data: IExaminationExamType, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateExaminationExamType> = {
    data: {
        code: { required, maxLength: maxLength(3),noWhiteSpace},
        fullName: { required, maxLength: maxLength(100) },
        
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'LevelDefinition-add-edit-model',
    template: require('./index.html')
})
export class LevelDefinitionAddEdit extends Vue {
    private repository: LevelDefinitionService;
    isActive: boolean = true;
    private data: ILevelDefinition = {
        levelId: '', code: '', fullName: '', statusId: 0
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private examtypemodel: Array<ILevelDefinition> = [];

    created() {
        this.repository = new LevelDefinitionService(this.$store);
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else {
            this.isActive = false;
        }
        this.repository.GetFindBy('e=>e.StatusId==1').then(
            r => {
                this.examtypemodel = r as Array<ILevelDefinition>
            }
        )
    }

    cancel() {
        this.$modal.hide('LevelDefinition-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                
                this.data.levelId = helper.newGuid();
                this.data.statusId = 1;
                if (this.examtypemodel.find(e => e.fullName == this.data.fullName || e.code == this.data.code && e.statusId != 2
                )) {

                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Record Already  Exist',
                        title: '',
                        messageTypeId: PayloadMessageTypes.warning
                    })



                }


                else {
                    this.repository.AddOne(this.data)
                        .then(() => {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: 'Record has been inserted successfully',
                                title: 'Success',
                                messageTypeId: PayloadMessageTypes.success
                            })
                            this.cancel();
                        });
                }
            } else {
                if (this.isActive == true) {
                    this.data.statusId = 1;
                }

                else {
                    this.data.statusId = 0;
                }
                if (this.examtypemodel.find(e => e.levelId != this.data.levelId && (e.fullName == this.data.fullName || e.code == this.data.code) && e.statusId !=2
                    )) {
    
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record Already  Exist',
                            title: '',
                            messageTypeId: PayloadMessageTypes.warning
                        })
    
    
    
                    }
                    else{
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
              
            }
        }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}