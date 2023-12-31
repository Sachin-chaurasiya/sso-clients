"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth0OAuth2 = exports.GithubOAuth2 = exports.GoogleOAuth2 = void 0;
var GoogleOAuth2_1 = require("./GoogleOAuth2");
Object.defineProperty(exports, "GoogleOAuth2", { enumerable: true, get: function () { return __importDefault(GoogleOAuth2_1).default; } });
var GithubOAuth2_1 = require("./GithubOAuth2");
Object.defineProperty(exports, "GithubOAuth2", { enumerable: true, get: function () { return __importDefault(GithubOAuth2_1).default; } });
var Auth0OAuth2_1 = require("./Auth0OAuth2");
Object.defineProperty(exports, "Auth0OAuth2", { enumerable: true, get: function () { return __importDefault(Auth0OAuth2_1).default; } });
