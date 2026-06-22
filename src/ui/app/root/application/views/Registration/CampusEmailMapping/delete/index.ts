/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IEmailTemplate } from '../../../../models';
import { EmailTemplateService } from '../../../../service';
import { IEmailMapping } from '../../../../models/Registration/EmailMapping';
import { CampusEmailMappingService } from '../../../../service/Registration/EmailMapping';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class CampusEmailMappingDelete extends Vue {
    private repository: CampusEmailMappingService;
    private data: IEmailMapping = {
        campusId: '', campusEmailLinkId: '', email: '', statusId: 1, password: '', operationName: '', mailBox: ''
    };
    private title: string = 'Delete Record';

    created() {
        this.repository = new CampusEmailMappingService(this.$store);
    }

    beforeModalOpen(event) {
        Object.assign(this.data, event.params.model);
    }

    cancel() {
        this.$modal.hide('delete-model');
        this.$emit("submit");
    }

    deleteModel() {
        this.data.statusId = 2;
        this.repository.Update(this.data)
            .then(() => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record has been Deleted successfully',
                    title: 'Deleted',
                    messageTypeId: PayloadMessageTypes.warning
                })
                this.cancel();
            });

        this.cancel();
    }
}