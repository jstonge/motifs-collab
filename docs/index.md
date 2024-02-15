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

```js
import {trajectory} from "./components/trajectory.js";
import {html} from "npm:htl";

import * as duckdb from "npm:@duckdb/duckdb-wasm";

const db = DuckDBClient.of({ timeline: FileAttachment("./data/timeline_prod.json")  })
```

# Scientific collab timeline
## How do collabs and individual productivity coevolve over time? 

```js
html`
<div class="grid grid-cols-2">
  <div>
    <ul>
      <li> <ins>ego</ins> is the selected author in parameters</li>
      <li> On the left, each node is a unique collaborator. On the right, each node is an article.</li>
      <li> <ins>new collab of collab</ins> are triadic closures, aka new authors that were selected from one of ego's collaborator of collaborator.</li>
      <li> Institutions is the result of coloring people with the same institutions than the guessed home institution of ego. We guess ego's institution based a simple majority rule institutions in any given year.</li>
      <li> The data was gathered using the new API provided by <a href="https://openalex.org/">OpenAlex new API</a>
    </ul>
  </div>
  <div class="card"">
    <h2>Choose parameters</h2>
    <br>
    ${formInput}
  </div>
</div>
`
```

```js
const formInput = Inputs.form({
  targets: Inputs.select(uniqAuthors.map(d => d.target), {label: "Author", multiple: 4}),
  a_nc: Inputs.select(
    ["acquaintance", "shared_institutions", "institutions"], 
    {label: "Select color", value: 'shared_institutions'}
    ),
  a_r: Inputs.select(["yearly_collabo", "all_times_collabo"], {label: "Author node size", value: 'all_times_collabo'}),
  p_r: Inputs.select(["", "cited_by_count", "nb_coauthor"], {label: "Paper node size", value: "tot_citation"}),
  yaxis: Inputs.select(["year", "author_age"], {label: "Y-axis", value: "year"})
});

const form = Generators.input(formInput);
```

```js
resize((width) => trajectory(paper_dat_multi, {form:form, width, height:1000}))
```

```js
const selected_targets = form.targets.length > 0 ? form.targets : ['Laurent Hébert‐Dufresne'] 
```

```js
const uniqAuthors = db.query(`SELECT DISTINCT(target) FROM timeline ORDER BY target`)
```

```js
const paper_dat_multi =  db.query(`SELECT * FROM timeline WHERE target in (${selected_targets.map(d => '\''+d+'\'').join()})`)
```

---


