import { Injectable, type OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoadoutService } from './loadout/loadout.service';

@Injectable()
export class AppService implements OnModuleInit {
    constructor(private readonly loadoutService: LoadoutService) { }

    async onModuleInit() {
        await this.scheduleJobs();
    }

    @Cron(CronExpression.EVERY_10_SECONDS, { name: 'extractLatestMeta' }) // scheduling job to run every 5 minutes
    async scheduleJobs() {
        await this.loadoutService.extractLatestMeta();
    }
}