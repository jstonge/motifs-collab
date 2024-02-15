import * as Plot from "npm:@observablehq/plot";


export function trajectory(paper_dat_multi, {form, width, height} = {}) {
    function p_r(d) {
        // Determines paper node size
        switch (form.p_r) {
        case 'nb_coauthor':
          return d.author === null ? 0 : d.author.split(", ").length;
        case '':
          return 1;
        case 'cited_by_count':
          return d['cited_by_count'];
      }
    }

  return Plot.plot({
    height,
    width,
    marginRight: 100,
    marginLeft: 130,
    r: { range: [1, 20]},
    color: {legend: true},
    fx: { padding: 0.03, axis: "top" },
    style: "overflow: visible;",
    y: { 
      grid: true, 
      reverse: true, nice: true, inset: 50, 
      label: form.yaxis, 
      format: d => d[form.yaxis].toString.slice(1)
    },
    marks: [
      Plot.dot(
        paper_dat_multi, 
        Plot.dodgeX("middle", { 
          y: d => d[form.yaxis], 
          fx: d => d.target_type,
          fill: d => d.type === 'paper' ? 
                null : 
                d[form.a_nc] === null ? null : d[form.a_nc],
          fillOpacity: d => d.type === 'paper' ? 
                0.7 : 
                d[form.a_nc] === null ? 0.2 : 0.7,
          r: d => d.type === 'paper' ? 
              p_r(d) :
              d[form.a_r], 
          stroke: 'black', 
          strokeWidth: 0.8,
          title: d => d.type === 'coauthor' ? 
              `Display Name: ${d.title}\nInstitutions: ${d.institutions}` : 
              `Title: ${d.title}\nAuthors: ${d.author}\nDoi: ${d.doi}`, 
          tip: true
      })),
      Plot.text(
        paper_dat_multi.filter(d => d.type === 'paper' ? p_r(d) > 2 : d[form.a_r] > 2), 
          Plot.dodgeX("middle", {
            y: d => d[form.yaxis], 
            fx: d => d.target_type,
            r: d => d.type === 'paper' ? p_r(d) : d[form.a_r],
            title: d => d.type === 'paper' ? p_r(d) : d[form.a_r],
            text: d => d.type === 'paper' ? p_r(d) : d[form.a_r],
        })),
    ]
  });
}