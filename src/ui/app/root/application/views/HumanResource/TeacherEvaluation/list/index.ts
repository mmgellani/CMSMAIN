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

import { ExaminationExamSectionLinkService } from '../../../../service/Examination/ExamSectionLink';
import { IExaminationExamSectionLinkVM } from '../../../../models/Examination/ExamSectionLink';
import { ExaminationFailCriteriaService } from '../../../../service/Examination/FailCriteria';
import { IExaminationFailCriteria, IExaminationFailMasterCriteria, IExaminationFailDetailCriteria } from '../../../../models/Examination/FailCriteria';
import { FailCriteriaAddEdit } from '../add-edit';
import { HumanResourceStaffService } from '../../../../service';
import { IHumanResourceEvaluationMaster, SurveyDetailVM } from '../../../../models';
import { StoreTypes } from '../../../../../../store';
import { SurveyDashboardDetailService } from '../../../../service/DashBoard/dashboardsurveydetail';
import { PreviewClass } from '../preview';
import { SendNotificationAddEdit } from '../sendnotification';


@Component({
  name: 'models-form-list',
  template: require('./index.html'),
  components: {
    'FailCriteria-add-edit-model': FailCriteriaAddEdit,
    'preview': PreviewClass,
    'sendnotification-add-edit-model':SendNotificationAddEdit
  }

})

export class TeacherEvaulation extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: SurveyDashboardDetailService;
  private data: Array<SurveyDetailVM> = [];
  private filterString: string = '';

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;


  private columns = [
    { key: 'surveyMaster', caption: "Master" },
    { key: 'surveyDescription', caption: "Description" },
    { key: 'question', caption: 'Question' },
    { key: 'statusId', caption: 'Status' },
    { key: 'action', caption: 'Action', width: 120 }

  ];

  created() {
    this.repository = new SurveyDashboardDetailService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.refreshData();


  }


  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("teacherEvaluation" in this.user.claims == true) {
        if (this.user.claims["teacherEvaluation"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["teacherEvaluation"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["teacherEvaluation"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["teacherEvaluation"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }


  refreshData() {
    this.data = [];
    this.repository.GetAllSurveyDetail().then(response => {
      this.data = response as Array<SurveyDetailVM>;

    });
  }

  editModel(item: SurveyDetailVM) {
    console.log(JSON.stringify(item))
    this.$modal.show('failCriteria-add-edit-model', { IsNewRecord: false, EvaluationMaster: item })
  }

  previewModel(item: SurveyDetailVM) {
    console.log(JSON.stringify(item))
    this.$modal.show('preview', { IsNewRecord: false, EvaluationMaster: item })
  }

  notificationwModel(item: SurveyDetailVM) {
    console.log(JSON.stringify(item))
    this.$modal.show('sendnotification-add-edit-model', { IsNewRecord: false, EvaluationMaster: item })
  }

  insertModel() {
    this.$modal.show('failCriteria-add-edit-model', { IsNewRecord: true })
  }
  deleteModel(item: SurveyDetailVM) {
    // var response = confirm('Are You sure to delete Teacher Evaluation')
    // if (response) {
    //   this.repository.deleteTeacherEvaluation(item.evaluationId).then(r => {
    //     this.$store.dispatch(StoreTypes.updateStatusBar, {
    //       text: r,
    //       title: 'Success',
    //       messageTypeId: PayloadMessageTypes.success
    //     })

    //     this.refreshData();

    //   })
    //}




  }


}