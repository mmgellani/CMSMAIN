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
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'Staff': HumanResourceStaffAddEdit,
        'Room': SetupRoomAddEdit,
        'Slots': TimeTableSlotsAddEdit
    }
})
export class TimeTableTimeTableAddEdit extends Vue {
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

    private data: ITimeTableTimeTable = {
        timeTableId: '', sectionCourseLinkId: '', staffId: '', roomId: '', dayName: '', slotTimingId: '', statusId: 0, loggerId: '', programCourseLinkId: '', isBreak:false
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    CityId='';

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
        this.CityId=event.params.CityId;




        var key = this.session + '?' + this.CampusId + '?' + classid + '?' + programdetailid;





        // this.ProgramCourserepo.GetFindBy('e=>e.ProgramDetailId.ToString()=="' + programdetailid + '" && e.ClassId.ToString()=="' + classid + '" && e.StatusId!=2')
        //     .then(res => {
        //         this.CourseList = res as Array<RegistrationProgramCourseLinkVM>

        //     })

        this.ProgramCourserepo.GetAllFilterData(programdetailid + `?` + classid)
            .then(res => {
                this.CourseList = res as Array<RegistrationProgramCourseLinkVM>

            })


        this.Staffrepo.GetStaff(this.CityId).then(res => {
            this.staffList = res as Array<IHumanResourceStaff>

        });
        // this.Roomrepo.GetFindBy('e=>e.StatusId!=2').then(res => {
        //     this.roomList = res as Array<ISetupRoom>

        // });
        this.SLTrepo.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.SlotTimingList = res as Array<ITimeTableSlotTimingsVM>

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

        });

    }

    addNewRoom() {
        this.$modal.show('Room-add-edit-model', { IsNewRecord: true });

    }
    loadRoom() {
        this.datas=[];
        this.repositoryVM.GetFindBy('e => e.CampusId.ToString() == "' + this.CampusId + '"')
            .then(response => this.datas = (response as Array<ISetupRoomTypeBuildingVM>));
    }

    addNewSlots() {
        this.$modal.show('Slots-add-edit-model', { IsNewRecord: true });

    }
    loadSlots() {
        this.SLTrepo.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.SlotTimingList = res as Array<ITimeTableSlotTimingsVM>

        });

    }

    cancel() {
        this.data= {
            timeTableId: '', sectionCourseLinkId: '', staffId: '', roomId: '', dayName: '', slotTimingId: '', statusId: 0, loggerId: '', programCourseLinkId: '', isBreak:false
        };
        this.$modal.hide('add-edit-model');
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

        if (this.IsNewRecord) {
            this.data.loggerId = helper.newGuid();
            this.data.timeTableId = helper.newGuid();
            this.data.statusId = 1;

            var campusProgramId = this.CampusProgramList.find(e =>e.sessionId == this.session && e.campusId == this.CampusId && e.programDetailId == this.programdetailID).campusProgramId

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
                        var key = this.data.roomId + '?' + this.data.slotTimingId + '?' + this.data.dayName + '?' + this.sectionID + '?' + this.data.staffId +  '?' + this.session + '?' + this.CampusId;

                        // alert(key)
                        this.repository.CheckClash(key).then(
                            res => {

                                this.dataList = res 
                                console.log(this.dataList[0].providedString)

                                // alert(JSON.stringify(this.dataList[0].val))




                                if (this.dataList[0].providedString.length == 0) {
                                    this.repository.AddOne(this.data)
                                        .then(() => {
                                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                text: 'Record has been inserted successfully',
                                                title: 'Success',
                                                messageTypeId: PayloadMessageTypes.success
                                            })
                                            this.cancel();
                                        });
                                    this.cancel();
                                }
                                else if (this.dataList[0].providedString.length > 0) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text:this.dataList[0].providedString ,
                                        title: 'Danger',
                                        messageTypeId: PayloadMessageTypes.error
                                    })


                                }
                            }






                        );


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



            var campusProgramId = this.CampusProgramList.find( e =>e.sessionId==this.session && e.campusId == this.CampusId && e.programDetailId == this.programdetailID).campusProgramId

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
                        var key = this.data.roomId + '?' + this.data.slotTimingId + '?' + this.data.dayName + '?' + this.sectionID + '?' + this.data.staffId +  '?' + this.session + '?' + this.CampusId;

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
    get allowSubmit() {
        return (this.data.dayName.length > 0) && (this.data.roomId.length > 0) && (this.data.staffId.length > 0) && (this.data.programCourseLinkId.length > 0) && (this.data.slotTimingId.length > 0);
    }
    $v: Vuelidate<any>;
}