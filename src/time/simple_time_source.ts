import { TimeSource } from "./time_source";

export class SimpleTimeSource implements TimeSource {
  private epoch: bigint;

  constructor(epoch: bigint) {
    this.epoch = epoch;
  }
  getTicks(): bigint {
    return BigInt(Date.now()) - this.epoch;
  }
  getTickDuration(): number {
    return 1;
  }
  getEpoch(): bigint {
    return this.epoch;
  }

  // 1577836800000 is Wednesday, 1. January 2020 00:00:00 GMT
  public static createDefault(): SimpleTimeSource {
    return new SimpleTimeSource(BigInt(1577836800000));
  }
}
