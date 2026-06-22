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

import { IExaminationGradingPolicy, ISetupCampus, ISetupSession, ISetupCampusProgramVM, DDLGroupModel, DDLModel, ICampusCityVM, ISetupClass, ISetupSection, IRegistrationSectionCourseLinkVM } from '../../../../models';
import { ExaminationGradingPolicyService, SetupCampusProgramLinkService, SetupCampusService, SetupSessionService, SetupClassService, SetupSectionService, RegistrationSectionCourseLinkService } from '../../../../service';

import { ExaminationGradingPolicyBulkAddEdit } from '../add-edit';
import { ExaminationGradingPolicyBulkDelete } from '../delete';
import { IExaminationGradingMaster } from '../../../../models/Examination/GradingCriteria';
import { ExaminationGradingMasterService } from '../../../../service/Examination/GradingMaster';

@Component({
  name: 'models-form-list',
  template: require('./index.html'),
  components: {
    'add-edit-model': ExaminationGradingPolicyBulkAddEdit,
    'delete-model': ExaminationGradingPolicyBulkDelete
  }
})

export class ExaminationGradingPolicyBulkList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: ExaminationGradingMasterService;
  private data: Array<IExaminationGradingMaster> = [];
  private filterString: string = '';
 
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  private columns = [
    { key: 'name', caption: 'FullName' },
    { key: 'statusId', caption: 'Status' },
    { key: 'action', caption: 'Action', width: 120 }
  ];

  created() {
    this.repository = new ExaminationGradingMasterService(this.$store);
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
      if (('gradingPolicyBulk' in this.user.claims) == true) {
        if (this.user.claims['gradingPolicyBulk'].indexOf('R') >= 0) {
          this.canRead = true;
        }
        if (this.user.claims['gradingPolicyBulk'].indexOf('C') >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims['gradingPolicyBulk'].indexOf('U') >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims['gradingPolicyBulk'].indexOf('D') >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push('Home');
      }
    }
  }
  refreshData() {
    this.data = [];{
      this.repository.GetFindBY('e=>e.StatusId!=2')
        .then(response => this.data = (response as Array<IExaminationGradingMaster>));

    }
  }

  insertModel() {
    this.$modal.show('add-edit-model', { model: { gradingMasterId: '', name: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
  }

  editModel(model: IExaminationGradingMaster) {
    this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
  }

  deleteModel(model: IExaminationGradingMaster) {
    this.$modal.show('delete-model', { model: model });
  }
}