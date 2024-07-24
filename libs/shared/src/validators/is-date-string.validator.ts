import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isDateString', async: false })
export class IsDateStringConstraint implements ValidatorConstraintInterface {

  validate(value: any, args: ValidationArguments) {
    const regex = /^\d{4}-\d{2}-\d{2}$/gm; // Format: YYYY-MM-DD
    return typeof value === 'string' && regex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Date must be in the format YYYY-MM-DD';
  }
}