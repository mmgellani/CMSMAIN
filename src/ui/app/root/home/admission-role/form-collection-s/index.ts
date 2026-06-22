import Vue from 'vue';
import Component from 'vue-class-component';

import Highcharts from 'highcharts';
import loadMap from 'highcharts/modules/map.js';
import loadDrilldown from 'highcharts/modules/drilldown.js';

import { genComponent } from 'vue-highcharts';

loadMap(Highcharts);
loadDrilldown(Highcharts);

@Component({
    template: require('./index.html'),
    components: {
        Highcharts: genComponent('Highcharts', Highcharts),
    },

})
export class FormCollectionSparklineWidget extends Vue {
    options = {
        chart: {
            type: 'area',
            height: 50,
        },
        colors: 
            ['#25ABE2']
        ,
        legend: {
            enabled: false
        },
        title: {
            text: ''
        },
        xAxis: {
            title: {
                text: ''
            },
            allowDecimals: false,
            lineWidth: 0,
            gridLineColor: 'transparent',
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            labels: {
                enabled: false
            },
            minorTickLength: 0,
            tickLength: 0

        },
        yAxis: {
            title: {
                text: ''
            },
            allowDecimals: false,
            lineWidth: 0,
            gridLineColor: 'transparent',
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            labels: {
                enabled: false
            },
            minorTickLength: 0,
            tickLength: 0
        },
        tooltip: {
            // pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
        },
        plotOptions: {
            area: {
                pointStart: 1940,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: 'USA',
            data: [
                null, null, null, null, null, 6, 11, 32, 110, 235,
                369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
                20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
                26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
                24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
                21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
                10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
                5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
            ]
        }]
    };
}