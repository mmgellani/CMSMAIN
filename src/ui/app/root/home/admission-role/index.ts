import { log } from 'util';
import * as helper from "../../../../app/root/application/helper/index";
import moment from "moment";
export * from './form-collection';
export * from './form-collection-cp';
export * from './form-collection-ad';
export * from './form-collection-fe';
export * from './form-collection-b';
export * from './form-collection-p';
export * from './form-collection-d';
export * from './form-collection-s';
export * from './form-collection-s-o';

export const sum = (items, property) => {
  return items.reduce((a, b) => { return a + b[property]; }, 0)
};

export const getChartJson = (providedData: any, chartyType: string) => {
  if (chartyType == "column") {
    var chartJson = `{
      "chart": { "type": "` + chartyType + `" },
      "colors":
        ["#5c5c98", "#ffb5c0", "#a2a0fe"],
      "title": { "text": "" },
     "subtitle": {
      "text": "Admission - Fee Paid - Enrolled"
  },
      "xAxis": { "type": "category" },
      "plotOptions": { "series": { "borderWidth": 0, "dataLabels": { "enabled": true } } },
       "legend":{ "enabled":false },
      "series": [
        {
          "name": "Admission",
          "data": [
            $master
          ]
        },
        {
          "name": "Fee Paid",
          "data": [
            $masterF
          ]
        },
        {
          "name": "Enrolled",
          "data": [
            $masterE
          ]
        }],
      "drilldown": {
        "allowPointDrilldown": false,
        "series": [
          $series
        ]
      }
    }`;

    var topData = "";
    var topDataF = "";
    var topDataE = "";

    var seriess = "";

    var mainVar = `{
      "id": "$id", "name": "$name",
      "data": [
        $data
      ]
    },`;

    providedData.forEach(element => {

      if (topData.indexOf(element.cityId) == -1) {
        //For Admission
        var sum = providedData.filter(e => e.cityId === element.cityId).reduce((a, b) => { return a + b['totalAdmission']; }, 0);
        //for Feepaid          
        var sumF = providedData.filter(e => e.cityId === element.cityId).reduce((a, b) => { return a + b['totalFeeConfirmed']; }, 0);

        var sumE = providedData.filter(e => e.cityId === element.cityId).reduce((a, b) => { return a + b['totalEnrolled']; }, 0);

        //For Admission
        topData += `{ "name": "` + element.cityName + `", "y": ` + sum + `, "drilldown": "` + element.cityId + `" },`;
        //for Feepaid          
        topDataF += `{ "name": "` + element.cityName + `", "y": ` + sumF + `, "drilldown": "` + element.cityId + 'F' + `" },`;

        topDataE += `{ "name": "` + element.cityName + `", "y": ` + sumE + `, "drilldown": "` + element.cityId + 'E' + `" },`

        var subCityData = "";
        var subCityDataF = "";
        var subCityDataE = "";

        providedData.filter(e => e.cityId == element.cityId).forEach(subcity => {

          //For Admission

          var sum = providedData.filter(e => e.cityId === element.cityId && e.subCityId === subcity.subCityId).reduce((a, b) => { return a + b['totalAdmission']; }, 0);
          //for Feepaid          
          var sumF = providedData.filter(e => e.cityId === element.cityId && e.subCityId === subcity.subCityId).reduce((a, b) => { return a + b['totalFeeConfirmed']; }, 0);

          var sumE = providedData.filter(e => e.cityId === element.cityId && e.subCityId === subcity.subCityId).reduce((a, b) => { return a + b['totalEnrolled']; }, 0);


          if (subCityData.indexOf(subcity.subCityId) == -1) {
            //For Admission
            subCityData += `{ "name": "` + subcity.subCityName + `", "y": ` + sum + `, "drilldown": "` + subcity.subCityId + `" },`;
            //for Feepaid
            subCityDataF += `{ "name": "` + subcity.subCityName + `", "y": ` + sumF + `, "drilldown": "` + subcity.subCityId + 'F' + `" },`;

            subCityDataE += `{ "name": "` + subcity.subCityName + `", "y": ` + sumE + `, "drilldown": "` + subcity.subCityId + 'E' + `" },`;

            var campus = '';
            var campusF = '';
            var campusE = '';

            providedData.filter(e => e.cityId == element.cityId && e.subCityId == subcity.subCityId).forEach(campuss => {

              if (campus.indexOf(campuss.campusId) == -1) {
                //For Admission
                var sum = providedData.filter(e => e.cityId == element.cityId && e.subCityId == subcity.subCityId && e.campusId == campuss.campusId).reduce((a, b) => { return a + b['totalAdmission']; }, 0);
                campus += `{ "name": "` + campuss.campusName + `", "y": ` + sum + `, "drilldown": "` + campuss.campusId + `" },`;
                //For Feepaid
                var sumF = providedData.filter(e => e.cityId == element.cityId && e.subCityId == subcity.subCityId && e.campusId == campuss.campusId).reduce((a, b) => { return a + b['totalFeeConfirmed']; }, 0);
                campusF += `{ "name": "` + campuss.campusName + `", "y": ` + sumF + `, "drilldown": "` + campuss.campusId + 'F' + `" },`;

                var sumE = providedData.filter(e => e.cityId == element.cityId && e.subCityId == subcity.subCityId && e.campusId == campuss.campusId).reduce((a, b) => { return a + b['totalEnrolled']; }, 0);
                campusE += `{ "name": "` + campuss.campusName + `", "y": ` + sumE + `, "drilldown": "` + campuss.campusId + 'E' + `" },`;
              }

              var program = '';
              var programF = '';
              var programE = '';

              providedData.filter(e => e.cityId == element.cityId && e.subCityId == subcity.subCityId && e.campusId == campuss.campusId).forEach(programm => {
                if (program.indexOf(programm.programId) == -1) {
                  // For Admission
                  var sum = providedData.filter(e => e.cityId == element.cityId && e.subCityId == subcity.subCityId && e.campusId == campuss.campusId && e.programId == programm.programId).reduce((a, b) => { return a + b['totalAdmission']; }, 0);
                  program += `{ "name": "` + programm.programName + `", "y": ` + sum + `, "drilldown": "` + programm.programId + campuss.campusId + `" },`;
                  // For Feepaid
                  var sumF = providedData.filter(e => e.cityId == element.cityId && e.subCityId == subcity.subCityId && e.campusId == campuss.campusId && e.programId == programm.programId).reduce((a, b) => { return a + b['totalFeeConfirmed']; }, 0);
                  programF += `{ "name": "` + programm.programName + `", "y": ` + sumF + `, "drilldown": "` + programm.programId + campuss.campusId + 'F' + `" },`;

                  var sumE = providedData.filter(e => e.cityId == element.cityId && e.subCityId == subcity.subCityId && e.campusId == campuss.campusId && e.programId == programm.programId).reduce((a, b) => { return a + b['totalEnrolled']; }, 0);
                  programE += `{ "name": "` + programm.programName + `", "y": ` + sumE + `, "drilldown": "` + programm.programId + campuss.campusId + 'E' + `" },`;
                }

                var programDetail = '';
                var programDetailF = '';
                var programDetailE = '';

                providedData.filter(e => e.cityId == element.cityId && e.subCityId == subcity.subCityId && e.campusId == campuss.campusId && e.programId == programm.programId).forEach(programmDetail => {
                  if (programDetail.indexOf(programmDetail.programDetailId) == -1) {
                    //For Admission
                    var sum = providedData.filter(e => e.cityId == element.cityId && e.subCityId == subcity.subCityId && e.campusId == campuss.campusId && e.programId == programm.programId && e.programDetailId == programmDetail.programDetailId).reduce((a, b) => { return a + b['totalAdmission']; }, 0);
                    programDetail += `{ "name": "` + programmDetail.description + `", "y": ` + sum + `, "drilldown": "` + programmDetail.programDetailId + `" },`;
                    //for Feepaid
                    var sumF = providedData.filter(e => e.cityId == element.cityId && e.subCityId == subcity.subCityId && e.campusId == campuss.campusId && e.programId == programm.programId && e.programDetailId == programmDetail.programDetailId).reduce((a, b) => { return a + b['totalFeeConfirmed']; }, 0);
                    programDetailF += `{ "name": "` + programmDetail.description + `", "y": ` + sumF + `, "drilldown": "` + programmDetail.programDetailId + 'F' + `" },`;

                    var sumE = providedData.filter(e => e.cityId == element.cityId && e.subCityId == subcity.subCityId && e.campusId == campuss.campusId && e.programId == programm.programId && e.programDetailId == programmDetail.programDetailId).reduce((a, b) => { return a + b['totalEnrolled']; }, 0);
                    programDetailE += `{ "name": "` + programmDetail.description + `", "y": ` + sumE + `, "drilldown": "` + programmDetail.programDetailId + 'E' + `" },`;
                  }
                });
                //For Admission
                seriess += mainVar.replace('$id', programm.programId + campuss.campusId).replace('$name', programm.programName).replace("$data", programDetail.substr(0, programDetail.length - 1));
                //For Feepaid
                seriess += mainVar.replace('$id', programm.programId + campuss.campusId + 'F').replace('$name', programm.programName).replace("$data", programDetailF.substr(0, programDetailF.length - 1));

                seriess += mainVar.replace('$id', programm.programId + campuss.campusId + 'E').replace('$name', programm.programName).replace("$data", programDetailE.substr(0, programDetailE.length - 1));

              });
              //For Admission
              seriess += mainVar.replace('$id', campuss.campusId).replace('$name', campuss.campusName).replace("$data", program.substr(0, program.length - 1));
              //For Feepaid
              seriess += mainVar.replace('$id', campuss.campusId + 'F').replace('$name', campuss.campusName).replace("$data", programF.substr(0, programF.length - 1));

              seriess += mainVar.replace('$id', campuss.campusId + 'E').replace('$name', campuss.campusName).replace("$data", programE.substr(0, programE.length - 1));

            });
            //for Admission
            seriess += mainVar.replace('$id', subcity.subCityId).replace('$name', subcity.subCityName).replace("$data", campus.substr(0, campus.length - 1));
            //for feepaid
            seriess += mainVar.replace('$id', subcity.subCityId + 'F').replace('$name', subcity.subCityName).replace("$data", campusF.substr(0, campusF.length - 1));

            seriess += mainVar.replace('$id', subcity.subCityId + 'E').replace('$name', subcity.subCityName).replace("$data", campusE.substr(0, campusE.length - 1));
          }
        });
        //for Admission       
        seriess += mainVar.replace('$id', element.cityId).replace('$name', element.cityName).replace("$data", subCityData.substr(0, subCityData.length - 1));
        subCityData = "";
        seriess += mainVar.replace('$id', element.cityId + 'F').replace('$name', element.cityName).replace("$data", subCityDataF.substr(0, subCityDataF.length - 1));
        subCityDataF = "";
        seriess += mainVar.replace('$id', element.cityId + 'E').replace('$name', element.cityName).replace("$data", subCityDataE.substr(0, subCityDataE.length - 1));
        subCityDataE = "";
      }
    });

    chartJson = chartJson.replace("$master", topData.substr(0, topData.length - 1));
    chartJson = chartJson.replace("$masterF", topDataF.substr(0, topDataF.length - 1));
    chartJson = chartJson.replace("$masterE", topDataE.substr(0, topDataE.length - 1));

    chartJson = chartJson.replace("$series", seriess.substr(0, seriess.length - 1));
    //chartJson = chartJson.replace("$seriesF", seriessF.substr(0, seriessF.length - 1));

    return JSON.parse(chartJson);

  }
  else if (chartyType == "approvedPie") {




    var chartJson = `{
      "chart": { "plotBackgroundColor": null,
        "plotBorderWidth": null,
        "plotShadow": false,
        "type": "pie" },
      "colors":
        ["#273b73e6", "#f32330e0"],
      "title": { "text": "" },
      "tooltip": {
        "headerFormat": "<span style='font-size:11px'>{series.name}</span><br>",
        "pointFormat": "<span style='color:{point.color}'>{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>"
      },
      "plotOptions": {
        "pie": {
            "allowPointSelect": true,
            "cursor": "pointer",
            "size": "200",
            "dataLabels": {
                "enabled": false
            },
            "showInLegend": true
        }
    },
    "credits": {
      "enabled": false
    },
      "series": [
        {
          "name": "Approved VS Un-Approved", "colorByPoint": true,
          "data": [
            $approved,
            $unapproved
          ]
        }]
    }`;

    var approvedata = "";
    var unapprovedata = "";

    var approved = '';
    var unapproved = '';
    if (providedData.held == 0) {
      approved = '0';
      unapproved = '0';
    }
    else {
      approved = ((providedData.approved / providedData.held) * 100).toFixed(2);
      unapproved = ((providedData.unApproved / providedData.held) * 100).toFixed(2);
    }
    approvedata = `{ "name": "Approved", "y": ` + approved + ` }`;
    unapprovedata = `{ "name": "Un-Approved", "y": ` + unapproved + ` }`;

    chartJson = chartJson.replace("$approved", approvedata);
    chartJson = chartJson.replace("$unapproved", unapprovedata);
    return JSON.parse(chartJson);

  }
  else if (chartyType == "heldPie") {

    //  alert('here')
    var chartJson = `{
      "chart": { "plotBackgroundColor": null,
        "plotBorderWidth": null,
        "plotShadow": false,
        "type": "pie" },
      "colors":
        ["#6689f294", "#f27782ab"],
      "title": { "text": "" },
      "tooltip": {
        "headerFormat": "<span style='font-size:11px'>{series.name}</span><br>",
        "pointFormat": "<span style='color:{point.color}'>{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>"
      },
      "plotOptions": {
        "pie": {
            "allowPointSelect": true,
            "cursor": "pointer",
            "size": "200",
            "dataLabels": {
                "enabled": false
            },
            "showInLegend": true
        }
    },
    "credits": {
      "enabled": false
    },
      "series": [
        {
          "name": "Held VS Un-Un-held", "colorByPoint": true,
          "data": [
            $held,
            $unheld
          ]
        }]
    }`;

    var helddata = "";
    var unhelddata = "";

    var held = '';
    var unheld = '';
    if (providedData.held == 0) {
      held = '0';
      unheld = '0';
    }
    else {
      held = ((providedData.held / providedData.scheduled) * 100).toFixed(2);
      unheld = (((providedData.scheduled - providedData.held) / providedData.scheduled) * 100).toFixed(2);
    }
    helddata = `{ "name": "Held", "y": ` + held + ` }`;
    unhelddata = `{ "name": "Un-Held", "y": ` + unheld + ` }`;

    chartJson = chartJson.replace("$held", helddata);
    chartJson = chartJson.replace("$unheld", unhelddata);

    return JSON.parse(chartJson);

  }

  else if (chartyType == "formcolectionPie") {




    var chartJson = `{
      "chart": { "plotBackgroundColor": null,
        "plotBorderWidth": null,
        "plotShadow": false,
        "type": "pie" },
      "colors":
        ["#273b73e6", "#f32330e0"],
      "title": { "text": "" },
      "tooltip": {
        "headerFormat": "<span style='font-size:11px'>{series.name}</span><br>",
        "pointFormat": "<span style='color:{point.color}'>{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>"
      },
      "plotOptions": {
        "pie": {
            "allowPointSelect": true,
            "cursor": "pointer",
            "size": "200",
            "dataLabels": {
                "enabled": false
            },
            "showInLegend": true
        }
    },
    "credits": {
      "enabled": false
    },
      "series": [
        {
          "name": "Morning VS Afternoon", "colorByPoint": true,
          "data": [
            $approved,
            $unapproved
          ]
        }]
    }`;

    var approvedata = "";
    var unapprovedata = "";

    var morning = 0;
    var evening = 0;

    var sumT = 0;

    var approved = '';
    var unapproved = '';
    if (providedData.length == 0) {
      approved = '0';
      unapproved = '0';
    }
    else {
      morning = providedData.find(e => e.description == 'Morning').formCollection;
      evening = providedData.find(e => e.description == 'Afternoon').formCollection;
      sumT = morning + evening;
      approved = ((morning / sumT) * 100).toFixed(2);
      unapproved = ((evening / sumT) * 100).toFixed(2);
    }
    approvedata = `{ "name": "Morning: ` + morning.toString() + `", "y": ` + approved + ` }`;
    unapprovedata = `{ "name": "Afternoon: ` + evening.toString() + `", "y": ` + unapproved + ` }`;

    chartJson = chartJson.replace("$approved", approvedata);
    chartJson = chartJson.replace("$unapproved", unapprovedata);
    return JSON.parse(chartJson);

  }

  else if (chartyType == "feePaidPie") {




    var chartJson = `{
      "chart": { "plotBackgroundColor": null,
        "plotBorderWidth": null,
        "plotShadow": false,
        "type": "pie" },
      "colors":
      ["#6689f294", "#f27782ab"],
      "title": { "text": "" },
      "tooltip": {
        "headerFormat": "<span style='font-size:11px'>{series.name}</span><br>",
        "pointFormat": "<span style='color:{point.color}'>{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>"
      },
      "plotOptions": {
        "pie": {
            "allowPointSelect": true,
            "cursor": "pointer",
            "size": "200",
            "dataLabels": {
                "enabled": false
            },
            "showInLegend": true
        }
    },
    "credits": {
      "enabled": false
    },
      "series": [
        {
          "name": "Morning VS Afternoon", "colorByPoint": true,
          "data": [
            $approved,
            $unapproved
          ]
        }]
    }`;

    var approvedata = "";
    var unapprovedata = "";

    var morning = 0;
    var evening = 0;

    var sumT = 0;

    var approved = '';
    var unapproved = '';
    if (providedData.length == 0) {
      approved = '0';
      unapproved = '0';
    }
    else {
      morning = providedData.find(e => e.description == 'Morning').feePaid;
      evening = providedData.find(e => e.description == 'Afternoon').feePaid;
      sumT = morning + evening;
      approved = ((morning / sumT) * 100).toFixed(2);
      unapproved = ((evening / sumT) * 100).toFixed(2);
    }
    approvedata = `{ "name": "Morning: ` + morning.toString() + `", "y": ` + approved + ` }`;
    unapprovedata = `{ "name": "Afternoon: ` + evening.toString() + `", "y": ` + unapproved + ` }`;

    chartJson = chartJson.replace("$approved", approvedata);
    chartJson = chartJson.replace("$unapproved", unapprovedata);
    return JSON.parse(chartJson);

  }

  else if (chartyType == "horizontalBar") {

    //  alert('here')
    var chartJson = `{
      "chart": {
        "type": "bar"
      },
      "colors":
        ["$color"],
      "title": {
        "text": null
      },
      "xAxis": {
        "categories": ["$cityName"],
        "title": {
          "text": null
        }
      },
      "yAxis": {
        "min": 0,
        "max": $max,
        "title": {
          "text": "Amount in PKR",
          "align": "high"
        },
        "plotLines": [{
          "color": "#F5B038",
          "dashStyle": "shortdash",
          "width": 2,
          "value": $value,
          "zIndex": 5
        }]
      },
      "tooltip": {
        "valueSuffix": " PKR"
      },
      "plotOptions": {
        "series": {
          "pointWidth": 30
      },
        "bar": {
          "dataLabels": {
            "enabled": true
          }
        }
      },
      "legend": {
        "layout": "vertical",
        "align": "right",
        "verticalAlign": "top",
        "x": -40,
        "y": 80,
        "floating": true,
        "borderWidth": 1,
        "shadow": true
      },
      "credits": {
        "enabled": false
      },
      "series": [{
        "name": "Concession Amount",
        "data": [$data]
      }]
    }`;

    var cityName = "";
    var color = "";
    var max = 0;

    var value = 0;

    var data = 0;



    if (providedData.actualAmount == 0) {
      cityName = "";
      color = "";
      max = 0;

      value = 0;

      data = 0;
    }
    else {
      cityName = providedData.cityName;






      data = providedData.discountAmount;

      value = ((20 * providedData.actualAmount) / 100);


      if (data > value) {
        color = "#c114149c";
        max = data * 1.3;
      }

      else {
        color = "#1e791ec4";
        max = value * 1.3;
      }


    }
    chartJson = chartJson.replace("$cityName", cityName);
    chartJson = chartJson.replace("$data", data.toString());
    chartJson = chartJson.replace("$value", value.toString());
    chartJson = chartJson.replace("$color", color);
    chartJson = chartJson.replace("$max", max.toString());

    // console.log(chartJson);

    return JSON.parse(chartJson);

  }
  else if (chartyType == "revenueBar") {
    var chartJson = `{
      "chart": {
        "type": "column"
      },
      "colors":
        ["#8b8abb", "#ff9dab", "#a2a0fe", "#ffc1ca"],
      "title": {
        "text": null
      },
      "xAxis": {
        "categories": [
          $xdata
        ],
        "crosshair": true
      },
      "yAxis": {
        "min": 0,
        "title": {
          "text": "Value"
        }
      },
      "tooltip": {
        "headerFormat": "<span style='font-size:10px'>{point.key}</span><table>",
        "pointFormat": "<tr><td style='color:{series.color};padding:0'>{series.name}: </td> + <td style='padding:0'><b>{point.y} </b></td></tr>",
        "footerFormat": "</table>",
        "shared": true,
        "useHTML": true
      },
      "plotOptions": {
        "column": {
          "pointPadding": 0.2,
          "borderWidth": 0,
          "maxPointWidth": 30
        }
      },
      "legend": {
        "layout": "vertical",
        "align": "right",
        "verticalAlign": "top",
        "x": -5,
        "y": 40,
        "floating": true,
        "borderWidth": 1,
        "backgroundColor":
          "#FFFFFF",
        "shadow": true
      },
      "series": [{
        "name": "Revenue/Students",
        "data": [$rsdata]
       }]
    }`;

    var xdata = [];
    var rdata = [];
    var sdata = [];
    var rsdata = [];

    providedData.forEach(element => {
      xdata.push('"' + element.city + '"');
      rdata.push(element.revenue);
      sdata.push(element.students);
      rsdata.push(element.averagePrStd);

    });
    chartJson = chartJson.replace("$xdata", xdata.toString());
    chartJson = chartJson.replace("$rdata", rdata.toString());
    chartJson = chartJson.replace("$sdata", sdata.toString());
    chartJson = chartJson.replace("$rsdata", rsdata.toString());

    //console.log(chartJson);

    return JSON.parse(chartJson);


    // alert(xdata);
    // alert(rdata);
    // alert(sdata);
    // alert(rsdata);



  }

  else if (chartyType == "lastMonthsBar") {
    var chartJson = `{
      "chart": {
        "type": "column"
      },
      "colors":
        ["#8b8abb", "#ff9dab", "#a2a0fe", "#ffc1ca"],
      "title": {
        "text": null
      },
      "xAxis": {
        "categories": [
          $xdata
        ],
        "crosshair": true
      },
      "yAxis": {
        "min": 0,
        "title": {
          "text": "Value"
        }
      },
      "tooltip": {
        "headerFormat": "<span style='font-size:10px'>{point.key}</span><table>",
        "pointFormat": "<tr><td style='color:{series.color};padding:0'>{series.name}: </td> + <td style='padding:0'><b>{point.y} </b></td></tr>",
        "footerFormat": "</table>",
        "shared": true,
        "useHTML": true
      },
      "plotOptions": {
        "column": {
          "pointPadding": 0.2,
          "borderWidth": 0,
          "maxPointWidth": 30
        }
      },
      "legend": {
        "layout": "vertical",
        "align": "right",
        "verticalAlign": "top",
        "x": -5,
        "y": 40,
        "floating": true,
        "borderWidth": 1,
        "backgroundColor":
          "#FFFFFF",
        "shadow": true
      },
      "series": [{
        "name": "Attendance/Month",
        "data": [$rsdata]
       }],
       "credits": {
         "enabled": false
       }
    }`;

    var xdata = [];
    var rdata = [];
    var sdata = [];
    var rsdata = [];

    providedData.forEach(element => {
      xdata.push('"' + element.dated + '"');
      // rdata.push(element.revenue);
      // sdata.push(element.students);
      rsdata.push(element.percentage);

    });
    chartJson = chartJson.replace("$xdata", xdata.toString());
    chartJson = chartJson.replace("$rdata", rdata.toString());
    chartJson = chartJson.replace("$sdata", sdata.toString());
    chartJson = chartJson.replace("$rsdata", rsdata.toString());


    return JSON.parse(chartJson);


  }
  else if (chartyType == "lastMonthsBarRating") {
    var chartJson = `{
      "chart": {
        "type": "column"
      },
      "colors":
        ["#8b8abb", "#ff9dab", "#a2a0fe", "#ffc1ca"],
      "title": {
        "text": null
      },
      "xAxis": {
        "categories": [
          $xdata
        ],
        "crosshair": true
      },
      "yAxis": {
        "min": 0,
        "max": 5,
        "title": {
          "text": "Value"
        }
      },
      "tooltip": {
        "headerFormat": "<span style='font-size:10px'>{point.key}</span><table>",
        "pointFormat": "<tr><td style='color:{series.color};padding:0'>{series.name}: </td> + <td style='padding:0'><b>{point.y} </b></td></tr>",
        "footerFormat": "</table>",
        "shared": true,
        "useHTML": true
      },
      "plotOptions": {
        "column": {
          "pointPadding": 0.2,
          "borderWidth": 0,
          "maxPointWidth": 30
        }
      },
      "legend": {
        "layout": "vertical",
        "align": "right",
        "verticalAlign": "top",
        "x": -5,
        "y": 40,
        "floating": true,
        "borderWidth": 1,
        "backgroundColor":
          "#FFFFFF",
        "shadow": true
      },
      "series": [{
        "name": "Rating/Month",
        "data": [$rsdata]
       }],
       "credits": {
         "enabled": false
       }
    }`;

    var xdata = [];
    var rdata = [];
    var sdata = [];
    var rsdata = [];

    providedData.forEach(element => {
      xdata.push('"' + element.month + '"');
      // rdata.push(element.revenue);
      // sdata.push(element.students);
      rsdata.push(element.average);

    });
    chartJson = chartJson.replace("$xdata", xdata.toString());
    chartJson = chartJson.replace("$rdata", rdata.toString());
    chartJson = chartJson.replace("$sdata", sdata.toString());
    chartJson = chartJson.replace("$rsdata", rsdata.toString());


    return JSON.parse(chartJson);


  }

  else if (chartyType == "SectionBarRating") {
    var chartJson = `{
      "chart": {
        "type": "column"
      },
      "colors":
        ["#8b8abb", "#ff9dab", "#a2a0fe", "#ffc1ca"],
      "title": {
        "text": null
      },
      "xAxis": {
        "categories": [
          $xdata
        ],
        "crosshair": true
      },
      "yAxis": {
        "min": 0,
        "max": 5,
        "title": {
          "text": "Value"
        }
      },
      "tooltip": {
        "headerFormat": "<span style='font-size:10px'>{point.key}</span><table>",
        "pointFormat": "<tr><td style='color:{series.color};padding:0'>{series.name}: </td> + <td style='padding:0'><b>{point.y} </b></td></tr><tr><td style='color:{series.color};padding:0'>Total Submitted: </td> + <td style='padding:0'><b>{point.totalSubmitted} </b></td></tr>",
        "footerFormat": "</table>",
        "shared": true,
        "useHTML": true
      },
      "plotOptions": {
        "column": {
          "pointPadding": 0.2,
          "borderWidth": 0,
          "maxPointWidth": 30
        }
      },
      "legend": {
        "layout": "vertical",
        "align": "right",
        "verticalAlign": "top",
        "x": -5,
        "y": 40,
        "floating": true,
        "borderWidth": 1,
        "backgroundColor":
          "#FFFFFF",
        "shadow": true
      },
      "series": [{
        "name": "Rating/Section",
        "data": $rsdata
       }],
       "credits": {
         "enabled": false
       }
    }`;

    var xdata = [];
    var rdata = [];
    var sdata = [];
    var rsdata = [];

    providedData.forEach(element => {
      xdata.push('"' + element.sectionName + '"');
      // rdata.push(element.revenue);
      // sdata.push(element.students);
      rsdata.push({y:element.average,totalSubmitted:element.totalSubmitted});

    });

    // console.log(rsdata)
    chartJson = chartJson.replace("$xdata", xdata.toString());
    chartJson = chartJson.replace("$rdata", rdata.toString());
    chartJson = chartJson.replace("$sdata", sdata.toString());
    chartJson = chartJson.replace("$rsdata", JSON.stringify(rsdata).toString());

    // console.log(JSON.parse(chartJson))
    return JSON.parse(chartJson);


  }
  else if (chartyType == "lowCityBar") {
    var chartJson = `{
      "chart": {
        "type": "column"
      },
      "colors":
        [ "#ff9dab"],
      "title": {
        "text": null
      },
      "xAxis": {
        "categories": [
          $xdata
        ],
        "crosshair": true
      },
      "yAxis": {
        "min": 0,
        "title": {
          "text": "Value"
        }
      },
      "tooltip": {
        "headerFormat": "<span style='font-size:10px'>{point.key}</span><table>",
        "pointFormat": "<tr><td style='color:{series.color};padding:0'>{series.name}: </td> + <td style='padding:0'><b>{point.y} </b></td></tr>",
        "footerFormat": "</table>",
        "shared": true,
        "useHTML": true
      },
      "plotOptions": {
        "column": {
          "pointPadding": 0.2,
          "borderWidth": 0,
          "maxPointWidth": 30
        }
      },
      "legend": {
        "layout": "vertical",
        "align": "right",
        "verticalAlign": "top",
        "x": -5,
        "y": 40,
        "floating": true,
        "borderWidth": 1,
        "backgroundColor":
          "#FFFFFF",
        "shadow": true
      },
      "series": [{
        "name": "Attendance/City",
        "data": [$rsdata]
       }],
       "credits": {
         "enabled": false
       }
    }`;

    var xdata = [];
    var rdata = [];
    var sdata = [];
    var rsdata = [];

    providedData.forEach(element => {
      xdata.push('"' + element.cityName + '"');
      // rdata.push(element.revenue);
      // sdata.push(element.students);
      rsdata.push(element.percentage);

    });
    chartJson = chartJson.replace("$xdata", xdata.toString());
    chartJson = chartJson.replace("$rdata", rdata.toString());
    chartJson = chartJson.replace("$sdata", sdata.toString());
    chartJson = chartJson.replace("$rsdata", rsdata.toString());

    console.log(JSON.parse(chartJson))


    return JSON.parse(chartJson);


  }
  else if (chartyType == "highCityBar") {
    var chartJson = `{
      "chart": {
        "type": "column"
      },
      "colors":
        ["#8b8abb"],
      "title": {
        "text": null
      },
      "xAxis": {
        "categories": [
          $xdata
        ],
        "crosshair": true
      },
      "yAxis": {
        "min": 0,
        "title": {
          "text": "Value"
        }
      },
      "tooltip": {
        "headerFormat": "<span style='font-size:10px'>{point.key}</span><table>",
        "pointFormat": "<tr><td style='color:{series.color};padding:0'>{series.name}: </td> + <td style='padding:0'><b>{point.y} </b></td></tr>",
        "footerFormat": "</table>",
        "shared": true,
        "useHTML": true
      },
      "plotOptions": {
        "column": {
          "pointPadding": 0.2,
          "borderWidth": 0,
          "maxPointWidth": 30
        }
      },
      "legend": {
        "layout": "vertical",
        "align": "right",
        "verticalAlign": "top",
        "x": -5,
        "y": 40,
        "floating": true,
        "borderWidth": 1,
        "backgroundColor":
          "#FFFFFF",
        "shadow": true
      },
      "series": [{
        "name": "Attendance/City",
        "data": [$rsdata]
       }],
       "credits": {
         "enabled": false
       }
    }`;

    var xdata = [];
    var rdata = [];
    var sdata = [];
    var rsdata = [];

    providedData.forEach(element => {
      xdata.push('"' + element.cityName + '"');
      // rdata.push(element.revenue);
      // sdata.push(element.students);
      rsdata.push(element.percentage);

    });
    chartJson = chartJson.replace("$xdata", xdata.toString());
    chartJson = chartJson.replace("$rdata", rdata.toString());
    chartJson = chartJson.replace("$sdata", sdata.toString());
    chartJson = chartJson.replace("$rsdata", rsdata.toString());


    return JSON.parse(chartJson);


  }
  else if (chartyType == "programBar") {
    var chartJson = `{
      "chart": {
        "type": "column"
      },
      "colors":
        ["#8b8abb", "#ff9dab", "#a2a0fe", "#ffc1ca"],
      "title": {
        "text": null
      },
      "xAxis": {
        "categories": [
          $xdata
        ],
        "crosshair": true
      },
      "yAxis": {
        "min": 0,
        "title": {
          "text": "Value"
        }
      },
      "tooltip": {
        "headerFormat": "<span style='font-size:10px'>{point.key}</span><table>",
        "pointFormat": "<tr><td style='color:{series.color};padding:0'>{series.name}: </td> + <td style='padding:0'><b>{point.y} </b></td></tr>",
        "footerFormat": "</table>",
        "shared": true,
        "useHTML": true
      },
      "plotOptions": {
        "column": {
          "pointPadding": 0.2,
          "borderWidth": 0,
          "maxPointWidth": 30
        }
      },
      "legend": {
        "layout": "vertical",
        "align": "right",
        "verticalAlign": "top",
        "x": -5,
        "y": 40,
        "floating": true,
        "borderWidth": 1,
        "backgroundColor":
          "#FFFFFF",
        "shadow": true
      },
      "series": [{
        "name": "Form Collection",
        "data": [$sdata]
       },{
        "name": "Fee Paid",
        "data": [$rsdata]
       }]
    }`;

    var xdata = [];
    var rdata = [];
    var sdata = [];
    var rsdata = [];

    providedData.forEach(element => {
      xdata.push('"' + element.description + '"');
      sdata.push(element.formCollection);
      rsdata.push(element.feePaid);

    });
    chartJson = chartJson.replace("$xdata", xdata.toString());
    chartJson = chartJson.replace("$sdata", sdata.toString());
    chartJson = chartJson.replace("$rsdata", rsdata.toString());

    //console.log(chartJson);

    return JSON.parse(chartJson);

  }

  else if (chartyType == "attenanceBar") {
    var chartJson = `{
      "chart": {
        "type": "column"
      },
      "colors":
        ["#8b8abb", "#ff9dab", "#a2a0fe", "#ffc1ca"],
      "title": {
        "text": null
      },
      "xAxis": {
        "categories": [
          "Scheduled vs Held"
        ],
        "crosshair": true
      },
      "yAxis": {
        "min": 0,
        "title": {
          "text": "Value"
        }
      },
      "tooltip": {
        "headerFormat": "<span style='font-size:10px'>{point.key}</span><table>",
        "pointFormat": "<tr><td style='color:{series.color};padding:0'>{series.name}: </td> + <td style='padding:0'><b>{point.y} </b></td></tr>",
        "footerFormat": "</table>",
        "shared": true,
        "useHTML": true
      },
      "plotOptions": {
        "column": {
          "pointPadding": 0.2,
          "borderWidth": 0,
          "maxPointWidth": 30
        }
      },
      "legend": {
        "layout": "vertical",
        "align": "right",
        "verticalAlign": "top",
        "x": -5,
        "y": 40,
        "floating": true,
        "borderWidth": 1,
        "backgroundColor":
          "#FFFFFF",
        "shadow": true
      },
      "series": [{
        "name": "Scheduled",
        "data": [$sdata]
       },{
        "name": "Held",
        "data": [$rsdata]
       }],
       "credits": {
         "enabled": false
       }
    }`;

    var xdata = [];
    var rdata = [];
    var sdata = [];
    var rsdata = [];

    // providedData.forEach(element => {
    //   xdata.push('"' + element.description + '"');
    //   sdata.push(element.formCollection);
    //   rsdata.push(element.feePaid);

    // });

    sdata = providedData.scheduled;
    rsdata = providedData.held;
    // chartJson = chartJson.replace("$xdata", xdata.toString());
    chartJson = chartJson.replace("$sdata", sdata.toString());
    chartJson = chartJson.replace("$rsdata", rsdata.toString());

    //console.log(chartJson);

    return JSON.parse(chartJson);

  }

  else if (chartyType == "trendingLine") {
    var chartJson = `{
      "chart": {
        "backgroundColor": "#959cb61a",
        "type": "line"
      },
      "colors":
        ["#8b8abb", "#ff9dab", "#a2a0fe", "#ffc1ca"],
      "title": {
        "text": null
      },
      "xAxis": {
        "categories": [
          $sdata
        ]
      },
      "yAxis": {
        "title": {
          "text": null
        }
      },
      "plotOptions": {
        "series": {
          "label": {
            "connectorAllowed": false
          }
        }
      },
      "legend": {
        "layout": "vertical",
        "align": "right",
        "verticalAlign": "middle"
      },
      "series": [{
        "name": "Admission",
        "data": [$rsdata]
       }],
"responsive": {
         "rules": [{
           "condition": {
             "maxWidth": 500
           },
           "chartOptions": {
             "legend": {
               "layout": "horizontal",
               "align": "center",
               "verticalAlign": "bottom"
             }
           }
         }]
       }
    }`;

    var xdata = [];
    var rdata = [];
    var sdata = [];
    var rsdata = [];

    providedData.forEach(element => {
      sdata.push('"' + moment(element.paidDate).format('DD-MM-YYYY') + '"');
      // sdata.push(element.paidDate);
      rsdata.push(element.count);

    });
    // chartJson = chartJson.replace("$xdata", xdata.toString());
    chartJson = chartJson.replace("$sdata", sdata.toString());
    chartJson = chartJson.replace("$rsdata", rsdata.toString());

    // console.log(chartJson);

    return JSON.parse(chartJson);

  }

  else if (chartyType == "MonthLineRating") {
    var chartJson = `{
      "chart": {
        "backgroundColor": "#959cb61a",
        "type": "line"
      },
      "colors":
        ["#8b8abb", "#ff9dab", "#a2a0fe", "#ffc1ca"],
      "title": {
        "text": null
      },
      "xAxis": {
        "categories": [
          $sdata
        ]
      },
      "yAxis": {
        "min": 0,
        "max": 5,
        "title": {
          "text": null
        }
      },
      "plotOptions": {
        "series": {
          "label": {
            "connectorAllowed": false
          }
        }
      },
      "legend": {
        "layout": "vertical",
        "align": "right",
        "verticalAlign": "middle"
      },
      "series": [{
        "name": "Rating",
        "data": [$rsdata]
       }],
"responsive": {
         "rules": [{
           "condition": {
             "maxWidth": 500
           },
           "chartOptions": {
             "legend": {
               "layout": "horizontal",
               "align": "center",
               "verticalAlign": "bottom"
             }
           }
         }]
       }
    }`;

    var xdata = [];
    var rdata = [];
    var sdata = [];
    var rsdata = [];

    providedData.forEach(element => {
      sdata.push('"' + element.month + '"');
      // sdata.push(element.paidDate);
      rsdata.push(element.average);

    });
    // chartJson = chartJson.replace("$xdata", xdata.toString());
    chartJson = chartJson.replace("$sdata", sdata.toString());
    chartJson = chartJson.replace("$rsdata", rsdata.toString());

    // console.log(chartJson);

    return JSON.parse(chartJson);

  }

};