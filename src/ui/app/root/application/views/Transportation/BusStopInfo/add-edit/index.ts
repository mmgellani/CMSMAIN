/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { ITransportationBusStopInfo } from '../../../../models';
import { TransportationBusStopInfoService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateTransportationBusStopInfo = { model: ITransportationBusStopInfo, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateTransportationBusStopInfo> = {
    model: {
	busStopId: { required },
	busStopName: { required },
	routeId: { required },
	feeAmount: { required },
	sessionId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class TransportationBusStopInfoAddEdit extends Vue {
    private repository: TransportationBusStopInfoService;
    private data: ITransportationBusStopInfo = {
        busStopId: '', busStopName: '', routeId: '', feeAmount: 0, sessionId: '', statusId: 0, loggerId: '', vehicleId: '', 
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new TransportationBusStopInfoService(this.$store);
    }

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
    }

    cancel() {
        this.$modal.hide('add-edit-model');
    }

    saveModel() {
        if (this.IsNewRecord) {
            this.data.loggerId = helper.newGuid();
            this.repository.AddOne(this.data)
                .then(() => this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record has been inserted successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                }));
        } else {
            this.repository.Update(this.data)
                .then(() => this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record has been updated successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                }));
        }

        this.cancel();
    }
    $v: Vuelidate<any>;
}