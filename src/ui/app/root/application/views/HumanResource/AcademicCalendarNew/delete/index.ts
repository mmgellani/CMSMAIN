/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IAcademicCalendar, IHumanResourceStaff } from '../../../../models';
import { AcademicCalendarService, HumanResourceStaffService } from '../../../../service';
import { CalendarExamTtypeService } from '../../../../service/AcademicCalendar/calendarExamType';
import { ICalendarExamType } from '../../../../models/academiccalendar/calendarExamType';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class AcademicCalendarNewDelete extends Vue {
    private repository: AcademicCalendarService;
    private calendarExamTypeRepo: CalendarExamTtypeService;

    private calendarExamTypeList: Array<ICalendarExamType> = [];
    data: IAcademicCalendar = {
        holidayTypeId: '00000000-0000-0000-0000-000000000000', toDate: null, academicCalendarId: '', academicCalendarTypeId: ''
        , description: '', fromDate: null, topicId: '00000000-0000-0000-0000-000000000000'
        , academicCalendarMasterId: '', topicIds:'',topicValue:'',courseId:'' ,chapterName:''
    };

     private title: string = 'Delete Record';

    created() {
        this.repository = new AcademicCalendarService(this.$store);
        this.calendarExamTypeRepo = new CalendarExamTtypeService(this.$store);
    }

    beforeModalOpen(event) {
        // Object.assign(this.data, event.params.model);
        this.loadCalendarExam();
        this.data = Object.assign(event.params.MODEL);
        this.data.academicCalendarId = event.params.MODEL.schedule.id;
        console.log(this.data.academicCalendarId);
    }
    loadCalendarExam(){
        this.calendarExamTypeList = [];
        this.calendarExamTypeRepo.GetFindBy('s=>s.StatusId!=2')
        .then(response => this.calendarExamTypeList = (response as Array<ICalendarExamType>));
    }
    cancel() {
        this.$modal.hide('delete-model');
        this.$emit("submit");
    }

    deleteModel() {
        if((this.calendarExamTypeList.filter(e=> e.calendarExamTypeId == this.data.academicCalendarId)).length>0){
            this.calendarExamTypeRepo.DeleteCalendarExam(this.data.academicCalendarId)
            .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Record has been Deleted successfully',
                title: 'Deleted',
                messageTypeId: PayloadMessageTypes.warning
            })
            this.cancel();
        });
        }
        else
        {
        this.repository.DeleteCalendar(this.data.academicCalendarId)
            .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Record has been Deleted successfully',
                title: 'Deleted',
                messageTypeId: PayloadMessageTypes.warning
            })
            this.cancel();
        });
    }
        this.cancel();
    }
}