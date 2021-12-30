import { SnowflakeGenerator } from "./generator";
import { Structure } from "./structure";

describe("new gen with id 9", () => {
  test("compare structure and generatorId", () => {
    const generator = new SnowflakeGenerator(9n);
    expect(generator.structure).toEqual(Structure.createDefault());
    expect(generator.generatorId).toBe(9n);
  });
  test("request 10000 ids at once and check sameness", async () => {
    let count = 10000;
    const generator = new SnowflakeGenerator(9n);
    let data = new Array<bigint>(count);
    for (let i = 0; i < count; i++) {
      data[i] = await generator.next();
    }

    for (let i = 0; i < data.length; i++) {
      const id = data[i];
      expect(data.filter((v) => v == id).length).toBe(1);
    }
  });
});

test("error with negative generatorId", () => {
  expect(() => {
    const gen = new SnowflakeGenerator(-9n);
  }).toThrow();
});
