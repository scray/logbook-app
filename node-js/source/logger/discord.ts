import { WebhookClient } from "discord.js";

export class Discord {

    client: WebhookClient;

    constructor() {
        this.client = new WebhookClient({
            url: "https://discord.com/api/webhooks/1039155000233955378/we69m2UPkKmGocOg7lCLJAvRkPK0KBBBaScBbME81vIIyEi858sGNceF7RYAp7tvxBXj"
        });
    }

    send(color: number, prefix: string, message: string) {

        let date = new Date();

        let embed = {
            "content": null,
            "embeds": [
                {
                    "title": prefix + " - " + date.toLocaleDateString("de-DE") + " " + date.toLocaleTimeString("de-DE"),
                    "description": message,
                    "color": color
                }
            ],
            "attachments": []
        };

        this.client.send(embed);
    }
}