# SSO Clients

<div align="center">
<h4 align="center">A TypeScript-supported package for SSO login.
</h4>
<p align="center">
    <a href="https://github.com/Sachin-chaurasiya/sso-clients/issues/new/choose">Report Bug</a>
    ·
    <a href="https://github.com/Sachin-chaurasiya/sso-clients/issues/new/choose">Request Feature</a>
</p>
<p align="center">
<a href="http://www.npmtrends.com/sso-clients" target="blank">
<img src="https://img.shields.io/npm/dm/sso-clients.svg?style=flat-square" alt="sso-clients downloads"/>
</a>    
<a href="https://www.npmjs.com/package/sso-clients" target="blank">
<img alt="Package-Version" src="https://img.shields.io/github/package-json/v/Sachin-chaurasiya/sso-clients?style=flat-square">
</a>
  <a href="https://github.com/Sachin-chaurasiya/sso-clients/blob/main/LICENSE" target="blank">
<img src="https://img.shields.io/github/license/Sachin-chaurasiya/sso-clients?style=flat-square" alt="sso-clients licence" />
</a>
<a href="https://github.com/Sachin-chaurasiya/sso-clients/fork" target="blank">
<img src="https://img.shields.io/github/forks/Sachin-chaurasiya/sso-clients?style=flat-square" alt="sso-clients forks"/>
</a>
<a href="https://github.com/Sachin-chaurasiya/sso-clients/stargazers" target="blank">
<img src="https://img.shields.io/github/stars/Sachin-chaurasiya/sso-clients?style=flat-square" alt="sso-clients stars"/>
</a>
<a href="https://github.com/Sachin-chaurasiya/sso-clients/issues" target="blank">
<img src="https://img.shields.io/github/issues/Sachin-chaurasiya/sso-clients?style=flat-square" alt="sso-clients issues"/>
</a>
<a href="https://github.com/Sachin-chaurasiya/sso-clients/pulls" target="blank">
<img src="https://img.shields.io/github/issues-pr/Sachin-chaurasiya/sso-clients?style=flat-square" alt="sso-clients pull-requests"/>
</a>
</p>
</div>

## Clients

- [Google](#import-the-google-client)
- [GitHub](#import-the-github-client)
- [Auth0](#import-the-auth0-client)

## Installation

```bash
npm install sso-clients

OR

yarn add sso-clients
```
## Usage

### Import the Google Client
```js
import { GoogleOAuth2 } from "sso-clients";
```

### Initialize the Client

```js
const googleOAuth = new GoogleOAuth2(
  "YOUR_GOOGLE_CLIENT_ID",
  "YOUR_GOOGLE_CLIENT_SECRET",
  "YOUR_CALLBACK_URL",
  ["email", "profile", "openid"],
);

```

### Import the GitHub Client
```js
import { GithubOAuth2 } from "sso-clients";
```

### Initialize the Client

```js
const githubOAuth = new GithubOAuth2(
  "YOUR_GITHUB_CLIENT_ID",
  "YOUR_GITHUB_CLIENT_SECRET",
  "YOUR_CALLBACK_URL",
  ['user:email']
);

```

### Import the Auth0 Client

```js
import { Auth0OAuth2 } from "sso-clients";
```
### Initialize the Client

```js
const auth0OAuth = new Auth0OAuth2(
  "YOUR_AUTH0_CLIENT_ID",
  "YOUR_AUTH0_CLIENT_SECRET",
  "YOUR_CALLBACK_URL",
  "YOUR_AUTH0_DOMAIN",
  ["openid", "profile", "email", "offline_access"],
);

```

## Available methods for a client

- `getName(): string`: Returns the name of the provider.

- `getLoginURL(): string`: Returns the URL for provider login.

- `getTokens(code: string): Promise<Tokens>`: Exchanges the authorization code for the access token. Returns a Promise that resolves to the tokens (access token, token type, expires in, and optional refresh token).

- `refreshTokens(refreshToken: string): Promise<Tokens>`: Refreshes the access token using the provided refresh token. Returns a Promise that resolves to the updated tokens.

- `getUserID(accessToken: string): Promise<string>`: Fetches the user ID using the provided access token.

- `getUserEmail(accessToken: string): Promise<string>`: Retrieves the user's email using the access token. Returns a Promise that resolves to the user's email.

- `isEmailVerified(accessToken: string): Promise<boolean>`: Checks if the user's email is verified using the access token. Returns a Promise that resolves to a boolean indicating email verification status.

- `getUserName(accessToken: string): Promise<string>`: Retrieves the user's name using the access token. Returns a Promise that resolves to the user's name.

- `getUser(accessToken: string): Promise<User>`: Retrieves the user's information (sub, email, email_verified, name) using the access token. Returns a Promise that resolves to the user object.
