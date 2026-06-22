/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import moment from 'moment';
import Component from 'vue-class-component';

@Component({
    name: 'input-date',
    template: `<input type="date" ref="input" v-on:value="dateInput(value)" @input="updateValue($event.target)" v-on:focus="selectAll">`,
    props: {
        value: {
            type: Date,
            required: true
        }
    }
})
export class InputDate extends Vue {
    value: Date = (<any>this).value;

    dateInput(date) {
        return date && moment(date).format('DD/MM/YYYY');
    }

    updateValue(target) {
        this.$emit('input', moment(target.value).format('yyyy/MM/dd'));
    }

    selectAll(event) {
        event.target.select();
    }
}