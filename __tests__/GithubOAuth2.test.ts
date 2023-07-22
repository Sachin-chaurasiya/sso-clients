import GithubOAuth2 from '../lib/GithubOAuth2';

describe('GithubOAuth2', () => {
  it('should create an instance', () => {
    const githubOAuth = new GithubOAuth2('appID', 'appSecret', 'callback', []);
    expect(githubOAuth).toBeInstanceOf(GithubOAuth2);
  });

  it('public method should work', () => {
    const githubOAuth = new GithubOAuth2('appID', 'appSecret', 'callback', []);

    expect(githubOAuth.getName()).toEqual('github');

    expect(githubOAuth.getLoginURL()).toEqual(
      'https://github.com/login/oauth/authorize?client_id=appID&redirect_uri=callback&scope=user%3Aemail&state=undefined'
    );
  });
});
