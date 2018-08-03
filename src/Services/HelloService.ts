// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { IUserRepository } from "../Repositories/Interfaces";
import { ArgumentNullException } from "../Errors";
import { User } from "../Models";

export class HelloService implements IHelloService {
  private _userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    if (!userRepository) {
      throw new ArgumentNullException("userRepository");
    }

    this._userRepository = userRepository;
  }

  async hasUserBeenGreeted(userId: string): Promise<boolean> {
    const user = await this._userRepository.findUserById(userId)
    if (user) {
      return user.hasBeenGreeted;
    }
    return false;
  }

  async markUserAsGreeted(userId: string): Promise<void> {
    let user = await this._userRepository.findUserById(userId)
    if (!user) {
      user = new User(userId);
    }
    user.hasBeenGreeted = true;
    await this._userRepository.saveUser(user);
  }
}
