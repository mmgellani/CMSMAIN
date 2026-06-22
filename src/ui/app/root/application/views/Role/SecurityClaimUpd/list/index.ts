/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IRolePrevilages, DDLGroupModel, DDLModel, ICampusCityVM, ISecurityClaimUpd } from '../../../../models';
import {RolePrevilagesService, SetupCampusService, SecurityClaimUpdService } from '../../../../service';
import { SecurityClaimsAddEdit } from '../add-edit';

// import { RolePrevilagesAddEdit } from '../add-edit';
// import { RolePrevilagesDelete } from '../delete';

@Component({
    name: 'User',
    template: require('./index.html'),
    components: {
        'add-edit-model': SecurityClaimsAddEdit
        //'delete-model': RolePrevilagesDelete
    }
})

export class SecurityClaimUpd extends Vue {
    campusCityList:Array<ICampusCityVM>=[];
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SecurityClaimUpdService;
    private data: Array<ISecurityClaimUpd> = [];
    private UserType:string='';
    private filterString: string = '';
    private campusId:string='';
    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [ 
        { key: 'securityClaimId', caption: 'Security Claim' }, 
        { key: 'description', caption: 'Description'  },
        // { key: 'createdOn', caption: 'Created on'},
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SecurityClaimUpdService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('securityclaims' in this.user.claims) == true) {
                if (this.user.claims['securityclaims'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['securityclaims'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['securityclaims'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['securityclaims'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

  
  
    refreshData() {
        this.data = [];
        this.repository.GetAll()
            .then(response => this.data = (response as Array<ISecurityClaimUpd>));
    }

    insertModel () {
        this.$modal.show('add-edit-model', {  IsNewRecord: true });
    }

    editModel (model : ISecurityClaimUpd) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : ISecurityClaimUpd) {
       
        var response = confirm('Are you sure to delete');
        if (response)

        {
            
            this.repository.Delete(model.securityClaimId).then(r=>{
                
            alert("Data Deleted Successfully")
            this.refreshData();
             

            })


        }
    }
}