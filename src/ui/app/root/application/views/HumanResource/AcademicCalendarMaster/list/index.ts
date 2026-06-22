import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IHumanResourceStaff, ITimeTableTimeTableVM, ISetupZone, ISetupCity, ISetupSubCity, ISetupSession, ICampusCityVM, HolidayType, AcademicCalendarVM, ISetupCitySubCityLink, IELTopics, IBoards, ISetupClass, IAcademicCalendarType, IAcademicCalendar, IAcademicCalendarMaster } from '../../../../models';
import { HumanResourceStaffService, TimeTableTimeTableService, SetupZoneService, SetupCityService, SetupSubCityService, SetupSessionService, SetupCampusService, ELTopicsService, BoardsService, SetupClassService, AcademicCalendarTypeService, AcademicCalendarService, AcademicCalendarMasterService } from '../../../../service';
import { StoreTypes } from '../../../../../../store';

import { Calendar } from '@toast-ui/vue-calendar';
import { HolidayTypeService } from '../../../../service/AcademicCalendar/holidaytype';
import * as helper from "../../../../helper";
import { CalendarPopup } from '../add-edit';
import { IAcademicCalendarView } from '../../../../models/academiccalendar/academicCalendar';
import moment from 'moment';
import { AcademicCalendarMasterDelete } from '../delete';


@Component({
  name: 'teacher-timetable',
  template: require('./index.html'),
  components: {
    'calendar': Calendar,
    'add-edit': CalendarPopup,
    'delete': AcademicCalendarMasterDelete
  }
})



export class AcademicCalendarMaster extends Vue {

  @State((state: IRootStoreState) => state.common.user) user: IUser;
  sessionRepo: SetupSessionService = new SetupSessionService(this.$store);

  sessionList: Array<ISetupSession> = [];
  calendarviewList: Array<IAcademicCalendarMaster> = [];
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
    { key: 'statusId', caption: 'Status' },
    { key: 'fromDate', caption: 'Level' },
    { key: 'toDate', caption: 'Code' },
    { key: 'action', caption: 'Action', width: 120 }
  ];
  mounted() {

    this.loadSession();
    // this.loadCitySubCity();
    this.$watch('sessionId',this.loadCitySubCity)

    this.loadClass();
  }
  loadAcademicCalendarType() {
    this.academicCalendarTypeList = [];

    this.repoAcademicCalendarType.GetFindByEx('e=>e.StatusId==1').then(res => {
      this.academicCalendarTypeList = res as Array<IAcademicCalendarType>
    });
  }
  loadClass() {
    this.classList = [];

    this.repoClass.GetFindBy('e=>e.StatusId==1').then(res => {
      this.classList = res as Array<ISetupClass>
        this.classList = this.classList;
      // this.classList = this.classList.filter(e=> e.classId == '18b9b02e-8213-4883-8cd6-6059ac5aa733' || e.classId == '8931d744-acc9-4776-a03a-2b705038ea48' || e.classId == '10bfa10a-2582-46db-ba80-ae326fee2b48')
    });
  }
  loadBoards() {
    this.boardRepo.GetFindBy('s=>s.StatusId==1')
      .then(r => {
        this.boardList = r

      })
  }
  loadCitySubCity() {
    this.citySubCityList = [];
    this.subCityRepo.GetFindByCitySubCityEx("e=>e.StatusId==1")
      .then(r => {
        this.citySubCityList = r as Array<ISetupCitySubCityLink>;
      });
  }
  loadTopics() {
    this.topicRepo.GetFindBy('s=>s.StatusId==1')
      .then(r => {
        this.topicList = r as Array<IELTopics>

      })
  }
  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("academicCalendarMaster" in this.user.claims == true) {
        if (this.user.claims["academicCalendarMaster"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["academicCalendarMaster"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["academicCalendarMaster"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["academicCalendarMaster"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  GetAcadmicCaldenview() {
    this.calendarviewList = [];
    var pro = this.sessionId + '?' + this.subCityId + '?' + this.classId + '?' + this.boardId;
    this.acadmiccalendarepo.GetAcadmicCaldenview( this.sessionId + '?' + this.subCityId + '?' + this.classId  + '?' + this.boardId ).then(r => {
      this.calendarviewList = r as Array<IAcademicCalendarMaster>

    })
  }
  insertModel() {

    if (this.sessionId.length > 0 && this.subCityId.length > 0 && this.classId.length > 0 && this.boardId.length > 0) {

      this.$modal.show('cal-add-edit-model', {
        model: {
          academicCalendarMasterId: '',
          sessionId: this.sessionId,
          subCityId: this.subCityId,
          classId: this.classId,
          boardId: this.boardId,
          fullName: '',
          fromDate: new Date(),
          toDate: new Date(),
          weeks: 1,
          statusId: 1
        }, IsNewRecord: true
      });
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select the Dropdowns",
        title: "Danger",
        messageTypeId: PayloadMessageTypes.error
      });
    }


  }

  editModel(model: IAcademicCalendarMaster) {
    this.$modal.show('cal-add-edit-model', { model: model, IsNewRecord: false });
  }


  loadCityCampus() {
    this.campusddl = [];
    this.cityDDL = [];
    let oldObj: ICampusCityVM;
    this.campusRepo.GetCityVM().then(r => {
      this.campusCityList = r as Array<ICampusCityVM>;
    });
  }

  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionList = r as Array<ISetupSession>
      })
  }

  deleteModel(model: IAcademicCalendarMaster) {

    this.$modal.show('delete-model', { model: model });

  }


}