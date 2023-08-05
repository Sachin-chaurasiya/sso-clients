import GithubOAuth2 from '../lib/GithubOAuth2';
import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';

jest.mock('axios');

describe('GithubOAuth2', () => {
  const createAxiosResponse = (data: any): AxiosResponse => {
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as AxiosRequestHeaders },
    };
  };

  const createGitHubOAuth2Instance = () => {
    const appID = 'your_app_id';
    const appSecret = 'your_app_secret';
    const callback = 'https://example.com/oauth/callback';
    const scopes = ['scope1', 'scope2'];

    return new GithubOAuth2(appID, appSecret, callback, scopes);
  };

  const mockGetUserResponse = {
    id: 'user_id',
    email: 'user@example.com',
    verified: true,
    name: 'John Doe',
  };

  it('should construct the correct login URL', () => {
    const githubOAuth2 = createGitHubOAuth2Instance();
    const expectedURL =
      'https://github.com/login/oauth/authorize?client_id=your_app_id&redirect_uri=https%3A%2F%2Fexample.com%2Foauth%2Fcallback&scope=scope1+scope2&state=undefined';

    expect(githubOAuth2.getLoginURL()).toBe(expectedURL);
  });

  it('should fetch user tokens successfully', async () => {
    const githubOAuth2 = createGitHubOAuth2Instance();

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

    const tokens = await githubOAuth2.getTokens('authorization_code');

    expect(tokens).toEqual(mockTokensResponse);
  });

  it('should refresh user tokens successfully', async () => {
    const githubOAuth2 = createGitHubOAuth2Instance();

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

    const tokens = await githubOAuth2.refreshTokens('refresh_token');

    expect(tokens).toEqual(mockRefreshTokensResponse);
  });

  it('should fetch user email', async () => {
    const githubOAuth2 = createGitHubOAuth2Instance();

    const mockUserResponse = {
      email: 'user@example.com',
    };

    (axios.request as jest.Mock).mockResolvedValue(
      createAxiosResponse(mockUserResponse)
    );

    const email = await githubOAuth2.getUserEmail('access_token');

    expect(email).toBe(mockUserResponse.email);
  });

  it('should check if user email is verified', async () => {
    const githubOAuth2 = createGitHubOAuth2Instance();

    const mockUserResponse = {
      verified: true,
    };

    (axios.request as jest.Mock).mockResolvedValue(
      createAxiosResponse(mockUserResponse)
    );

    const isEmailVerified = await githubOAuth2.isEmailVerified('access_token');

    expect(isEmailVerified).toBe(true);
  });

  it('should fetch user name', async () => {
    const githubOAuth2 = createGitHubOAuth2Instance();

    const mockUserResponse = {
      name: 'John Doe',
    };

    (axios.request as jest.Mock).mockResolvedValue(
      createAxiosResponse(mockUserResponse)
    );

    const name = await githubOAuth2.getUserName('access_token');

    expect(name).toBe(mockUserResponse.name);
  });

  it('should fetch user details', async () => {
    const githubOAuth2 = createGitHubOAuth2Instance();

    (axios.request as jest.Mock).mockResolvedValue(
      createAxiosResponse(mockGetUserResponse)
    );

    const user = await githubOAuth2.getUser('access_token');

    expect(user).toEqual(mockGetUserResponse);
  });

  it('should handle errors when fetching user tokens', async () => {
    const githubOAuth2 = createGitHubOAuth2Instance();

    const errorMessage = 'Failed to get tokens';
    const mockErrorResponse: AxiosError = {
      message: errorMessage,
      name: 'Error',
      config: { headers: {} as AxiosRequestHeaders },
      isAxiosError: true,
      toJSON: () => ({}),
    };

    (axios.request as jest.Mock).mockRejectedValue(mockErrorResponse);

    await expect(githubOAuth2.getTokens('authorization_code')).rejects.toThrow(
      errorMessage
    );
  });

  it('should handle errors when refreshing user tokens', async () => {
    const githubOAuth2 = createGitHubOAuth2Instance();

    const errorMessage = 'Failed to refresh tokens';
    const mockErrorResponse: AxiosError = {
      message: errorMessage,
      name: 'Error',
      config: { headers: {} as AxiosRequestHeaders },
      isAxiosError: true,
      toJSON: () => ({}),
    };

    (axios.request as jest.Mock).mockRejectedValue(mockErrorResponse);

    await expect(githubOAuth2.refreshTokens('refresh_token')).rejects.toThrow(
      errorMessage
    );
  });

  it('should handle errors when fetching user details', async () => {
    const githubOAuth2 = createGitHubOAuth2Instance();

    const errorMessage = 'Failed to get user details';
    const mockErrorResponse: AxiosError = {
      message: errorMessage,
      name: 'Error',
      config: { headers: {} as AxiosRequestHeaders },
      isAxiosError: true,
      toJSON: () => ({}),
    };

    (axios.request as jest.Mock).mockRejectedValue(mockErrorResponse);

    await expect(githubOAuth2.getUser('access_token')).rejects.toThrow(
      errorMessage
    );
  });
});
