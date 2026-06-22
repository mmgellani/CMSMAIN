/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { ITimeTableTimeTable, IRegistrationSectionCourseLinkVM, IRegistrationSectionCourseLink, ISetupRoom, IHumanResourceStaff, ITimeTableSlotTimingsVM, ITimeTableTimeTableVM, RegistrationProgramCourseLinkVM, ISetupCampusProgramLinkVM, ISetupCampusProgramLink, ISetupRoomTypeBuildingVM } from '../../../../models';
import { TimeTableTimeTableService, RegistrationSectionCourseLinkService, SetupRoomService, HumanResourceStaffService, TimeTableSlotTimingsService, RegistrationProgramCourseLinkService, SetupCampusProgramLinkService, SetupRoomBuildingLinkService } from '../../../../service';

import * as helper from '../../../../helper';

import { HumanResourceStaffAddEdit } from '../../../HumanResource/Staff/add-edit';
import { SetupRoomAddEdit } from '../../../Setup/Room/add-edit';
import { TimeTableSlotsAddEdit } from '../../Slots/add-edit';
import { ITimeTableTimeTableMerge } from '../../../../models/TimeTable/timetablemerge';
import { IDayOff } from '../../../../models/TimeTable/dayOff';
import { DayOff } from '../list';
import { DayOffService } from '../../../../service/TimeTable/dayOff';
import { formulateSingle } from "../../../../helper";
import { getChartJson } from '../../../../../home/admission-role';

type ValidateDayOff = { model: IDayOff, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateDayOff> = {
    model: {
        // timeTableId: { required },
        fromDate: { required },
        toDate: { required },
        timeTableId: { required },

        // statusId: { required },
        // loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'Staff': HumanResourceStaffAddEdit,
        'Room': SetupRoomAddEdit,
        'Slots': TimeTableSlotsAddEdit
    }
})
export class DayOffAddEdit extends Vue {
    isActive: boolean = true;
    private repoDayOff: DayOffService = new DayOffService(this.$store);
    private repository: TimeTableTimeTableService;

    private timeTableId: string = "";
    private dayOffId: string = "";

    private dayOffserv: DayOffService = new DayOffService(this.$store)
    private TimeTabledata: Array<ITimeTableTimeTableVM> = [];

    // private data: ITimeTableTimeTableMerge = {
    //     timeTableId: [], mergeTimeTableId: '', fromDate: '', toDate: '', fullName: '', statusId: 1
    // };
    // private data: IDayOff = {
    //     dayOffId: '', fromDate: new Date(), statusId: 1, timeTableId: '', toDate: new Date()
    // };
    private IsNewRecord: boolean = true;
    private title: string = '';
    CityId = '';
    private dayOffModel: IDayOff = { dayOffId: '', fromDate: new Date(), statusId: 1, timeTableId: '', toDate: new Date() }
    private fromdateStr = this.dayOffModel.fromDate.getFullYear() + '-' + ("0" + (this.dayOffModel.fromDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.dayOffModel.fromDate.getDate())).slice(-2);
    private todateStr = this.dayOffModel.toDate.getFullYear() + '-' + ("0" + (this.dayOffModel.toDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.dayOffModel.toDate.getDate())).slice(-2);
    created() {
        this.repository = new TimeTableTimeTableService(this.$store);
    }
    // private formatFunction(state) {
    //     var oneItem = this.TimeTabledata.filter(e => e.timeTableId == state.id);

    //     var $state = $(
    //         oneItem ? oneItem.length > 0 ?
    //              oneItem[0].fullName + oneItem[0].sectionName + oneItem[0].staffName + oneItem[0].startTime + oneItem[0].endTime + oneItem[0].dayName  : '' : ''
    //     );
    //     return $state;
    // }
    // options = {
    //     templateResult: this.formatFunction,
    //     templateSelection: this.formatFunction,
    //     data: []
    // };
    // loadTimeTabledata() {
    //     this.TimeTabledata = [];
    //     this.dayOffserv.GetTimeTabledata().then(r => {
    //         this.TimeTabledata = r as Array<ITimeTableTimeTableVM>;


    //         this.TimeTabledata.forEach(element => {
    //             element.name = element.fullName + '--' + element.sectionName + '--' + element.staffName + '--' + element.startTime + '--' + element.endTime + '--' + element.dayName
    //         });
    //         this.options.data = formulateSingle(this.TimeTabledata, "timeTableId", "name");
    //     });
    // }

    // insertClassId() {
    //     if (this.data) {
    //         this.data.timeTableId.push('00000000-0000-0000-0000-000000000000');

    //         if (this.data.timeTableId.length > 1) {
    //             var timeTableId = this.data.timeTableId[0];
    //             var fullName = this.TimeTabledata.find(e => e.timeTableId == timeTableId).fullName;
    //             var temp = [];
    //             Object.assign(temp, this.TimeTabledata.filter(e => e.fullName == fullName));
    //             this.TimeTabledata = [];
    //             Object.assign(this.TimeTabledata, temp);

    //             //this.TimeTabledata = this.TimeTabledata.filter(e => e.fullName == fullName);
    //         }
    //     }
    // }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.TimeTabledata, event.params.modelVM);

        if (this.IsNewRecord == false) {
            Object.assign(this.dayOffModel, event.params.modelVM2);
            this.dayOffModel.fromDate = new Date(this.dayOffModel.fromDate)
            this.dayOffModel.toDate = new Date(this.dayOffModel.toDate)
            this.fromdateStr = this.dayOffModel.fromDate.getFullYear() + '-' + ("0" + (this.dayOffModel.fromDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.dayOffModel.fromDate.getDate())).slice(-2);
            this.todateStr = this.dayOffModel.toDate.getFullYear() + '-' + ("0" + (this.dayOffModel.toDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.dayOffModel.toDate.getDate())).slice(-2);

        }
        if (this.IsNewRecord == true) {
            //   this.data.timeTableId.push('00000000-0000-0000-0000-000000000000');
        }
        // alert(JSON.stringify(this.TimeTabledata));

        // this.loadTimeTabledata();
    }

    cancel() {

        this.dayOffModel = { dayOffId: '', fromDate: new Date(), statusId: 1, timeTableId: '', toDate: new Date() }
        this.$modal.hide('add-edit-model');
        this.$emit("submit");

    }

    saveModel() {
        this.dayOffModel.fromDate = new Date(this.fromdateStr)
        this.dayOffModel.toDate = new Date(this.todateStr)
        if (this.dayOffModel.fromDate > this.dayOffModel.toDate) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'From date cannot be Greater than ToDate',
                title: 'Invalid Date',
                messageTypeId: PayloadMessageTypes.error
            })
        } else {
            if (this.IsNewRecord == true) {
                this.dayOffModel.dayOffId = helper.newGuid();
                this.dayOffModel.statusId = 1;
                this.dayOffModel.fromDate = new Date(this.fromdateStr)
                this.dayOffModel.toDate = new Date(this.todateStr)
                this.repoDayOff.AddOne(this.dayOffModel)
                    .then(r => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Data Entered successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    })
            }
            else {
                if (this.isActive == true) {
                    this.dayOffModel.statusId = 1;
                }

                else {
                    this.dayOffModel.statusId = 0;
                }
                this.dayOffModel.fromDate = new Date(this.fromdateStr)
                this.dayOffModel.toDate = new Date(this.todateStr)
                this.repoDayOff.Update(this.dayOffModel)
                    .then(r => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Data Updated successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    })
            }
        }






    }
    get allowSubmit() {
        return (this.dayOffModel.timeTableId.length > 0)
    }
}

export interface listclass {
    timetableid: string;
}