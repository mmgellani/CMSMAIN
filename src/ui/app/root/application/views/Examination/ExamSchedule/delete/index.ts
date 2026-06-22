/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { ExaminationExamScheduleService } from '../../../../service/Examination/ExamSchedule';
import { GetCourseListByTimetable, IExaminationExamSchedule, UpdatemarksResponse } from '../../../../models/Examination/ExamSchedule';


@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class ExaminationExamScheduleDelete extends Vue {
    private repository: ExaminationExamScheduleService;
    private data: IExaminationExamSchedule = {
        month: '', examScheduleId: '', examDate: new Date(), statusId: 0, examTypeId: '', courseId: '', campusProgramId: '', classId: '', failMasterId: '', gradingMasterId: '', sectionCourseLinkId: '', totalMarks: 0, fullName: ''
    };
    private deleteexam: Array<UpdatemarksResponse> = [];
    private msgShow: string = '';
    private SectionCourseLinkId: string = '';
    private activeDayoff: boolean = false;
    private title: string = 'Delete Record';
    examScheduleId = ''
    created() {
        this.repository = new ExaminationExamScheduleService(this.$store);
    }

    beforeModalOpen(event) {
        debugger
        this.activeDayoff=false;
        Object.assign(this.data, event.params.model);
        this.examScheduleId = event.params.id;
        this.SectionCourseLinkId = event.params.model.sectionCourseLinkId;
        //console.log(this.data.examScheduleId)
    }

    cancel() {
        this.$modal.hide('delete-model');
        this.$emit("submit");
    }

    deleteModel() {
        debugger;
        var key = this.SectionCourseLinkId + '?' + this.examScheduleId;
        this.repository.DeleteExamSchedulebyCourse(key).then((r) => {

            this.deleteexam = r as Array<UpdatemarksResponse>;

            if (this.deleteexam[0].pg_catalog !== 0) {
               
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Marked exam cannot be deleted',
                    title: "Error",
                    messageTypeId: PayloadMessageTypes.error,
                });
                this.cancel();
            }
            else {
                this.activeDayoff=false;
                this.data.statusId = 2;
                this.repository.UpdateById(this.examScheduleId)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been Deleted successfully',
                            title: 'Deleted',
                            messageTypeId: PayloadMessageTypes.warning
                        })
                        this.cancel();
                    });
            }
        });
    }
}