/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength ,minLength} from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IHumanResourceDepartments, IEmailTemplate, ICampusCityVM } from '../../../../models';
import { HumanResourceDepartmentsService, EmailTemplateService, SetupCampusService } from '../../../../service';

import * as helper from '../../../../helper';
import { IEmailMapping } from '../../../../models/Registration/EmailMapping';
import { CampusEmailMappingService } from '../../../../service/Registration/EmailMapping';

type ValidateEmailTemplate = { data: IEmailMapping, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateEmailTemplate> = {
    data: {
        email: {
            required,
        },
        password: {
            required,
        },
        mailBox: {
            required,
        },
        operationName: {
            required
        }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'CampusEmailMapping-add-edit-model',
    template: require('./index.html')
})
export class CampusEmailMappingAddEdit extends Vue {
    private repository: CampusEmailMappingService;
    isActive: boolean = true;
    private data: IEmailMapping = {
        campusId: '', campusEmailLinkId: '', email: '', statusId: 1, password: '', operationName: '', mailBox: ''
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private campusCityList: Array<ICampusCityVM> = []

    created() {
        this.repository = new CampusEmailMappingService(this.$store);
    }

    mounted() {
        this.loadCampus();
    }

    loadCampus() {
        this.campusCityList = []
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        Object.assign(this.data, event.params.model);
        this.IsNewRecord = event.params.IsNewRecord;
        this.data.campusId = event.params.model.campusId;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';


        if (this.IsNewRecord == false) {

        }
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else if (this.data.statusId == 0) {
            this.isActive = false;
        }
    }

    cancel() {
        this.$modal.hide('CampusEmailMapping-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.campusEmailLinkId = helper.newGuid();
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

            // this.cancel();
        }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any;
}