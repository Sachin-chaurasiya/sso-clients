import axios, { AxiosError, AxiosResponse } from 'axios';

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
  protected state: any = {};
  protected scopes: string[] = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid',
  ];

  constructor(
    appID: string,
    appSecret: string,
    callback: string,
    state: any,
    scopes: string[] = []
  ) {
    this.appID = appID;
    this.appSecret = appSecret;
    this.callback = callback;
    this.state = state ?? {};
    this.scopes = scopes.length ? scopes : this.scopes;
  }

  public getName(): string {
    return 'google';
  }

  public getLoginURL(): string {
    return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: this.appID,
      redirect_uri: this.callback,
      scope: this.getScopes().join(' '),
      state: JSON.stringify(this.state),
      response_type: 'code',
    })}`;
  }

  public async getTokens(code: string): Promise<Tokens> {
    const payload = new URLSearchParams({
      code,
      client_id: this.appID,
      client_secret: this.appSecret,
      redirect_uri: this.callback,
      scope: '',
      grant_type: 'authorization_code',
    });

    const response: AxiosResponse = await this.request(
      'POST',
      'https://oauth2.googleapis.com/token',
      {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      payload.toString()
    );

    return response.data as Tokens;
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
      'https://oauth2.googleapis.com/token',
      {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      payload.toString()
    );

    const tokens = response.data as Tokens;

    if (!tokens.refresh_token) {
      tokens.refresh_token = refreshToken;
    }

    return tokens;
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

  protected async getUser(accessToken: string): Promise<User> {
    const response: AxiosResponse = await this.request(
      'GET',
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${encodeURIComponent(
        accessToken
      )}`
    );
    return response.data as User;
  }

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

  protected addScope(scope: string): GoogleOAuth2 {
    if (!this.scopes.includes(scope)) {
      this.scopes.push(scope);
    }
    return this;
  }

  protected getScopes(): string[] {
    return this.scopes;
  }
}
