import { ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator';

export function IsEthereumHash(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsEthereumHash',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          return /^0x[0-9a-fA-F]{64}$/.test(value);
        }
      }
    })
  }
}