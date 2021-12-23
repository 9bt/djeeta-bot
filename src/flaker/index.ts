import Sonyflake from 'sonyflake';

let flaker: Sonyflake | undefined;

export function generateNewId(): string {
  if (!flaker) {
    flaker = new Sonyflake({
      epoch: Date.UTC(2021, 11, 1),
    });
  }

  if (!flaker) {
    throw new Error('Failed to initialize flaker');
  }

  return flaker.nextId();
}
