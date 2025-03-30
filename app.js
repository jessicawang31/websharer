import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';

import apiv3Router from './routes/api/v3/apiv3.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import models from './models.js';

import WebAppAuthProvider from 'msal-node-wrapper'

const authConfig = {
    auth: {
   	clientId: "249fcfc7-ada6-494b-ab62-e8331a009a14", // "Client ID or Application ID HERE",
    	authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2", // tenant ID here
    	clientSecret: "u-g8Q~UexafptTXnkps4H-zb~tq0hFwYsBsrObop", // "Client or Application secret here (NOT THE 'secret id', but the 'secret value')",
        redirectUri: "https://a7-websharer.jessicawangprojects.me/redirect"
        // redirectUri: "http://localhost:3000/redirect"
    },
	system: {
    	loggerOptions: {
        	loggerCallback(loglevel, message, containsPii) {
            	console.log(message);
        	},
        	piiLoggingEnabled: false,
        	logLevel: 3,
    	}
	}
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

// works for https
app.enable('trust proxy');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const oneDay = 1000 * 60 * 60 * 24

app.use(sessions({
    secret: "my secret is super secretive",
    saveUninitialized: true, 
    cookie: {maxAge: oneDay}, 
    resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

// middlewear
app.use((req, res, next) => {
    req.models = models;
    // req.authProvider = authProvider;
    next();
})

app.use('/api/v3', apiv3Router);

app.get('/signin', (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/", // redirect here after login
    })(req, res, next);

});
app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/", // redirect here after logout
    })(req, res, next);

});

app.use(authProvider.interactionErrorHandler());

export default app;