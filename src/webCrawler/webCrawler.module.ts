import { Module } from '@nestjs/common';
import { WebCrawlerService } from './webCrawler.service';

@Module({
    imports: [],
    providers: [WebCrawlerService],
    exports: [WebCrawlerService],
})
export class WebCrawlerModule { }