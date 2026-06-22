import Vue from "vue";
import Component from "vue-class-component";

import "./style.scss";
import { RootStoreTypes, IRootStoreState } from "../../root/store";
import { State } from "vuex-class";

declare var Stimulsoft: any;

@Component({
    props: ["path", "data"],
    template: require("./report-engine.html")
})
export class ReportEngine extends Vue {
    path: string = (<any>this).path;
    data: any = (<any>this).data;

    @State((state: IRootStoreState) => state.reportOperation) report: any;

    beforeModalOpen(event) {
        this.initialize();
    }
    initialize() {        
        var options = new Stimulsoft.Viewer.StiViewerOptions();
        options.height = (83 * window.innerHeight) / 100 + "px";
        options.appearance.scrollbarsMode = true;
        options.toolbar.showDesignButton = false;
        options.toolbar.printDestination =
            Stimulsoft.Viewer.StiPrintDestination.Direct;
        options.appearance.htmlRenderMode =
            Stimulsoft.Report.Export.StiHtmlExportMode.Table;

        var viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
        var report = new Stimulsoft.Report.StiReport();
        var dataSet = new Stimulsoft.System.Data.DataSet("root");        

        dataSet.readJson(JSON.stringify(this.report.data));
        report.loadFile(this.report.path);

        report.dictionary.databases.clear();

        report.regData("root", "root", dataSet);
        report.dictionary.synchronize();

        Stimulsoft.Base.StiLicense.key = '6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHnyVF/eQhc/KDE85NYanz/T+5P4QCl7jNY7XApu9SIojHI8xKJ4IFXi2kWSNxMZv1f2VjL2Ox3UQ+9/7j9vyOC5zAu+OuJjo95DznU2TSBF/hvJ8UTMoS1M3j5F6egvjl/j5AOI3ci6wsDJE5/PWLBb6H3YYe67jwCi/20DPb7e8Hcx/1/04YDb6FkUG8ryRcz5nl4eRDg719Yu9xQmypiesqkwJy9JOWiQyHM1Qk07q9LlqwHaiuSidwve7O79+VCwO3Zkkq5hpcWTWJXWtQPPz4K8uOSBm3nILNIQz9Xzn1OYWElnt6ATEc184/8V327QE2pxzLWzgLDQ/aJGxleHm3yYurMiY6QvEsbRz67UET01gPTcYQ/20cT1ZRsgWiBBm4jo+01Da0BombvH2LEjcbR+pqIaZwbJQRPsKbBEJf8EUdwNmEnRGNPKKCGZkd9shU0VHWJItSKwItm2o4/LUd05F8IbVghy3Y+32/3SD2HMYJZFnRf7/r/5ATaJoqbKehJoCdf8NEcYlKtEQM2T';

        viewer.report = report;
        viewer.renderHtml("viewerContent");
    }

    close() {
        //this.$modal.hide("report-viewer-eng");

        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: null,
            path: '',
            show: false
        });
    }
}
