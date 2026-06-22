/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

// import Vue from 'vue';
// import Component from 'vue-class-component';

// import { StoreTypes } from '../../../../../../store';
// import { PayloadMessageTypes } from '../../../../../../model';

// import { IFeeChallanValidity } from '../../../../models';
// import { FeeChallanValidityService } from '../../../../service';

// @Component({
//     name: 'delete-modal',
//     template: require('./index.html')
// })
// export class FeeChallanValidityDelete extends Vue {
//     private repository: FeeChallanValidityService;
//     private data: IFeeChallanValidity = { challanValidityId: '', campusId: '', installmentNo: 0, fromDate: new Date(), toDate: new Date(), statusId: 0, loggerId: '',campusProgramId:'',classId:''  };
//     private title: string = 'Delete Record';

//     created() {
//         this.repository = new FeeChallanValidityService(this.$store);
//     }

//     beforeModalOpen(event) {
//         Object.assign(this.data, event.params.model);
//     }

//     cancel() {
//         this.$modal.hide('delete-model');
//         this.$emit("submit");
//     }

//     deleteModel() {
//         this.data.statusId=2;
//         this.repository.Update(this.data)
//             .then(() => {this.$store.dispatch(StoreTypes.updateStatusBar, {
//                 text: 'Record has been Deleted successfully',
//                 title: 'Deleted',
//                 messageTypeId: PayloadMessageTypes.warning
//             })
//             this.cancel();
//         });

//         this.cancel();
//     }
// }

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IFeeChallanValidity } from '../../../../models';
import { FeeChallanValidityService } from '../../../../service';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class FeeChallanValidityDelete extends Vue {
    private repository: FeeChallanValidityService;
    private data: IFeeChallanValidity = { challanValidityId: '', campusId: '', installmentNo: 0, fromDate: new Date(), toDate: new Date(), statusId: 0, loggerId: '',campusProgramId:'',classId:''  };
    private title: string = 'Delete Record';

    created() {
        this.repository = new FeeChallanValidityService(this.$store);
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

