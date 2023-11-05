import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    Paramtype,
    ValidationPipe,
} from '@nestjs/common';

import { isObject, omit } from 'lodash';

import { DTO_VALIDATION_OPTIONS } from '../constants';
import { deepMerge } from '../helpers';

/**
 * global pipe for DTO validation
 */
@Injectable()
export class AppPipe extends ValidationPipe {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype, type } = metadata;
        // dto class
        const dto = metatype as any;
        const options = Reflect.getMetadata(DTO_VALIDATION_OPTIONS, dto) || {};
        const originOptions = { ...this.validatorOptions };
        const originTransform = { ...this.transformOptions };
        const { transformOptions, type: optionsType, ...customOptions } = options;
        const requestType: Paramtype = optionsType ?? 'body';

        // skip if request type for DTO is different from the request type for the data
        if (requestType !== type) return value;

        // merge transform options and custom options
        if (transformOptions) {
            this.transformOptions = deepMerge(
                this.transformOptions,
                transformOptions ?? {},
                'replace',
            );
        }
        // merge vliadtor options and custom options
        this.validatorOptions = deepMerge(this.validatorOptions, customOptions ?? {}, 'replace');
        const toValidate = isObject(value)
            ? Object.fromEntries(
                  Object.entries(value as Record<string, any>).map(([key, v]) => {
                      if (!isObject(v) || !('mimetype' in v)) return [key, v];
                      return [key, omit(v, ['fields'])];
                  }),
              )
            : value;
        try {
            let result = await super.transform(toValidate, metadata);
            // if there is static transform function
            if (typeof result.transform === 'function') {
                result = await result.transform(result);
                const { transform, ...data } = result;
                result = data;
            }
            // reset validator options
            this.validatorOptions = originOptions;
            // reset transform options
            this.transformOptions = originTransform;
            return result;
        } catch (error: any) {
            this.validatorOptions = originOptions;
            this.transformOptions = originTransform;
            if ('response' in error) throw new BadRequestException(error.response);
            throw new BadRequestException(error);
        }
    }
}
