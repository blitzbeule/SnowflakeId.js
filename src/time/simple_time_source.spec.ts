import { SimpleTimeSource } from "./simple_time_source";

test("test getters of SimpleTimeSource with default values", () => {
  const ts = SimpleTimeSource.createDefault();
  expect(ts.getTickDuration()).toBe(1);
  expect(ts.getEpoch()).toBe(1577836800000n);
});
