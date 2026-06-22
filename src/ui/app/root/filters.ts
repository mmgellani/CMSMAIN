import Vue from "vue";
import moment from 'moment'

Vue.filter('formatDMY', function (value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
    }
});

Vue.filter('formatMDY', function (value) {
    if (value) {
        return moment(String(value)).format('MM/DD/YYYY')
    }
});

Vue.filter('formatYDM', function (value) {
    if (value) {
        return moment(String(value)).format('YYYY/MM/DD')
    }
});

Vue.filter('formatDMYt', function (value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY hh:mm')
    }
});

Vue.filter('formatHM', function (value) {
    if (value) {
        return moment(String(value)).format('hh:mm')
    }
});

Vue.mixin({
    methods: {
        formatDate: date => moment(date).format('DD/MM/YYYY')
    }
})