import { AxiosResponse } from 'axios';
interface Tokens {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
}
interface User {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
}
export default class GoogleOAuth2 {
    protected appID: string;
    protected appSecret: string;
    protected callback: string;
    protected state: any;
    protected scopes: string[];
    constructor(appID: string, appSecret: string, callback: string, scopes: string[], state?: any);
    getName(): string;
    getLoginURL(): string;
    getTokens(code: string): Promise<Tokens>;
    refreshTokens(refreshToken: string): Promise<Tokens>;
    getUserEmail(accessToken: string): Promise<string>;
    isEmailVerified(accessToken: string): Promise<boolean>;
    getUserName(accessToken: string): Promise<string>;
    getUser(accessToken: string): Promise<User>;
    protected request(method: string, url: string, headers?: Record<string, string>, payload?: string): Promise<AxiosResponse>;
    protected addScope(scope: string): GoogleOAuth2;
    protected getScopes(): string[];
}
export {};
