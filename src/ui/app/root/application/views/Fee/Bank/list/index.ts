/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { FeeBankService, FeeCampusBankLinkService } from '../../../../service';
import { IFeeBank, IFeeBankVM, IFeeCampusBankLink } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { FeeBankAddEdit } from '../add-edit';
import { FeeBankDelete } from '../delete';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Bank-add-edit-model': FeeBankAddEdit,
        'delete-model': FeeBankDelete
    }
})

export class FeeBankList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeBankService;
    private data: Array<IFeeBankVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private campusbankModel: Array<IFeeCampusBankLink> = [];
    private repocampusbank: FeeCampusBankLinkService;

    private columns = [
        { key: 'fullName', caption: 'Bank' },
        { key: 'address', caption: 'Address' },
        { key: 'accountTitle', caption: 'AccountTitle' },
        { key: 'accountNo', caption: "AccountNo" },
        { key: 'cityName', caption: "City" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new FeeBankService(this.$store);
        this.repocampusbank = new FeeCampusBankLinkService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        // this.getcampusbank();
    }

    getcampusbank() {
        this.campusbankModel = [];
        this.repocampusbank.GetFindBy('e => e.StatusId!=2')
            .then(response => this.campusbankModel = (response as Array<IFeeCampusBankLink>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('feeBank' in this.user.claims) == true) {
                if (this.user.claims['feeBank'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeBank'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeBank'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeBank'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('e=>e.StatusId!=2')
            .then(response => this.data = (response as Array<IFeeBankVM>));
    }

    insertModel() {
        this.$modal.show('Bank-add-edit-model', { model: { bankId: '', fullName: '',abbreviation:'', address: '', accountTitle: '', accountNo: '', statusId: 0, loggerId: '', cityId: '' }, IsNewRecord: true });
    }

    editModel(model: IFeeBank) {
        this.$modal.show('Bank-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IFeeBank) {
        // if (this.campusbankModel.filter(e => e.bankId == model.bankId).length > 0) {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: "This Parent Child Relation Cannot be Deleted",
        //         title: "Success",
        //         messageTypeId: PayloadMessageTypes.success
        //     });
        // }
        // else {
        this.$modal.show('delete-model', { model: model });
        // }
    }
}