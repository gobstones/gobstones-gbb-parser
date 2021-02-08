/* eslint-disable max-len */
import { Locale } from './Locale';

export const es: Locale = {
    parser: {
        errors: {
            CellBoundaryExceeded:
                'La definición para la coordenada ${coordinate} en la definición de la celda ${x} ${y} en la línea ${line}, columna ${column} es inválida, ya que cae fuera del tablero.',
            DuplicateCellDefinition:
                'La definición de la celda ${x} ${y} se encontró dos veces. La primera en la línea ${lineFirstAppearance}, columna ${colFirstAppearance} y nuevamente en la línea ${lineSecondAppearance}, columna ${colSecondAppearance}.',
            DuplicateColorDefinition:
                'La definición para el color ${color} de la celda ${x} ${y} se declara dos veces. La primera vez en la línea ${lineFirstAppearance}, columna ${colFirstAppearance} y nuevamente en la línea ${lineSecondAppearance}, columna ${colSecondAppearance}.',
            HeadBoundaryExceeded:
                'La posición del cabezal cae fuera del tablero. La ${coordinate} está declarada como ${coordinateValue} en la línea ${coordinateLine}, columna ${coordinateCol}, pero no puede ser superior al ${dimension} del tablero el cual está declarado como ${dimensionValue} en la línea ${dimensionLine}, columna ${dimensionCol}.',
            InvalidSizeDefinition:
                'La ${dimension} del tablero no puede ser cero. Error en la línea ${line}, columna ${col}.',
            UnexpectedEOF:
                'Llegamos al final del archivo, pero todavía hay datos que son requeridos. ¿Está seguro de estar pasando el contenido del archivo completo?',
            UnexpectedToken:
                'Se encontró un carater inválido en la línea ${lineNumber}, columna ${columnNumber}:\n${lineText}\n${lineMarker}'
        }
    },
    stringifier: {
        errors: {
            InvalidHeadDefinition:
                'La posición del cabezal debe definirse como un arreglo de dos elementos, donde cada uno es un número.',
            HeadBoundaryExceeded:
                'El cabezal en ${coordinate} tiene un valor inválido, ya que cae fuera del tablero. Especificaste ${value}, pero debe ser mayor o igual a ${min} o menor o igual a ${max}.',
            InvalidSizeDefinition:
                'El ${dimension} del tablero no puede ser cero o negativo, pero especificaste ${value}.',
            InvalidCellDefinition: {
                main:
                    "La definición de una celda debe contener valores para 'a', 'n', 'r' and 'v', y nada más. ",
                missing:
                    'Te está faltando un valor para la clave ${key} para la definición de la celda en la posición ${x}, ${y}.',
                added: 'Aún así hay claves adicionales para la posición ${x}, ${y}.'
            },
            InvalidBoardDefinition: {
                main:
                    'La cantidad de elementos en el arreglo de la definición de board debe coincidir con el ancho y alto definido para el tablero en cada uno de sus elementos',
                width:
                    'Sin embargo el arreglo tiene ${encountered} elementos, mientras que el ancho indica que ${declared} como requerido.',
                height:
                    'Sin embargo el arreglo en la posición ${position} del arreglo tiene ${encountered} elementos, mientras que el ancho indica que ${declared} son requeridos.'
            },
            InvalidBoardDataDefinition:
                'El atributo cellData o board está definido incorrectamente.'
        }
    },
    keywords: {
        width: 'ancho',
        height: 'alto',
        xCoordinate: 'coordenada X',
        yCoordinate: 'coordenada Y',
        a: 'Azul',
        n: 'Negro',
        r: 'Rojo',
        v: 'Verde'
    },
    cli: {
        descriptions: {
            tool: 'Un Parser/Stringifier para el formato de archivo GBB (Tablero de Gobstones)',
            help: 'Mostrar la ayuda de la herramienta',
            version: 'Mostrar información de la versión',
            parse: 'Leer un texto en formato GBB y producir un JSON',
            stringify: 'Leer un JSON y producir un texto en formato GBB',
            language:
                'Idioma a utilizar, uno de ${availableLangs}. Solo afecta los mensajes de error, not el lenguaje en si.',
            file:
                'Usar los contenidos de un archivo como entrada. Si se especifica esta opción, la entrada en línea es ignorada.',
            out: 'Escribir la salida a un archivo. Si el archivo ya existe, se sobreescribe.',
            pretty: 'Mostrar la salida de forma agradable a la lectura'
        },
        errors: {
            language:
                'Especificaste el idioma "${lang}", pero no es un idioma válido, seleccione uno de ${availableLangs}.',
            file: 'El archivo ${fileName} no existe o no se puede leer.'
        }
    }
};
