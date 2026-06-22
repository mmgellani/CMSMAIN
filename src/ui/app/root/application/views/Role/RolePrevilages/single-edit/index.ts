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

import { IRolePrevilages, ISetupZone, ISetupSession, DDLGroupModel, DDLModel, ICampusCityVM, ISetupCampus, ISetupCampusProgramVM, ISetupProgram, IRoles, IRoleAssignedList } from '../../../../models';
import { RolePrevilagesService, SetupZoneService, SetupSessionService, SetupCampusService, SetupCampusProgramLinkService, SetupProgramService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateRolePrevilages = { model: IRolePrevilages, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateRolePrevilages> = {
    model: {
        roleId: { required }
    }
};
interface IUserRoleAssign {

    id: string;
    name: string;
    status: boolean;
}

interface ModuleList
{
    id:string;
}

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'edit-model',
    template: require('./index.html')
})
export class RolePrevilageEdit extends Vue {
    campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    private repository: RolePrevilagesService;
    private zoneId: string = '';
    private sessionId: string = '';
    private campusProgramId: string = '';
    private campusId: string = '';
    private UserRoleList: Array<IUserRoleAssign> = [];
    private TempUserRoleList: Array<IUserRoleAssign> = [];
    private zoneList: Array<ISetupZone> = [];
    private sessionList: Array<ISetupSession> = [];
    private campusList: Array<ISetupCampus> = [];
    private ProgramList: Array<ISetupProgram> = [];
    private ZoneRepo: SetupZoneService = new SetupZoneService(this.$store);
    private SessionRepo: SetupSessionService = new SetupSessionService(this.$store);
    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
    private ProgramRepo: SetupProgramService = new SetupProgramService(this.$store);
    private RolePrevRepo: RolePrevilagesService =new RolePrevilagesService(this.$store);
    private RoleList:Array<IRoles>=[];
    private Rolename:string='';
    private ModuleTypeList:Array<ModuleList>=[];
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    ListType: string = '';
     
    private data:IRolePrevilages={  userId:0,
        moduleStore: '',
        rolePrevilagesLinkId:''}
   
      private roleId:string=''; moduleType:string='';
      
      
    

    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
         this.repository = new RolePrevilagesService(this.$store);
        // this.ZoneRepo.GetAll().then(
        //     res => {
        //         this.zoneList = res as Array<ISetupZone>
        //     }
        // )
        // this.SessionRepo.GetAll().then(
        //     res => {
        //         this.sessionList = res as Array<ISetupSession>
               
        //     }
        // )
        // this.campusRepo.GetAll().then(
        //     res => {
        //         this.campusList = res as Array<ISetupCampus>
        //     }
        // )
        // this.ProgramRepo.GetAll().then(
        //     res => {
        //         this.ProgramList = res as Array<ISetupProgram>
        //     }
        // )

        // this.RolePrevRepo.GetAllRoles().then(
        //     res => {
        //         this.RoleList = res as Array<IRoles>
                
        //     }
        // )
        //this.loadProgramsOfCampus();

    }

    // GetData() {
    //     if (this.ListType == 'Campus') {
    //         this.UserRoleList = [];
    //         this.campusList.forEach(e => {
    //             var temp: IUserRoleAssign = {
    //                 id: e.campusId,
    //                 name: e.fullName,
    //                 ischeck: false

    //             }
    //             this.UserRoleList.push(temp);
    //         }


    //         )



    //     }
    //     else if (this.ListType == 'Zone') {
    //         this.UserRoleList = [];
    //         this.zoneList.forEach(e => {
    //             var temp: IUserRoleAssign = {
    //                 id: e.zoneId,
    //                 name: e.fullName,
    //                 ischeck: false

    //             }
    //             this.UserRoleList.push(temp);
    //         }

    //         )



    //     }
    //     else if (this.ListType == 'Session') {
    //         this.UserRoleList = [];
    //         this.sessionList.forEach(e => {
    //             var temp: IUserRoleAssign = {
    //                 id: e.sessionId,
    //                 name: e.fullName,
    //                 ischeck: false

    //             }
    //             this.UserRoleList.push(temp);
    //         }

    //         )



    //     }
    //     else if (this.ListType == 'Program') {
    //         this.UserRoleList = [];
    //         this.ProgramList.forEach(e => {
    //             var temp: IUserRoleAssign = {
    //                 id: e.programId,
    //                 name: e.fullName,
    //                 ischeck: false

    //             }
    //             this.UserRoleList.push(temp);
    //         }

    //         )



    //     }



    // }

    beforeModalOpen(event) {
        this.UserRoleList=[]

        this.roleId=event.params.model.roleId ;
        this.moduleType=event.params.model.moduleType ;

        

        var key=this.roleId+'?'+this.moduleType;
        
       
        this.repository.DataOnUpdate(key).then(
            res=>
            {

                this.UserRoleList=res as Array<IUserRoleAssign>
             
                
      
                
            }
        )


    
         this.title = 'Edit Record'; 
         

    }

    beforeModalClose() {
    

    }

   

    cancel() {
        this.$modal.hide('edit-model');
        this.$emit("submit");
    }

    saveModel() {
        // this.ModuleTypeList=[];

        // this.TempUserRoleList=this.UserRoleList.filter(e=>e.status==true)
        // for(var i=0;i<this.TempUserRoleList.length;i++)
        // {
        //     this.ModuleTypeList.push(
        //         {
        //             id:this.TempUserRoleList[i].id
        //         }
        //     )
             
        // }
        
      
        // this.data.roleId=this.roleId;
        // this.data.moduleStore=JSON.stringify(this.ModuleTypeList);
     
        // this.data.moduleType=this.moduleType

       

        
        
        

        // this.repository.Update(this.data)
        //         .then(() => this.$store.dispatch(StoreTypes.updateStatusBar, {
                  
                   
        //             text: 'Record has been Updated successfully',
        //             title: 'Success',
        //             messageTypeId: PayloadMessageTypes.success
        //         }
            
        //     ));

        



       
        // this.cancel();
    }

    $v: Vuelidate<any>;
}