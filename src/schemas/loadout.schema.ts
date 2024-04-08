import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IAttachment {
    name: string;
    slot: string;
}

@Schema()
export class Loadout {
    @Prop({ index: true })
    name!: string;

    @Prop({ type: Date, default: Date.now })
    createdAt!: Date;

    @Prop({ default: false })
    isTopFive: boolean;

    @Prop([{
        name: String,
        slot: String,
        _id: false
    }])
    attachments: IAttachment[];
}

export const LoadoutSchema = SchemaFactory.createForClass(Loadout);
