/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { ITransportationRouteStudentLink } from '../../../../models';
import { TransportationRouteStudentLinkService } from '../../../../service';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class TransportationRouteStudentLinkDelete extends Vue {
    private repository: TransportationRouteStudentLinkService;
    private data: ITransportationRouteStudentLink = { routeStudentLinkId: '', routeDetailId: '', admissionFormId: '', isChecked : false, exemption: 0, startingDtae: new Date(), statusId: 0, loggerId: '',  };
    private title: string = 'Delete Record';
    private editData: Array<ITransportationRouteStudentLink> = [];
    private routeDetailLinkId = '';
    private loggerId = '';

    created() {
        this.repository = new TransportationRouteStudentLinkService(this.$store);
    }

    beforeModalOpen(event) {
        Object.assign(this.data, event.params.model);
        this.loadEditInfo();
    }

    cancel() {
        this.$modal.hide('delete-model');
    }

    loadEditInfo() {
        this.editData = [];
        this.repository.GetFindBy('e=>e.AdmissionFormId.ToString()=="' + this.data.admissionFormId + '" ')
            .then(response => {
                this.editData = (response as Array<ITransportationRouteStudentLink>);

                if (this.editData) {
                    if (this.editData.length > 0) {
                        this.routeDetailLinkId = this.editData[0].routeStudentLinkId;
                        this.loggerId = this.editData[0].loggerId;

                       
                    }
                }
            });
    }

    // deleteModel() {
    //     this.repository.Delete(this.data)
    //         .then(() => this.$store.dispatch(StoreTypes.updateStatusBar, {
    //             text: 'Record has been Deleted successfully',
    //             title: 'Deleted',
    //             messageTypeId: PayloadMessageTypes.warning
    //         }));

    //     this.cancel();
    // }

    deleteModel() {
        this.data.statusId=2;
        this.data.routeStudentLinkId = this.routeDetailLinkId;
        this.data.loggerId = this.loggerId;
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