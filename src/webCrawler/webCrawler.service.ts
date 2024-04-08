import axios from "axios";
import parse, { HTMLElement } from "node-html-parser";
import { Loadout } from "../schemas/loadout.schema";
import { Injectable, Logger } from '@nestjs/common';

axios.defaults.headers.common["Accept-Encoding"] = "gzip";

@Injectable()
export class WebCrawlerService {

    private readonly targetUrl = 'https://warzoneloadout.games/warzone-meta';
    private readonly logger = new Logger(WebCrawlerService.name)

    public async extractLatestMeta(): Promise<Loadout[]> {
        const webPageRoot = await this.getWebPageRoot();
        return this.getLoadouts(webPageRoot);
    }
    private async getWebPageRoot() {
        const res = await axios.get(this.targetUrl)
        return parse(res.data.toString());
    }

    private getLoadouts(root: HTMLElement): Loadout[] {
        const loadoutsList: Loadout[] = [];
        const loadoutNode = root.querySelector('.new_mobile-ranking-container')?.querySelector('.new_mobile-tier-section');

        if (!loadoutNode) {
            return loadoutsList;
        }

        loadoutNode.childNodes.forEach((c) => {

            const gunNode = parse(c.toString()).querySelector('.mobile-accordion');

            if (!gunNode) {
                return
            }

            const loadout = new Loadout();
            loadout.attachments = [];
            loadout.name = gunNode.querySelector('.accordion-header')
                ?.querySelector('.headerdisplayed')
                ?.querySelector('.nameplaystylemobile')
                ?.querySelector('.new_weapon-name')
                ?.text || ''

            const attachmentsNode = gunNode.querySelector('.accordion-content')?.querySelector('.new_attachments');

            if (!attachmentsNode) {
                return
            }

            attachmentsNode.childNodes.forEach((attachmentNode) => {
                const node = parse(attachmentNode.toString());
                const attachmentSlot = node.querySelector('.new_attachment-slot')?.text;
                const attachmentName = node.querySelector('.new_attachment-name')?.text;

                if (attachmentSlot && attachmentName) {
                    loadout.attachments.push({
                        name: attachmentName,
                        slot: attachmentSlot,
                    });
                }
            });

            loadoutsList.push(loadout);

        });

        return loadoutsList;
    }

}