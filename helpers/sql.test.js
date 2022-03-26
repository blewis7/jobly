const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("./sql");

const js = {"firstName": "first_name", "lastName": "last_name", "isAdmin": "is_admin"};

describe("sqlForPartialUpdate", function () {
    test("works for valid input for first_name, last_name, and age", () => {
        const data = {"firstName": "Brock", "lastName": "Lewis", "age": 27};
        const res = sqlForPartialUpdate(data, js);
        expect(res.setCols).toEqual('"first_name"=$1, "last_name"=$2, "age"=$3');
        expect(res.values).toEqual(["Brock", "Lewis", 27]);
    });

    test("Works for valid input for one variable, is_admin", () => {
        const data = {"isAdmin": true};
        const res = sqlForPartialUpdate(data, js);
        expect(res.setCols).toEqual('"is_admin"=$1');
        expect(res.values).toEqual([true]);
    });

    test("Works for invalid input, empty object", () => {
        const data = {};
        try {
            sqlForPartialUpdate(data, js);
        }
        catch (err){
            expect(err instanceof BadRequestError).toBeTruthy();
        } 
    });
})