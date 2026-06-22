import { default as Axios } from "axios";
import { GlobalConfig } from "../../../../common";
import { Store } from "vuex";
import { StoreService } from "../../../../store";

const BASE_URL = GlobalConfig.uri.services + "Reports/";

export class TransportationReportsService extends StoreService {
  constructor(store: Store<{}>) {
    super(store);
  }

  //Fee Reports Services

  //   public GetFeeDetail(predicate: string) {
  //     return this.exec<any>( Axios.post(BASE_URL + "GetFeeDetail", {
  //         ProvidedString: predicate
  //       }))
  //       .then(value => this.processPayload(value))
  //       .catch(error => console.error(error));
  //   }
   public GetTransportDefaultReport(predicate: string) 
   {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTransportDefaultReport", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetTransportFeeDetailReport(predicate: string) 
   {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTransportFeeDetailReport", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
}
