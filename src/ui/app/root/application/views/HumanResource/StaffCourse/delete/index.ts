/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IStaffCourse } from '../../../../models';
import { StaffCourseService } from '../../../../service';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class StaffCourseDelete extends Vue {
    private repository: StaffCourseService;
    private data: IStaffCourse = { staffId:'',campusBuildingId: '', courseId: '', isPrimary: false, statusId: 0, staffCourseId: '',  };
    private title: string = 'Delete Record';

    created() {
        this.repository = new StaffCourseService(this.$store);
    }

    beforeModalOpen(event) {
        Object.assign(this.data, event.params.model) as IStaffCourse;
        console.log('oye kider ja rha')
        console.log(this.data)
    }

    cancel() {
        this.$modal.hide('delete-model-staffCourse');
        this.$emit("submit");
    }

    deleteModel() {
        console.log('hello inside')
        this.data.statusId=2;
        this.repository.Update(this.data)
            .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Record has been Deleted successfully',
                title: 'Deleted',
                messageTypeId: PayloadMessageTypes.warning
            })
            this.cancel();
        });

        this.cancel();
    }
}