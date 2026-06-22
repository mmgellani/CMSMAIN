import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    name: 'drop-down',
    template: require('./index.html'),
    props: {
        data: {
            type: Array,
            required: true
        },
        keyValue: {
            type: String,
            required: true
        },
        displayValue: {
            type: String,
            required: true
        },
        groupBy: {
            type: String,
            required: false
        },
        placeholder: {
            type: String,
            required: false
        },
        value: {
            type: String,
            required: true
        }
    }
})
export class DropDown extends Vue {
    xData: any = (<any>this).data;
    selected: string = (<any>this).keyValue;
    display: string = (<any>this).displayValue;
    group: string = (<any>this).groupBy;
    place: string = (<any>this).placeholder;
    value: string = (<any>this).value;

    tempVmodel: string = '';

    groupHeader = [];

    mounted() {
        this.loadHeaders();
        this.$watch('data', this.loadHeaders);
        this.$watch('value', () => { this.tempVmodel = (<any>this).value; });
    }

    loadHeaders() {
        this.xData = (<any>this).data;
        this.tempVmodel = (<any>this).value;

        this.groupHeader = [];
        if (this.xData) {
            if (this.xData.length > 0) {
                this.xData.forEach(element => {
                    if (this.groupHeader.indexOf(element[this.group]) == -1) {
                        this.groupHeader.push(element[this.group]);
                    }
                });

                this.groupHeader = this.groupHeader.sort((n1, n2) => {
                    if (n1 > n2) {
                        return 1;
                    }

                    if (n1 < n2) {
                        return -1;
                    }

                    return 0;
                });
            }
        }
    }

    loadChilds(gHeader: string = '') {
        if (this.isGroup) {
            return this.xData.filter(e => e[this.group] == gHeader).sort((n1, n2) => {
                if (n1[this.display] > n2[this.display]) {
                    return 1;
                }

                if (n1[this.display] < n2[this.display]) {
                    return -1;
                }

                return 0;
            });
        } else {
            return this.xData.sort((n1, n2) => {
                if (n1[this.display] > n2[this.display]) {
                    return 1;
                }

                if (n1[this.display] < n2[this.display]) {
                    return -1;
                }

                return 0;
            });
        }
    }

    processClick(value) {
        this.$emit('input', value);
        this.$emit('change', event);
    }

    changeEvent(event) {
    }

    get isGroup() {
        if (this.group) {
            if (this.group.length > 0) {
                return true;
            }
        }
        return false;
    }
}