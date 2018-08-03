// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

export interface IHelloService {
  hasUserBeenGreeted(userId: string): Promise<boolean>;
  markUserAsGreeted(userId: string): Promise<void>;
}
