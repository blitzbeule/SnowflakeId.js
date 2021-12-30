import { SimpleTimeSource } from ".";
import { Structure } from "./structure";
import { TimeSource } from "./time/time_source";
import { sleep } from "./util";

export class SnowflakeGenerator {
  private _generatorId: bigint;

  private _structure: Structure;
  private timeSource: TimeSource;

  private maxSequence: bigint;
  private timeMask: bigint;
  private timeShift: bigint;
  private generatorComponent: bigint;

  private lastTimestamp: bigint = -1n;
  private sequence: bigint = 0n;

  constructor(generatorId: bigint);
  constructor(
    generatorId: bigint,
    structure: Structure,
    timeSource: TimeSource
  );
  constructor(
    generatorId: bigint,
    structure?: Structure,
    timeSource?: TimeSource
  ) {
    if (structure === undefined || structure === null) {
      structure = Structure.createDefault();
    }
    if (timeSource === undefined || timeSource === null) {
      timeSource = SimpleTimeSource.createDefault();
    }

    if (generatorId < 0 || generatorId > structure.maxGenerators - 1n) {
      throw new Error("generatorId not in bounds");
    }
    this._generatorId = generatorId;

    this._structure = structure;
    this.timeSource = timeSource;

    this.timeMask = this.calculateMask(BigInt(structure.timestampBits));
    this.maxSequence = this.calculateMask(BigInt(structure.sequenceBits));
    this.timeShift = BigInt(structure.generatorBits + structure.sequenceBits);
    this.generatorComponent = generatorId << BigInt(structure.sequenceBits);
  }

  public async next(): Promise<bigint> {
    const ticks = this.timeSource.getTicks();
    if (ticks < 0) {
      throw new Error("Clock gave negative ticks");
    }
    const timestamp = ticks & this.timeMask;

    if (timestamp < this.lastTimestamp) {
      throw new Error("Timestamp moved backwards or wrapped around!");
    }

    if (timestamp == this.lastTimestamp) {
      if (this.sequence >= this.maxSequence) {
        await sleep(1);
        return this.next();
      }
      this.sequence++;
    } else {
      this.sequence = 0n;
      this.lastTimestamp = timestamp;
    }

    return (
      BigInt(0) +
      (timestamp << this.timeShift) +
      this.generatorComponent +
      this.sequence
    );
  }

  private calculateMask(bits: bigint): bigint {
    return (BigInt(1) << bits) - BigInt(1);
  }

  public get structure(): Structure {
    return this._structure;
  }

  public get generatorId(): bigint {
    return this._generatorId;
  }
}
