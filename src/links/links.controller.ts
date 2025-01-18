import { Body, Controller, Post} from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { LinksService } from './links.service';

@Controller()
export class LinksController {
    constructor(private readonly linksService: LinksService) { }

    @Post('create')
    async create(@Body() createLinkDto: CreateLinkDto) {
        const newLink = await this.linksService.createLink(createLinkDto);

        return {
            target: newLink.target,
            link: newLink.link,
            valid: newLink.valid
        }
    }
}
