# BaseHelloApp

[![Build Status](https://travis-ci.com/MattSFT/BaseHelloApp.svg?branch=master)](https://travis-ci.com/MattSFT/BaseHelloApp) [![Coverage Status](https://coveralls.io/repos/github/MattSFT/BaseHelloApp/badge.svg?branch=master)](https://coveralls.io/github/MattSFT/BaseHelloApp?branch=master)

## What is this?

This is a very simple sample for building a bot that can work with BotFramework and Microsoft Teams specifically. Take a look at the [Config.ts](https://github.com/MattSFT/BaseHelloApp/blob/master/src/Config/Config.ts) file for possible configuration options and how they are pulled in by the app. You should be able to deploy this directly to an azure App Service if you configure the options in the environment first.

## Why use this?

It is setup to already have the basics of a production level app.
1. There are basic unit tests.
2. There is a code coverage report being generated that maps the coverage to the Typescript code.
3. There is an extensible logging framework with built in app insights trace publishing.
4. Abstractions built so you just have to worry about writing the code that matters
