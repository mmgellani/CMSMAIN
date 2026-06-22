import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';
import { email, maxLength, required } from 'vuelidate/lib/validators';
import { IHumanResourceStaff, ITimeTableTimeTableVM, ISetupZone, ISetupCity, ISetupSubCity, ISetupSession, ICampusCityVM, HolidayType, AcademicCalendarVM, IELTopics, IBoards, ProgramCourseList, IELChapters, IAcademicCalendarMaster } from '../../../../models';
import { HumanResourceStaffService, TimeTableTimeTableService, SetupZoneService, SetupCityService, SetupSubCityService, SetupSessionService, SetupCampusService, AcademicCalendarService, ELTopicsService, BoardsService, AcademicCalendarTypeService, AdmissionStudentsService, ELChaptersService, AcademicCalendarMasterService } from '../../../../service';
import { StoreTypes } from '../../../../../../store';

import { Calendar } from '@toast-ui/vue-calendar';
import { HolidayTypeService } from '../../../../service/AcademicCalendar/holidaytype';
import * as helper from "../../../../helper";
import moment from 'moment'
import { IAcademicCalendar, IAcademicCalendarView } from '../../../../models/academiccalendar/academicCalendar';
import { IAcademicCalendarType } from '../../../../models/academiccalendar/academicCalendarType';
import { validationMixin, ValidationRuleset } from 'vuelidate';
import { ICalendarExamType } from '../../../../models/academiccalendar/calendarExamType';
import { CalendarExamTtypeService } from '../../../../service/AcademicCalendar/calendarExamType';

