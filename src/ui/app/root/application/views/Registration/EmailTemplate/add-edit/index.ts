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

import { IHumanResourceDepartments, IEmailTemplate } from '../../../../models';
import { HumanResourceDepartmentsService, EmailTemplateService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateEmailTemplate = { data: IEmailTemplate, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateEmailTemplate> = {
    data: {
        subject: {
            required,
           
        },
        body: {
            required,
        },
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'emailTemplate-add-edit-model',
    template: require('./index.html')
})
export class EmailTemplateAddEdit extends Vue {
    private repository: EmailTemplateService;
    isActive: boolean = true;
    departmentIdmain = '';
    private data: IEmailTemplate = {
        body: '', statusId: 1, emailTemplateId: '', subject: ''
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private departmentlist: Array<IHumanResourceDepartments> = [];
    private tempdepartmentlist: Array<IHumanResourceDepartments> = [];

    private repoDepartment: HumanResourceDepartmentsService = new HumanResourceDepartmentsService(this.$store)


    created() {
        this.repository = new EmailTemplateService(this.$store);
    }


    

    beforeModalOpen(event) {

        this.departmentIdmain = '';
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';

        Object.assign(this.data, event.params.model);



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
        this.$modal.hide('emailTemplate-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.emailTemplateId = helper.newGuid();
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