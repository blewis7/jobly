"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "new",
    salary: 45000,
    equity: "0.020",
    companyHandle: "c1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({...newJob, id: expect.any(Number)});
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
        {
            id: 1,
            title: 'hello',
            salary: 45000,
            equity: "0",
            companyHandle: 'c1',
            companyName: "C1"
        },
        {
            id: 2,
            title: 'world',
            salary: 55000,
            equity: "0.020",
            companyHandle: 'c3',
            companyName: "C3"
        },
    ]);
  });

  test("works: with filters", async () => {
    let jobs = await Job.findAll({title: "World", minSalary: 20000, hasEquity: true});
    expect(jobs).toEqual([
        {
            id: 2,
            title: 'world',
            salary: 55000,
            equity: "0.020",
            companyHandle: 'c3',
            companyName: "C3"
        },
    ]);
  })
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(1);
    expect(job).toEqual({
        id: 1,
        title: 'hello',
        salary: 45000,
        equity: "0",
        companyHandle: 'c1',
        companyName: "C1"
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(9999999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "New",
    salary: 60000,
    equity: '0.4',
  };

  test("works", async function () {
    let job = await Job.update(1, updateData);
    expect(job).toEqual({
      id: 1,
      ...updateData,
      companyHandle: 'c1'
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(999999, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(1, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(1);
    const res = await db.query(
        "SELECT id FROM jobs WHERE id=1");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(999999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
