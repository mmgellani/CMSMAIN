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

import { IMinimumPaidDate, IFeeChallanType, ISetupSubCity, ISetupCity } from '../../../../models';
import { FeeChallanTypeService, SetupCityService, SetupSubCityService } from '../../../../service';

import * as helper from '../../../../helper';
import { FeeChallanTypeAddEdit } from '../../ChallanType/add-edit';
import { MinimumPaidDateService } from '../../../../service/Fee/minimumpaiddate';

type ValidateMinimumPaidDate = { data: IMinimumPaidDate, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateMinimumPaidDate> = {
    data: {
        subCityId: { required },
        minDays: { required }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
    // components: {
    //     'ChallanType-add-edit-model': FeeChallanTypeAddEdit,
    // }
})
export class MinimumPaidDateAddEdit extends Vue {
    private repository: MinimumPaidDateService;
    private cityId: string = ''
    private data: IMinimumPaidDate = {
        minimumPaidDateId: '',
        subCityId: '',
        minDays: 0,
        statusId: 1,
    };


    private IsNewRecord: boolean = true;
    private title: string = '';
    private isActive: boolean = true;

    private subCityList: Array<ISetupSubCity> = [];
    private citylist: Array<ISetupCity> = [];
    private cityrepository: SetupCityService = new SetupCityService(this.$store);
    private subCityRepo: SetupSubCityService = new SetupSubCityService(this.$store);


    created() {
        this.repository = new MinimumPaidDateService(this.$store);
        // this.cityrepository = new SetupCityService(this.$store);
        this.loadCity();
        this.$watch('cityId', this.loadSubCity);
    }

    loadCity() {
        this.citylist = [];
        this.cityrepository.GetFindBy("e=>e.StatusId!=2").then(res => {
            this.citylist = res as Array<ISetupCity>;
        });
    }

    loadSubCity() {
        this.subCityList = [];
        this.subCityRepo.GetFindBy('e=> e.CityId.ToString()=="' + this.cityId + '" && e.StatusId!=2')
            .then(r => {
                this.subCityList = r as Array<ISetupSubCity>;
            });
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
        Object.assign(this.data, event.params.model);
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else {
            this.isActive = false;
        }
        if (this.IsNewRecord == false) {
            this.data.minimumPaidDateId = event.params.model.minimumPaidDateId
            this.cityId = event.params.model.cityId;
            this.data.subCityId = event.params.model.subCityId;
            this.loadSubCity();
            this.data.minDays = event.params.model.minDays

        }
    }

    cancel() {
        this.$emit("submit");
        this.$modal.hide('add-edit-model');
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.minimumPaidDateId = helper.newGuid();
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