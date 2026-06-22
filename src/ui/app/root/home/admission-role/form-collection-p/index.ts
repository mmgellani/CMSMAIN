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
    }
})
export class FormCollectionPieWidget extends Vue {
    options = {
        chart: {
            type: 'pie'
        },
        colors:
             ['#39B54A', '#25ABE2'
            //  , '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#FFF200', '#EE207C', '#27368E'
            ]
        ,
        title: {
            text: ''
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Total percent'
            }

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}%'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },

        "series": [
            {
                "name": "Approved VS Un-Approved",
                "colorByPoint": true,
                "data": [
                    {
                        "name": "Approved",
                        "y": 65
                    },
                    {
                        "name": "UnApproved",
                        "y": 35
                    }
                ]
            }
        // ],
        // "drilldown": {
        //     "series": [
        //         {
        //             "name": "FSc(M)",
        //             "id": "FSc(M)",
        //             "data": [
        //                 [
        //                     "v65.0",
        //                     0.1
        //                 ],
        //                 [
        //                     "v64.0",
        //                     1.3
        //                 ],
        //                 [
        //                     "v63.0",
        //                     53.02
        //                 ],
        //                 [
        //                     "v62.0",
        //                     1.4
        //                 ],
        //                 [
        //                     "v61.0",
        //                     0.88
        //                 ],
        //                 [
        //                     "v60.0",
        //                     0.56
        //                 ],
        //                 [
        //                     "v59.0",
        //                     0.45
        //                 ],
        //                 [
        //                     "v58.0",
        //                     0.49
        //                 ],
        //                 [
        //                     "v57.0",
        //                     0.32
        //                 ],
        //                 [
        //                     "v56.0",
        //                     0.29
        //                 ],
        //                 [
        //                     "v55.0",
        //                     0.79
        //                 ],
        //                 [
        //                     "v54.0",
        //                     0.18
        //                 ],
        //                 [
        //                     "v51.0",
        //                     0.13
        //                 ],
        //                 [
        //                     "v49.0",
        //                     2.16
        //                 ],
        //                 [
        //                     "v48.0",
        //                     0.13
        //                 ],
        //                 [
        //                     "v47.0",
        //                     0.11
        //                 ],
        //                 [
        //                     "v43.0",
        //                     0.17
        //                 ],
        //                 [
        //                     "v29.0",
        //                     0.26
        //                 ]
        //             ]
        //         },
        //         {
        //             "name": "FSc(E)",
        //             "id": "FSc(E)",
        //             "data": [
        //                 [
        //                     "v58.0",
        //                     1.02
        //                 ],
        //                 [
        //                     "v57.0",
        //                     7.36
        //                 ],
        //                 [
        //                     "v56.0",
        //                     0.35
        //                 ],
        //                 [
        //                     "v55.0",
        //                     0.11
        //                 ],
        //                 [
        //                     "v54.0",
        //                     0.1
        //                 ],
        //                 [
        //                     "v52.0",
        //                     0.95
        //                 ],
        //                 [
        //                     "v51.0",
        //                     0.15
        //                 ],
        //                 [
        //                     "v50.0",
        //                     0.1
        //                 ],
        //                 [
        //                     "v48.0",
        //                     0.31
        //                 ],
        //                 [
        //                     "v47.0",
        //                     0.12
        //                 ]
        //             ]
        //         },
        //         {
        //             "name": "ICOM",
        //             "id": "ICOM",
        //             "data": [
        //                 [
        //                     "v11.0",
        //                     6.2
        //                 ],
        //                 [
        //                     "v10.0",
        //                     0.29
        //                 ],
        //                 [
        //                     "v9.0",
        //                     0.27
        //                 ],
        //                 [
        //                     "v8.0",
        //                     0.47
        //                 ]
        //             ]
        //         },
        //         {
        //             "name": "ICS",
        //             "id": "ICS",
        //             "data": [
        //                 [
        //                     "v11.0",
        //                     3.39
        //                 ],
        //                 [
        //                     "v10.1",
        //                     0.96
        //                 ],
        //                 [
        //                     "v10.0",
        //                     0.36
        //                 ],
        //                 [
        //                     "v9.1",
        //                     0.54
        //                 ],
        //                 [
        //                     "v9.0",
        //                     0.13
        //                 ],
        //                 [
        //                     "v5.1",
        //                     0.2
        //                 ]
        //             ]
        //         },
        //         {
        //             "name": "FA",
        //             "id": "FA",
        //             "data": [
        //                 [
        //                     "v16",
        //                     2.6
        //                 ],
        //                 [
        //                     "v15",
        //                     0.92
        //                 ],
        //                 [
        //                     "v14",
        //                     0.4
        //                 ],
        //                 [
        //                     "v13",
        //                     0.1
        //                 ]
        //             ]
        //         },
        //         {
        //             "name": "Opera",
        //             "id": "Opera",
        //             "data": [
        //                 [
        //                     "v50.0",
        //                     0.96
        //                 ],
        //                 [
        //                     "v49.0",
        //                     0.82
        //                 ],
        //                 [
        //                     "v12.1",
        //                     0.14
        //                 ]
        //             ]
        //         }
            ]
        };
    }
