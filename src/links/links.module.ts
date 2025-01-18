import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Link, LinkSchema } from './schemas/link.schema';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { ShortLinksController } from './short-links/short-links.controller';


@Module({
    imports: [MongooseModule.forFeature([{name: Link.name, schema: LinkSchema}])],
    controllers: [LinksController, ShortLinksController],    
    providers: [LinksService],
})
export class LinksModule {}
