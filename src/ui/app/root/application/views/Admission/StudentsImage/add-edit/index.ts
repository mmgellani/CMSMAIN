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

import { IAdmissionStudentsImage, IAdmissionStudents } from '../../../../models';
import { AdmissionStudentsImageService, AdmissionStudentsService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateAdmissionStudentsImage = { model: IAdmissionStudentsImage, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateAdmissionStudentsImage> = {
    model: {
	studentsImageId: { required },
	studentId: { required },
	image: { required },
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
export class AdmissionStudentsImageAddEdit extends Vue {
    private repository: AdmissionStudentsImageService;
    private isActive:boolean=true
    private Studentrepository: AdmissionStudentsService=null;
    StudentList:Array<IAdmissionStudents>=[];
    private data: IAdmissionStudentsImage = {
        studentsImageId: '', studentId: '', image: '', statusId: 0, loggerId: '', 
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new AdmissionStudentsImageService(this.$store);
        this.Studentrepository = new AdmissionStudentsService(this.$store);
        this.Studentrepository.GetFindBy('e=>e.StatusId==1').then(res=>{
            this.StudentList=res as Array<IAdmissionStudents>
        })
    }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }
    onFileChange(e) {
        //alert(JSON.stringify(e));
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        this.createImage(files[0]);
    }

    createImage(file) {
        
        var $this = this;
        helper.resizeImage({ file: file, maxSize: 120 })
            .then(resizeImage => {
                $this.data.image = resizeImage as string;
            });
    }

    removeImage() {
        if (this.data.image.length != 0) {
            this.data.image = '';
        }
    }

    saveModel() {
        if (this.IsNewRecord) {
            this.data.studentsImageId=helper.newGuid();
            this.data.statusId=1;
            this.data.loggerId = helper.newGuid();
            this.repository.AddOne(this.data)
                .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
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
                .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
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
        return (this.data.studentId.length > 0 ) && (this.data.image.length > 0)  ;
      }
    $v: Vuelidate<any>;
}