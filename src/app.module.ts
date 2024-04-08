import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoadoutModule } from './loadout/loadout.module';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { WebCrawlerModule } from './webCrawler/webCrawler.module';
import { DiscordModule } from './discord/discord.module';

@Module({
    imports: [
        MongooseModule.forRoot(Bun.env.DB_URL as string),
        WebCrawlerModule,
        LoadoutModule,
        ScheduleModule.forRoot(),
        DiscordModule
    ],
    controllers: [],
    providers: [AppService],
})
export class AppModule { }