import DateHelper from '../../utils/dateHelper.js'
import {assertEquals} from "../deps.js";

DateHelper.prototype.currentDate = () => {
    return new Date(2020, 0, 15, 13, 45, 11);
}

Deno.test('Today should return correct value', () => {
    // arrange
    const expected = "2020-01-15";

    // act
    const actual = new DateHelper().today();

    // assert
    assertEquals(actual, expected);
})

Deno.test('Yesterday should return correct value', () => {
    // arrange
    const expected = "2020-01-14";

    // act
    const actual = new DateHelper().yesterday();

    // assert
    assertEquals(actual, expected);
})

Deno.test('Week should return correct value', () => {
    // arrange
    const expected = 3;

    // act
    const actual = new DateHelper().week();

    // assert
    assertEquals(actual, expected);
});

Deno.test('PreviousWeek should return correct value', () => {
    // arrange
    const expected = {
        start: "2020-01-06",
        end: "2020-01-12"
    };

    // act
    const actual = new DateHelper().previousWeek();

    // assert
    assertEquals(actual, expected);
})

Deno.test('WeekByWeekNumber should return correct value', () => {
    // arrange
    const expected = {
        start: '2020-02-10',
        end: '2020-02-16'
    };

    // act
    const actual = new DateHelper().weekByWeekNumber(7);

    // assert
    assertEquals(actual, expected);
})

Deno.test('PreviousMonth should return correct value', () => {
    // arrange
    const expected = {
        start: "2019-12-01",
        end: "2019-12-31"
    };

    // act
    const actual = new DateHelper().previousMonth();

    // assert
    assertEquals(actual, expected);
})

Deno.test('MonthByMonthNumber should return correct value', () => {
    // arrange
    const expected = {
        start: '2020-02-01',
        end: '2020-02-29'
    };

    // act
    const actual = new DateHelper().monthByMonthNumber(2, 2020);

    // assert
    assertEquals(actual, expected);
})
