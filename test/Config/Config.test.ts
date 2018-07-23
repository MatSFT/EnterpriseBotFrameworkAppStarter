import 'mocha';
import { expect } from 'chai';
import { InvalidOperationException } from '../../src/Errors';
import { StorageType, Config } from '../../src/Config';

describe('Config', () => {
  beforeEach(() => {
    delete process.env.NAME;
    delete process.env.VERSION;
    delete process.env.MICROSOFT_APP_ID;
    delete process.env.MICROSOFT_APP_PASSWORD;
    delete process.env.APPINSIGHTS_INSTRUMENTATIONKEY;
    delete process.env.MICROSOFT_TENANT_FILTER;
    delete process.env.PORT;
    delete process.env.MESSAGES_ENDPOINT;
    delete process.env.DEFAULT_LOCALE;
    delete process.env.LOCALE_PATH;
    delete process.env.DATA_STORAGE_TYPE;
    delete process.env.DATA_FILE_PATH;
    delete process.env.LOG_LEVEL;
  });

  it('should fail when MICROSOFT_APP_ID is not set.', () => {
    process.env.MICROSOFT_APP_PASSWORD = "APP_PASSWORD";
    expect(() => new Config()).to.throw(InvalidOperationException);
  });

  it('should fail when MICROSOFT_APP_PASSWORD is not set.', () => {
    process.env.MICROSOFT_APP_ID = "APP_ID";
    expect(() => new Config()).to.throw(InvalidOperationException);
  });

  it('should succeed when MICROSOFT_APP_ID and MICROSOFT_APP_PASSWORD are set.', () => {
    process.env.MICROSOFT_APP_ID = "APP_ID";
    process.env.MICROSOFT_APP_PASSWORD = "APP_PASSWORD";
    const config = new Config();

    expect(config.MicrosoftAppId).to.equal(process.env.MICROSOFT_APP_ID);
    expect(config.MicrosoftAppPassword).to.equal(process.env.MICROSOFT_APP_PASSWORD);
  });

  it('should have default values when not overidden.', () => {
    process.env.MICROSOFT_APP_ID = "APP_ID";
    process.env.MICROSOFT_APP_PASSWORD = "APP_PASSWORD";
    const config = new Config();

    const expected = {
      Name: 'base-hello-app',
      Version: '1.0.0',
      ApplicationInsightsKey: undefined,
      MicrosoftAppId: 'APP_ID',
      MicrosoftAppPassword: 'APP_PASSWORD',
      MicrosoftTenantFilter: [],
      ServerPort: '3978',
      MessagesEndpoint: '/api/messages',
      DefaultLocale: 'en',
      LocalePath: './locale',
      DataStorageType: 0,
      DataFilePath: './Data.json',
      LogLevel: 'info'
    };

    expect(config).to.deep.equal(expected);
  });
  
  it('should set Name properly.', () => {
    process.env.MICROSOFT_APP_ID = "APP_ID";
    process.env.MICROSOFT_APP_PASSWORD = "APP_PASSWORD";
    process.env.NAME = "NAME";
    const config = new Config();

    expect(config.Name).to.equal(process.env.NAME);
  });

  it('should set Version properly.', () => {
    process.env.MICROSOFT_APP_ID = "APP_ID";
    process.env.MICROSOFT_APP_PASSWORD = "APP_PASSWORD";
    process.env.VERSION = "VERSION";
    const config = new Config();

    expect(config.Version).to.equal(process.env.VERSION);
  });

  it('should set ApplicationInsightsKey properly.', () => {
    process.env.MICROSOFT_APP_ID = "APP_ID";
    process.env.MICROSOFT_APP_PASSWORD = "APP_PASSWORD";
    process.env.APPINSIGHTS_INSTRUMENTATIONKEY = "APP_INSIGHTS_KEY";
    const config = new Config();

    expect(config.ApplicationInsightsKey).to.equal(process.env.APPINSIGHTS_INSTRUMENTATIONKEY);
  });

  it('should set MicrosoftTenantFilter properly.', () => {
    process.env.MICROSOFT_APP_ID = "APP_ID";
    process.env.MICROSOFT_APP_PASSWORD = "APP_PASSWORD";
    process.env.MICROSOFT_TENANT_FILTER = "123,124";
    const config = new Config();

    expect(config.MicrosoftTenantFilter).to.deep.equal(["123","124"]);
  });

  it('should set ServerPort properly.', () => {
    process.env.MICROSOFT_APP_ID = "APP_ID";
    process.env.MICROSOFT_APP_PASSWORD = "APP_PASSWORD";
    process.env.PORT = "1234";
    const config = new Config();

    expect(config.ServerPort).to.equal(process.env.PORT);
  });

  it('should set MessagesEndpoint properly.', () => {
    process.env.MICROSOFT_APP_ID = "APP_ID";
    process.env.MICROSOFT_APP_PASSWORD = "APP_PASSWORD";
    process.env.MESSAGES_ENDPOINT = "api/1234";
    const config = new Config();

    expect(config.MessagesEndpoint).to.equal(process.env.MESSAGES_ENDPOINT);
  });

  it('should set DefaultLocale properly.', () => {
    process.env.MICROSOFT_APP_ID = "APP_ID";
    process.env.MICROSOFT_APP_PASSWORD = "APP_PASSWORD";
    process.env.DEFAULT_LOCALE = "hello";
    const config = new Config();

    expect(config.DefaultLocale).to.equal(process.env.DEFAULT_LOCALE);
  });

  it('should set LocalePath properly.', () => {
    process.env.MICROSOFT_APP_ID = "APP_ID";
    process.env.MICROSOFT_APP_PASSWORD = "APP_PASSWORD";
    process.env.LOCALE_PATH = "hello";
    const config = new Config();

    expect(config.LocalePath).to.equal(process.env.LOCALE_PATH);
  });

  it('should set DataStorageType properly.', () => {
    process.env.MICROSOFT_APP_ID = "APP_ID";
    process.env.MICROSOFT_APP_PASSWORD = "APP_PASSWORD";
    process.env.DATA_STORAGE_TYPE = "file";
    const config = new Config();

    expect(config.DataStorageType).to.equal(StorageType.File);
  });

  it('should set DataFilePath properly.', () => {
    process.env.MICROSOFT_APP_ID = "APP_ID";
    process.env.MICROSOFT_APP_PASSWORD = "APP_PASSWORD";
    process.env.DATA_FILE_PATH = "filePath";
    const config = new Config();

    expect(config.DataFilePath).to.equal(process.env.DATA_FILE_PATH);
  });

  it('should set LogLevel properly.', () => {
    process.env.MICROSOFT_APP_ID = "APP_ID";
    process.env.MICROSOFT_APP_PASSWORD = "APP_PASSWORD";
    process.env.LOG_LEVEL = "debug";
    const config = new Config();

    expect(config.LogLevel).to.equal(process.env.LOG_LEVEL);
  });
});
