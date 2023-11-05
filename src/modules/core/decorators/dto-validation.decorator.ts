import { Paramtype, SetMetadata } from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';

import { DTO_VALIDATION_OPTIONS } from '../constants';

/**
 * DTO class decorator for configuring data validation through the global validation pipe
 * @param options
 */
export const DtoValidation = (
    options?: ValidatorOptions & {
        transformOptions?: ClassTransformOptions;
    } & { type?: Paramtype },
) => SetMetadata(DTO_VALIDATION_OPTIONS, options ?? {});
