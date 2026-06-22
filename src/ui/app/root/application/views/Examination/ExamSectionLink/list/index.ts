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


@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    
})

export class ExaminationExamSectionLink extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: ExaminationExamSectionLinkService;
    private data: Array<IExaminationExamSectionLinkVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [ 
        { key: 'campusName', caption: 'Campus' },
        { key: 'className', caption: 'Class' },
        { key: 'sectionName',  caption: 'Section' },
        { key: 'description', caption: 'Description' },
        { key: 'statusId', caption: 'Status'  },
        // { key: 'action', caption: 'Action', width: 120 }

    ];

    created() {
        this.repository = new ExaminationExamSectionLinkService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
    }

    
    validatePage() {
        if (this.user.roles.indexOf("admin") >= 0) {
          this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        } else {
          if ("examinationExamSectionLink" in this.user.claims == true) {
            if (this.user.claims["examinationExamSectionLink"].indexOf("R") >= 0) {
              this.canRead = true;
            }
            if (this.user.claims["examinationExamSectionLink"].indexOf("C") >= 0) {
              this.canAdd = true;
            }
            if (this.user.claims["examinationExamSectionLink"].indexOf("U") >= 0) {
              this.canEdit = true;
            }
            if (this.user.claims["examinationExamSectionLink"].indexOf("D") >= 0) {
              this.canDelete = true;
            }
          } else {
            this.$router.push("Home");
          }
        }
      }

//     refreshData() {
//         this.data = [];
//         if (this.data.length>0) {
//         this.repository.GetFindBy('e=>e.StatusId==1')
//             .then(response => this.data = (response as Array<IExamSectionLinkVM>));
//     }
//     else {
//         console.log("Error in RefreshData()")
//     }
// }
refreshData() {
    this.data = [];
    this.repository.GetFindByVM().then(response => {
      this.data = response as Array<IExaminationExamSectionLinkVM>;
    });
}
    

    // deleteModel (model : IExaminationExamDetail) {
    //     this.$modal.show('delete-model', { model: model });
    // }
}