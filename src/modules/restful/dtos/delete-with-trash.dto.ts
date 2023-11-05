import { Transform } from 'class-transformer';

import { IsBoolean, IsDefined, IsOptional, IsUUID } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';

import { toBoolean } from '@/modules/core/helpers';

import { DeleteDto } from './delete.dto';

/**
 * bulk delete validation with soft delete
 */
@DtoValidation()
export class DeleteWithTrashDto extends DeleteDto {
    @Transform(({ value }) => toBoolean(value))
    @IsBoolean()
    @IsOptional()
    trash?: boolean;
}

// src/modules/restful/dtos/restore.dto.ts
/**
 * bulk recover validation
 */
@DtoValidation()
export class RestoreDto {
    @IsUUID(undefined, {
        each: true,
        message: 'ID Format Error',
    })
    @IsDefined({
        each: true,
        message: 'ID is required',
    })
    ids: string[] = [];
}
