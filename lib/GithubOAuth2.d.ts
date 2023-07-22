import { AxiosResponse } from 'axios';
interface Tokens {
    access_token: string;
    token_type?: string;
    expires_in?: number;
    refresh_token?: string;
    scope?: string;
}
interface User {
    id?: string;
    email?: string;
    verified?: boolean;
    name?: string;
}
export default class GithubOAuth2 {
    protected appID: string;
    protected appSecret: string;
    protected callback: string;
    protected state: any;
    protected scopes: string[];
    protected user: User | undefined;
    constructor(appID: string, appSecret: string, callback: string, scopes: string[], state?: any);
    getName(): string;
    getLoginURL(): string;
    getTokens(code: string): Promise<Tokens>;
    refreshTokens(refreshToken: string): Promise<Tokens>;
    getUserID(accessToken: string): Promise<string>;
    getUserEmail(accessToken: string): Promise<string>;
    isEmailVerified(accessToken: string): Promise<boolean>;
    getUserName(accessToken: string): Promise<string>;
    getUser(accessToken: string): Promise<User>;
    protected request(method: string, url: string, headers?: Record<string, string>, payload?: string): Promise<AxiosResponse>;
    protected getScopes(): string[];
}
export {};
