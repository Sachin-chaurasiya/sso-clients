import { Auth0OAuth2 } from '../lib';

describe('Auth0OAuth2', () => {
  it('should create an instance', () => {
    const auth0OAuth = new Auth0OAuth2(
      'appID',
      'appSecret',
      'callback',
      'domain',
      []
    );
    expect(auth0OAuth).toBeInstanceOf(Auth0OAuth2);
  });

  it('public method should work', () => {
    const auth0OAuth = new Auth0OAuth2(
      'appID',
      'appSecret',
      'callback',
      'domain',
      []
    );

    expect(auth0OAuth.getName()).toEqual('auth0');

    expect(auth0OAuth.getLoginURL()).toEqual(
      'https://domain/authorize?client_id=appID&redirect_uri=callback&state=undefined&scope=openid+profile+email+offline_access&response_type=code'
    );
  });
});
