/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { ITopicVideoChapterLink } from '../../../../models';
import { TopicVideoChapterLinkService } from '../../../../service';
import { LevelProgramClassMapService } from '../../../../service/Assessment/LevelProgramClassMap';
import { ILevelProgramClassMap, IVWLevelProgramClassMap } from '../../../../models/Assessment/LevelProgramClassMap';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})
export class LevelProgramClassMapDelete extends Vue {
    private repository: LevelProgramClassMapService ;
    private data: ILevelProgramClassMap = {levelProgramClassId:'',levelId:'',statusId:0,programId:'',classId:''}
    private title: string = 'Delete Record';

    created() {
        this.repository = new LevelProgramClassMapService(this.$store);
    }

    beforeModalOpen(event) {
        Object.assign(this.data, event.params.model);
        this.title=this.data.levelProgramClassId;
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