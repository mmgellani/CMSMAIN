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

import { ITimeTableTimeTable, IRegistrationSectionCourseLinkVM, IRegistrationSectionCourseLink, ISetupRoom, IHumanResourceStaff, ITimeTableSlotTimingsVM, ITimeTableTimeTableVM, RegistrationProgramCourseLinkVM, ISetupCampusProgramLinkVM, ISetupCampusProgramLink, ISetupRoomTypeBuildingVM, dayofweek, ITimeTableVWSlotTimings, ITimeTableSlotTimings } from '../../../../models';
import { TimeTableTimeTableService, RegistrationSectionCourseLinkService, SetupRoomService, HumanResourceStaffService, TimeTableSlotTimingsService, RegistrationProgramCourseLinkService, SetupCampusProgramLinkService, SetupRoomBuildingLinkService } from '../../../../service';

import * as helper from '../../../../helper';

import { HumanResourceStaffAddEdit } from '../../../HumanResource/Staff/add-edit';
import { SetupRoomAddEdit } from '../../../Setup/Room/add-edit';
import { TimeTableSlotsAddEdit } from '../../Slots/add-edit';

type ValidateTimeTableTimeTable = { model: ITimeTableTimeTable, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateTimeTableTimeTable> = {
    model: {
        // timeTableId: { required },
        sectionCourseLinkId: { required },
        staffId: { required },
        roomId: { required },
        dayName: { required },
        slotTimingId: { required },
        // statusId: { required },
        // loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model-bulk',
    template: require('./index.html'),
    components: {
        'Staff': HumanResourceStaffAddEdit,
        'Room': SetupRoomAddEdit,
        'Slots': TimeTableSlotsAddEdit
    }
})
export class TimeTableTimeTableBulkAddEdit extends Vue {
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
    private programdetailID: string = '';
    private classID: string = '';
    private datas: Array<ISetupRoomTypeBuildingVM> = [];
    private dataTimetable: Array<ITimeTableTimeTable> = [];
    private showslotss: boolean = false;


    private ProgramCourserepo: RegistrationProgramCourseLinkService;
    private CourseList: Array<RegistrationProgramCourseLinkVM> = [];
    private SectionCourserepository: RegistrationSectionCourseLinkService;
    private CampusProgramRepository: SetupCampusProgramLinkService;
    private CampusProgramList: Array<ISetupCampusProgramLink> = [];


    sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];
    sectionCourseLinkCheck: Array<IRegistrationSectionCourseLinkVM> = [];
    staffList: Array<IHumanResourceStaff> = [];
    roomList: Array<ISetupRoom> = [];
    SlotTimingList: Array<ITimeTableSlotTimings> = [];
    private repositoryVM: SetupRoomBuildingLinkService;

    private data: ITimeTableTimeTable = {
        timeTableId: '', sectionCourseLinkId: '', staffId: '', roomId: '', dayName: '', slotTimingId: '', statusId: 0, loggerId: '', programCourseLinkId: '', isBreak: false
    };

    private weekDay: Array<dayofweek> = []

    private IsNewRecord: boolean = true;
    private title: string = '';
    private week: any = [];
    CityId = '';

    created() {
        this.repository = new TimeTableTimeTableService(this.$store);
        this.ProgramCourserepo = new RegistrationProgramCourseLinkService(this.$store);
        this.SCrepo = new RegistrationSectionCourseLinkService(this.$store);
        this.Roomrepo = new SetupRoomService(this.$store);
        this.Staffrepo = new HumanResourceStaffService(this.$store);
        this.SLTrepo = new TimeTableSlotTimingsService(this.$store);
        this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
        this.CampusProgramRepository = new SetupCampusProgramLinkService(this.$store);
        this.repositoryVM = new SetupRoomBuildingLinkService(this.$store);

    }
    staffMember(option) {
        return '<strong>' + option.fullName + '</strong>' + ' <i>' + option.email + '</i>'
    }
    roomCampus(option) {
        return '<strong>' + option.fullName + '</strong>' + ' <i>' + option.buildingName + '</i>'
    }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        var classid = event.params.ClassID;
        this.classID = classid;
        this.CampusId = event.params.CampusId;
        this.session = event.params.SessionID;
        var programdetailid = event.params.ProgramDetailID;
        this.programdetailID = programdetailid;
        this.sectionID = event.params.SectionId;
        this.CityId = event.params.CityId;

        this.week = [{ dayname: 'Monday' }, { dayname: 'Tuesday' }, { dayname: 'Wednesday' }, { dayname: 'Thursday' }, { dayname: 'Friday' }, { dayname: 'Saturday' }, { dayname: 'Sunday' }];
        this.weekDay = [];
        for (var i = 0; i < this.week.length; i++) {
            this.weekDay.push({
                dayId: i,
                dayName: this.week[i].dayname,
                isChecked: false,
                slotId: ''
            });
        }

        var key = this.session + '?' + this.CampusId + '?' + classid + '?' + programdetailid;

        this.ProgramCourserepo.GetAllFilterData(programdetailid + `?` + classid)
            .then(res => {
                this.CourseList = res as Array<RegistrationProgramCourseLinkVM>

            })


        this.Staffrepo.GetStaff(this.CityId).then(res => {
            this.staffList = res as Array<IHumanResourceStaff>
            this.staffList.forEach(element => {
                element.fullName=element.fullName+'-'+element.email
    
                    
                });

        });

        this.SLTrepo.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.SlotTimingList = res as Array<ITimeTableSlotTimings>
            
            this.SlotTimingList.forEach(element => {
                element.startTime = element.startTime + '-' + element.endTime
            });

        });

        this.CampusProgramRepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.CampusProgramList = res as Array<ISetupCampusProgramLink>

        });

        this.SectionCourserepository.GetAll().then(res => {
            this.sectionCourseLinkList = res as Array<IRegistrationSectionCourseLinkVM>
        });
        this.loadRoom();
    }



    addNewStaff() {
        this.$modal.show('Staff-add-edit-model', { IsNewRecord: true });

    }
    loadStaff() {
        this.Staffrepo.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.staffList = res as Array<IHumanResourceStaff>
            this.staffList.forEach(element => {
            element.fullName=element.fullName+'-'+element.email

                
            });

        });

    }

    showslot(option: any) {


        var e = <HTMLInputElement>document.getElementById(option);

        if (e.checked == true) {

            this.showslotss = true
        }

        else if (e.checked == false) {
            this.showslotss = false

        }
    }
    addNewRoom() {
        this.$modal.show('Room-add-edit-model', { IsNewRecord: true });

    }
    loadRoom() {
        this.datas = [];
        this.repositoryVM.GetFindBy('e => e.CampusId.ToString() == "' + this.CampusId + '"')
            .then(response => {
                this.datas = (response as Array<ISetupRoomTypeBuildingVM>)
                this.datas.forEach(element => {
                    element.fullName = element.fullName + ' - ' + element.buildingName + ' - ' + element.campusName
                });

            });



        // this.Staffrepo.GetFindBy('e=>e.StatusId!=2').then(res => {
        //     this.SlotTimingList = res as Array<ITimeTableSlotTimingsVM>

        //     this.SlotTimingList.forEach(element => {
        //         element.startTime = element.startTime + '-' + element.endTime
        //     });

        // });


    }

    addNewSlots() {
        this.$modal.show('Slots-add-edit-model', { IsNewRecord: true });

    }
    loadSlots() {
        this.SLTrepo.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.SlotTimingList = res as Array<ITimeTableSlotTimings>
            this.SlotTimingList.forEach(element => {
                element.startTime = element.startTime + '-' + element.endTime
            });

        });

    }

    cancel() {
        this.$modal.hide('add-edit-modelBulk');
        this.$emit("submit");
    }

    // CheckClash()
    // {

    //     var sectionid=this.sectionCourseLinkList.find(e=>e.sectionCourseLinkId==this.data.sectionCourseLinkId).sectionId
    //     var key=this.data.roomId+'?'+this.data.slotTimingId+'?'+this.data.dayName+'?'+sectionid+'?'+this.session;
    //     //alert(key);
    //     this.repository.CheckClash(key).then(
    //         res=>{

    //             this.dataList=res as Array<ITimeTableTimeTableVM>



    //             if(this.dataList.length>0)
    //             {
    //                 this.ClashExist=true;
    //             }
    //             else if(this.dataList.length<1)
    //             {
    //                 this.ClashExist=false;
    //             }
    //         }


    //     //.then(response => this.dataList = (response as Array<ITimeTableTimeTableVM>)



    // );



    // }

    saveModel() {

       

        this.dataTimetable = [];


        if (this.IsNewRecord) {



            var campusProgramId = this.CampusProgramList.find(e => e.sessionId == this.session && e.campusId == this.CampusId && e.programDetailId == this.programdetailID).campusProgramId

            this.SectionCourserepository.GetAllFilterData(campusProgramId + `?` + this.classID + `?` + this.sectionID)
                .then(response => {
                    this.sectionCourseLinkCheck = response as Array<IRegistrationSectionCourseLinkVM>
                    if (this.sectionCourseLinkCheck.length == 0) {

                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'No Record in SectionCourselink',
                            title: 'Error',
                            messageTypeId: PayloadMessageTypes.error
                        })

                    }

                    else {
                        this.weekDay = this.weekDay.filter(
                            s => s.isChecked == true
                        );

                        var sectionCourseLinkId = this.sectionCourseLinkCheck[0].sectionCourseLinkId;
                        this.data.sectionCourseLinkId = sectionCourseLinkId;

                        this.weekDay.forEach(e => {
                            var key = this.data.roomId + '?' + e.slotId + '?' + e.dayName + '?' + this.sectionID + '?' + this.data.staffId + '?' + this.session + '?' + this.CampusId;
                            this.dataList = [];
                            this.repository.CheckClash(key).then(
                                res => {

                                    this.dataList = res
                                    console.log(this.dataList[0].providedString)
                                    if (this.dataList[0].providedString.length == 0) {
                                        this.dataTimetable.push({
                                            timeTableId: helper.newGuid(),
                                            sectionCourseLinkId: this.data.sectionCourseLinkId,
                                            staffId: this.data.staffId,
                                            roomId: this.data.roomId,
                                            dayName: e.dayName,
                                            slotTimingId: e.slotId,
                                            statusId: 1,
                                            loggerId: helper.newGuid(),
                                            programCourseLinkId: this.data.programCourseLinkId,
                                            isBreak: this.data.isBreak

                                        });
                                    }
                                    else if (this.dataList[0].providedString.length > 0) {
                                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                                            text: this.dataList[0].providedString,
                                            title: 'Danger',
                                            messageTypeId: PayloadMessageTypes.error
                                        })


                                    }

                                    if (this.dataTimetable.length == this.weekDay.length) {

                                        this.repository.AddMany(this.dataTimetable).then(() => {
                                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                text: "Record has been inserted successfully",
                                                title: "Success",
                                                messageTypeId: PayloadMessageTypes.success
                                            })
                                            this.cancel();
                                        });
                                    }

                                }
                            );

                        }

                        )
                    }

                }
                );
        } else {
            if (this.isActive == true) {
                this.data.statusId = 1;
            }

            else {
                this.data.statusId = 0;
            }



            var campusProgramId = this.CampusProgramList.find(e => e.campusId == this.CampusId && e.programDetailId == this.programdetailID).campusProgramId

            this.SectionCourserepository.GetAllFilterData(campusProgramId + `?` + this.classID + `?` + this.sectionID)
                .then(response => {
                    this.sectionCourseLinkCheck = response as Array<IRegistrationSectionCourseLinkVM>
                    if (this.sectionCourseLinkCheck.length == 0) {

                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'No Record in SectionCourselink',
                            title: 'Error',
                            messageTypeId: PayloadMessageTypes.error
                        })

                    }

                    else {
                        // var sectionCourseLinkId = this.sectionCourseLinkList.find(z => z.campusProgramId == campusProgramId && z.classId == this.classID && z.sectionId == this.sectionID).sectionCourseLinkId

                        var sectionCourseLinkId = this.sectionCourseLinkCheck[0].sectionCourseLinkId;
                        this.data.sectionCourseLinkId = sectionCourseLinkId;
                        var key = this.data.roomId + '?' + this.data.slotTimingId + '?' + this.data.dayName + '?' + this.sectionID + '?' + this.data.staffId + '?' + this.session + '?' + this.CampusId;

                        // this.repository.CheckClash(key).then(
                        //     res => {

                        //         this.dataList = res 





                        //         if (this.dataList[0].val == 0) {


                        this.repository.Update(this.data)
                            .then(() => {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: 'Record has been updated successfully',
                                    title: 'Success',
                                    messageTypeId: PayloadMessageTypes.success
                                })
                                this.cancel();
                            });
                        this.cancel();
                        //         }


                        //     else if (this.dataList[0].val > 0) {
                        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
                        //         text: 'Clash Occured',
                        //         title: 'Danger',
                        //         messageTypeId: PayloadMessageTypes.error
                        //     })


                        // }
                        // });




                    }
                });


        }
    }
    allowsubmit()
    {
        return this.data.staffId.length>0 && this.data.programCourseLinkId.length>0 
        && this.data.roomId.length>0 



    }
    $v: Vuelidate<any>;
}