type ValidateAcademicCalendar = { academicCalendarModel: IAcademicCalendar, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateAcademicCalendar> = {
    academicCalendarModel: {
        academicCalendarTypeId: { required },
        topicId: { required }

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'teacher-timetable',
    template: require('./index.html')
})



export class CalendarPopup extends Vue {

    holidaytyperepo: HolidayTypeService = new HolidayTypeService(this.$store);
    holidaytypelist: Array<HolidayType> = [];
    calendarviewList: Array<IAcademicCalendarView> = [];

    IsNewReord = true;
    mtodate: any;
    mfromdate: any;
    private repository: ELChaptersService = new ELChaptersService(this.$store);
    private calendarExamTypeRepository: CalendarExamTtypeService = new CalendarExamTtypeService(this.$store);
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
    academicCalendarMasterId = ''
    academicCalendarTypeId = ''
    private scheduleList = [];
    timetableser: TimeTableTimeTableService = new TimeTableTimeTableService(this.$store);
    academicCalendarModel: IAcademicCalendar = {
        holidayTypeId: '00000000-0000-0000-0000-000000000000', toDate: null, academicCalendarId: '', academicCalendarTypeId: ''
        , description: '', fromDate: null, topicId: '00000000-0000-0000-0000-000000000000'
        , academicCalendarMasterId: '', topicIds:'',topicValue:'' ,courseId:'' , chapterName:''
    };
    private examType: ICalendarExamType = {
        calendarExamTypeId: "",
        name: "",
        academicCalendarMasterId: "",
        courseId: "",
        fromDate: new Date(),
        toDate: new Date(),
        statusId: 0,
        topicIds:''
    };
    ss: IAcademicCalendarType;
    classId: any = '';
    private courseRepository: AdmissionStudentsService = new AdmissionStudentsService(this.$store);
    private programCourse: Array<ProgramCourseList> = [];
    repoAcademicCalendar: AcademicCalendarService = new AcademicCalendarService(this.$store)
    private topicList: Array<IELTopics> = []
    private courseId = '';
    private topicRepo: ELTopicsService = new ELTopicsService(this.$store)
    boardList: IBoards[] = [];
    boardRepo: BoardsService = new BoardsService(this.$store);
    academicCalendarTypeList: IAcademicCalendarType[] = []
    repoAcademicCalendarType: AcademicCalendarTypeService = new AcademicCalendarTypeService(this.$store)
    // repoAcademicCalendarMaster: AcademicCalendarMasterService = new AcademicCalendarMasterService(this.$store)
    // academicCalendarMasterList: IAcademicCalendarMaster[] = []
    //academicCalendarMasterId=''

    private course = '';

    title = ''

    private examList = [
        {
            title: 'Monthly Test'
        },
        {
            title: 'Phase 1'
        },
        {
            title: 'Phase 2'
        },
    ]


    beforeModalOpen(event) {

        this.IsNewReord = event.params.isNewRecord;
        this.title = this.IsNewReord ? 'Add Record' : 'Edit Record';
        // this.academicCalendarModel. = event.params.CAMPUSID;
        this.$v.$reset();
        this.sessionId = event.params.SESSIONID;
        this.start = event.params.STARTDTE;
        this.end = event.params.ENDATE;
        this.mtodate = event.params.mToDate;
        this.mfromdate = event.params.mFromDate;
        this.course = event.params.courseId;
        this.boardId = event.params.BOARDID;

        this.academicCalendarModel.academicCalendarMasterId = event.params.AcademicCalendarMasterId
        this.academicCalendarMasterId = event.params.AcademicCalendarMasterId
        // this.academicCalendarModel.topicId = event.params.TOPICID
        // this.academicCalendarModel.boardId = event.params.BOARDID
        this.subCityId = event.params.SUBCITYID
        //this.academicCalendarModel.academicCalendarTypeId = event.params.AcademicCalendarTypeId
        // this.holidaytypeid=event.params.SUBCITYID'fc478956-b943-482c-8c0d-8c5d9829cf5e'
        this.classId = event.params.CLASSID
        // this.loadAcademicCalendarMaster();
        if (this.IsNewReord == true) {
            this.academicCalendarModel.fromDate = new Date(moment(this.start._date).format('YYYY-MM-DD'))
            this.academicCalendarModel.toDate = new Date(moment(this.end._date).format('YYYY-MM-DD'))
            this.courseId = '';
            this.chapterid = ''
            //this.academicCalendarModel.holidayTypeId=

        }
        else {
            this.calendarviewList = [];
            console.log(event.params.MODEL.schedule.id)
            this.repoAcademicCalendar.GetAcademicCalendarSingleData(this.sessionId + '?' + this.subCityId + '?' + this.classId + '?' + event.params.MODEL.schedule.id).then(
                r => {
                    this.calendarviewList = r as Array<IAcademicCalendarView>
                    console.log(this.calendarviewList)
                    if (this.calendarviewList.length > 0) {

                        if (this.calendarviewList[0].academicCalendarTypeId == '99999999-9999-9999-0000-000000000000') {
                            this.academicCalendarModel.academicCalendarTypeId = this.calendarviewList[0].academicCalendarTypeId;
                            this.academicCalendarModel.holidayTypeId = this.calendarviewList[0].holidayTypeId;
                            this.academicCalendarModel.academicCalendarId = this.calendarviewList[0].academicCalendarId;
                            this.academicCalendarModel.description = this.calendarviewList[0].calendarName;
                            // this.academicCalendarModel.boardId = this.calendarviewList[0].boardId;
                            this.courseId = this.calendarviewList[0].courseId;
                            this.chapterid = this.calendarviewList[0].chapterId;
                            this.academicCalendarModel.topicId = this.calendarviewList[0].topicId;
                            this.academicCalendarModel.fromDate = new Date(this.calendarviewList[0].fromDate);
                            this.academicCalendarModel.toDate = new Date(this.calendarviewList[0].toDate);
                            this.academicCalendarModel.academicCalendarMasterId = this.calendarviewList[0].academicCalendarMasterId;
                        }
                        else {
                            this.academicCalendarModel.academicCalendarTypeId = this.calendarviewList[0].academicCalendarTypeId;
                            this.academicCalendarModel.academicCalendarId = this.calendarviewList[0].academicCalendarId;
                            this.academicCalendarModel.holidayTypeId = this.calendarviewList[0].holidayTypeId;
                            this.academicCalendarModel.description = this.calendarviewList[0].calendarName;
                            // this.academicCalendarModel.boardId = this.calendarviewList[0].boardId;
                            this.chapterid = this.calendarviewList[0].chapterId;
                            this.courseId = this.calendarviewList[0].courseId;
                            this.academicCalendarModel.topicId = this.calendarviewList[0].topicId;
                            this.academicCalendarModel.fromDate = new Date(this.calendarviewList[0].fromDate);
                            this.academicCalendarModel.toDate = new Date(this.calendarviewList[0].toDate);
                            this.academicCalendarModel.academicCalendarMasterId = this.calendarviewList[0].academicCalendarMasterId;

                        }
                    }
                }
            )
        }
    }

    mounted() {
        this.loadHolidayType();
        this.loadBoards();
        this.loadAcademicCalendarType();
        this.loadCourse();
    }


    viewWeeks(event) {

        if (event.target.checked == true) {
            var firstday = this.academicCalendarModel.fromDate.getDate() - (this.academicCalendarModel.fromDate.getDay() - 1);
            var lastday = firstday + 5;
            const weekStart = new Date(this.academicCalendarModel.fromDate.setDate(firstday));
            const weekEnd = new Date(this.academicCalendarModel.fromDate.setDate(lastday));
            if (this.dateRangeCheck(this.mfromdate, this.mtodate, this.start._date) && this.dateRangeCheck(this.mfromdate, this.mtodate, weekEnd)) {


                this.academicCalendarModel.fromDate = weekStart;
                this.academicCalendarModel.toDate = weekEnd;
            }
            else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Invalid selection",
                    title: "danger",
                    messageTypeId: PayloadMessageTypes.error
                });
                this.academicCalendarModel.fromDate = new Date(moment(this.start._date).format('YYYY-MM-DD'))
                this.academicCalendarModel.toDate = new Date(moment(this.end._date).format('YYYY-MM-DD'))
            }
        }
    }

    dateRangeCheck(from, to, check) {
        var fDate, lDate, cDate;
        fDate = moment(from).format('YYYY-MM-DD');
        lDate = moment(to).format('YYYY-MM-DD');
        cDate = moment(check).format('YYYY-MM-DD');
        if (fDate <= cDate && cDate <= lDate) {
            return true;
        } else {
            return false;
        }
    }

    sessionId = ''
    // loadAcademicCalendarMaster() {
    //     this.academicCalendarMasterList=[]
    //     var key = this.sessionId + "?" + this.subCityId + "?" + this.classId
    //     this.repoAcademicCalendarMaster.GetFindByIds(key)
    //         .then(r => {
    //             this.academicCalendarMasterList = r as IAcademicCalendarMaster[]
    //         })
    // }
    loadAcademicCalendarType() {
        this.academicCalendarTypeList = [];

        this.repoAcademicCalendarType.GetFindByEx('e=>e.StatusId==1').then(res => {
            this.academicCalendarTypeList = res as Array<IAcademicCalendarType>
        });
    }

    loadBoards() {
        this.boardRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.boardList = r

            })
    }
    loadTopics() {
        this.topicList = [];
        this.topicRepo.GetFindBy('s=>s.ChapterId.ToString()=="' + this.chapterid + '" && s.StatusId==1')
            .then(r => {
                this.topicList = r as Array<IELTopics>
                this.topicList = this.topicList.sort((one, two) =>
                  one.title < two.title ? -1 : 1
                );

            })
    }
    loadHolidayType() {

        this.holidaytyperepo.GetFindBy('e=>e.StatusId==1').then(r => {
            this.holidaytypelist = r as Array<HolidayType>
        })
    }
    GetChapters() {
        this.data = [];
        this.repository.GetFindBy('s=>s.CourseId.ToString()=="' + this.course + '" && s.BoardId.ToString()=="' + this.boardId + '" && s.ClassId.ToString()=="' + this.classId + '" && s.StatusId == 1').then(e => {
            this.data = e as Array<IELChapters>
            this.data = this.data.sort((one, two) =>
              one.orderNo < two.orderNo ? -1 : 1
            );

        })

    }
    cancel() {
        this.academicCalendarModel = {
            holidayTypeId: '00000000-0000-0000-0000-000000000000', toDate: null, academicCalendarId: '', academicCalendarTypeId: ''
            , description: '', fromDate: null, topicId: '00000000-0000-0000-0000-000000000000'
            , academicCalendarMasterId: '', topicIds:'' , topicValue:'',courseId:'', chapterName:''
        };
        // this.holidaytypeid = '';
        this.examType.name = ''
        this.$modal.hide('cal-add-edit-model')
        this.$emit('submit');

    }
    showdisabled() {

        if (this.academicCalendarModel.academicCalendarTypeId == 'e97cfef1-d44c-486d-9500-920eedec4249')
            return true;
        return false;

    }

    loadCourse() {
        this.courseRepository.GetProgramCourse().then(r => {
            this.programCourse = r as Array<ProgramCourseList>;

        });
    }

    save() {
        // this.academicCalendarModel.academicCalendarMasterId=this.academicCalendarMasterId;
        // console.log(this.academicCalendarModel.academicCalendarTypeId )
        if (this.academicCalendarModel.academicCalendarTypeId == 'e97cfef1-d44c-486d-9500-920eedec4249') {
            this.examType.calendarExamTypeId = helper.newGuid();
            this.examType.academicCalendarMasterId = this.academicCalendarMasterId;
            this.examType.courseId = this.course;
            this.examType.fromDate = new Date(moment(this.start._date).format('YYYY-MM-DD'));
            this.examType.toDate = new Date(moment(this.end._date).format('YYYY-MM-DD'));
            this.examType.statusId = 1;

            if (this.examType.name.length > 0) {
                console.log(JSON.stringify(this.examType));
                this.calendarExamTypeRepository.AddOne(this.examType).then(() => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: "Record has been inserted successfully",
                        title: "Success",
                        messageTypeId: PayloadMessageTypes.success
                    });
                    this.cancel();
                });
            } else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Enter exam type",
                    title: "error",
                    messageTypeId: PayloadMessageTypes.error
                });
            }


        }
        else {
            this.$v.$touch();
            if (!this.$v.$invalid) {
                if (this.IsNewReord == true) {

                    if (this.academicCalendarModel.academicCalendarTypeId != '99999999-9999-9999-0000-000000000000') {
                        this.academicCalendarModel.holidayTypeId = '00000000-0000-0000-0000-000000000000'
                    }
                    this.academicCalendarModel.academicCalendarId = helper.newGuid();
                    // console.log(JSON.stringify(this.academicCalendarModel))
                    this.repoAcademicCalendar.AddOne(this.academicCalendarModel)
                        .then(r => {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: "Academic Calendar Inserted SuccessFully",
                                title: "Success",
                                messageTypeId: PayloadMessageTypes.success
                            });


                            this.cancel();
                        })
                }
                else {

                    if (this.academicCalendarModel.academicCalendarTypeId != '99999999-9999-9999-0000-000000000000') {
                        this.academicCalendarModel.holidayTypeId = '00000000-0000-0000-0000-000000000000'

                    }
                    else {
                        // this.academicCalendarModel.boardId = '00000000-0000-0000-0000-000000000000'
                        this.academicCalendarModel.topicId = '00000000-0000-0000-0000-000000000000'
                    }
                    this.repoAcademicCalendar.Update(this.academicCalendarModel)
                        .then(r => {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: "Academic Calendar Updated SuccessFully",
                                title: "Success",
                                messageTypeId: PayloadMessageTypes.success
                            });
                            this.cancel();
                        })
                }
            }
        }

    }
    $v: any
}