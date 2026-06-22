/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { AttendanceAttendanceDetailService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, FeeConcessionDetailService, FeeConcessionService, FeeScholarshipCriteriaService, RegistrationEnrollmentsService, SetupAdmissionTypeService, SetupCampusProgramLinkService, SetupCampusService, SetupProgramDetailsService, SetupSessionService, SetupShiftService, SetupSubCityService } from '../../../../service';
import { DDLGroupModel, DDLModel, IAttendanceApprovalDataExVM, IAttendanceApprovalDataVM, IAttendanceAttendanceDetail, IAttendanceAttendenceMaster, IAttendanceAttendenceStatus, IAttendenceData, ICampusCityVM, ICourseSection, IFeeConcession, IFeeConcessionDetail, IFeeConcessionDetailVM, IFeeScholarshipCriteriaVM, IOperationAttendanceMaster, IRegistrationSectionCourseLinkVM, IScholarshipApplyVM, IScholarshipStudentModel, ISetupAdmissionType, ISetupCampus, ISetupCampusProgramVM, ISetupProgramDetails, ISetupProgramDetailsVM, ISetupSession, ISetupShift, ISetupSubCity, IStudentModel, IStudentToEnrollVM } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import moment from "moment";
import { TreeItem } from '../../../../../../components';
import { SmartAddEdit } from '../add-edit';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SmartAddEdit
    }
})

export class SmartAttendence extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repo= new AttendanceAttendenceMasterService(this.$store);
    private subcityrepo:SetupSubCityService=new SetupSubCityService(this.$store);
    private subcitylist:Array<ISetupSubCity>=[];
    private subCityId='';
    private SmartAttendencelist:Array<SmartAttendence>=[];

    


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []
    private columns = [
        { key: 'cityName', caption: 'City' },
        { key: 'subCityName', caption: 'SubCity Name' },
        { key: 'campusName', caption: 'Campus' }
    ];
    created() {
        this.subcityrepo.GetFindBy('e=>e.StatusId==1').then(r=>{
            this.subcitylist= r as Array<ISetupSubCity>
        })
        // this.loadCampus();
      

    }


    mounted() {

      
    }

    insertModel()
    {

        this.$modal.show('add-edit-model')



    }

    GetSmartAttendenceData()
    {
        this.SmartAttendencelist=[];

        this.repo.GetSmartAttendenceBySubCity(this.subCityId).then(r=>{

            this.SmartAttendencelist= r as Array<SmartAttendence>
        })

    }

}