---
toc: false
---

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 2rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>

# Yet another science embedding
## How do people move around science


```js
html`
<div class="grid grid-cols-2">
  <div>
    <ul>
      <li> We look at how <ins>ego</ins> is the selected author moves around</li>
      <li> Field of science (FoS) is determined using <a href="https://github.com/allenai/s2_fos">S2ORC</a> or <a href="https://maartengr.github.io/BERTopic/index.html">BERTopic</a> (WIP)</li>
      <li> <ins>background</ins> refers to how we constructured the background embedding. <ins>Papers</ins> mean that it is a random sample of papers on S2ORC. <ins>Authors</ins> is a random sample authors, that we then took 3 papers from each. <ins>FOS</ins> is a random sample uniform by field of science (WIP)</li>
    </ul>
  </div>
  <div class="card"">
    <h2>Choose parameters</h2>
    <br>
    ${formInput}
  </div>
</div>`
```

```js
const formInput = Inputs.form({
  sel_authors: Inputs.select(["Laurent Hébert-Dufresne"], {label: "Select author"}),
  sel_topics: Inputs.select(["S2ORC"], {label: "Field of Science"}),
  sel_bg: Inputs.select(["Papers"], {label: "Background"}),
  bandwidth: Inputs.range([0, 40], {step: 0.2, label: "bandwidth"}),
  thresholds: Inputs.range([1, 40], { step: 1, value: 20, label: "thresholds" }),
  show_background: Inputs.toggle({label: "show background", value: false})
});

const form = Generators.input(formInput);
```

```js
const color = form.show_background ? 
  {legend:true, scheme: form.show_background ? "turbo" : null} : 
  {legend: true, domain: current_fos, range: current_hex}
```

```js
Plot.plot({
  color: color,
  marginLeft:100,
  marginBottom:50,
  marginRight:50,
  marginTop:50,
  height: 800,
  width: 1200,
  axis: null,
  marks: [
    Plot.dot(
      dat.filter(d => d.is_background === false && d.year >= sel_yr_min && d.year <= sel_yr_max), {
        x: 'x', 
        y: 'y', 
        stroke: d => form.show_background ? cat2id[d['fos']] : d['fos'],
        r: 3,
        title: d => `Title: ${d['title']}\nField of study: ${d['fos']}`,  
        tip: true
      }),
      Plot.dot(
        dat.filter(d => d.is_background === true  && d.year >= sel_yr_min && d.year <= sel_yr_max), {
          x: 'x', 
          y: 'y',   
          stroke: d => form.show_background ? cat2id[d['fos']] : 'lightgrey',
          r: 3,
          fillOpacity: form.show_background ? 0.9 : 0.5,
          strokeOpacity: form.show_background ? 0.9 : 0.5,
          title: form.show_background ? d => `Title: ${d['title']}\nField of study: ${d['fos']}` : null,  
          tip: form.show_background ? true : false
      }),
    Plot.density(dat, { x: 'x', y: 'y', bandwidth: form.bandwidth, thresholds: form.thresholds, strokeWidth: 0.1}),
    // Plot.tip(dat.filter(d=>d.is_background==false && d['title'] === "Measuring Centralization of Online Platforms Through Size and Interconnection of Communities"), { 
    //     x: 'x', y: 'y', anchor: "right", title: d => `Title: ${d['title']}\nField of study: ${d['fos']}`
    //     })
  ]
})
```

```js
const sel_yr_min = view(Inputs.range([2010, 2023], { step: 1, value: 2010, label: "year min"}))
const sel_yr_max = view(Inputs.range([2010, 2023], { step: 1, value: 2023, label: "year max"}))
```

```js
// IMPORT DB STUFF
import * as duckdb from "npm:@duckdb/duckdb-wasm";
const db = DuckDBClient.of({  emb: FileAttachment("./data/embedding.parquet"), })
```

```js
// QUERY THE DATA
const dat = db.query(`SELECT * FROM emb`)
const uniqFOS = db.query(`SELECT DISTINCT(fos) as name FROM emb`)
```

```js
// HELPERS FOR COLORS
let cat2id = {};
let fos_name = uniqFOS.map(d => d.name)
for (let i = 0; i < fos_name.length; i++) {
  cat2id[fos_name[i]] = i
}

function generateHexColors(numColors) {
  let colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push('#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
  }
  return colors;
}

const hexColors = generateHexColors(23);

// CATEGORY TO COLORS
let cat2col = {};

for (let i = 0; i < fos_name.length; i++) {
  cat2col[fos_name[i]] = hexColors[i]
}

// TOGGLING THE BACKGROUND
// MAKING SURE COLORS ARE CONSISTENT AS WE ADD NEW YEARS
const current_fos = form.show_background ? 
          Array.from(new Set(dat.filter(d => d.is_background === true  && d.year >= sel_yr_min && d.year <= sel_yr_max)
                      .map(d => d.fos))) :         
          Array.from(new Set(dat.filter(d => d.is_background === false  && d.year >= sel_yr_min && d.year <= sel_yr_max)
                      .map(d => d.fos)))

const current_hex = current_fos.map(d => cat2col[d])
```

## Table

```js
Inputs.table(dat)
```
---

