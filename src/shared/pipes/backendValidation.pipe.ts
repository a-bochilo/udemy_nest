import {
    ArgumentMetadata,
    HttpStatus,
    PipeTransform,
    ValidationError,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { HttpException } from "@nestjs/common";

export class BackendValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        const object = plainToClass(metadata.metatype, value);

        const errors = await validate(object);

        if (!errors.length) return value;

        throw new HttpException(
            { errors: this.formatErrors(errors) },
            HttpStatus.UNPROCESSABLE_ENTITY
        );
    }

    formatErrors(errors: ValidationError[]) {
        return errors.reduce((acc, err) => {
            acc[err.property] = Object.values(err.constraints);
            return acc;
        }, {});
    }
}