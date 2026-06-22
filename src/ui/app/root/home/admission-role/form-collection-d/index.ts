import Vue from 'vue';
import Component from 'vue-class-component';

import Highcharts from 'highcharts';
import loadMap from 'highcharts/modules/map.js';
import { genComponent } from 'vue-highcharts';

loadMap(Highcharts);

@Component({
    template: require('./index.html'),
    components: {
        Highcharts: genComponent('Highcharts', Highcharts),
        Highmaps: genComponent('Highmaps', Highcharts),
    }
})
export class FormCollectionDonutWidget extends Vue {
    options = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        colors:
             ['#39B54A', '#25ABE2', '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#FFF200', '#EE207C', '#27368E']
        ,
        title: {
            text: '',
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '110%'
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            innerSize: '50%',
            data: [
                ['Chrome', 58.9],
                ['Firefox', 14],
                ['Internet Explorer', 13],
                ['Edge', 3.78],
                ['Safari', 3.42],
                {
                    name: 'Other',
                    y: 7.61,
                    dataLabels: {
                        enabled: false
                    }
                }
            ]
        }]

    }

}