// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import {Session, Message, IDialogWaterfallStep} from "botbuilder";
import {ILogger} from "../Logging";
import { BaseDialog } from "./BaseDialog";

export class HelloDialog extends BaseDialog {
  constructor(triggerRegExp: RegExp, logger: ILogger) {
    super(triggerRegExp, logger);
  }

  protected buildDialog(): IDialogWaterfallStep {
    return (session: Session) => this.performAction(session);
  }

  private async performAction(session: Session): Promise<void> {
    const incomingMessage = session.message.text || "";
    const match = this._triggerRegExp.exec(incomingMessage);

    this._logger.info('Responding with hello!');
    const message = new Message(session).text("hello");
    session.send(message);
  }
}
