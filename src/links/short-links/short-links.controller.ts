import { BadRequestException, Controller, Get, NotFoundException, Param, Put, Query, Res, UnprocessableEntityException } from '@nestjs/common';
import { LinksService } from '../links.service';
import { Response } from 'express';

@Controller('l')
export class ShortLinksController {
    constructor(private readonly linksService: LinksService) { }
    @Get(':id')
    async findURLAndRedirect(@Param("id") id: string, @Query('password') password: string, @Res() res: Response) {
        try {
            if (!id) {
                throw new BadRequestException('No se proporcionó un identificador')
            }

            const foundURL = await this.linksService.findURLByShortId(id)

            if (!foundURL) {
                throw new NotFoundException('No se encontró el link');
            }

            if (!foundURL.valid) {
                throw new NotFoundException('Link inválido');
            }

            if (foundURL.expiration && new Date() > foundURL.expiration) {
                throw new NotFoundException('El link ha expirado');
            }

            if (foundURL.password) {
                if (!password) {
                    throw new NotFoundException('Solicitud inválida')
                }

                const isMatch = await this.linksService.validatePassword(password, foundURL.password)

                if (!isMatch) {
                    throw new NotFoundException('Password incorrecta');
                }
            }

            await this.linksService.updateStats(id)

            return res.redirect(foundURL.target)

        } catch (error) {
            throw new UnprocessableEntityException('Server error')
        }
    }

    @Get(':id/stats')
    async findURLStats(@Param('id') id: string) {
        try {
            if (!id) {
                throw new BadRequestException('No se proporcionó un identificador')
            }

            const foundURL = await this.linksService.findURLByShortId(id)

            if (!foundURL) {
                throw new NotFoundException('No se encontró el link');
            }

            return {
                link: foundURL.link,
                visitCount: foundURL.visitCount
            }
        } catch (error) {
            throw new UnprocessableEntityException('Server error')
        }
    }

    @Put(':id')
    async invalidateURL(@Param('id') id: string) {
        try {
            if (!id) {
                throw new BadRequestException('No se proporcionó un identificador')
            }

            const foundURL = await this.linksService.findURLByShortId(id)

            if (!foundURL) {
                throw new NotFoundException('No se encontró el link');
            }

            const updatedLink = await this.linksService.invalidateLink(id)

            return {
                link: updatedLink.link,
                valid: updatedLink.valid
            }
        } catch (error) {
            throw new UnprocessableEntityException('Server error')
        }
    }
}