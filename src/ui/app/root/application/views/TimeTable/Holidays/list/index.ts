import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';
import { StoreTypes } from '../../../../../../store';



import { IHumanResourceStaff, ITimeTableTimeTableVM, ISetupZone, ISetupCity, ISetupSubCity, ISetupSession, ICampusCityVM, HolidayType, AcademicCalendarVM } from '../../../../models';
import { HumanResourceStaffService, TimeTableTimeTableService, SetupZoneService, SetupCityService, SetupSubCityService, SetupSessionService, SetupCampusService } from '../../../../service';
import { HolidayTypeService } from '../../../../service/AcademicCalendar/holidaytype';
import { HolidaysAddEdit } from '../add-edit';
import { DeleteHolidays } from '../delete';
import { HolidaysVM, IHolidays } from '../../../../models/academiccalendar/holidays';
import { HolidayService } from '../../../../service/AcademicCalendar/holiday';


@Component({
    name: 'holidaytype',
    template: require('./index.html'),
    components: {
        "add-edit": HolidaysAddEdit,
        "delete": DeleteHolidays
    }
})



export class AcademicHolidays extends Vue {


    data: Array<IHolidays> = [];
    repository: HolidayService = new HolidayService(this.$store);
    repositoryHolidayType: HolidayTypeService = new HolidayTypeService(this.$store);
    title: string = '';
    holidaytypelist: Array<HolidayType> = [];
    holidayTypeId: string = '';
    private columns = [
        // { key: 'campusName', caption: 'Campus' },
        // { key: 'holiday', caption: 'Name' },
        { key: 'description', caption: 'Description' },
        { key: 'dates', caption: 'Date' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() { }

    mounted() {

        this.loadHolidayType();


    }


    loadHolidays() {
        this.repository.GetHolidays(this.holidayTypeId).then(r => {
            this.data = r as Array<IHolidays>
        })
    }

    loadHolidayType() {
        this.holidaytypelist = [];
        this.repositoryHolidayType.GetFindBy('e=>e.StatusId==1').then(r => {
            this.holidaytypelist = r as Array<HolidayType>
            this.holidaytypelist = this.holidaytypelist.filter(e => e.holidayTypeId == 'fc478956-b943-482c-8c0d-8c5d9829cf5e')
        })
    }
    insertModel() {
        if (this.holidayTypeId.length > 0) {
            this.$modal.show('holidays-add-edit-model', { model: { holidayId: '', holidayTypeId: '', description: '', statusId: 1, dates: '' }, IsNewRecord: true, holidayTypeId: this.holidayTypeId });
        } else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdown",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }

    }

    editModel(obj: any) {
        this.$modal.show('holidays-add-edit-model', { model: obj, IsNewRecord: false });
    }

    deleteModel(obj: any) {
        this.$modal.show('delete-model', { model: obj })

    }

    cancel() {

        this.$modal.hide("holidays-add-edit-model");
    }
}