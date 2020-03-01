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

function distributeMean(className, data) {
  const element = document.querySelector(className);
  const sample = element.querySelector(".sample");
  const mean = element.querySelector(".mean");

  sample.innerText = data.sample ? data.sample : 0;
  mean.innerText = data.mean ? data.mean : 0;
}

function showResults(test) {
  const p = test.p();

  distributeMean(".resultA", test.a());
  distributeMean(".resultB", test.b());

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
  distributeMean(".resultA", []);
  distributeMean(".resultB", []);
}

function handleForm() {
  saveData();
  const dataA = valueToNumbers("groupA");
  const dataB = valueToNumbers("groupB");
  const test = new tTest2(dataA, dataB);
  if (test.valid()) {
    console.log("T: " + test.t(), "P: " + test.p());
    console.log(dataA);
    console.log(dataB);
    showResults(test, dataA, dataB);
  } else {
    cleanResults();
  }
}
handleForm();

const form = document.getElementById("form");
form.addEventListener("change", handleForm);
form.addEventListener("keyup", handleForm);
