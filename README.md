# Specimen labels using Svelte

A [Svelte](https://svelte.dev/) app for generating specimen labels with a range of options (Svelte is a front end framework for building web apps, it has nothing to do with labels!). 

This tool was originally built for generating labels from Specify database extracts because HTML provides greater versatility for label design than the Specify label designer, and also because Specify 7 field headings were erratic so say the least, in older versions. However, this tool can generate labels from any input csv file with sensible headings. 

Clone this repo to your local machine and run `npm install`, then `npm run dev` and open the provided url in your browser.

Drag and drop a csv file onto the grey block and then use the various options to customize as you would like.

### Field headings

The file must have reasonable field headings in order for the fields to be added to the label. The headings in the file are mapped to Darwin Core terms, as well as additional specimen/accession specific terms, which are then added to the label. See src/lib/fieldMappings.js for the list of accepted field names. 

Also see example.csv for an example file. 

