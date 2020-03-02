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
  scientificToDecimal(num) {
    var nsign = Math.sign(num);
    //remove the sign
    num = Math.abs(num);
    //if the number is in scientific notation remove it
    if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
      var zero = "0",
        parts = String(num)
          .toLowerCase()
          .split("e"), //split into coeff and exponent
        e = parts.pop(), //store the exponential part
        l = Math.abs(e), //get the number of zeros
        sign = e / l,
        coeff_array = parts[0].split(".");
      if (sign === -1) {
        l = l - coeff_array[0].length;
        if (l < 0) {
          num =
            coeff_array[0].slice(0, l) +
            "." +
            coeff_array[0].slice(l) +
            (coeff_array.length === 2 ? coeff_array[1] : "");
        } else {
          num = zero + "." + new Array(l + 1).join(zero) + coeff_array.join("");
        }
      } else {
        var dec = coeff_array[1];
        if (dec) l = l - dec.length;
        if (l < 0) {
          num = coeff_array[0] + dec.slice(0, l) + "." + dec.slice(l);
        } else {
          num = coeff_array.join("") + new Array(l + 1).join(zero);
        }
      }
    }
    return nsign < 0 ? "-" + num : num;
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
      const value = this.scientificToDecimal(p) + "";
      return value.substring(0, 10);
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
