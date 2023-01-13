"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discord = void 0;
const discord_js_1 = require("discord.js");
class Discord {
    constructor() {
        this.client = new discord_js_1.WebhookClient({
            url: "https://discord.com/api/webhooks/1039155000233955378/we69m2UPkKmGocOg7lCLJAvRkPK0KBBBaScBbME81vIIyEi858sGNceF7RYAp7tvxBXj"
        });
    }
    send(color, prefix, message) {
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
exports.Discord = Discord;
