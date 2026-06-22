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

import { IELChapters, ProgramCourseList } from '../../../../models';
import { AdmissionStudentsService, AttendanceAttendenceMasterService, ELChaptersService } from '../../../../service';

import * as helper from '../../../../helper';
import { TreeItem } from '../../../../../../components';

type ValidateELChapters = { data: IELChapters, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateELChapters> = {
    data: {
    // chapterId: { required },
    fullName: { required },
	description: { required },
    orderNo:{required},
    abbreviation:{required}
	// isEnable: { required },
	// courseId: { required },
	// classId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class SmartAddEdit extends Vue {

    private rsu: TreeItem = null;

    private repo= new AttendanceAttendenceMasterService(this.$store);
    created() {

    }

    beforeModalOpen(event) {
        this.repo.GetAllSmartAttendence().then(
            resultdata => {
                this.rsu = resultdata as TreeItem
            });
}

 
    cancel() {
        this.$modal.hide('add-edit-model');
     
    }

    saveModel() {

        var forStore = [];
            var array = Array.prototype.slice.call(this.rsu);
            var final = JSON.stringify(array).replace(/[.*+?^${}()|[\]\\]/g, '');
            final = final.replace(new RegExp(',"children":,', 'g'), '},{');
            final = final.replace(new RegExp(',"children":', 'g'), '},{');
            final = '[{' + final.substr(0, final.length - 2) + ']';
           var processed = JSON.parse(final);
           processed.filter(e => e.isChecked == true).forEach(element => {
               forStore.push({ model: element.caption, id: element.id });
           });
           this.repo.InsertSmartAttendence(JSON.stringify(forStore)).then(r=>{
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: r,
                title: "",
                messageTypeId: PayloadMessageTypes.success
            });
             this.cancel();
           })}

    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
        //return  this.$v.data.$error (this.data.name.length > 0);
    }

    $v: any;
}