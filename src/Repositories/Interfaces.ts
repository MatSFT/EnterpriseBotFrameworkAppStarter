// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { User } from "../Models";

export interface IUserRepository {
  saveUser(user: User) : Promise<void>;
  findUserById(userId: string) : Promise<User|null>;
}
