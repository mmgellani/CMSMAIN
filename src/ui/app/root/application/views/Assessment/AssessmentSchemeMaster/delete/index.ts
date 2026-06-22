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
import { AssessmentSchemeDetailService } from '../../../../service/Assessment/AssesmentDetail';
import { AssessmentSchemeMasterService } from '../../../../service/Assessment/AssesmentMaster';
import { IAssessmentSchemeDefinitionAll } from '../../../../models/Setup/AssessmentSchemeDefinition';


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
    private AssesmentSchmeDetailRepo: AssessmentSchemeDetailService;
    private AssesmentSchmeMastrRepo: AssessmentSchemeMasterService;
    assmentMasterdata: IAssessmentSchemeDefinitionAll ;

    examScheduleId = ''
    created() {
        this.repository = new ExaminationExamScheduleService(this.$store);
        this.AssesmentSchmeDetailRepo=new  AssessmentSchemeDetailService(this.$store);
        this.AssesmentSchmeMastrRepo = new AssessmentSchemeMasterService(this.$store);

    }

    beforeModalOpen(event) {
        
        this.activeDayoff=false;
        Object.assign(this.data, event.params.model);
        //console.log(this.data.examScheduleId)
    }

    cancel() {
        this.$modal.hide('delete-model');
        this.$emit("submit");
    }
    deleteModel() {
        
        this.data.statusId = 2;
        this.AssesmentSchmeMastrRepo.Update(this.data).then(() => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been Deleted successfully",
            title: "Deleted",
            messageTypeId: PayloadMessageTypes.success
          });
          this.cancel();
        });
    
        this.cancel();
      }

}