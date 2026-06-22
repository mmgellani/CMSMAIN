import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IHumanResourceStaff, ITimeTableTimeTableVM, ISetupZone, ISetupCity, ISetupSubCity, ISetupSession, ICampusCityVM, HolidayType, AcademicCalendarVM, ISetupCitySubCityLink, IELTopics, IBoards, ISetupClass, IAcademicCalendarType, IAcademicCalendar, IAcademicCalendarMaster, IAcademicCalendarMasterCity } from '../../../../models';
import { HumanResourceStaffService, TimeTableTimeTableService, SetupZoneService, SetupCityService, SetupSubCityService, SetupSessionService, SetupCampusService, ELTopicsService, BoardsService, SetupClassService, AcademicCalendarTypeService, AcademicCalendarService, AcademicCalendarMasterService } from '../../../../service';
import { StoreTypes } from '../../../../../../store';

import { Calendar } from '@toast-ui/vue-calendar';
import { HolidayTypeService } from '../../../../service/AcademicCalendar/holidaytype';
import * as helper from "../../../../helper";
import { IAcademicCalendarView } from '../../../../models/academiccalendar/academicCalendar';
import moment from 'moment';


@Component({
  name: 'teacher-timetable',
  template: require('./index.html'),
})



export class CalendarConfirmation extends Vue {

  @State((state: IRootStoreState) => state.common.user) user: IUser;
  sessionRepo: SetupSessionService = new SetupSessionService(this.$store);

  sessionList: Array<ISetupSession> = [];
  calendarviewList: Array<IAcademicCalendarMasterCity> = [];
  campusddl: any[];
  cityDDL: any[];
  campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  campusCityList: any = [];
  sessionId: string = '';
  campusId: string = ''
  holidaytypeid: string = '';
  topicId = ''
  boardId = ''
  academiccalendarlist: Array<AcademicCalendarVM> = [];
  private classList: Array<ISetupClass> = [];
  private repoClass: SetupClassService = new SetupClassService(this.$store)

  timetableser: TimeTableTimeTableService = new TimeTableTimeTableService(this.$store);
  private subCityRepo: SetupSubCityService = new SetupSubCityService(this.$store);
  private citySubCityList: Array<ISetupCitySubCityLink> = [];
  private topicList: Array<IELTopics> = []
  private topicRepo: ELTopicsService = new ELTopicsService(this.$store)
  boardList: IBoards[] = [];
  boardRepo: BoardsService = new BoardsService(this.$store);
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  subCityId = ''
  academicCalendarTypeId = ''
  academicCalendarTypeList: IAcademicCalendarType[] = []
  repoAcademicCalendarType: AcademicCalendarTypeService = new AcademicCalendarTypeService(this.$store)
  acadmiccalendarepo: AcademicCalendarMasterService = new AcademicCalendarMasterService(this.$store);
  private useCreationPopup = false;
  private useDetailPopup = true;

  classId = '';
  private columns = [
    { key: 'fullName', caption: 'Full Name' },
    { key: 'subCity', caption: 'Sub City' },
    { key: 'isApproved', caption: 'Status' },
    { key: 'action', caption: 'Action', width: 120 }
  ];
  mounted() {
    this.GetAcadmicCaldenview();
  }


  GetAcadmicCaldenview() {
    this.calendarviewList = [];
    this.acadmiccalendarepo.GetApprovedCalendarEx(this.user.userId).then(r => {
      this.calendarviewList = r as Array<IAcademicCalendarMasterCity>
    })
  }

  checked(model) {
    this.acadmiccalendarepo.Update(model).then(() => {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Record has been updated successfully",
        title: "Success",
        messageTypeId: PayloadMessageTypes.success
      });
    });
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("calendarConfirmation" in this.user.claims == true) {
        if (this.user.claims["calendarConfirmation"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["calendarConfirmation"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["calendarConfirmation"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["calendarConfirmation"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }
}