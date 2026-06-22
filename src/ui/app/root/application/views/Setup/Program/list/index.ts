/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { ISetupProgram, IAdmissionAdmissionForm, IFeeConcessionVM } from '../../../../models';
import { SetupProgramService, AdmissionAdmissionFormService, FeeConcessionService } from '../../../../service';

import { SetupProgramAddEdit } from '../add-edit';
import { SetupProgramDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Program-add-edit-model': SetupProgramAddEdit,
        'delete-model': SetupProgramDelete
    }
})

export class SetupProgramList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupProgramService;
    private data: Array<ISetupProgram> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private AdmissionFormModel: Array<IAdmissionAdmissionForm> = [];
    private repoadform: AdmissionAdmissionFormService;
    private concessionModel: Array<IFeeConcessionVM> = [];
    private repoconcession: FeeConcessionService;

    private columns = [ 
        { key: 'fullName', caption: 'FullName' }, 
        { key: 'description', caption: "Description" },
        { key: 'code', caption: "Code" },
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupProgramService(this.$store);
        this.repoadform  = new AdmissionAdmissionFormService (this.$store);
        this.repoconcession = new FeeConcessionService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getadmissionform();
        this.getconcession();
    }
    getconcession() {
        this.concessionModel = [];
        this.repoconcession.GetFindBy('e => e.StatusId!=2')
            .then(response => this.concessionModel = (response as Array<IFeeConcessionVM>));
    }


    getadmissionform() {
        this.AdmissionFormModel = [];
        this.repoadform.GetFindBy('e => e.StatusId!=2')
            .then(response => this.AdmissionFormModel = (response as Array<IAdmissionAdmissionForm>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupProgram' in this.user.claims) == true) {
                if (this.user.claims['setupProgram'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupProgram'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupProgram'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupProgram'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('e => e.StatusId!=2')
            .then(response => this.data = (response as Array<ISetupProgram>));
    }

    insertModel () {
        this.$modal.show('Program-add-edit-model', { model: { programId: '', fullName: '', description: '', code: '', statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : ISetupProgram) {
        this.$modal.show('Program-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : ISetupProgram) {
        if(this.AdmissionFormModel.filter(e => e.campusProgramId == model.programId).length > 0)  {

            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
              });
        }

      else if(this.concessionModel.filter(e => e.programId == model.programId).length > 0)  {

            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
              });
        }
        else {
        this.$modal.show('delete-model', { model: model });
    }
}
}