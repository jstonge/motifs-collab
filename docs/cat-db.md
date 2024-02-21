```js
import * as duckdb from "npm:@duckdb/duckdb-wasm";

const db = DuckDBClient.of({ 
    count_inst: FileAttachment("./data/count_inst.parquet"),
    png_v_pdf: FileAttachment("./data/ror_00f54p054.parquet"),
    })
```

# The-CAT-DB
## The state of the catDB

```js
const dat = db.query(`SELECT * FROM count_inst`)
const dat2 = db.query(`SELECT * FROM png_v_pdf`)
```

```js
Plot.barX(dat, {x: 'pdf_count', y: "ror" }).plot({marginLeft: 100})
```

## Looking at specific institution

```js
Plot.plot({
 marginLeft:200,
  x: { grid: true, },
  marks: [
    Plot.barX(dat2, {
        x: "pdf_tot_pages", 
        y: "pdfid", 
        fillOpacity: 0.6,
        fill: "red",
        sort: {y: "x", reverse: true}}
        ),
    Plot.barX(dat2, {
        x: "png_count", 
        y: "pdfid", 
        fillOpacity: 0.3,
        fill: "lightblue",
        sort: {y: "x", reverse: true}}
        )
  ]
})
```


---