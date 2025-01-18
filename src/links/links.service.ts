import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Link, TLinkSchema } from './schemas/link.schema';
import { CreateLinkDto } from './dto/create-link.dto';
import { nanoid } from 'nanoid';
import { isURL } from 'class-validator';

@Injectable()
export class LinksService {
    constructor(@InjectModel(Link.name) private readonly linkModel: Model<Link>) { }

    async createLink(linkDto: CreateLinkDto): Promise<TLinkSchema> {
        const { url } = linkDto;

        if (!isURL(url)) {
            throw new BadRequestException('URL no valida')
        }

        try {
            const existingURL = await this.linkModel.findOne({ target: url })

            if (existingURL) {
                return existingURL
            }

            const hashedURL = nanoid(5)
            const shortURL = `${process.env.BASE_URL}/l/${hashedURL}`

            let hashedPassword: string | undefined = undefined

            if (linkDto.password && linkDto.password.length > 0) {
                let salt = await bcrypt.genSalt(Number(process.env.SALT_BCRYPT));
                hashedPassword = await bcrypt.hash(linkDto.password, salt);
            }

            const createdLink = new this.linkModel({
                link: shortURL,
                shortId: hashedURL,
                target: linkDto.url,
                password: hashedPassword,
                //ver de checkear si es una fecha valida antes de guardarlo
                expiration: linkDto.expiration
            });

            return createdLink.save();

        } catch (error) {
            throw new UnprocessableEntityException('Server error')
        }

    }

    async findURLByShortId(shortId: string) {
        const foundURL = await this.linkModel.findOne({ shortId })

        return foundURL
    }

    async updateStats(shortId: string) {
        await this.linkModel.updateOne({shortId}, {$inc: { visitCount: 1}})
    }

    async validatePassword(password: string, dbPassword: string){
        const passMatch = await bcrypt.compare(password, dbPassword);

        return passMatch
    }

    async invalidateLink(shortId: string): Promise<TLinkSchema> {
        return this.linkModel.findOneAndUpdate(
          { shortId },
          { valid: false },
          { new: true },
        );
      }
      
}
