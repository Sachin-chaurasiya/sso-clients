import axios, { AxiosError, AxiosResponse } from 'axios';

// Types
interface Tokens {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

interface User {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
}

// Logic

export default class Auth0OAuth2 {
  protected appID: string;
  protected domain: string;
  protected appSecret: string;
  protected callback: string;
  protected state: any;
  protected scopes: string[] = ['openid', 'profile', 'email', 'offline_access'];
  protected user: User | undefined;
  protected tokens: Tokens | undefined;

  constructor(
    appID: string,
    appSecret: string,
    callback: string,
    domain: string,
    scopes: string[],
    state?: any
  ) {
    this.appID = appID;
    this.appSecret = appSecret;
    this.callback = callback;
    this.domain = domain;
    this.scopes = scopes.length ? scopes : this.scopes;
    this.state = state;
    this.user = undefined;
    this.tokens = undefined;
  }

  // public methods

  public getName(): string {
    return 'auth0';
  }

  public getLoginURL(): string {
    return `https://${this.domain}/authorize?${new URLSearchParams({
      client_id: this.appID,
      redirect_uri: this.callback,
      state: JSON.stringify(this.state),
      scope: this.getScopes().join(' '),
      response_type: 'code',
    })}`;
  }

  public async getTokens(code: string): Promise<Tokens> {
    if (!this.tokens) {
      const payload = new URLSearchParams({
        code,
        client_id: this.appID,
        client_secret: this.appSecret,
        redirect_uri: this.callback,
        scope: this.getScopes().join(' '),
        grant_type: 'authorization_code',
      });

      const response: AxiosResponse = await this.request(
        'POST',
        `https://${this.domain}/oauth/token`,
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        payload.toString()
      );

      this.tokens = response.data as Tokens;
    }

    return this.tokens;
  }

  public async refreshTokens(refreshToken: string): Promise<Tokens> {
    const payload = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: this.appID,
      client_secret: this.appSecret,
      grant_type: 'refresh_token',
    });

    const response: AxiosResponse = await this.request(
      'POST',
      `https://${this.domain}/oauth/token`,
      {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      payload.toString()
    );

    this.tokens = response.data as Tokens;

    if (!this.tokens.refresh_token) {
      this.tokens.refresh_token = refreshToken;
    }

    return this.tokens;
  }

  public async getUserID(accessToken: string): Promise<string> {
    const user = await this.getUser(accessToken);

    return user.sub || '';
  }

  public async getUserEmail(accessToken: string): Promise<string> {
    const user = await this.getUser(accessToken);

    return user.email || '';
  }

  public async isEmailVerified(accessToken: string): Promise<boolean> {
    const user = await this.getUser(accessToken);

    return !!user.email_verified;
  }

  public async getUserName(accessToken: string): Promise<string> {
    const user = await this.getUser(accessToken);

    return user.name || '';
  }

  public async getUser(accessToken: string): Promise<User> {
    if (!this.user || Object.keys(this.user).length === 0) {
      const headers = {
        Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
      };

      const response: AxiosResponse = await this.request(
        'GET',
        `https://${this.domain}/userinfo`,
        headers
      );

      this.user = response.data as User;
    }

    return this.user;
  }

  // Protected methods

  protected async request(
    method: string,
    url: string,
    headers: Record<string, string> = {},
    payload = ''
  ): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.request({
        method,
        url,
        headers,
        data: payload,
      });

      return response;
    } catch (error) {
      throw new Error(
        `Failed to make a request: ${(error as AxiosError).message}`
      );
    }
  }

  protected getScopes(): string[] {
    return this.scopes;
  }
}
