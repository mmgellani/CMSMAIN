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

import { IBoards, IRegistrationCourse, ISetupClass, IRegistrationProgramCourseLink, RegistrationProgramCourseLinkVM } from '../../../../models';
import { BoardsService, RegistrationCourseService, SetupClassService, RegistrationProgramCourseLinkService } from '../../../../service';

import { BoardsAddEdit } from '../add-edit';
import { BoardsDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': BoardsAddEdit,
        'delete-model': BoardsDelete
    }
})

export class BoardsList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: BoardsService;
    private data: Array<IBoards> = [];
    private filterString: string = '';
    private classId = '';
    private courseId = ''
    private courseList: Array<RegistrationProgramCourseLinkVM> = []
    private classList: Array<ISetupClass> = []

    private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [ 
        { key: 'fullName', caption: 'Name' },
        { key: 'abbreviation', caption: 'Abbreviation' },
       
        
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new BoardsService(this.$store);
      //  this.loadClass()

    }

    // loadClass() {
    //     this.classRepo.GetFindBy('s=>s.StatusId==1')
    //         .then(r => {
    //             this.classList = r as Array<ISetupClass>

    //         })
    // }
    loadCourse() {
            this.programCourseRepo.GetByClassId(this.classId)
                .then(r => {
                    this.courseList = r as Array<RegistrationProgramCourseLinkVM>
                    this.refreshData();
                })

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
            if (('Boards' in this.user.claims) == true) {
                if (this.user.claims['Boards'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['Boards'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['Boards'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['Boards'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        //if (this.classId.length > 0 && this.courseId.length > 0) {

            this.repository.GetFindBy('s=>s.StatusId!=2')
                .then(response => this.data = (response as Array<IBoards>));
        //}

    }

    insertModel() {
        console.log('calling')
       // if (this.classId.length > 0 && this.courseId.length > 0) {
            this.$modal.show('add-edit-model', { model:  {boardId:'',fullName:'',abbreviation:'',statusId:0}, IsNewRecord: true });
       // }
        // else{
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: 'Please Select Drop Down Values First',
        //         title: 'Warning',
        //         messageTypeId: PayloadMessageTypes.warning
        //     });
        // }
    }

    editModel(model: IBoards) {
        console.log(model)
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IBoards) {
        this.$modal.show('delete-model', { model: model });
    }
}