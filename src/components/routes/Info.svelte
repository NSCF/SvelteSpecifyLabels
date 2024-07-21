<script>
  import Header from "../Header.svelte";
</script>
<Header />
-- add hyperlinks for concepts here, like CSV, character encoding, etc
<p>
  This tool makes creating specimen labels quick and easy. Simply add your dataset, select the label type you want, and 
  tweak the settings as needed. The labels have been designed to meet the needs of most collection types and adhere to best practices. 
  We hope this will save you some time and that you will enjoy using it. If you encounter any problems please create on issue
  on the Github page.
</p>

<h3>Usage</h3>

<h4>Loading your data</h4>
<p>
  Start by loading in a CSV file with your data from the home page. CSV is the simplest and easiest format for exchanging data between 
  systems. There is a link to an example file you can use as a template (see below).
</p>
<p>If you are using Excel or Access to manage your specimen data then make sure to set the encoding 
  to UTF-8 when you export your records to CSV format, otherwise special characters like degree symbols will get scrambled. 
  Most other database systems (such as Specify) use UTF-8 by default.
</p>
<p>
  <em>
    Note that no specimen data is stored or sent over the internet when using this tool. The source code is available on Github and can be checked
    by someone who knows Javascript to confirm.  
  </em>
</p>

<h4>Data fields</h4>
<p>
  The tool makes use of standard data fields like locality, date, taxon name, etc. for labels and uses Darwin Core fields 
  as far as possible. When you load your data the tool does its best to map the fields from your dataset to the label fields. For example, if you have a field called 'localityname'
  it will be mapped to 'locality'. 
</p>
<p>
  If your fields don't appear on the label there is an option to set the mappings manually. Fields can be included or excluded
  as you see fit. You can also read up on the Darwin Core term definitions in the mapping section using the links provided.
</p>
<p>
  Remember that the fields you include are up to you. The tool requires at lease one field like localit or a taxon name in 
  order to generate a label, but other than that you are free to pick and choose as you like.
</p>

<h5>Taxon name fields</h5>
<p>
  Taxon names are stored in many different ways. The tool gives priority to names stored in individual rank fields, i.e. family,
  genus, species, etc. Alternatively you can use a single field like taxon name or scientific name. It is also recommended to include separate
  fields for the taxon author, qualifiers, certainty, etc. Labels can also include identification remarks, literature sources, and so on.
</p>

<h5>The example dataset</h5>
<p>
  When you click on the link for the example dataset you will be taken to a Google Sheet which includes fields that will be
  picked up by the tool as well some example records. Hover over the field headings to see the comments describing how each field 
  should be used. You are welcome to make a copy of this sheet for your own use (File >> Make a copy).
  To download the data go to File >> Download and select 'Comma separated values (.csv)'. 
</p>
<p>
  The spreadsheet includes a field called 'print', which can be used for flagging and filtering records for printing. 
  Just enter appropriate values here, then hover on the top of the column (above the field name), click the little triangle
  that appears, select 'Create a filter', click on the striped triangle now in the field heading, and set the appropriate options. 
  You can add as many filtering columns as you need to your spreadsheet. You may want fields for institution where the specimens 
  are deposited, and date deposited, for example, which can also be used for filtering records.
</p>
<p>
  To print labels for filtered records you will need to copy and paste them into a separate spreadsheet before downloading
  the CSV file. Unfortunately Google Sheets exports everything in a spreadsheet, ignoring any filters applied. 
</p>

<h4>Duplicate labels</h4>
<p>
  If you want to duplicate labels for each specimen in a series (e.g. several insects of the same species collected together, 
  or duplicate herbarium specimens), you will need to include a field in your dataset with a count (call the field 'count'). If you 
  have a field with counts of specimens per age/sex, the tool will deduce counts from that field. 
</p>

<h4>Label options</h4>
<p>
  Once you've added your data you will see a list of options for customizing your label design. When you click the print label button 
  your choices will be saved for the next time you want to print labels. Use a small dataset to get the label design right before 
  generating large batches of labels.
</p>
<p>
  <em>
    It is strongly recommended that you <strong>print</strong> a small number of test labels to check that your design works well when
    physically printed before you print large batches of actual specimen labels. 
  </em>
</p>

<h4>Printing labels</h4>
<p>
  When you click the print button the browser will open the standard print dialog. Make sure to set the page size
  and margins appropriately before printing. You can either print directly from here or you can save the labels as a PDF
  for later printing. It is recommended to use the 'Save as PDF' option rather than 'Microsoft Print to PDF'
  as this gives better results. 
</p>
<p>
  For guidelines on printing archival quality specimen labels please see the NSCF Collection Management Manual.
</p>

<h3>Acknowledgements</h3>
<p>
  Several members of the NSCF community provided inputs and suggestions on label design, and the layout of and 
  functionality of this tool.
</p>
- language translations provided by...
