import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';
import { isNil, merge } from 'lodash';
import { DataSource, ObjectType } from 'typeorm';

type Condition = {
    entity: ObjectType<any>;
    /**
     * If no field is specified, the currently property will be used as the query basis
     */
    property?: string;
};

/**
 * validate uniqueness
 */
@ValidatorConstraint({ name: 'dataUnique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
    constructor(private dataSource: DataSource) {}

    async validate(value: any, args: ValidationArguments) {
        const config: Omit<Condition, 'entity'> = {
            property: args.property,
        };
        const condition = ('entity' in args.constraints[0]
            ? merge(config, args.constraints[0])
            : {
                  ...config,
                  entity: args.constraints[0],
              }) as unknown as Required<Condition>;
        if (!condition.entity) return false;
        try {
            // query if exist, failure when exist
            const repo = this.dataSource.getRepository(condition.entity);
            return isNil(
                await repo.findOne({ where: { [condition.property]: value }, withDeleted: true }),
            );
        } catch (err) {
            // failure if database operation error
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        const { entity, property } = args.constraints[0];
        const queryProperty = property ?? args.property;
        if (!(args.object as any).getManager) {
            return 'getManager function not been found!';
        }
        if (!entity) {
            return 'Model not been specified!';
        }
        return `${queryProperty} of ${entity.name} must been unique!`;
    }
}

export function IsUnique(
    params: ObjectType<any> | Condition,
    validationOptions?: ValidationOptions,
) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [params],
            validator: UniqueConstraint,
        });
    };
}
