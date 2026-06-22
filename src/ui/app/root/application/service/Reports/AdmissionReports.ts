import { default as Axios } from "axios";
import { GlobalConfig } from "../../../../common";
import { Store } from "vuex";
import { StoreService } from "../../../../store";

const BASE_URL = GlobalConfig.uri.services + "Reports/";

export class ReportsService extends StoreService {
  constructor(store: Store<{}>) {
    super(store);
  }

  public Getprofile(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "StudentResetMicrosoftPassword", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetMask() {
    return this.exec<any>(
      Axios.get(BASE_URL + "GetMask")
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //Admission Reports Services

  public GetAdmissionDetail(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetail", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAdmissionDetailProg(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailProg", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAdmissionDetailSec(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailSec", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAdmissionDetailGen(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailGen", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAdmissionCityWise(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionCityWise", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAdmissionSOI(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionSOI", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionDetailFee(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionDetailFee", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetStepDetailGen(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllStepAdmissionDetailGen", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetFormReport(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFormReport", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetFormReportEx(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFormReportEx", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetMatricMarksReport(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetMatricMarksReport", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetMatricPercReport(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetMatricPercReport", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAllAdmissionDetailComp(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailComp", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  //********************************************/
  //********************************************/
  public GetAdmissionDetailEnrolled(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailEnrolled", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAdmissionDetailProgEnrolled(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailProgEnrolled", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAdmissionDetailSecEnrolled(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailSecEnrolled", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAdmissionDetailGenEnrolled(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailGenEnrolled", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAllAdmissionDetailCompEnrolled(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailCompEnrolled", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //********************************************/
  //********************************************/
  public GetAdmissionSlip(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionSlip", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAllAdmissionSlipEx(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionSlipEx", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAdmissionAcademicReport() {
    return this.exec<any>(Axios.get(BASE_URL + "GetAllAdmissionAcademicReport"))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportBoardWiseGen(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportBoardWiseGen", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetGenderCount(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetGenderCount", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetGenderConCount(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetGenderConCount", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetGenderConCountEx(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetGenderConCountEx", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetGenderCountEx(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetGenderCountEx", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportYearWiseGen(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportYearWiseGen", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportAddressWiseGen(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportAddressWiseGen", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportBoardWiseProg(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportBoardWiseProg", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportYearWiseProg(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportYearWiseProg", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportAddressWiseProg(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportAddressWiseProg", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportBoardWise(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportBoardWise", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportYearWise(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportYearWise", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportAddressWise(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportAddressWise", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportBoardWiseGenProg(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportBoardWiseGenProg", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportYearWiseGenProg(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportYearWiseGenProg", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetPreAdmissionReport(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetPreAdmissionReport", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetUndergraduateAdmissionReport(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetUndergraduateAdmissionReport", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetRegularAdmissionReport(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetRegularAdmissionReport", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAdmissionReportAddressWiseGenProg(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportAddressWiseGenProg", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportEnrolledBoardWiseGen(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportEnrolledBoardWiseGen", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportEnrolledYearWiseGen(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportEnrolledYearWiseGen", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportEnrolledAddressWiseGen(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportEnrolledAddressWiseGen", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportEnrolledBoardWiseProg(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportEnrolledBoardWiseProg", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportEnrolledYearWiseProg(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportEnrolledYearWiseProg", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportEnrolledAddressWiseProg(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportEnrolledAddressWiseProg", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportEnrolledBoardWise(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportEnrolledBoardWise", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportEnrolledYearWise(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportEnrolledYearWise", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportEnrolledAddressWise(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportEnrolledAddressWise", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportEnrolledBoardWiseGenProg(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportEnrolledBoardWiseGenProg", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportEnrolledYearWiseGenProg(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportEnrolledYearWiseGenProg", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionReportEnrolledAddressWiseGenProg(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionReportEnrolledAddressWiseGenProg", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  //Fee Reports Services

  // public GetFeeDetail() {
  //   return this.exec<any>(Axios.get(BASE_URL + "GetFeeDetail"))
  //     .then(value => this.processPayload(value))
  //     .catch(error => console.error(error));
  // }

  // public GetFeeDetailPaid() {
  //   return this.exec<any>(Axios.get(BASE_URL + "GetFeeDetailPaid"))
  //     .then(value => this.processPayload(value))
  //     .catch(error => console.error(error));
  // }

  public getTimeTableReport(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTimeTableReport", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
}
