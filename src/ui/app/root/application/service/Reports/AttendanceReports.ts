import { default as Axios } from "axios";
import { Store } from "vuex";
import { GlobalConfig } from "../../../../common";
import { StoreService } from "../../../../store";

const BASE_URL = GlobalConfig.uri.services + "Reports/";

export class AttendanceReportsService extends StoreService {
  constructor(store: Store<{}>) {
    super(store);
  }

  //Attendance Reports Services

  public GetAdmissionDetail(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetail", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetAdmissionDetailProg(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailProg", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetAdmissionDetailSec(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailSec", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetAdmissionDetailGen(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailGen", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetAllAdmissionDetailComp(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailComp", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  //********************************************/
  //********************************************/
  public GetAdmissionDetailEnrolled(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailEnrolled", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetAdmissionDetailProgEnrolled(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailProgEnrolled", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetAdmissionDetailSecEnrolled(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailSecEnrolled", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetAdmissionDetailGenEnrolled(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailGenEnrolled", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetAllAdmissionDetailCompEnrolled(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionDetailCompEnrolled", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  //********************************************/
  //********************************************/
  public GetAdmissionSlip(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllAdmissionSlip", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetAdmissionAcademicReport() {
    return this.exec<any>(Axios.get(BASE_URL + "GetAllAdmissionAcademicReport"))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

}
