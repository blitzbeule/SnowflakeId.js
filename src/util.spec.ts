import { sleep } from "./util";

test("test sleep", () => {
  expect(async () => {
    await sleep(3);
  }).not.toThrow();
});
