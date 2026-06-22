import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IHumanResourceStaff, ITimeTableTimeTableVM, ISetupZone, ISetupCity, ISetupSubCity } from '../../../../models';
import { HumanResourceStaffService, TimeTableTimeTableService, SetupZoneService, SetupCityService, SetupSubCityService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'teacher-attendanceRegister',
    template: require('./index.html'),
    // components: {
    //     'Staff-add-edit-model': HumanResourceStaffAddEdit,
    //     'delete-model': HumanResourceStaffDelete
    // }
})

export class AttendanceRegister extends Vue {

}