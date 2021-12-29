import { TimeSource } from "./time/time_source";

export class Structure {
  private _timestampBits: number;
  private _generatorBits: number;
  private _sequenceBits: number;

  public get sequenceBits(): number {
    return this._sequenceBits;
  }

  public get generatorBits(): number {
    return this._generatorBits;
  }

  public get timestampBits(): number {
    return this._timestampBits;
  }

  constructor(
    timestampBits: number,
    generatorBits: number,
    sequenceBits: number
  ) {
    if (timestampBits < 1) {
      throw new Error("timestampBits must be greater than 0");
    }
    if (generatorBits < 1) {
      throw new Error("generatorBits must be greater than 0");
    }
    if (sequenceBits < 1) {
      throw new Error("sequenceBits must be greater than 0");
    }

    if (timestampBits + generatorBits + sequenceBits != 63) {
      throw new Error("the sum of all 3 must be 63");
    }

    this._timestampBits = timestampBits;
    this._generatorBits = generatorBits;
    this._sequenceBits = sequenceBits;
  }

  public get maxSequences(): bigint {
    return BigInt(1) << BigInt(this._sequenceBits);
  }

  public get maxGenerators(): bigint {
    return BigInt(1) << BigInt(this._generatorBits);
  }

  public get maxTimestamps(): bigint {
    return BigInt(1) << BigInt(this._timestampBits);
  }

  public wraparoundTime(timeSource: TimeSource): bigint {
    return BigInt(timeSource.getTickDuration()) * this.maxTimestamps;
  }

  public getWraparoundDate(timeSource: TimeSource): {
    date: Date;
    timestamp: bigint;
  } {
    return {
      date: new Date(
        Number(timeSource.getEpoch() + this.wraparoundTime(timeSource))
      ),
      timestamp: timeSource.getEpoch() + this.wraparoundTime(timeSource),
    };
  }

  public static createDefault(): Structure {
    return new Structure(41, 10, 12);
  }
}
