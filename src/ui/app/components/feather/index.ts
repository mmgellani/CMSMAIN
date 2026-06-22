import Vue from 'vue';
const feather = require('feather-icons');

Vue.component('xfeather', {
    props: {
        icon: { required: true },
        xclass: { default: '' },
        stroke: { default: 2 },
        width: { default: 22 },
        height: { default: 22 },
        color: {},
        fill: { default: 'none' }
    },
    mounted() {
        if (this.icon) {
            if (feather) {
                this.icon = feather.icons[this.icon].toSvg({
                    class: this.xclass,
                    'stroke-width': this.stroke,
                    color: this.color,
                    fill: this.fill,
                    width: this.width,
                    height: this.height
                });
            }
        }
    },
    template: `<i v-html="icon"></i>`
});

Vue.component('feather', {
    props: {
        icon: { required: true },
        xclass: { default: '' },
        stroke: { default: 2 },
        width: { default: 22 },
        height: { default: 22 },
        color: {},
        fill: { default: 'none' }
    },
    computed: {
        processed() {
            if (this.icon) {
                if (feather) {
                    return feather.icons[this.icon].toSvg({
                        class: this.xclass,
                        'stroke-width': this.stroke,
                        color: this.color,
                        fill: this.fill,
                        width: this.width,
                        height: this.height
                    });
                }
            }
        }
    },
    template: `<i v-html="processed"></i>`
});