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

import { ITransportationRouteInfo, ITransportationVehicleInfo } from '../../../../models';
import { TransportationRouteInfoService, TransportationVehicleInfoService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateTransportationRouteInfo = { data: ITransportationRouteInfo, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateTransportationRouteInfo> = {
    data: {
        routeTitle: {
            required,
            maxLength: maxLength(14)
        },
        maxInstallmentNo: {
            required,
            maxLength: maxLength(3)
        },
        driverName: {
            required,
            maxLength: maxLength(15)
        },
        driverPhoneNo: { required },
        routeStartPoint: {
            required,
            maxLength: maxLength(20)
        },
        routeEndPoint: {
            required,
            maxLength: maxLength(20)
        },
        vehicleId: {
            required
        }

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class TransportationRouteInfoAddEdit extends Vue {
    private repository: TransportationRouteInfoService;
    private data: ITransportationRouteInfo = {
        routeId: '', routeTitle: '', subCityId: '', maxInstallmentNo: 0, driverName: '', driverPhoneNo: '', routeStartPoint: '', routeEndPoint: '', statusId: 0, loggerId: '', vehicleId: '', longitude: '', latitude: ''
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private vehicleModel: Array<ITransportationVehicleInfo> = [];
    private vehicleService: TransportationVehicleInfoService = null;
    // private subCityId ='';
    private isActive: boolean = true;

    created() {
        this.repository = new TransportationRouteInfoService(this.$store);
        this.vehicleService = new TransportationVehicleInfoService(this.$store);
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else {
            this.isActive = false;
        }
        this.getVehicles();
    }

    getVehicles() {
        this.vehicleService
            .GetFindBy("f=>f.StatusId == 1")
            .then(
                response =>
                    (this.vehicleModel = response as Array<ITransportationVehicleInfo>)
            );
    }

    cancel() {
        this.$modal.hide('add-edit-model');
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.routeId = helper.newGuid();
                this.data.loggerId = helper.newGuid();
                this.data.statusId = 1;
                this.repository.AddOne(this.data)
                    .then(() => this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Record has been inserted successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    }));
            } else {
                if (this.isActive == true) {
                    this.data.statusId = 1;
                }
                else {
                    this.data.statusId = 0;
                }
                this.repository.Update(this.data)
                    .then(() => this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Record has been updated successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    }));
            }

            this.cancel();
        }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }


    $v: any;
}