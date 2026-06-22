import Component from 'vue-class-component';
import { MessageApproval } from '../../../../../models/Message/message';
import { MessageService } from '../../../../../service/Message/message-service';
import { PayloadMessageTypes } from '../../../../../../../model';
import { StoreTypes } from '../../../../../../../store';
import Vue from 'vue';
import moment from 'moment';

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})


export class UnApprove extends Vue {


    service: MessageService = new MessageService(this.$store);

    
    private title: string = 'Student Message ';

    private name: string = '';

    private data: MessageApproval = {
        viewId: '',
        messageText: '',
        recipients: 0,
        quedDate: '',
        isApproved: true,
        mask: '',
        userId: 0,
        displayName: '',
        username: '',
        messageCount:0

    }

    created() {

    }

    beforeModalOpen(event) {
        this.data.viewId = event.params.model.viewId;
        this.data.messageText = event.params.model.messageText;
        this.data.recipients = event.params.model.recipients;
        this.data.quedDate = event.params.model.quedDate;
        this.data.mask = event.params.model.mask;
        this.data.userId = event.params.model.userId;
        this.data.displayName = event.params.model.displayName;
        this.data.username = event.params.model.username;
    }

    cancel() {
        this.$emit("submit");
        this.$modal.hide('unapprove');

    }

    updMicrosoftPass() {
        var key = this.data.messageText.replace("'","''") + '?' + moment(this.data.quedDate).format("YYYY/MM/DD")  + '?' + this.data.userId;

        this.service.UnApprove(key).then(r => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Message Reverted SuccessFully',
                title: '',
                messageTypeId: PayloadMessageTypes.success
            });
            this.cancel();
        })
        this.cancel();

    }
}


