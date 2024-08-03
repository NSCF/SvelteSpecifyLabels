<h3>Quick and easy specimen labels</h3>
<p>
  Simply add your dataset, select the label type you want, and 
  tweak the settings as needed. The labels have been designed to meet the needs of most collection types and adhere to best practices. 
</p>

<h3>How to use this tool</h3>

<h4>Loading your data</h4>
<p>
  Start by loading in a CSV file with your data from the home page. <a href="https://en.wikipedia.org/wiki/Comma-separated_values" target="_blank">CSV</a> is the simplest and 
  easiest format for exchanging data between systems. There is a link to an example file you can use as a template (see below).
</p>
<p>If you are using Excel or Access to manage your specimen data then make sure to set the encoding to 
  <a href="https://www.motionpoint.com/blog/the-importance-of-character-encoding-website-translation-user-experience" target="_blank">UTF-8</a> when you export your records to 
  CSV format, otherwise special characters like degree symbols will get scrambled. Most other database systems (such as Specify) use UTF-8 by default.
</p>
<p>
  <em>
    Note that no specimen data are stored or sent over the internet when using this tool. The source code is 
    <a href="https://github.com/NSCF/SvelteSpecifyLabels" target="_blank">available on Github</a> and can be checked
    by someone who knows Javascript to confirm.  
  </em>
</p>

<h4>Data fields</h4>
<p>
  The tool makes use of standard data fields like locality, date, taxon name, etc. and uses <a href="https://dwc.tdwg.org/terms/" target="_blank">Darwin Core field names</a>
  as far as possible. When you load your data the tool does its best to map the fields from your dataset to the label fields. For example, if you have a field called 'localityname'
  it will be mapped to 'locality'. The idea is to be able to import your data using whatever fields you have and have them picked up by the tool, so you don't have to do extra work.
</p>
<p>
  If your fields don't appear on the label there is an option to set the mappings manually. Fields can be included or excluded
  as you see fit. You can also read up on the Darwin Core term definitions in the mapping section using the links provided.
</p>
<p>
  Remember that the fields you include on the label are up to you. The tool requires at lease one field like locality or taxon name in 
  order to generate a label, but other than that you are free to pick and choose as you like.
</p>
<p>
  For herbarium labels you can also include fields like 'dups' to list institutions where duplicates are deposited, and 'additionalCollectors', as well as family and 
  genus number/code fields if you want those for filing purposes.
</p>
<p>
  For insect labels you can include a field called 'shortLocality' for an abbreviated form of the locality for printing on the label 
  (insect labels have severe space limitations). This should include everything from country down to the specific locality as you would like it on the label, 
  but not the coordinates or coordinate metadata, which get their own line. 
</p>

<h5>Taxon name fields</h5>
<p>
  Taxon names can be stored in many different ways. The tool gives priority to names stored in individual rank fields, i.e. family,
  genus, species, etc (down to subforma for plants). Alternatively you can use one field for the taxon name and store the identified 
  name there regardless of its rank (a separate field, taxonRank, can be included). It is also recommended to include separate
  fields for the taxon author, qualifiers, certainty, etc. You can also include identification remarks, literature sources, and so on.
</p>

<h5>The example dataset</h5>
<p>
  When you click on the link for the example dataset you will be taken to a Google Sheet which includes fields that will be
  picked up by the tool, and some example records. Take a few moments to go through the field headings to see the comments 
  describing how each field should be used. You are welcome to make a copy of this sheet for your own use (File >> Make a copy).
</p>
<p>
  To make labels from a Google Sheet you need to download the data in CSV format. Go to File >> Download, and select 'Comma separated values (.csv)'. 
</p>
<p>
  The spreadsheet includes a field called 'print', which can be used for flagging and filtering records for printing. 
  <a href="https://youtu.be/SYSevA4znlc?si=oO6e0d_pxyUikpEd" target="_blank">This 3min video</a> shows how to filter Google Sheets. To print labels 
  for filtered records you will need to copy and paste them into a separate spreadsheet before downloading
  the CSV file. Unfortunately Google Sheets exports everything in a spreadsheet, ignoring any filters applied. You can add as 
  many filtering columns as you need to your spreadsheet. You may want fields for institution where the specimens 
  are deposited, and date deposited, for example, for printing labels for batches of specimens as you deposit them.
</p>

<h4>Duplicate labels</h4>
<p>
  If you want to duplicate labels for each specimen in a series (e.g. several insects of the same species collected together, 
  or duplicate herbarium specimens), you will need to include a field in your dataset with a count (call the field 'count'). If you 
  have a field with counts of specimens per age/sex, the tool will deduce counts from that field, if you don't already have a count field. 
</p>

<h4>Label options</h4>
<p>
  Once you've added your data you will see a list of options for customizing your label design. When you click the print label button 
  your choices (and field mappings) will be saved for the next time you want to print labels. Use a small dataset to get the label design right before 
  generating large batches of labels.
</p>
<p>
  <em>
    It is strongly recommended that you <strong>print</strong> a small number of test labels to check that your design 
    works well when     physically printed before you print large batches of actual specimen labels. 
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
  For guidelines on printing archival quality specimen labels please see the 
  <a href="https://nscf.org.za/resources/collections-management/" target="_blank">NSCF Collection Management Manual</a>.
</p>

<h3>Comments, suggestions, and issues</h3>
<p>
  If you have any comments or suggestions, or if you encounter a bug, please create an issue on the 
  <a href="https://github.com/NSCF/SvelteSpecifyLabels/issues" target="_blank">Github page for this tool</a>.
</p>

<h3>Acknowledgements</h3>
<p>
  Several members of the NSCF community provided inputs and suggestions on label design, layout and 
  functionality of this tool.
</p>
<h4>Translations were provided by:</h4>
<ul>
  <li>afr: Adriaan Jordaan, Christiaan Steenkamp, Hester Steyn, Ian Engelbrecht</li>
</ul>
<p>If you'd like to contribute a language translation to broaden the range of languages the tool is available in, 
  please see the instructions <a href="https://github.com/NSCF/SvelteSpecifyLabels" target="_blank">on the Github page</a>, 
  and create an issue as above if you need technical assistance.
</p>