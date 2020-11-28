import {assertEquals} from "../deps.js";
import {format} from "../../utils/formatHelper.js";

Deno.test('format formats months correctly', () => {
    // arrange
    const date = new Date(2020, 0, 30)
    const expected = '2020-01-30'

    // act
    const actual = format(date)

    // assert
    assertEquals(actual, expected)
})

Deno.test('format formats days correctly', () => {
    // arrange
    const date = new Date(2020, 11, 5)
    const expected = '2020-12-05'

    // act
    const actual = format(date)

    // assert
    assertEquals(actual, expected)
})
