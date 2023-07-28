import GoogleOAuth2 from '../lib/GoogleOAuth2';
import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';

jest.mock('axios');

describe('GoogleOAuth2', () => {
  const createAxiosResponse = (data: any): AxiosResponse => {
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as AxiosRequestHeaders },
    };
  };

  const createGoogleOAuth2Instance = () => {
    const appID = 'your_app_id';
    const appSecret = 'your_app_secret';
    const callback = 'https://example.com/oauth/callback';
    const scopes = ['scope1', 'scope2'];

    return new GoogleOAuth2(appID, appSecret, callback, scopes);
  };

  const mockGetUserResponse = {
    sub: 'user_id',
    email: 'user@example.com',
    email_verified: true,
    name: 'John Doe',
  };

  it('should construct the correct login URL', () => {
    const googleOAuth2 = createGoogleOAuth2Instance();
    const expectedURL =
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=your_app_id&redirect_uri=https%3A%2F%2Fexample.com%2Foauth%2Fcallback&scope=scope1+scope2&state=undefined&response_type=code';

    expect(googleOAuth2.getLoginURL()).toBe(expectedURL);
  });

  it('should fetch user tokens successfully', async () => {
    const googleOAuth2 = createGoogleOAuth2Instance();

    const mockTokensResponse = {
      access_token: 'access_token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'refresh_token',
      scope: 'scope1 scope2',
    };

    (axios.request as jest.Mock).mockResolvedValue(
      createAxiosResponse(mockTokensResponse)
    );

    const tokens = await googleOAuth2.getTokens('authorization_code');

    expect(tokens).toEqual(mockTokensResponse);
  });

  it('should refresh user tokens successfully', async () => {
    const googleOAuth2 = createGoogleOAuth2Instance();

    const mockRefreshTokensResponse = {
      access_token: 'new_access_token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'refresh_token',
      scope: 'scope1 scope2',
    };

    (axios.request as jest.Mock).mockResolvedValue(
      createAxiosResponse(mockRefreshTokensResponse)
    );

    const tokens = await googleOAuth2.refreshTokens('refresh_token');

    expect(tokens).toEqual(mockRefreshTokensResponse);
  });

  it('should fetch user email', async () => {
    const googleOAuth2 = createGoogleOAuth2Instance();

    const mockUserResponse = {
      email: 'user@example.com',
    };

    (axios.request as jest.Mock).mockResolvedValue(
      createAxiosResponse(mockUserResponse)
    );

    const email = await googleOAuth2.getUserEmail('access_token');

    expect(email).toBe(mockUserResponse.email);
  });

  it('should check if user email is verified', async () => {
    const googleOAuth2 = createGoogleOAuth2Instance();

    const mockUserResponse = {
      email_verified: true,
    };

    (axios.request as jest.Mock).mockResolvedValue(
      createAxiosResponse(mockUserResponse)
    );

    const isEmailVerified = await googleOAuth2.isEmailVerified('access_token');

    expect(isEmailVerified).toBe(true);
  });

  it('should fetch user name', async () => {
    const googleOAuth2 = createGoogleOAuth2Instance();

    const mockUserResponse = {
      name: 'John Doe',
    };

    (axios.request as jest.Mock).mockResolvedValue(
      createAxiosResponse(mockUserResponse)
    );

    const name = await googleOAuth2.getUserName('access_token');

    expect(name).toBe(mockUserResponse.name);
  });

  it('should fetch user details', async () => {
    const googleOAuth2 = createGoogleOAuth2Instance();

    (axios.request as jest.Mock).mockResolvedValue(
      createAxiosResponse(mockGetUserResponse)
    );

    const user = await googleOAuth2.getUser('access_token');

    expect(user).toEqual(mockGetUserResponse);
  });

  it('should handle errors when fetching user tokens', async () => {
    const googleOAuth2 = createGoogleOAuth2Instance();

    const errorMessage = 'Failed to get tokens';
    const mockErrorResponse: AxiosError = {
      message: errorMessage,
      name: 'Error',
      config: { headers: {} as AxiosRequestHeaders },
      isAxiosError: true,
      toJSON: () => ({}),
    };

    (axios.request as jest.Mock).mockRejectedValue(mockErrorResponse);

    await expect(googleOAuth2.getTokens('authorization_code')).rejects.toThrow(
      errorMessage
    );
  });

  it('should handle errors when refreshing user tokens', async () => {
    const googleOAuth2 = createGoogleOAuth2Instance();

    const errorMessage = 'Failed to refresh tokens';
    const mockErrorResponse: AxiosError = {
      message: errorMessage,
      name: 'Error',
      config: { headers: {} as AxiosRequestHeaders },
      isAxiosError: true,
      toJSON: () => ({}),
    };

    (axios.request as jest.Mock).mockRejectedValue(mockErrorResponse);

    await expect(googleOAuth2.refreshTokens('refresh_token')).rejects.toThrow(
      errorMessage
    );
  });

  it('should handle errors when fetching user details', async () => {
    const googleOAuth2 = createGoogleOAuth2Instance();

    const errorMessage = 'Failed to get user details';
    const mockErrorResponse: AxiosError = {
      message: errorMessage,
      name: 'Error',
      config: { headers: {} as AxiosRequestHeaders },
      isAxiosError: true,
      toJSON: () => ({}),
    };

    (axios.request as jest.Mock).mockRejectedValue(mockErrorResponse);

    await expect(googleOAuth2.getUser('access_token')).rejects.toThrow(
      errorMessage
    );
  });
});
