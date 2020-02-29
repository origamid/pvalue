function saveData() {
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach(textarea => {
    const value =
      textarea.value.length > 0
        ? textarea.value
        : window.localStorage.getItem(textarea.id);
    window.localStorage.setItem(textarea.id, value);
  });
}

function populateData() {
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach(textarea => {
    const item = window.localStorage.getItem(textarea.id);
    let populate = false;
    if (item !== null && item !== "null") {
      const array = item.split(/\r?\n/).filter(item => item);
      populate = array.length > 0;
    }

    if (populate) {
      const value = item ? item : "";
      textarea.value = value;
    }
  });
}
populateData();

function calcT(qa, qb) {
  const totalA = qa.length;
  const totalB = qb.length;
  const sumA = qa.reduce((acc, i) => acc + i);
  const sumB = qb.reduce((acc, i) => acc + i);
  const sqA = sumA * sumA;
  const sqB = sumB * sumB;
  const meanA = sumA / totalA;
  const meanB = sumB / totalB;

  const sqIndA = qa.map(i => i * i).reduce((acc, i) => acc + i);
  const sqIndB = qb.map(i => i * i).reduce((acc, i) => acc + i);

  const p1 = sqIndA - sqA / totalA + (sqIndB - sqB / totalB);
  const p2 = p1 / (totalA + totalB - 2);
  const p3 = p2 * (1 / totalA + 1 / totalB);
  const p4 = Math.sqrt(p3);
  const t = (meanA - meanB) / p4;
  const dFree = totalA - 1 + totalB - 1;

  return [t, dFree];
}

function valueToNumbers(id) {
  const group = document.getElementById(id);
  return group.value
    .replace(/ /g, "")
    .split(/\r?\n/)
    .filter(item => item)
    .map(item => item.replace(",", ""))
    .map(Number)
    .filter(n => !isNaN(n));
}

function distributeMean(className, value) {
  const element = document.querySelector(className);
  const sample = element.querySelector(".sample");
  const mean = element.querySelector(".mean");

  const meanValue = +value.reduce((acc, i) => acc + i) / value.length;

  sample.innerText = value.length;
  mean.innerText = meanValue.toFixed(2);
}

function showResults(p, valueA, valueB) {
  distributeMean(".resultA", valueA);
  distributeMean(".resultB", valueB);

  if (p > 0.05) {
    result.innerHTML = `
      <div>
        <p class="pvalue">P VALUE: ${p} >= 0.05</p>
        <p>Statistically <span class="insignificant">Insignificant</span></p>
        <p class="emoji">😲 😡 🤬 😟 😢 😭 💁‍♀️</p>
      </div>
    `;
  } else if (p < 0.05) {
    result.innerHTML = `
      <div>
        <p class="pvalue">P VALUE: ${p} < 0.05</p>
        <p>Statistically <span class="significant">Significant</span></p>
        <p class="emoji">🤓 🤯 😍 😆 😂 🤣 😴</p>
      </div>
  `;
  }
}

function handleForm() {
  saveData();
  const valueA = valueToNumbers("groupA");
  const valueB = valueToNumbers("groupB");
  let t;
  if (valueA.length > 0 && valueB.length > 0) {
    t = calcT(valueA, valueB);
    console.log("t: " + t[0]);
    console.log("A: " + valueA);
    console.log("B: " + valueB);
  }

  if (t && !isNaN(t[0])) {
    const p = jStat.ttest(t[0], valueA.length + valueB.length, 2);
    showResults(+p.toFixed(5), valueA, valueB);
  }
}
handleForm();

const form = document.getElementById("form");
form.addEventListener("change", handleForm);
form.addEventListener("keyup", handleForm);
