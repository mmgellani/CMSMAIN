/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { AreaWidget } from '../widget';
@Component({
    name: 'grid',
    template: require('./index.html'),
    props: ['data', 'columns', 'pre', 'isCheckBox'],
    filters: {
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    },
    components: {
        AreaWidget
    }
})
export class Grid extends Vue {
    private data: any = (<any>this).data;
    private columns: any = (<any>this).columns;
    private pre: any = (<any>this).pre;

    private searchQuery: string = '';
    private sortKey: string = '';
    private sortOrders: any = {};

    private startRow: number = 0;
    private rowsPerPage: number = 10;
    private pageSizeMenu = [10, 20, 50, 100];

    created() {
        let sortOrders = {};
        this.columns.forEach(function (key) {
            sortOrders[key.key] = 1;
        })
        this.sortOrders = sortOrders;
    }

    hasValue(item, column) {
        return item[column.toLowerCase()] !== 'undefined'
    }
    itemValue(item, column) {
        return item[column.toLowerCase()]
    }

    get filteredData() {
        let sortKey = this.sortKey;
        let filterKey = this.searchQuery && this.searchQuery.toLowerCase();
        let order = this.sortOrders[sortKey] || 1;
        let data = this.data;

        if (filterKey) {
            data = data.filter(function (row) {
                return Object.keys(row).some(function (key) {
                    return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
                })
            })
        }
        if (sortKey) {
            data = data.slice().sort(function (a, b) {
                a = a[sortKey];
                b = b[sortKey];
                return (a === b ? 0 : a > b ? 1 : -1) * order;
            })
        }
        return data;
    }

    sortBy(key) {
        this.sortKey = key;
        this.sortOrders[key] = this.sortOrders[key] * -1
    }

    movePages(amount) {
        if (this.filteredData !== undefined) {
            let newStartRow = this.startRow + (amount * this.rowsPerPage);
            if (newStartRow >= 0 && newStartRow < this.filteredData.length) {
                this.startRow = newStartRow;
            }
        }
    }

    updateFilter(tex) {
        this.searchQuery = tex;
    }

    moveFirtst() {
        if (this.filteredData !== undefined) {
            this.startRow = 1;
        }
    }

    moveLast() {
        if (this.filteredData !== undefined) {
            this.startRow = Math.round(this.filteredData.length / this.rowsPerPage);
        }
    }

    get dataPerPage() {
        return this.filteredData !== undefined ? this.filteredData.filter((item, index) => index >= this.startRow && index < (this.startRow + this.rowsPerPage)) : '';
    }

    serialNumber(index) {
        return (this.startRow / this.rowsPerPage + 1) == 1 ? (index + 1) : ((index + 1) + ((this.startRow / this.rowsPerPage) * this.rowsPerPage));
    }
}