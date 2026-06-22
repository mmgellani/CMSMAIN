/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    name: 'attendance-slot',
    template: require('./attendanceslot.html'),
    props: ['data', 'item', 'astatus']
})
export class AttendanceSlot extends Vue {
    data: any = this.data;
    astatus: any = this.astatus;
    item: string = this.item;

    get processedData() {
        return this.data.filter(e => e.courseId == this.item);
    }

    get courseName() {
        return this.processedData[0].courseName;
    }

    get getslot() {
        return this.processedData[0].startTime + ' : ' + this.processedData[0].endTime;
    }
}