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

import { ExaminationExamSectionLinkService } from '../../../../service/Examination/ExamSectionLink';
import { IExaminationExamSectionLinkVM } from '../../../../models/Examination/ExamSectionLink';
import { ExaminationFailCriteriaService } from '../../../../service/Examination/FailCriteria';
import { IExaminationFailCriteria, IExaminationFailMasterCriteria, IExaminationFailDetailCriteria } from '../../../../models/Examination/FailCriteria';
import { FailCriteriaAddEdit } from '../add-edit';


@Component({
  name: 'models-form-list',
  template: require('./index.html'),
  components: {
    'FailCriteria-add-edit-model': FailCriteriaAddEdit
  }

})

export class FailCriteria extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: ExaminationFailCriteriaService;
  private data: Array<IExaminationFailMasterCriteria> = [];
  private filterString: string = '';

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;


  private columns = [
    { key: 'fullName', caption: 'FullName' },
    { key: 'fail_In', caption: 'Fail In' },
    { key: 'failMarks', caption: 'Fail Marks' },
    { key: 'absentConsiderFail', caption: 'Absent Consider Fail' },
    { key: 'statusId', caption: 'Status' },
    { key: 'action', caption: 'Action', width: 120 }

  ];

  created() {
    this.repository = new ExaminationFailCriteriaService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.refreshData();
  }


  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("failCriteria" in this.user.claims == true) {
        if (this.user.claims["failCriteria"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["failCriteria"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["failCriteria"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["failCriteria"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }


  refreshData() {
    this.data = [];
    this.repository.GetFailMaster().then(response => {
      this.data = response as Array<IExaminationFailMasterCriteria>;
      
    });
  }

  editModel(item: IExaminationFailMasterCriteria) {
    this.$modal.show('failCriteria-add-edit-model', { IsNewRecord: false,failMaster:item })
  }

  insertModel() {
    this.$modal.show('failCriteria-add-edit-model', { IsNewRecord: true })
  }


}