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

import { IVideos } from '../../../../models';
import { VideosService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateVideos = { data: IVideos, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateVideos> = {
    data: {
        name: { required },
        description: { required },
        tags: { required },
        links: { required },
        server: { required },
       

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class VideosAddEdit extends Vue {
    private isActive: boolean = true;
    private repository: VideosService;
    private data: IVideos = { name: '', videosId: '', description: '', links: '', server: '', tags: '', statusId: 0 }
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new VideosService(this.$store);
    }
    beforeModalClose() {
        console.log('i am clled')
        this.data = { name: '', videosId: '', description: '', links: '', server: '', tags: '', statusId: 0 }
        this.$v.$reset();

    }
    beforeModalOpen(event) {
        console.log('befor calling ' + JSON.stringify(event.params.model))
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';

        if (this.IsNewRecord) {

        }
        else {
            Object.assign(this.data, event.params.model as IVideos);
            console.log('edit')
            console.log(this.data)
            if (this.data.statusId == 1) {
                this.isActive = true
            }
            else {
                this.isActive = false
            }

        }

    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        if (this.IsNewRecord) {
            //this.data.loggerId = helper.newGuid();
            this.data.statusId = 1;
            this.data.videosId = helper.newGuid();
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
            console.log(this.data)
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
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
        //return  this.$v.data.$error (this.data.name.length > 0);
    }

    $v: any;
}