import { SimpleTimeSource } from ".";
import { Structure } from "./structure";

test("default value getters", () => {
  const str = Structure.createDefault();

  expect(str.timestampBits).toBe(41);
  expect(str.generatorBits).toBe(10);
  expect(str.sequenceBits).toBe(12);

  expect(str.maxSequences.toString()).toEqual("4096");
  expect(str.maxGenerators.toString()).toEqual("1024");
  expect(str.maxTimestamps.toString()).toEqual("2199023255552");

  expect(str.wraparoundTime(SimpleTimeSource.createDefault())).toEqual(
    2199023255552n
  );
});

test("test exception throwing", () => {
  expect(() => {
    const str = new Structure(-1, 10, 12);
  }).toThrow();

  expect(() => {
    const str = new Structure(41, -10, 12);
  }).toThrow();

  expect(() => {
    const str = new Structure(41, 10, -12);
  }).toThrow();

  expect(() => {
    const str = new Structure(40, 10, 12);
  }).toThrow();
});
