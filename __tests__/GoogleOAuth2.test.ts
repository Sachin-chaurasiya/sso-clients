import GoogleOAuth2 from '../lib/GoogleOAuth2';

describe('GoogleOAuth2', () => {
  it('should create an instance', () => {
    const googleOAuth = new GoogleOAuth2('appID', 'appSecret', 'callback', []);
    expect(googleOAuth).toBeInstanceOf(GoogleOAuth2);
  });

  it('public method should work', () => {
    const googleOAuth = new GoogleOAuth2('appID', 'appSecret', 'callback', []);

    expect(googleOAuth.getName()).toEqual('google');

    expect(googleOAuth.getLoginURL()).toEqual(
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=appID&redirect_uri=callback&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&state=undefined&response_type=code'
    );
  });
});
