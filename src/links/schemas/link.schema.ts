import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument} from 'mongoose';

@Schema()
export class Link extends Document {
    @Prop()
    expiration?: Date;

    @Prop({ required: true, unique: true })
    link: string;

    @Prop()
    password?: string;

    @Prop({ required: true, unique: true })
    shortId: string;

    @Prop({ required: true })
    target: string;

    @Prop({ default: true })
    valid: boolean;

    @Prop({ default: 0 })
    visitCount: number;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
export type TLinkSchema =  HydratedDocument<Link>;
