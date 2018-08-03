// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as Path from "path";
import {Server} from "http";
import * as Express from "express";
import { ChatConnector } from "botbuilder";
import { ConsoleLogger, ILogger, ApplicationInsightsLogger, CompoundLogger, NoLogger } from "./Logging";
import { Config, IConfig, StorageType } from "./Config";
import { IDataStorage, FileStorage, MemoryStorage } from "./Storage";
import { Dialogs } from "./Dialogs";
import { ArgumentNullException } from "./Errors";
import { AddressInfo } from "net";
import { HelloService } from "./Services/HelloService";
import { UserRepository } from "./Repositories/UserRepository";

export class App {
  private _config: IConfig;
  private _logger: ILogger;
  private _server: Server | null = null;

  constructor(config: IConfig, logger: ILogger) {
    if (!config) {
      throw new ArgumentNullException("config");
    }
    if (!logger) {
      throw new ArgumentNullException("logger");
    }

    this._config = config;
    this._logger = logger;

    this._logger.info('Created new instance of App.');
    this._logger.debug(`Config: ${JSON.stringify(this._config)}`);
  }

  run(): void {   
    const chatConnector = new ChatConnector({
      appId: this._config.MicrosoftAppId,
      appPassword: this._config.MicrosoftAppPassword
    });

    let userStorage: IDataStorage;
    if (this._config.DataStorageType === StorageType.File) {
      userStorage = new FileStorage(this._logger, this._config.DataFilePath);
    }
    else {
      userStorage = new MemoryStorage(this._logger);
    }

    const helloService = new HelloService(new UserRepository(userStorage));
    const universalBot = Dialogs.register(chatConnector, this._logger, this._config, helloService);

    const app = Express();
    this._server = app.listen(this._config.ServerPort, () => {
      let address: string | AddressInfo = "unknown";
      if (this._server) {
        address = this._server.address();
      }
      this._logger.info(`App is running on ${JSON.stringify(address)}`); 
    });

    app.use(Express.static(Path.join(__dirname, "../public")));
    app.post(this._config.MessagesEndpoint, chatConnector.listen());
  }

  stop(): void {
    if (this._server && this._server.listening) {
      this._server.close(() => {
        this._logger.info("App shut down");
      });
    }
  }
}

export function run(): void {
  const config = new Config();
  
  const loggers = [];
  loggers.push(new ConsoleLogger(config.LogLevel));

  if (config.ApplicationInsightsKey) {
    loggers.push(new ApplicationInsightsLogger(config.LogLevel, config.ApplicationInsightsKey));
  }

  let logger: ILogger;
  if (loggers.length === 1) {
    logger = loggers[0];
  }
  else if (loggers.length > 1) {
    logger = new CompoundLogger(config.LogLevel, loggers);
  }
  else {
    logger = new NoLogger();
  }
  const app = new App(config, logger);  

  process.on("uncaughtException", (error) => {
    logger.logException(error);
  });

  process.on("unhandledRejection", (error) => {
    if (!(error instanceof Error)) {
      error = new Error(error);
    }
    logger.logException(error);
  });

  process.on("warning", (warning) => {
    logger.warn(`${warning.name}: ${warning.message} ${warning.stack}`);
  });

  process.on('SIGINT', () => {
    app.stop();
  });

  process.on("exit", (code) => {
    app.stop();
  });
  app.run();
}
