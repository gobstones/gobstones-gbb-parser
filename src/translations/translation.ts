export interface Locale {
    parser: {
        errors: {
            CellBoundaryExceeded: string;
            DuplicateCellDefinition: string;
            DuplicateColorDefinition: string;
            HeadBoundaryExceeded: string;
            InvalidSizeDefinition: string;
            UnexpectedEOF: string;
            UnexpectedToken: string;
        };
    };
    stringifier: {
        errors: {
            HeadBoundaryExceeded: string;
            InvalidSizeDefinition: string;
            InvalidCellDefinition: {
                main: string;
                missing: string;
                added: string;
            };
            InvalidBoardDefinition: {
                main: string;
                width: string;
                height: string;
            };
        };
    };
    keywords: {
        width: string;
        height: string;
        xCoordinate: string;
        yCoordinate: string;
        a: string;
        n: string;
        r: string;
        v: string;
    };
    cli: {
        descriptions: {
            tool: string;
            help: string;
            version: string;
            parse: string;
            stringify: string;
            language: string;
            file: string;
            out: string;
            pretty: string;
        };
        errors: {
            language: string;
            file: string;
        };
    };
}
