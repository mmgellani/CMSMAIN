import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';
import { StoreTypes } from '../../../../../../store';



import { IHumanResourceStaff, ITimeTableTimeTableVM, ISetupZone, ISetupCity, ISetupSubCity, ISetupSession, ICampusCityVM, HolidayType, AcademicCalendarVM } from '../../../../models';
import { HumanResourceStaffService, TimeTableTimeTableService, SetupZoneService, SetupCityService, SetupSubCityService, SetupSessionService, SetupCampusService } from '../../../../service';
import { HolidayTypeService } from '../../../../service/AcademicCalendar/holidaytype';
import { HolidayTypeAddEdit } from '../add-edit';
import { DeleteHolidayType } from '../delete';


@Component({
    name: 'holidaytype',
    template: require('./index.html'),
    components:{
        "add-edit":HolidayTypeAddEdit,
        "delete":DeleteHolidayType
    }
})



export class AcademicHolidayType extends Vue {

    service:HolidayTypeService=new HolidayTypeService(this.$store);
    private canAdd=true;
    private canEdit=true;
    private canDelete=true;

    data:Array<HolidayType>=[];
    private columns = [
        // { key: 'campusName', caption: 'Campus' },
        { key: 'name', caption: 'Name' },
        { key: 'description', caption: 'Description' },
        {key: 'isRecursive', caption: 'IsRecursive' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    mounted()
    {
        this.GetHolidayTypeData();

     
    }

    GetHolidayTypeData()
    {
        this.service.GetFindBy('e=>e.StatusId!=2').then(
            r=>{
                this.data= r as Array<HolidayType>
                
                
            }
        )


    }

    insertModel()
    {

        this.$modal.show('holidaytype-add-edit-model',{model: { holidayTypeId: '', name: '', description: '', statusId: 1 },IsNewRecord:true});

    }

    editModel(model:HolidayType)
    {
        
        this.$modal.show('holidaytype-add-edit-model',{model:model ,IsNewRecord:false});

    }

    deleteModel(model:HolidayType)
    {
        this.$modal.show('delete-model', { model: model });


    }




}