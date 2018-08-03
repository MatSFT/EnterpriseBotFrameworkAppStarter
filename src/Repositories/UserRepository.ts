// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { User } from "../Models";
import { IUserRepository } from "./Interfaces";
import { IDataStorage } from "../Storage/Interfaces";
import { ArgumentNullException } from "../Errors";

export class UserRepository implements IUserRepository {
  private _storage: IDataStorage;

  constructor(storage: IDataStorage) {
    if(!storage) {
      throw new ArgumentNullException("storage");
    }

    this._storage = storage;
  }

  async saveUser(user: User): Promise<void> {
    const data = await this._storage.load();
    data[user.id] = user.toJSON();
    await this._storage.save(data);
  }

  async findUserById(userId: string): Promise<User | null> {
    const data = await this._storage.load();
    const userData = data[userId];
    if (!userData) {
      return null;
    }
    return User.fromJSON(userData);
  }
}
