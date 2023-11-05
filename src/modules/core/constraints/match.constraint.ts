import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

/**
 * if property iss equal
 */
@ValidatorConstraint({ name: 'isMatch' })
export class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [relatedProperty] = args.constraints;
        const relatedValue = (args.object as any)[relatedProperty];
        return value === relatedValue;
    }

    defaultMessage(args: ValidationArguments) {
        const [relatedProperty] = args.constraints;
        return `${relatedProperty} and ${args.property} don't match`;
    }
}

/**
 * if property in DTO is equal
 * @param relatedProperty property name
 * @param validationOptions class-validator option
 */
export function IsMatch(relatedProperty: string, validationOptions?: ValidationOptions) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [relatedProperty],
            validator: MatchConstraint,
        });
    };
}
