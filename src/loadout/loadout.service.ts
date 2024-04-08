import { Logger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Loadout, type IAttachment } from '../schemas/loadout.schema';
import { WebCrawlerService } from '../webCrawler/webCrawler.service';
import _ from 'lodash';
import { DiscordService } from '../discord/discord.service';

@Injectable()
export class LoadoutService {

    private readonly logger = new Logger(LoadoutService.name)
    private counter = 0;

    constructor(
        @InjectModel(Loadout.name) private loadoutModel: Model<Loadout>,
        private readonly webCrawlerService: WebCrawlerService,
        private readonly discordService: DiscordService
    ) { }

    async createLoadout() {
        const newLoadout = new this.loadoutModel();
        return newLoadout.save();
    }

    async extractLatestMeta() {
        this.logger.log(`Extracting latest meta... ${this.counter++}`);
        const crawledMetas = await this.webCrawlerService.extractLatestMeta();
        this.logger.log(`Found a total of ${crawledMetas.length} loadouts`);

        if (crawledMetas.length === 0) {
            return;
        }

        const topFive = await this.getTopFive();

        for (const crawledMeta of crawledMetas) {
            const existingMeta = topFive.find(m => m.name === crawledMeta.name);
            if (existingMeta) {
                if (_.isEqual(existingMeta.attachments, crawledMeta.attachments)) {
                    this.logger.log(`No changes detected for ${crawledMeta.name}`);
                    continue;
                } else {
                    await this.loadoutModel.updateOne(existingMeta, { isTopFive: false });
                    await this.loadoutModel.create({ ...crawledMeta, isTopFive: true });
                    this.logger.log(`Updated ${crawledMeta.name}`);
                    this.discordService.sendMessage(
                        `> ### UPDATE FOR ABOLUTE META -> ${crawledMeta.name}
                        - ${crawledMeta.attachments[0].slot}: ${crawledMeta.attachments[0].name}
                        - ${crawledMeta.attachments[1].slot}: ${crawledMeta.attachments[1].name}
                        - ${crawledMeta.attachments[2].slot}: ${crawledMeta.attachments[2].name}
                        - ${crawledMeta.attachments[3].slot}: ${crawledMeta.attachments[3].name}
                        - ${crawledMeta.attachments[4].slot}: ${crawledMeta.attachments[4].name}
                        `
                    )
                }
            } else {
                await this.loadoutModel.create({ ...crawledMeta, isTopFive: true });
                this.logger.log(`Added ${crawledMeta.name}`);
                this.discordService.sendMessage(
                    `> ### NEW TOP 5 ABOLUTE META -> ${crawledMeta.name}
                    * ${crawledMeta.attachments[0].slot}: ${crawledMeta.attachments[0].name}
                    * ${crawledMeta.attachments[1].slot}: ${crawledMeta.attachments[1].name}
                    * ${crawledMeta.attachments[2].slot}: ${crawledMeta.attachments[2].name}
                    * ${crawledMeta.attachments[3].slot}: ${crawledMeta.attachments[3].name}
                    * ${crawledMeta.attachments[4].slot}: ${crawledMeta.attachments[4].name}
                    `
                )
            }
        }

        for (const notMeta of topFive.filter(top => !crawledMetas.some(crawled => crawled.name === top.name))) {
            await this.loadoutModel.updateOne(notMeta, { isTopFive: false });
            this.logger.log(`Removed ${notMeta.name}`);
        }
    }

    readableAttachment(attachment: IAttachment) {
        return `${attachment.slot}: ${attachment.name}`
    }

    async getTopFive(): Promise<Loadout[]> {
        return this.loadoutModel.find({ isTopFive: true }).lean();
    }

}