import { Injectable, type OnModuleInit } from '@nestjs/common';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

@Injectable()
export class DiscordBot implements OnModuleInit {
    private readonly client = new Client({ intents: [GatewayIntentBits.Guilds] });

    async onModuleInit() {
        this.client.login(Bun.env.DISCORD_BOT_TOKEN);
    }

    sendMessage(message: string, channelName: string) {
        this.client.guilds.cache.forEach((guild) => {
            guild.channels.cache.forEach((channel) => {
                if (channel instanceof TextChannel && channel.name === channelName) {
                    channel.send(message);
                }
            });
        });
    }
}
