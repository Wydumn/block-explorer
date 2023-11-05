import { ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator';

// validate if prefix is 0x
export function IsStartsWith0x(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsStartsWith0x',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          return value.startsWith('0x');
        }
      }
    })
  }
}