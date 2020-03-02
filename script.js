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

function showResults(test) {
  const p = test.p;

  const sampleA = document.querySelector(".sampleA");
  const sampleB = document.querySelector(".sampleB");
  sampleA.innerText = test.a.sample;
  sampleB.innerText = test.b.sample;

  const result = document.getElementById("result");

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

function cleanResults() {
  const result = document.getElementById("result");
  result.innerHTML = `<div><p class="pvalue"></p></div>`;
}

function handleForm() {
  saveData();
  const dataA = valueToNumbers("groupA");
  const dataB = valueToNumbers("groupB");
  const test = new tTest2(dataA, dataB);
  if (test.valid()) {
    console.log("T: " + test.t, "P: " + test.p);
    console.log(dataA);
    console.log(dataB);
    showResults(test, dataA, dataB);
    createGraphs(dataA, dataB);
  } else {
    cleanResults();
  }
}
handleForm();

const form = document.getElementById("form");
form.addEventListener("change", handleForm);
form.addEventListener("keyup", handleForm);

function createGraphs(a, b) {
  const data = [
    {
      y: a,
      type: "box",
      name: "Group A",
      marker: { color: "#000" },
      boxmean: "sd"
    },
    {
      y: b,
      type: "box",
      name: "Group B",
      marker: { color: "#000" },
      boxmean: "sd"
    }
  ];

  Plotly.newPlot("graph", data, {
    title: false,
    showlegend: false,
    margin: {
      l: 40,
      r: 40,
      b: 40,
      t: 40
    }
  });
}
