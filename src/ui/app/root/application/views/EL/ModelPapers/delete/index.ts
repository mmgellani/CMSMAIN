/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IELModelPapers } from '../../../../models';
import { ELModelPapersService } from '../../../../service';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class ELModelPapersDelete extends Vue {
    private repository: ELModelPapersService;
    private data: IELModelPapers = { modelPaperId: '', fullName: '', totalMarks: 0, correctCredit: 0, incorrectCredit: 0, skippedCredit: 0, testTime: 0, statusId: 0,loggerId:''  };
    private title: string = 'Delete Record';

    created() {
        this.repository = new ELModelPapersService(this.$store);
    }

    beforeModalOpen(event) {
        Object.assign(this.data, event.params.model);
    }

    cancel() {
        this.$modal.hide('delete-model');
        this.$emit("submit");
    }

    deleteModel() {
        this.data.statusId=2;
        this.repository.Update(this.data)
            .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Record has been Deleted successfully',
                title: 'Deleted',
                messageTypeId: PayloadMessageTypes.warning
            })
            this.cancel();
        });

        this.cancel();
    }
}