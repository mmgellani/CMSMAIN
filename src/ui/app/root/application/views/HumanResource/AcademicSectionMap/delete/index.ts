/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IRegistrationSectionCourseLink } from '../../../../models';
import { AcademicSectionMapService, RegistrationSectionCourseLinkService } from '../../../../service';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class AcademicSectionMapDelete extends Vue {
    private repository: AcademicSectionMapService;
    private data: IRegistrationSectionCourseLink = { sectionCourseLinkId: '', campusProgramId: '', classId: '', sectionId: '', fromSerial: 0, toSerial: 0, statusId: 0, loggerId: '',  };
    private title: string = 'Delete Record';

    created() {
        this.repository = new AcademicSectionMapService(this.$store);
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
    }
}