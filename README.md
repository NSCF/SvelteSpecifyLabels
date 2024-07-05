# Specimen labels using Svelte

A [Svelte](https://svelte.dev/) app for generating specimen labels with a range of options (Svelte is a front end framework for building web apps, it has nothing to do with labels!). 

This tool was originally built for generating labels from Specify database extracts because it was just easier. However, this tool can generate labels from any input csv file with sensible field headings. 

To run this tool you need to have the following installed:

- Node.js: [https://nodejs.org/](https://nodejs.org/)
- git: [https://git-scm.com/download](https://git-scm.com/download)

Create a folder on your hard drive, then open that folder. Click in the address bar of the folder and type `cmd` to open a command window. Copy paste the following command below into the command window and press enter: `git clone https://github.com/NSCF/SvelteSpecifyLabels.git`

When it's done, type `cd sveltespecifylabels` and enter, then `npm install`, then `npm run dev` and open the provided url in your browser.

Drag and drop a csv file with your specimen data onto the grey block and then use the various options to customize your labels as you would like. When you press print, remember to set the page size and margins in the print window as required (try not to waste label paper).

Your settings will be saved on the machine for future use (but you will have to set everything again if you make labels on a different computer).

***Rest assured that none of your data is saved anywhere or sent over the internet. You (or someone who knows javascript) can check the code in this repo to confirm this.***

### Field headings

The input csv file must have reasonable field headings in order for the fields to be added to the label. The headings in the file are mapped to Darwin Core terms, as well as additional specimen/accession specific terms, which are then added to the label. See src/lib/fieldMappings.js for the list of accepted field names. 

Also see example.csv for an example input file. 

