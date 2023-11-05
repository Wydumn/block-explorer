import { IsDefined, IsUUID } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';

/**
 * bulk delete validation
 */
@DtoValidation()
export class DeleteDto {
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
