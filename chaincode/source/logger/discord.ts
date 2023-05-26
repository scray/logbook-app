import { WebhookClient } from "discord.js";

export class Discord {

    client: WebhookClient;

    constructor() {
    }

    send(color: number, prefix: string, message: string) {
        console.log(message);
    }
}
