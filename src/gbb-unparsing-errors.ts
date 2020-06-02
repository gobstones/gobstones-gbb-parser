export class GBBUnparsingError extends Error {
    public isError: boolean;

    public constructor(name: string, message: string) {
        super(message);
        this.name = name;
        this.isError = true;
        Object.setPrototypeOf(this, GBBUnparsingError.prototype);
    }
}
export class CellBoundaryExceeded extends GBBUnparsingError {
    public constructor(message: string) {
        super('CellBoundaryExceeded', message);
        Object.setPrototypeOf(this, CellBoundaryExceeded.prototype);
    }
}
export class HeadBoundaryExceeded extends GBBUnparsingError {
    public constructor(message: string) {
        super('HeadBoundaryExceeded', message);
        Object.setPrototypeOf(this, HeadBoundaryExceeded.prototype);
    }
}
export class InvalidSizeDefinition extends GBBUnparsingError {
    public constructor(message: string) {
        super('InvalidSizeDefinition', message);
        Object.setPrototypeOf(this, InvalidSizeDefinition.prototype);
    }
}
export class InvalidCellDefinition extends GBBUnparsingError {
    public constructor(message: string) {
        super('InvalidCellDefinition', message);
        Object.setPrototypeOf(this, InvalidCellDefinition.prototype);
    }
}
export class InvalidBoardDefinition extends GBBUnparsingError {
    public constructor(message: string) {
        super('InvalidBoardDefinition', message);
        Object.setPrototypeOf(this, InvalidBoardDefinition.prototype);
    }
}
