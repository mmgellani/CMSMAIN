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

import { IHumanResourceDepartments, IRegistrationCourse } from '../../../../models';
import { HumanResourceDepartmentsService, RegistrationCourseService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateRegistrationCourse = { data: IRegistrationCourse, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateRegistrationCourse> = {
    data: {
        title: {
            required,
            maxLength: maxLength(10)
        },
        fullName: {
            required,
            maxLength: maxLength(100)
        },
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'Course-add-edit-model',
    template: require('./index.html')
})
export class RegistrationCourseAddEdit extends Vue {
    private repository: RegistrationCourseService;
    isActive: boolean = true;
    departmentIdmain='';
    private data: IRegistrationCourse = {
        departmentId:'',courseId: '', title: '', fullName: '', statusId: 0, loggerId: '',
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private departmentlist:Array<IHumanResourceDepartments>=[];
    private tempdepartmentlist:Array<IHumanResourceDepartments>=[];

    private repoDepartment: HumanResourceDepartmentsService = new HumanResourceDepartmentsService(this.$store)


    created() {
        this.repository = new RegistrationCourseService(this.$store);
        this.loadDepartments();
    }


    loadDepartments() {
        this.departmentlist=[];
        this.repoDepartment.GetFindBy('e=>e.StatusId!=2 && e.Level==1')
            .then(r => {
                this.departmentlist = r as IHumanResourceDepartments[]
            })
    }
    loadSubDepartments(deptid) {
        this.tempdepartmentlist=[];
        this.repoDepartment.GetFindBy('s=>s.DepartmentParentId.ToString()=="' + deptid+'" && s.Level==2')
            .then(r => {
                this.tempdepartmentlist = r as IHumanResourceDepartments[]
                console.log(JSON.stringify(this.tempdepartmentlist))
            })
    }

    beforeModalOpen(event) {
        
        this.departmentIdmain='';
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        
        Object.assign(this.data, event.params.model);
        

        
        if(this.IsNewRecord==false)
        {
            //this.data.departmentId=event.params.model.subDepartmentId;
            this.departmentIdmain=event.params.model.departmentId;
            this.data.departmentId=event.params.model.subDepartmentId;

            this.loadSubDepartments(this.departmentIdmain)
        }
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else if (this.data.statusId == 0) {
            this.isActive = false;
        }
    }

    cancel() {
        this.$modal.hide('Course-add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.loggerId = helper.newGuid();
                this.data.courseId = helper.newGuid();
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