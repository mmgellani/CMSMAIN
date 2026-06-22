/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { FeeBankService, SetupCityService } from '../../../../service';
import { IFeeBank, ISetupCity } from '../../../../models';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { maxLength, required } from 'vuelidate/lib/validators';

import Component from 'vue-class-component';
import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

type ValidateFeeBank = { data: IFeeBank, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeBank> = {
    data: {
        fullName: { required },
        address: { required },
        accountTitle: { required },
        accountNo: { required }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'Bank-add-edit-model',
    template: require('./index.html')
})
export class FeeBankAddEdit extends Vue {
    private isActive: boolean = true;
     private isEnabled: boolean = false;

    private repository: FeeBankService;
    private cityrepository: SetupCityService;
    citylist: Array<ISetupCity> = [];
    private data: IFeeBank = {
        bankId: '', fullName: '',abbreviation: '' ,address: '', accountTitle: '', accountNo: '', statusId: 0, isEnabled:true, loggerId: '', cityId: ''
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new FeeBankService(this.$store);
        this.cityrepository = new SetupCityService(this.$store);
        this.loadCities();
    }

    loadCities() {

        this.citylist = [];
        this.cityrepository.GetFindBy('e=>e.StatusId==1').then(r => {
            this.citylist = r as Array<ISetupCity>
        })
    }
    checkAll() {
        debugger;
        if (this.isEnabled) {
            this.data.isEnabled=true
        }
        else {
            this.data.isEnabled=false

        }

    }
    beforeModalOpen(event) {
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        debugger;
        if (this.data.statusId == 1) {
            this.isActive = true
        }
        else {
            this.isActive = false
        }

        if (this.data.isEnabled == true) {
            this.isEnabled = true
        }
        else {
            this.isEnabled = false
        }

        
    }

    cancel() {
        this.$modal.hide('Bank-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                debugger;
                this.data.loggerId = helper.newGuid();
                this.data.bankId = helper.newGuid();
                this.data.statusId = 1;
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

                // this.data.isEnabled = this.isEnabled;

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
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}