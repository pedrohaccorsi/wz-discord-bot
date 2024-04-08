import { Injectable } from '@nestjs/common';
import { DiscordBot } from './bot/discord.bot';

@Injectable()
export class DiscordService {
    constructor(private discordBot: DiscordBot) { }
    private readonly targetChannel = Bun.env.NODE_ENV === 'development' ? 'wz-meta-loadouts-test' : 'wz-meta-loadouts';

    sendMessage(message: string) {
        this.discordBot.sendMessage(message, this.targetChannel);
    }
}
