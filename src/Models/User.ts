// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import {ArgumentNullException} from "../Errors";

export class User {
  readonly id: string;
  hasBeenGreeted: boolean;

  constructor(id: string, hasBeenGreeted: boolean = false) {
    if (!id) {
      throw new ArgumentNullException("id");
    }

    this.id = id;
    this.hasBeenGreeted = hasBeenGreeted;
  }

  toJSON(): any {
    return {
      id: this.id,
      hasBeenGreeted: this.hasBeenGreeted
    };
  }

  static fromJSON(json: any) : User {
    return new User(json.id, json.hasBeenGreeted);
  }
}
