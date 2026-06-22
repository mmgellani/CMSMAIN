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
import { PayloadMessageTypes, IUser } from '../../../../../../model';

import { ITimeTableTimeTable, IRegistrationSectionCourseLinkVM, IRegistrationSectionCourseLink, ISetupRoom, IHumanResourceStaff, ITimeTableSlotTimingsVM, ITimeTableTimeTableVM, RegistrationProgramCourseLinkVM, ISetupCampusProgramLinkVM, ISetupCampusProgramLink, ISetupRoomTypeBuildingVM } from '../../../../models';
import { TimeTableTimeTableService, RegistrationSectionCourseLinkService, SetupRoomService, HumanResourceStaffService, TimeTableSlotTimingsService, RegistrationProgramCourseLinkService, SetupCampusProgramLinkService, SetupRoomBuildingLinkService } from '../../../../service';

import * as helper from '../../../../helper';

import { HumanResourceStaffAddEdit } from '../../../HumanResource/Staff/add-edit';
import { SetupRoomAddEdit } from '../../../Setup/Room/add-edit';
import { TimeTableSlotsAddEdit } from '../../Slots/add-edit';
import { ITimeTableTimeTableMerge, ITimeTableVWTimeTableMerge } from '../../../../models/TimeTable/timetablemerge';
import moment from 'moment';
import { State } from 'vuex-class';
import { IRootStoreState } from '../../../../../store';

type ValidateTimeTableTimeTable = { data: ITimeTableTimeTableMerge, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateTimeTableTimeTable> = {
    data: {
        fullName: { required },
        fromDate: { required },
        toDate: { required }
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
export class TimeTableTimeTableAddEdit extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    isActive: boolean = true;
    private repository: TimeTableTimeTableService;
    private SCrepo: RegistrationSectionCourseLinkService;
    private Roomrepo: SetupRoomService;
    private Staffrepo: HumanResourceStaffService;
    private SLTrepo: TimeTableSlotTimingsService;
    // private dataList: Array<ITimeTableTimeTableVM> = [];
    private dataList: any = [];
    private ClashExist: boolean = false;
    private CampusId: string = '';
    private session: string = '';
    private sectionID: string = '';
    private campusProgramID: string = '';
    private idslist: Array<listclass> = [];
    private FromDate = new Date();
    private programdetailID: string = '';
    private classID: string = '';
    private datas: Array<ISetupRoomTypeBuildingVM> = [];


    private ProgramCourserepo: RegistrationProgramCourseLinkService;
    private CourseList: Array<RegistrationProgramCourseLinkVM> = [];
    private SectionCourserepository: RegistrationSectionCourseLinkService;
    private CampusProgramRepository: SetupCampusProgramLinkService;
    private CampusProgramList: Array<ISetupCampusProgramLink> = [];
    //private SubCityId:string='';

    sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];
    sectionCourseLinkCheck: Array<IRegistrationSectionCourseLinkVM> = [];
    staffList: Array<IHumanResourceStaff> = [];
    roomList: Array<ISetupRoom> = [];
    SlotTimingList: Array<ITimeTableSlotTimingsVM> = [];
    private repositoryVM: SetupRoomBuildingLinkService;
    private TimeTabledata: Array<ITimeTableVWTimeTableMerge> = [];

    private data: ITimeTableTimeTableMerge = {
        timeTableId: [], mergeTimeTableId: '', fromDate: '', toDate: '', fullName: '', statusId: 1
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    CityId = '';

    created() {
        this.repository = new TimeTableTimeTableService(this.$store);
    }

    insertClassId() {
        if (this.data) {
            this.data.timeTableId.push('00000000-0000-0000-0000-000000000000');

            if (this.data.timeTableId.length > 1) {
                var timeTableId = this.data.timeTableId[0];
                var fullName = this.TimeTabledata.find(e => e.timeTableId == timeTableId).fullName;
                var temp = [];
                Object.assign(temp, this.TimeTabledata.filter(e => e.fullName == fullName));
                this.TimeTabledata = [];
                Object.assign(this.TimeTabledata, temp);

                //this.TimeTabledata = this.TimeTabledata.filter(e => e.fullName == fullName);
            }
        }
    }

    beforeModalOpen(event) {

        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        this.session = event.params.SESSIONID;
        this.classID = event.params.CLASSID;
        var key =
            this.session +
            // "?" +
            // this.campusid +

            "?" +
            this.classID +
            "?" + this.user.userId;

        this.repository.GetTimeTableMerge(key).then(r => {
            this.TimeTabledata = r as Array<ITimeTableVWTimeTableMerge>
        })

        Object.assign(this.TimeTabledata, event.params.modelVM);


        if (this.IsNewRecord == false) {



            this.data.mergeTimeTableId = event.params.modelVM2.mergeTimeTableId;
            this.data.fullName = event.params.modelVM2.fullName;
            this.data.fromDate = event.params.modelVM2.fromDate;
            this.data.toDate = event.params.modelVM2.toDate;
            this.data.timeTableId = event.params.modelVM2.timeTableId;


            if (this.data.timeTableId.length > 1) {
                var timeTableId = this.data.timeTableId[0];
                var fullName = this.TimeTabledata.find(e => e.timeTableId == timeTableId).fullName;
                var temp = [];
                Object.assign(temp, this.TimeTabledata.filter(e => e.fullName == fullName));
                this.TimeTabledata = [];
                Object.assign(this.TimeTabledata, temp);

                //this.TimeTabledata = this.TimeTabledata.filter(e => e.fullName == fullName);
            }
        }
        if (this.data && this.IsNewRecord == true) {
            this.data.timeTableId.push('00000000-0000-0000-0000-000000000000');
        }


    }

    cancel() {
        this.data = {
            timeTableId: [], mergeTimeTableId: '', fromDate: '', toDate: '', fullName: '', statusId: 1
        };

        this.$modal.hide('add-edit-model');
    }

    saveModel() {
        debugger;
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.data.timeTableId.length > 1) {
                this.idslist = [];
                this.data.fromDate = moment(this.data.fromDate).format('YYYY-MM-DD')
                this.data.toDate = moment(this.data.toDate).format('YYYY-MM-DD')
                if (this.IsNewRecord == true) {


                    var z = JSON.stringify(this.data) + '?' + '0';
                }
                else {

                    var z = JSON.stringify(this.data) + '?' + '1';
                }


                this.repository.InsertMergeTimeTable(z).then(r => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Merge Time Table has been inserted successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                    this.cancel();


                })
            }
            else{
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Please Select TimeTable For Merge',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.warning
                })

            }
        }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}

export interface listclass {
    timetableid: string;
}