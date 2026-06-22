/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IExaminationExamDetail, IExamDataVM } from '../../../../models';
import { ExaminationExamDetailService } from '../../../../service';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class ExaminationExamDetailDelete extends Vue {
    private repository: ExaminationExamDetailService;
    private data: IExamDataVM = { 
        examDetailId: '', 
        admissionFormId: '', 
        rollNo: '', 
        fullName: '', 
        examMasterId: '', 
        attendanceStatusId: '', 
        obtainMarks: 0, 
        statusId: 0, 
       
        code: '', 
        dated: new Date(), 
        totalMarks: 0, 
        classId:'', 
        className: '', 
        sectionId:'', 
        sectionName:'' , 
        courseId: '', 
        courseName: '', 
        campusProgramId: '', 
        campusId: '', 
        programDetailId: '', 
        sessionId: ''
};
    private title: string = 'Delete Record';

    created() {
        this.repository = new ExaminationExamDetailService(this.$store);
    }

    beforeModalOpen(event) {
        Object.assign(this.data, event.params.model);
    }

    cancel() {
        this.$modal.hide('delete-model');
        this.$emit("submit");
    }

    deleteModel() {
        this.repository.Delete(this.data)
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