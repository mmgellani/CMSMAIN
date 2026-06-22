import { default as jwtDecode } from "jwt-decode";
import { AuthenticationService } from ".";
import { PayloadMessageTypes } from "../model";
import Store from '../root/store/store';
import { StoreTypes } from '../store';


declare var Msal: any;

const MICROSOFT_CLIENT_ID = '5150c9e8-c886-436d-9304-a19e06ecb8aa';
const MICROSOFT_TENENT_ID = '12b221b3-0464-4223-89e5-888835778b58';
const PROD_REDIRECT_URI = window.location.origin;

interface IJwtToken {
    aud: string;
    iss: string;
    iat: number;
    nbf: number;
    exp: number;
    aio: string;
    email: string;
    name: string;
    nonce: string;
    oid: string;
    preferred_username: string;
    sub: string;
    tid: string;
    uti: string;
    ver: string;
};

export default class ExAuthService {
    private app: any;
    private applicationConfig;
    private accessTokenRequest = {
        scopes: ["user.read"],
        prompt: 'select_account',
    }
    private config = {
        auth: {
            clientId: MICROSOFT_CLIENT_ID,
            authority: `https://login.microsoftonline.com/${MICROSOFT_TENENT_ID}`,
            redirectUri: PROD_REDIRECT_URI,
        }
    }

    private auth: AuthenticationService;

    constructor() {
        this.auth = new AuthenticationService(Store);
        this.app = new Msal.UserAgentApplication(this.config);
    }

    login() {
        return this.app.loginPopup(this.accessTokenRequest)
            .then(
                response => {
                    let decodedToken: IJwtToken = jwtDecode(response.idToken.rawIdToken);
                    if (decodedToken.nonce) {
                        window.localStorage.setItem('microsoft-auth', JSON.stringify(decodedToken));
                        this.auth.login({ username: decodedToken.preferred_username.toLowerCase(), password: response.idToken.rawIdToken })
                            .then((value) => Store.dispatch(StoreTypes.updateUser, value))
                            .then(() => Store.dispatch(StoreTypes.updateStatusBar, null))
                            .then(() => { window.location.href = `${PROD_REDIRECT_URI}/home` })

                    }
                }

            )
    };
    async logout() {
        this.app.logout();
    };
}