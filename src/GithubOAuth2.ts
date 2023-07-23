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
  id?: string;
  email?: string;
  verified?: boolean;
  name?: string;
}

// Logic

export default class GithubOAuth2 {
  protected appID: string;
  protected appSecret: string;
  protected callback: string;
  protected state: any;
  protected scopes: string[] = ['user:email'];
  protected user: User | undefined;

  constructor(
    appID: string,
    appSecret: string,
    callback: string,
    scopes: string[],
    state?: any
  ) {
    this.appID = appID;
    this.appSecret = appSecret;
    this.callback = callback;
    this.scopes = scopes.length ? scopes : this.scopes;
    this.state = state;
    this.user = undefined;
  }

  // public methods

  public getName(): string {
    return 'github';
  }

  public getLoginURL(): string {
    return `https://github.com/login/oauth/authorize?${new URLSearchParams({
      client_id: this.appID,
      redirect_uri: this.callback,
      scope: this.getScopes().join(' '),
      state: JSON.stringify(this.state),
    })}`;
  }

  public async getTokens(code: string): Promise<Tokens> {
    const payload = new URLSearchParams({
      code,
      client_id: this.appID,
      client_secret: this.appSecret,
      redirect_uri: this.callback,
    });

    const response: AxiosResponse = await this.request(
      'POST',
      'https://github.com/login/oauth/access_token',
      {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      payload.toString()
    );

    const tokens = response.data as Tokens;

    return tokens;
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
      'https://github.com/login/oauth/access_token',
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

  public async getUserID(accessToken: string): Promise<string> {
    const user = await this.getUser(accessToken);

    return user.id || '';
  }

  public async getUserEmail(accessToken: string): Promise<string> {
    const user = await this.getUser(accessToken);

    return user.email || '';
  }

  public async isEmailVerified(accessToken: string): Promise<boolean> {
    const user = await this.getUser(accessToken);

    return !!user.verified;
  }

  public async getUserName(accessToken: string): Promise<string> {
    const user = await this.getUser(accessToken);

    return user.name || '';
  }

  public async getUser(accessToken: string): Promise<User> {
    if (!this.user || Object.keys(this.user).length === 0) {
      const response: AxiosResponse = await this.request(
        'GET',
        'https://api.github.com/user',
        {
          Authorization: `token ${encodeURIComponent(accessToken)}`,
        }
      );

      const userData = response.data as User;

      const emailsResponse: AxiosResponse = await this.request(
        'GET',
        'https://api.github.com/user/emails',
        {
          Authorization: `token ${encodeURIComponent(accessToken)}`,
        }
      );

      const emailsData: User[] = emailsResponse.data;

      for (const email of emailsData) {
        if (email.verified === true) {
          userData.email = email.email;
          userData.verified = email.verified;
          break;
        }
      }

      this.user = userData;
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
