import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MinDate } from "class-validator";

export class CreateLinkDto {
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate({ message: 'Expiración debe ser una fecha válida' })
    @MinDate(new Date(), {
        message: 'Expiración debe ser una fecha posterior a la actual',
    })
    expiration?: Date;

    @IsString()
    @IsNotEmpty()
    link: string;

    @IsOptional()
    @IsNotEmpty()//!??
    password?: string;

    @IsNotEmpty()
    @IsUrl({
        require_protocol: true,
        protocols: ['http', 'https'],
        require_valid_protocol: true,
    })
    url: string;

    @IsBoolean()
    valid: boolean;

    @IsNumber()
    @IsInt()
    visitCounter: number;
}