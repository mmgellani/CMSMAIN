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

import { IRolePrevilages, DDLGroupModel, DDLModel, ICampusCityVM } from '../../../../models';
import {RolePrevilagesService, SetupCampusService } from '../../../../service';

// import { RolePrevilagesAddEdit } from '../add-edit';
// import { RolePrevilagesDelete } from '../delete';

@Component({
    name: 'User',
    template: require('./index.html'),
    // components: {
    //     'add-edit-model': RolePrevilagesAddEdit,
    //     'delete-model': RolePrevilagesDelete
    // }
})

export class UserRecord extends Vue {
    campusCityList:Array<ICampusCityVM>=[];
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: RolePrevilagesService;
    private data: Array<IRolePrevilages> = [];
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
        { key: 'roleId', caption: 'Roll Type' }, 
        { key: 'moduleStore', caption: 'ModuleStore'  },
        { key: 'moduleType', caption: 'ModuleType'},
         { Key: 'action' , caption:'Action', width: 120 }
    ];

    created() {
        this.repository = new RolePrevilagesService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.loadCityCampus();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('UserRecord' in this.user.claims) == true) {
                if (this.user.claims['UserRecord'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['UserRecord'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['UserRecord'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['UserRecord'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM()
            .then(r => {
                this.campusCityList = r as Array<ICampusCityVM>

                oldObj = this.campusCityList[0]
                this.campusCityList.forEach(e => {

                    if (e.cityName == oldObj.cityName) {

                        this.campusddl.push({ id: e.campusId, text: e.campusName })
                    }
                    else {

                        this.cityDDL.push({ title: this.campusCityList[this.campusCityList.indexOf(e) - 1].cityName, group: this.campusddl })
                        this.campusddl = []
                        this.campusddl.push({ id: e.campusId, text: e.campusName })
                    }
                    oldObj = e;
                })
                this.cityDDL.push({ title: oldObj.cityName, group: this.campusddl })
                //  console.log(JSON.stringify(this.programDDL))



            })
    }

  
    refreshData() {
        // this.data = [];
        // this.repository.GetAll()
        //     .then(response => this.data = (response as Array<IRolePrevilages>));
    }

    insertModel () {
        this.$modal.show('add-edit-model', { model: { roleId: '', moduleStore: '', moduleType: ''  }, IsNewRecord: true });
    }

    editModel (model : IRolePrevilages) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : IRolePrevilages) {
        this.$modal.show('delete-model', { model: model });
    }
}