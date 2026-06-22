import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";
import { required, maxLength } from "vuelidate/lib/validators";

import {
  IHumanResourceStaff,
  ITimeTableTimeTableVM,
  ISetupZone,
  ISetupCity,
  ISetupSubCity,
  ISetupSession,
  ICampusCityVM,
  HolidayType,
  AcademicCalendarVM,
  IELTopics,
  IBoards,
  ProgramCourseList,
  IELChapters,
  IAcademicCalendarMaster,
} from "../../../../models";
import {
  HumanResourceStaffService,
  TimeTableTimeTableService,
  SetupZoneService,
  SetupCityService,
  SetupSubCityService,
  SetupSessionService,
  SetupCampusService,
  AcademicCalendarService,
  ELTopicsService,
  BoardsService,
  AcademicCalendarTypeService,
  AdmissionStudentsService,
  ELChaptersService,
  AcademicCalendarMasterService,
} from "../../../../service";
import { StoreTypes } from "../../../../../../store";

import { Calendar } from "@toast-ui/vue-calendar";
import { HolidayTypeService } from "../../../../service/AcademicCalendar/holidaytype";
import * as helper from "../../../../helper";
import moment from "moment";
import {
  IAcademicCalendar,
  IAcademicCalendarView,
} from "../../../../models/academiccalendar/academicCalendar";
import { IAcademicCalendarType } from "../../../../models/academiccalendar/academicCalendarType";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { validationMixin, ValidationRuleset } from "vuelidate";
type ValidateCalendarMaster = {
  academicCalendarMasterModel: IAcademicCalendarMaster;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateCalendarMaster> = {
  academicCalendarMasterModel: {
    fullName: { required },
  },
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "teacher-timetable",
  template: require("./index.html"),
})
export class CalendarPopup extends Vue {
  IsNewRecord = true;

  campusid: string = "";
  sessionid: string = "";
  start: any;
  end: any;
  todatestring = new Date();
  fromdatestring = new Date();
  isActive = true;
  boardList: IBoards[] = [];
  boardRepo: BoardsService = new BoardsService(this.$store);
  acadmiccalendarepo: AcademicCalendarMasterService = new AcademicCalendarMasterService(
    this.$store
  );
  calendarviewList: Array<IAcademicCalendarMaster> = [];

  academicCalendarMasterModel: IAcademicCalendarMaster = {
    academicCalendarMasterId: "",
    sessionId: "",
    subCityId: "",
    classId: "",
    boardId: "",
    fullName: "",
    fromDate: new Date(),
    toDate: new Date(),
    weeks: 1,
    statusId: 1,
    isApproved: null,
  };
  classId: any = "";
  repoAcademicCalendar: AcademicCalendarMasterService = new AcademicCalendarMasterService(
    this.$store
  );

  beforeModalOpen(event) {
    this.IsNewRecord = event.params.IsNewRecord;
    Object.assign(this.academicCalendarMasterModel, event.params.model);
    this.GetAcadmicCaldenview()
    if (this.academicCalendarMasterModel.statusId == 1) {
      this.isActive = true;
    } else if (this.academicCalendarMasterModel.statusId == 0) {
      this.isActive = false;
    }

    if (this.IsNewRecord == false) {
      this.fromdatestring = new Date(
        moment(this.academicCalendarMasterModel.fromDate).format("YYYY-MM-DD")
      );
      this.todatestring = new Date(
        moment(this.academicCalendarMasterModel.toDate).format("YYYY-MM-DD")
      );
    }
  }
  GetAcadmicCaldenview() {
    this.calendarviewList = []; 
    this.acadmiccalendarepo
      .GetAcadmicCaldenview( this.academicCalendarMasterModel.sessionId +
          '?' +
          this.academicCalendarMasterModel.subCityId +
          '?' +
          this.academicCalendarMasterModel.classId +
          '?' +
          this.academicCalendarMasterModel.boardId
      )
      .then((r) => {
        this.calendarviewList = r as Array<IAcademicCalendarMaster>;
      });
  }
  mounted() {}

  cancel() {
    this.academicCalendarMasterModel = {
      academicCalendarMasterId: "",
      sessionId: "",
      subCityId: "",
      classId: "",
      boardId: "",
      fullName: "",
      fromDate: new Date(),
      toDate: new Date(),
      weeks: 1,
      isApproved: null,
      statusId: 1,
    };
    // this.holidaytypeid = '';
    this.$modal.hide("cal-add-edit-model");
    this.$emit("submit");
  }

  save() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      this.academicCalendarMasterModel.fromDate = new Date(
        moment(this.fromdatestring.toDateString()).format("YYYY-MM-DD")
      );
      this.academicCalendarMasterModel.toDate = new Date(
        moment(this.todatestring.toDateString()).format("YYYY-MM-DD")
      );

      if (this.IsNewRecord == true) {
        this.academicCalendarMasterModel.academicCalendarMasterId = helper.newGuid();
        if (
          this.calendarviewList.find(
            (e) => e.fullName == this.academicCalendarMasterModel.fullName
          )
        ) {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record already exist",
            title: "Error",
            messageTypeId: PayloadMessageTypes.error,
          });
        } else {
          this.repoAcademicCalendar
            .AddOne(this.academicCalendarMasterModel)
            .then((r) => {
              this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Academic Calendar Inserted SuccessFully",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success,
              });

              this.cancel();
            });
        }
      } else {
        if (this.isActive == true) {
          this.academicCalendarMasterModel.statusId = 1;
        } else {
          this.academicCalendarMasterModel.statusId = 0;
        }

        this.repoAcademicCalendar
          .Update(this.academicCalendarMasterModel)
          .then((r) => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "Academic Calendar Updated SuccessFully",
              title: "Success",
              messageTypeId: PayloadMessageTypes.success,
            });

            this.cancel();
          });
      }
    }
  }
  $v: any;
}
