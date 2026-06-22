import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IHumanResourceStaff, ITimeTableTimeTableVM, ISetupZone, ISetupCity, ISetupSubCity, ISetupSession, ICampusCityVM, HolidayType, AcademicCalendarVM, IELTopics, IBoards, ProgramCourseList, IELChapters } from '../../../../models';
import { HumanResourceStaffService, TimeTableTimeTableService, SetupZoneService, SetupCityService, SetupSubCityService, SetupSessionService, SetupCampusService, AcademicCalendarService, ELTopicsService, BoardsService, AcademicCalendarTypeService, AdmissionStudentsService, ELChaptersService } from '../../../../service';
import { StoreTypes } from '../../../../../../store';

import { Calendar } from '@toast-ui/vue-calendar';
import { HolidayTypeService } from '../../../../service/AcademicCalendar/holidaytype';
import * as helper from "../../../../helper";
import moment from 'moment'
import { IAcademicCalendar, IAcademicCalendarView } from '../../../../models/academiccalendar/academicCalendar';
import { IAcademicCalendarType } from '../../../../models/academiccalendar/academicCalendarType';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { CalendarPopup } from '../../AcademicCalendarMaster/add-edit';
import { AcademicCalendarNewDelete } from '../delete';
@Component({
    name: 'view-Popup',
    template: require('./index.html'),
    components: {
        "add-edit": CalendarPopup,
        'delete-model': AcademicCalendarNewDelete
    },
})



export class ViewCalendarNewPopup extends Vue {

    holidaytyperepo: HolidayTypeService = new HolidayTypeService(this.$store);
    holidaytypelist: Array<HolidayType> = [];
    calendarviewList: Array<IAcademicCalendarView> = [];

    IsNewReord = true;

    private repository: ELChaptersService = new ELChaptersService(this.$store);
    private data: Array<IELChapters> = [];
    chapterid = '';

    fullName: string = '';
    description: string = '';
    //holidaytypeid: string = '';
    campusid: string = '';
    sessionid: string = '';
    start: any;
    end: any;

    topicId = ''
    boardId = ''
    subCityId = ''
    academicCalendarTypeId = ''
    private scheduleList = [];
    timetableser: TimeTableTimeTableService = new TimeTableTimeTableService(this.$store);
    academicCalendarModel: IAcademicCalendar = {
        holidayTypeId: '00000000-0000-0000-0000-000000000000', toDate: null, academicCalendarId: '', academicCalendarTypeId: ''
        , description: '', fromDate: null, topicId: '00000000-0000-0000-0000-000000000000'
        , academicCalendarMasterId: '',topicIds:'',topicValue:'',courseId:'' , chapterName:''
    };
    ss: IAcademicCalendarType;
    classId: any = '';
    private courseRepository: AdmissionStudentsService = new AdmissionStudentsService(this.$store);
    private programCourse: Array<ProgramCourseList> = [];
    repoAcademicCalendar: AcademicCalendarService = new AcademicCalendarService(this.$store)
    private topicList: Array<IELTopics> = []
    courseId = '';
    sessionId = '';
    campusId: string = "";
    private topicRepo: ELTopicsService = new ELTopicsService(this.$store)
    boardList: IBoards[] = [];
    boardRepo: BoardsService = new BoardsService(this.$store);
    academicCalendarTypeList: IAcademicCalendarType[] = []
    repoAcademicCalendarType: AcademicCalendarTypeService = new AcademicCalendarTypeService(this.$store);
    public model = [] ;
    beforeModalOpen(event) {
        this.IsNewReord = event.params.isNewRecord;
        this.sessionId = event.params.SESSIONID;
        this.start = event.params.STARTDTE;
        this.end = event.params.ENDATE;
        this.courseId = event.params.courseId;
        this.subCityId = event.params.SUBCITYID;
        this.classId = event.params.CLASSID;
        this.campusId = event.params.CAMPUSID;
        this.boardId = event.params.BOARDID;
        this.model = Object.assign(event.params.MODEL);
        console.log(this.model)

        if (!this.IsNewReord) {
            this.calendarviewList = [];
            this.repoAcademicCalendar.GetAcademicCalendarSingleData(this.sessionId + '?' + this.subCityId + '?' + this.classId + '?' + event.params.MODEL.schedule.id).then(
                r => {
                    this.calendarviewList = r as Array<IAcademicCalendarView>
                    // console.log(JSON.stringify(this.academicCalendarModel))
                }
            )
        }
    }
    mounted() {

    }

    cancel() {
        this.$modal.hide('view-model')
    }
    edit() {
        this.$modal.hide('view-model');
        this.$modal.show("cal-add-edit-model", {
            SESSIONID: this.sessionId,
            CAMPUSID: this.campusId,
            SUBCITYID: this.subCityId,
            CLASSID: this.classId,
            courseId: this.courseId,
            isNewRecord: false,
            MODEL: this.model,
            BOARDID: this.boardId,
        });
    }
    remove() {
        console.log(this.model)
        this.$modal.hide('view-model');
        this.$modal.show("delete-model", {
            MODEL: this.model
        });
    }
}