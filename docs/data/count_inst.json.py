import sys
import kitty
import pandas as pd

cat_db = kitty.catDB()

#### ROR ~ PDF_COUNT ####

count_inst = cat_db.count(agg_field="inst_id", collection="cc_catalog")

pd.DataFrame({'ror': count_inst.keys(), 'pdf_count': count_inst.values()})\
  .to_parquet('count_inst.parquet')


#### PDF TOT PAGES vs PNG COUNTS  ####


ror='00f54p054'

res = cat_db.find_all(id=ror, agg_field="inst_id", collection="cc_pdf")
list_pdf_ids = [r['id'] for r in res]

out = []
for pdfid in list_pdf_ids:
    png_count = cat_db.count(id=pdfid, agg_field='pdf_id', collection='cc_png')
    pdfs = cat_db.find_one(id=pdfid, agg_field=None, collection='cc_pdf')
    pdf_tot_pages = pdfs['metadata']['tot_pages']
    out.append((pdf_tot_pages, png_count, pdfid))

df = pd.DataFrame(out, columns=['pdf_tot_pages', 'png_count', 'pdfid'])
df.to_parquet(f'ror_{ror}.parquet')
