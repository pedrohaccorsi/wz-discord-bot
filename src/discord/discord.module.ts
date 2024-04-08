import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordBot } from './bot/discord.bot';

@Module({
    providers: [DiscordService, DiscordBot],
    exports: [DiscordService],
})
export class DiscordModule {}
