import { default as Axios } from "axios";
import { Store } from "vuex";
import { GlobalConfig } from "../../../../common";
import { StoreService } from "../../../../store";

const BASE_URL = GlobalConfig.uri.services + "Reports/";

export class EnrolledReportsService extends StoreService {
  constructor(store: Store<{}>) {
    super(store);
  }

  public GetStudentsUsernameAndPassword(predicate: string) {
    return this.exec<any>( Axios.post(BASE_URL + "GetStudentsUsernameAndPassword", {
        ProvidedString: predicate
      }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetStudentsStruckOff(predicate: string) {
    return this.exec<any>( Axios.post(BASE_URL + "GetStudentsStruckOff", {
        ProvidedString: predicate
      }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetWithDrawllist(predicate: string) {
    return this.exec<any>( Axios.post(BASE_URL + "GetWithDrawllist", {
        ProvidedString: predicate
      }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetEnrolledStudents(predicate: string) {
    return this.exec<any>( Axios.post(BASE_URL + "GetEnrolledStudents", {
        ProvidedString: predicate
      }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetEnrolledStudentsContact(predicate: string) {
    return this.exec<any>( Axios.post(BASE_URL + "GetEnrolledStudentsContact", {
        ProvidedString: predicate
      }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }


  public GetStdMailingLabel(predicate: string) {
    return this.exec<any>( Axios.post(BASE_URL + "GetStdMailingLabel", {
        ProvidedString: predicate
      }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

// public GetStepEnrollmentReport(predicate: string) {
//     return this.exec<any>( Axios.post(BASE_URL + "GetStepEnrollmentReport", {
//         ProvidedString: predicate
//       }))
//       .then(value => this.processPayload(value))
//       .catch(error => console.error(error));
//   }

public GetStepEnrollmentReport(predicate: { ProvidedString: string }) {
  return this.exec<any>(
    Axios.post(BASE_URL + "GetStepEnrollmentReport", predicate)
  )
  .then(value => this.processPayload(value))
  .catch(error => console.error(error));
}





  public GetEnrolledStudentsWithoutadd(predicate: string) {
    return this.exec<any>( Axios.post(BASE_URL + "GetEnrolledStudentsWithoutadd", {
        ProvidedString: predicate
      }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetAwardList(predicate: string) {
    return this.exec<any>( Axios.post(BASE_URL + "GetAwardList", {
        ProvidedString: predicate
      }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  // public GetEnrolledStudentsCount(predicate: string) {
  //   return this.exec<any>( Axios.post(BASE_URL + "GetEnrolledStudentsCount", {
  //       ProvidedString: predicate
  //     }))
  //     .then(value => this.processPayload(value))
  //     .catch(error => console.error(error));
  // }

  // public GetEnrolledStudentsRef(predicate: string) {
  //   return this.exec<any>( Axios.post(BASE_URL + "GetEnrolledStudentsRef", {
  //       ProvidedString: predicate
  //     }))
  //     .then(value => this.processPayload(value))
  //     .catch(error => console.error(error));
  // }
  // public GetEnrolledStudentsBoard(predicate: string) {
  //   return this.exec<any>( Axios.post(BASE_URL + "GetEnrolledStudentsBoard", {
  //       ProvidedString: predicate
  //     }))
  //     .then(value => this.processPayload(value))
  //     .catch(error => console.error(error));
  // }
  // public GetEnrolledStudentsReligion(predicate: string) {
  //   return this.exec<any>( Axios.post(BASE_URL + "GetEnrolledStudentsReligion", {
  //       ProvidedString: predicate
  //     }))
  //     .then(value => this.processPayload(value))
  //     .catch(error => console.error(error));
  // }
  // public GetEnrolledStudentsMarks(predicate: string) {
  //   return this.exec<any>( Axios.post(BASE_URL + "GetEnrolledStudentsMarks", {
  //       ProvidedString: predicate
  //     }))
  //     .then(value => this.processPayload(value))
  //     .catch(error => console.error(error));
  // }

}
