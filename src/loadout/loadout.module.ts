import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Loadout, LoadoutSchema } from '../schemas/loadout.schema';
import { WebCrawlerModule } from '../webCrawler/webCrawler.module';
import { LoadoutService } from './loadout.service';
import { DiscordModule } from '../discord/discord.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Loadout.name,
                schema: LoadoutSchema,
            },
        ]),
        WebCrawlerModule,
        DiscordModule
    ],
    providers: [LoadoutService],
    exports: [LoadoutService]
})
export class LoadoutModule { }