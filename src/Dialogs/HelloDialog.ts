// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { Session, Message, IDialogWaterfallStep } from "botbuilder";
import { ILogger } from "../Logging";
import { BaseDialog } from "./BaseDialog";
import { ArgumentNullException } from "../Errors";
import { IHelloService } from "../Services";

export class HelloDialog extends BaseDialog {
  private _helloService: IHelloService;

  constructor(triggerRegExp: RegExp, logger: ILogger, helloService: IHelloService) {
    super(triggerRegExp, logger);

    if (!helloService) {
      throw new ArgumentNullException("helloService");
    }

    this._helloService = helloService;
  }

  protected buildDialog(): IDialogWaterfallStep {
    return (session: Session) => this.performAction(session);
  }

  private async performAction(session: Session): Promise<void> {
    const incomingMessage = session.message.text || "";
    const match = this._triggerRegExp.exec(incomingMessage);
    const userId = session.message.user.id;

    const hasBeenGreeted = await this._helloService.hasUserBeenGreeted(userId);

    let message;
    if (hasBeenGreeted) {
      this._logger.info('Responding with hello again!');
      message = new Message(session).text("hello_again");
    }
    else {
      this._logger.info('Responding with first hello!');
      message = new Message(session).text("hello_first_time");
      await this._helloService.markUserAsGreeted(userId);
    }

    session.send(message);
  }
}
