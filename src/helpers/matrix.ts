/**
 * Create a two-dimensional matrix where all positions are filled using the given
 * generator.
 *
 * @param width - The number of rows of the matrix
 * @param height - The number of columns of the matrix
 * @param height - A function that given the i,j position of the element returns
 *  the element to store the matrix at that position
 * @returns A `T[][]` where T is the type of the elements in the matrix.
 */
export const makeMatrix = <T>(
    width: number,
    height: number,
    initialValueGenerator?: (i: number, j: number) => T
): T[][] => {
    const generatedMatrix = [];
    for (let i = 0; i < width; i++) {
        generatedMatrix[i] = [];
        for (let j = 0; j < height; j++) {
            generatedMatrix[i][j] = initialValueGenerator(i, j);
        }
    }
    return generatedMatrix;
};
