export interface TimeSource {
  getTicks(): bigint;
  getTickDuration(): number;
  getEpoch(): bigint;
}
