export class GBBParsingError extends Error {
    public isError: boolean;

    public constructor(name: string, message: string) {
        super(message);
        this.name = name;
        this.isError = true;
        Object.setPrototypeOf(this, GBBParsingError.prototype);
    }
}

export class UnexpectedEOFError extends GBBParsingError {
    public constructor(message: string) {
        super('UnexpectedEOFError', message);
        Object.setPrototypeOf(this, UnexpectedEOFError.prototype);
    }
}
export class CellBoundaryExceeded extends GBBParsingError {
    public constructor(message: string) {
        super('CellBoundaryExceeded', message);
        Object.setPrototypeOf(this, CellBoundaryExceeded.prototype);
    }
}
export class HeadBoundaryExceeded extends GBBParsingError {
    public constructor(message: string) {
        super('HeadBoundaryExceeded', message);
        Object.setPrototypeOf(this, HeadBoundaryExceeded.prototype);
    }
}
export class DuplicateColorError extends GBBParsingError {
    public constructor(message: string) {
        super('DuplicateColorError', message);
        Object.setPrototypeOf(this, DuplicateColorError.prototype);
    }
}
export class DuplicateCellError extends GBBParsingError {
    public constructor(message: string) {
        super('DuplicateCellError', message);
        Object.setPrototypeOf(this, DuplicateCellError.prototype);
    }
}
export class InvalidSizeDefinition extends GBBParsingError {
    public constructor(message: string) {
        super('InvalidSizeDefinition', message);
        Object.setPrototypeOf(this, InvalidSizeDefinition.prototype);
    }
}
export class UnexpectedTokenError extends GBBParsingError {
    public constructor(message: string) {
        const splitted = message.split('\n');
        super('UnexpectedTokenError', splitted[0] + '\n' + splitted[2] + '\n' + splitted[3]);
        Object.setPrototypeOf(this, UnexpectedTokenError.prototype);
    }
}
