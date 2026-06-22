/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../src/ui/app/store/index';
import { PayloadMessageTypes } from '../../../../../../src/ui/app/model/index';
import { RegistrationCourseService, RolePrevilagesService } from '../../application/service';
import { IRegistrationCourse, TodoList } from '../../application/models';

import * as helper from '../../../../app/root/application/helper/index';



type ValidateToDoList = { data: TodoList, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateToDoList> = {
    data: {
        title: {
            required
        },
        description: {
            required
        },
        dated: {
            required
        },
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'toDoList-add-edit-model',
    template: require('./index.html')
})
export class ToDoListAddEdit extends Vue {
    private repository: RegistrationCourseService;
    isActive: boolean = true;
    private data: TodoList = {
        todoListId: '', userId: 0, dated: new Date(), description: '', taskStatus: false, title: '', statusId: 0
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private currDate: Date =  new Date();
    private rolePrivilagesRepo: RolePrevilagesService = null;

    created() {
        this.repository = new RegistrationCourseService(this.$store);
        this.rolePrivilagesRepo = new RolePrevilagesService(this.$store);
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Task' : 'Edit Task';
        Object.assign(this.data, event.params.model);
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else if (this.data.statusId == 0) {
            this.isActive = false;
        }
    }

    cancel() {
        this.$modal.hide('toDoList-add-edit-model');
        this.$emit("submit");
    }

    // disabledDates(){

    // }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.todoListId = helper.newGuid();
                this.data.statusId = 1;
                this.data.taskStatus = false;

                var key = this.data.todoListId + "?" + this.data.userId + "?" + helper.formateDate(this.data.dated) + "?" + this.data.description + "?" + this.data.taskStatus + "?" + this.data.title + "?" + this.data.statusId
                this.rolePrivilagesRepo.InsertToDoList(key)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Task has been inserted successfully',
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
                var key = this.data.todoListId + "?" + this.data.userId + "?" + helper.formateDate(this.data.dated) + "?" + this.data.description + "?" + this.data.taskStatus + "?" + this.data.title + "?" + this.data.statusId;
                this.rolePrivilagesRepo.InsertToDoList(key)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Task has been inserted successfully',
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