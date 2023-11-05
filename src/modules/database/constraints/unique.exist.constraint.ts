import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';
import { isNil, merge } from 'lodash';
import { DataSource, Not, ObjectType } from 'typeorm';

type Condition = {
    entity: ObjectType<any>;
    /**
     * default id
     */
    ignore?: string;
    /**
     * If no field is specified, the property will be used as the query basis
     */
    property?: string;
};

/**
 * verify uniqueness when updating, ignored fields by specifying ignore
 */
@ValidatorConstraint({ name: 'dataUniqueExist', async: true })
@Injectable()
export class UniqueExistContraint implements ValidatorConstraintInterface {
    constructor(private dataSource: DataSource) {}

    async validate(value: any, args: ValidationArguments) {
        const config: Omit<Condition, 'entity'> = {
            ignore: 'id',
            property: args.property,
        };
        const condition = ('entity' in args.constraints[0]
            ? merge(config, args.constraints[0])
            : {
                  ...config,
                  entity: args.constraints[0],
              }) as unknown as Required<Condition>;
        if (!condition.entity) return false;
        const ignoreValue = (args.object as any)[condition.ignore];
        // failure if ignoreValue not exist
        if (ignoreValue === undefined) return false;
        const repo = this.dataSource.getRepository(condition.entity);
        // if property is unique for queryProperty besides ignoreValue
        return isNil(
            await repo.findOne({
                where: {
                    [condition.property]: value,
                    [condition.ignore]: Not(ignoreValue),
                },
                withDeleted: true,
            }),
        );
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

/**
 * validation when update
 * @param params Entity class or Condition
 * @param validationOptions
 */
export function IsUniqueExist(
    params: ObjectType<any> | Condition,
    validationOptions?: ValidationOptions,
) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [params],
            validator: UniqueExistContraint,
        });
    };
}
