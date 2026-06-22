import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';
import { StoreTypes } from '../../../../../../store';
import moment from 'moment';



import { IHumanResourceStaff, ITimeTableTimeTableVM, ISetupZone, ISetupCity, ISetupSubCity, ISetupSession, ICampusCityVM, HolidayType, AcademicCalendarVM, ISetupCitySubCityLink, ISetupClass, IAcademicCalendarMaster } from '../../../../models';
import { HumanResourceStaffService, TimeTableTimeTableService, SetupZoneService, SetupCityService, SetupSubCityService, SetupSessionService, SetupCampusService, SetupClassService, AcademicCalendarMasterService } from '../../../../service';
import { HolidayTypeService } from '../../../../service/AcademicCalendar/holidaytype';
import { HolidaysVM, IHolidays } from '../../../../models/academiccalendar/holidays';
import { HolidayService } from '../../../../service/AcademicCalendar/holiday';
import { AcademicCalendarEventService } from '../../../../service/AcademicCalendar/event';
import { IEvents, IEventsVW } from '../../../../models/academiccalendar/events';
import { EventsAddEdit } from '../add-edit';
import { DeleteEvents } from '../delete';


@Component({
  name: 'holidaytype',
  template: require('./index.html'),
  components: {
    "add-edit": EventsAddEdit,
    "delete": DeleteEvents
  }
})



export class AcademicEvents extends Vue {


  data: Array<IEventsVW> = [];
  repository: AcademicCalendarEventService = new AcademicCalendarEventService(this.$store);
  sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
  sessionList: Array<ISetupSession> = [];
  private subCityRepo: SetupSubCityService = new SetupSubCityService(this.$store);
  private citySubCityList: Array<ISetupCitySubCityLink> = [];
  private classList: Array<ISetupClass> = [];
  private repoClass: SetupClassService = new SetupClassService(this.$store)
  repoAcademicCalendarMaster: AcademicCalendarMasterService = new AcademicCalendarMasterService(this.$store)
  academicCalendarMasterList: IAcademicCalendarMaster[] = []
  title: string = '';
  subCityId = ''
  classId = '';
  sessionId: string = '';
  campusId: string = ''
  holidaytypelist: Array<HolidayType> = [];
  academicCalendarMasterId: string = ''
  private columns = [
    // { key: 'campusName', caption: 'Campus' },
    { key: 'holidayType', caption: 'Holiday Type' },
    { key: 'description', caption: 'Description' },
    { key: 'fromDate', caption: 'FromDate' },
    { key: 'toDate', caption: 'ToDate' },
    { key: 'statusId', caption: 'Status' },
    { key: 'action', caption: 'Action', width: 120 }
  ];

  created() { }

  mounted() {

    this.loadSession();
    this.loadCitySubCity();
    this.loadClass();


  }

  loadAcademicCalendarMaster() {
    this.academicCalendarMasterList = []
    if (this.sessionId.length > 0 && this.subCityId.length > 0 && this.classId.length > 0) {
      var key = this.sessionId + "?" + this.subCityId + "?" + this.classId
      this.repoAcademicCalendarMaster.GetFindByIds(key)
        .then(r => {
          this.academicCalendarMasterList = r as IAcademicCalendarMaster[]
        })
    }

  }
  loadClass() {
    this.classList = [];

    this.repoClass.GetFindBy('e=>e.StatusId==1').then(res => {
      this.classList = res as Array<ISetupClass>
    });
  }
  loadCitySubCity() {
    this.citySubCityList = [];
    this.subCityRepo.GetFindByCitySubCityEx("e=>e.StatusId==1")
      .then(r => {
        this.citySubCityList = r as Array<ISetupCitySubCityLink>;
      });
  }


  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionList = r as Array<ISetupSession>
      })
  }

  private masterFrom = "2021-08-29";
  private masterTo = "2021-08-29"
  loadEvents() {
    this.masterFrom = (this.academicCalendarMasterList.find(e => e.academicCalendarMasterId == this.academicCalendarMasterId).fromDate).toString();
    this.masterTo = (this.academicCalendarMasterList.find(e => e.academicCalendarMasterId == this.academicCalendarMasterId).toDate).toString();
    this.masterFrom = moment(this.masterFrom).format('YYYY/MM/DD')
    this.masterTo = moment(this.masterTo).format('YYYY/MM/DD')
    console.log(this.masterFrom);
    this.repository.GetEvents(this.academicCalendarMasterId).then(r => {
      this.data = r as Array<IEventsVW>
    })
  }
  insertModel() {
    if (this.sessionId.length > 0 && this.subCityId.length > 0 && this.classId.length > 0 && this.academicCalendarMasterId.length > 0) {
      this.$modal.show('events-add-edit-model', { model: { eventId: '', holidayTypeId: '', academicCalendarMasterId: '', description: '', statusId: 1, fromDate: '', toDate: '' }, IsNewRecord: true, masterFrom: this.masterFrom, masterTo: this.masterTo, academicCalendarMasterId: this.academicCalendarMasterId });
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select the Dropdowns",
        title: "Danger",
        messageTypeId: PayloadMessageTypes.error
      });
    }

  }

  editModel(obj: any) {

    this.$modal.show('events-add-edit-model', { model: obj, IsNewRecord: false, masterFrom: this.masterFrom, masterTo: this.masterTo });


  }

  deleteModel(obj: any) {
    this.$modal.show('delete-model', { model: obj })

  }

  cancel() {

    this.$modal.hide("events-add-edit-model");
  }
}