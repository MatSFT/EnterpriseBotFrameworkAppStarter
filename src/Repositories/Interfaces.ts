// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

export interface IDataStorage {
  save(data: any) : Promise<void>;
  load() : Promise<any>;
}
