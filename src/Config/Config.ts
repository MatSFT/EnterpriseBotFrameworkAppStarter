// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as fs from "fs";
import {InvalidOperationException} from "../Errors";
import {IConfig, StorageType} from "./Interfaces";

export class Config implements IConfig {
  readonly Name: string;
  readonly Version: string;
  readonly ApplicationInsightsKey?: string;  
  readonly MicrosoftAppId: string;
  readonly MicrosoftAppPassword: string;
  readonly MicrosoftTenantFilter: string[];
  readonly ServerPort: string;
  readonly MessagesEndpoint: string;
  readonly DefaultLocale: string;
  readonly LocalePath: string;
  readonly DataStorageType: StorageType;
  readonly DataFilePath: string;
  readonly LogLevel: number | string;

  constructor() {
    try {
      const packageData = JSON.parse(fs.readFileSync("package.json", "UTF8"));
      this.Name = process.env.NAME || packageData.name || "App";
      this.Version = process.env.VERSION || packageData.version;
    }
    catch(error) {
      throw new InvalidOperationException(`Could not read package.json file. error=${error}`);
    }

    this.ApplicationInsightsKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;

    if (!process.env.MICROSOFT_APP_ID) {
      throw new InvalidOperationException("Environment variable 'MICROSOFT_APP_ID' not set.");
    }
    this.MicrosoftAppId = process.env.MICROSOFT_APP_ID as string;

    if (!process.env.MICROSOFT_APP_PASSWORD) {
      throw new InvalidOperationException("Environment variable 'MICROSOFT_APP_PASSWORD' not set.");
    }
    this.MicrosoftAppPassword = process.env.MICROSOFT_APP_PASSWORD as string;

    this.MicrosoftTenantFilter = [];
    if (process.env.MICROSOFT_TENANT_FILTER) {
      this.MicrosoftTenantFilter = (process.env.MICROSOFT_TENANT_FILTER as string).trim().split(",");
    }
    
    this.ServerPort = process.env.PORT || "3978";
    this.MessagesEndpoint = process.env.MESSAGES_ENDPOINT || "/api/messages";
    this.DefaultLocale = process.env.DEFAULT_LOCALE || "en";
    this.LocalePath = process.env.LOCALE_PATH || "./locale";
    this.DataStorageType = this.parseStorageType(process.env.DATA_STORAGE_TYPE, StorageType.Memory);
    this.DataFilePath = process.env.DATA_FILE_PATH || "./Data.json";
    this.LogLevel = process.env.LOG_LEVEL || "info";
  }

  parseStorageType(envParam: any, defaultValue: StorageType) : StorageType {
    let value = defaultValue;
    if (envParam as string) {
      switch ((envParam as string).toLowerCase()) {
        case "0":
        case "memory":
          value = StorageType.Memory;
          break;
        case "1":
        case "file":
          value = StorageType.File;
          break;
      }
    }
    return value;
  }

  parseInt(envParam: any, defaultValue: number) : number {
    let value = defaultValue;
    if (envParam as string) {
      value = parseInt(envParam as string) || value; 
    }
    return value;
  }
}
