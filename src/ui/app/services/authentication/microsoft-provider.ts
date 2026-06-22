import { default as ClientOAuth2 } from 'client-oauth2';
import { Route } from 'vue-router';
import { default as jwtDecode } from "jwt-decode";
import { default as base64 } from "base-64";
import { ILoginClient, ILoginProvider, LoginProviders, PayloadMessageTypes } from '../../model';
import { GlobalConfig } from '../../common';
import { AuthenticationService } from './authentication-service';
import Store from '../../root/store/store';
import { StoreTypes } from '../../store';

const MICROSOFT_CLIENT_ID = '5150c9e8-c886-436d-9304-a19e06ecb8aa';
const MICROSOFT_TENENT_ID = '12b221b3-0464-4223-89e5-888835778b58';
// cf: https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols-implicit

const options: ClientOAuth2.Options = {
    clientId: MICROSOFT_CLIENT_ID,
    accessTokenUri: 'https://accounts.google.com/o/oauth2/token',
    authorizationUri: 'https://login.microsoftonline.com/' + MICROSOFT_TENENT_ID + '/oauth2/v2.0/authorize',
    redirectUri: 'https:' + GlobalConfig.uri.site,
    scopes: ['profile', 'email', 'openid'],
    query: {
        prompt: 'login',
        response_mode: 'fragment'
    }
};

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

export class MicrosoftClient implements ILoginClient {

    private client: ClientOAuth2;
    private auth: AuthenticationService;

    constructor() {
        this.auth = new AuthenticationService(Store);
    }

    public get clientId(): string {
        return MICROSOFT_CLIENT_ID;
    }

    public get iconClass(): string {
        return 'fa-windows';
    }

    public get localeKeys() {
        return {
            name: 'login.provider.microsoft'
        };
    }

    public get providerId(): string {
        return LoginProviders.Microsoft;
    }

    getAccessToken(route: Route): string {
        let hash = JSON.stringify(route.query);
        let token: string = null;

        if (hash) {
            if (hash.toString().indexOf('id_token') != -1) {
                token = hash.toString().split('=')[1].toString();
                let decodedToken: IJwtToken = jwtDecode(token);

                if (decodedToken.nonce) {
                    window.localStorage.setItem('microsoft-auth', JSON.stringify(decodedToken));
                    this.auth.login({ username: decodedToken.email.toLowerCase(), password: 'P@kht00nKhw@h' })
                        .then((value) => Store.dispatch(StoreTypes.updateUser, value))
                        .then(() => Store.dispatch(StoreTypes.updateStatusBar, null))
                        .then(() => { window.location.href = (window.location.origin + '/home'); })
                        .catch(() => { });
                } else {
                    Store.dispatch(StoreTypes.updateStatusBar, {
                        title: 'Invalid',
                        text: 'Please contact IT department for your User Varification.',
                        messageTypeId: PayloadMessageTypes.warning
                    });
                }
            }
        }

        return token;
    }

    getUri(provider: ILoginProvider): string {

        if (!this.client) {
            let opts = Object.assign({}, options);
            opts.query['nonce'] = provider.nonce;
            this.client = new ClientOAuth2(opts);
        }

        let uri = this.client.token.getUri();
        uri = uri.replace('response_type=token', 'response_type=id_token');
        uri = uri.replace('state=', 'state=12345');

        return uri;
    }
}