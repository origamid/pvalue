class tTest2 {
  constructor(dataA, dataB) {
    this.dataA = dataA;
    this.dataB = dataB;
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
  t() {
    const a = this.a();
    const b = this.b();
    const p1a = a.sqInd - a.sq / a.sample;
    const p1b = b.sqInd - b.sq / b.sample;
    const p2 = (p1a + p1b) / (a.sample + b.sample - 2);
    const p3 = p2 * (1 / a.sample + 1 / b.sample);
    const t = (a.mean - b.mean) / Math.sqrt(p3);
    return t;
  }
  p() {
    if (window.jStat) {
      const p = jStat.ttest(this.t(), this.a().sample + this.b().sample, 2);
      return +p.toFixed(5);
    } else {
      console.error("Library jStat needed: https://github.com/jstat/jstat");
      return NaN;
    }
  }
  a() {
    if (this.dataA.length > 0) {
      return this.calcSampleSumSqMeanSqInd(this.dataA);
    } else {
      return [];
    }
  }
  b() {
    if (this.dataB.length > 0) {
      return this.calcSampleSumSqMeanSqInd(this.dataB);
    } else {
      return [];
    }
  }
  valid() {
    return !isNaN(this.t()) && !isNaN(this.p());
  }
}
window.tTest2 = tTest2;
