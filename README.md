# sso-clients

A TypeScript-supported package for SSO login.

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

### Available methods

- `getName(): string`: Returns the name of the provider ('google').

- `getLoginURL(): string`: Returns the URL for Google login.

- `getTokens(code: string): Promise<Tokens>`: Exchanges the authorization code for the access token. Returns a Promise that resolves to the tokens (access token, token type, expires in, and optional refresh token).

- `refreshTokens(refreshToken: string): Promise<Tokens>`: Refreshes the access token using the provided refresh token. Returns a Promise that resolves to the updated tokens.

- `getUserEmail(accessToken: string): Promise<string>`: Retrieves the user's email using the access token. Returns a Promise that resolves to the user's email.

- `isEmailVerified(accessToken: string): Promise<boolean>`: Checks if the user's email is verified using the access token. Returns a Promise that resolves to a boolean indicating email verification status.

- `getUserName(accessToken: string): Promise<string>`: Retrieves the user's name using the access token. Returns a Promise that resolves to the user's name.

- `getUser(accessToken: string): Promise<User>`: Retrieves the user's information (sub, email, email_verified, name) using the access token. Returns a Promise that resolves to the user object.


