class tTest2 {
  constructor(dataA, dataB) {
    this.dataA = dataA;
    this.dataB = dataB;
    this.a = this.getA();
    this.b = this.getB();
    this.t = this.getT();
    this.p = this.getP();
  }
  calcSampleSumSqMeanSqInd(data) {
    const sample = data.length;
    const sum = data.reduce((acc, i) => acc + i);
    const sq = sum * sum;
    const mean = sum / sample;
    const sqInd = data.map(i => i * i).reduce((acc, i) => acc + i);
    return {
      sample,
      sum,
      sq,
      mean,
      sqInd
    };
  }
  getT() {
    const a = this.getA();
    const b = this.getB();
    const p1a = a.sqInd - a.sq / a.sample;
    const p1b = b.sqInd - b.sq / b.sample;
    const p2 = (p1a + p1b) / (a.sample + b.sample - 2);
    const p3 = p2 * (1 / a.sample + 1 / b.sample);
    const t = (a.mean - b.mean) / Math.sqrt(p3);
    return t;
  }
  getP() {
    if (window.jStat) {
      const p = jStat.ttest(
        this.getT(),
        this.getA().sample + this.getB().sample,
        2
      );
      return +p.toFixed(5);
    } else {
      console.error("Library jStat needed: https://github.com/jstat/jstat");
      return NaN;
    }
  }
  getA() {
    if (this.dataA.length > 0) {
      return this.calcSampleSumSqMeanSqInd(this.dataA);
    } else {
      return [];
    }
  }
  getB() {
    if (this.dataB.length > 0) {
      return this.calcSampleSumSqMeanSqInd(this.dataB);
    } else {
      return [];
    }
  }
  valid() {
    return !isNaN(this.getT()) && !isNaN(this.getP());
  }
}
window.tTest2 = tTest2;
