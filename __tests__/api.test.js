const { updateMeetupSchema } = require("../src/validators/meetup/index");
const {
  getWhereClause,
  getOrderByClause,
} = require("../src/common/helpers/getMeetupsHelper");

describe("Update meetup validation", () => {
  test("Valid input passes validation", () => {
    const validInput = {
      meetup_id: 123,
      name: "Mobile App Development Workshop",
      description:
        "Learn about mobile app development strategies and tools from industry experts.",
      keywords: ["Mobile app development", "iOS", "Android"],
      time: new Date(Date.now() + 24 * 60 * 60 * 1000),
      place: "AppSpace, 456 Oak St",
    };
    const { error } = updateMeetupSchema.validate(validInput);
    expect(error).toBeUndefined();
  });

  test("Invalid input fails validation if meetup_id is not a number", () => {
    let meetup = {
      meetup_id: "sdfdsfds",
      name: "Mobile App Development Workshop",
      description:
        "Learn about mobile app development strategies and tools from industry experts.",
      keywords: ["Mobile app development", "iOS", "Android"],
      time: new Date(Date.now() + 24 * 60 * 60 * 1000),
      place: "AppSpace, 456 Oak St",
    };
    const { error } = updateMeetupSchema.validate(meetup);
    expect(error).toBeDefined();
  });

  test("Invalid input fails validation if meetup_id is not positive", () => {
    const invalidInput = {
      meetup_id: -1,
      name: "Mobile App Development Workshop",
      description:
        "Learn about mobile app development strategies and tools from industry experts.",
      keywords: ["Mobile app development", "iOS", "Android"],
      time: new Date(Date.now() + 24 * 60 * 60 * 1000),
      place: "AppSpace, 456 Oak St",
    };
    const { error } = updateMeetupSchema.validate(invalidInput);
    expect(error).toBeDefined();
  });

  test("Invalid input fails validation if name length is less than 5 characters", () => {
    const invalidInput = {
      meetup_id: 123,
      name: "ABC",
      description:
        "Learn about mobile app development strategies and tools from industry experts.",
      keywords: ["Mobile app development", "iOS", "Android"],
      time: new Date(Date.now() + 24 * 60 * 60 * 1000),
      place: "AppSpace, 456 Oak St",
    };
    const { error } = updateMeetupSchema.validate(invalidInput);
    expect(error).toBeDefined();
  });
});

describe("getWhereClause function", () => {
  test("Returns empty object if no filters provided", () => {
    const filters = {};
    const fieldNames = ["name", "description", "keywords", "time", "place"];
    const result = getWhereClause(filters, fieldNames);
    expect(result).toEqual({});
  });

  test("Returns whereClause object with correct keys and values", () => {
    const filters = { name: "Workshop", place: "AppSpace" };
    const fieldNames = ["name", "description", "keywords", "time", "place"];
    const result = getWhereClause(filters, fieldNames);
    expect(result).toEqual({
      name: { contains: "Workshop", mode: "insensitive" },
      place: { contains: "AppSpace", mode: "insensitive" },
    });
  });

  test("Ignores filters that are not in fieldNames", () => {
    const filters = { invalidField: "Value" };
    const fieldNames = ["name", "description", "keywords", "time", "place"];
    const result = getWhereClause(filters, fieldNames);
    expect(result).toEqual({});
  });
});

describe("getOrderByClause function", () => {
  test("Returns orderByClause object with default sorting if no sortFields provided", () => {
    const sortFields = [];
    const fieldNames = ["name", "description", "keywords", "time", "place"];
    const sortOrders = [];
    const result = getOrderByClause(sortFields, fieldNames, sortOrders);
    expect(result).toEqual({ meetup_id: "asc" });
  });

  test("Returns orderByClause object with correct sorting", () => {
    const sortFields = ["time", "name"];
    const fieldNames = ["name", "description", "keywords", "time", "place"];
    const sortOrders = ["desc", "asc"];
    const result = getOrderByClause(sortFields, fieldNames, sortOrders);
    expect(result).toEqual({ time: "desc", name: "asc" });
  });

  test("Ignores sortFields that are not in fieldNames", () => {
    const sortFields = ["invalidField", "name"];
    const fieldNames = ["name", "description", "keywords", "time", "place"];
    const sortOrders = ["asc", "asc"];
    const result = getOrderByClause(sortFields, fieldNames, sortOrders);
    expect(result).toEqual({ name: "asc" });
  });
});
