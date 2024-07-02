import Rand from "rand-seed";

export default class SeededRandom {
  static seed: string | undefined;
  static randGenerator: Rand;

  constructor() {
  }

  static setSeed(seed: string) {
    this.seed = seed !== "" ? seed : undefined;
    this.randGenerator = new Rand(this.seed);
  }

  static random() {
    return this.randGenerator.next();
  }

  static range(min: number, max: number) {
    return Math.floor(this.random() * (max - min) + min);
  }
}
