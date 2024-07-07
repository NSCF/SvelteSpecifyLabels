# Specimen labels using Svelte

A [Svelte](https://svelte.dev/) app for generating specimen labels with a range of options (Svelte is a front end framework for building web apps, it has nothing to do with labels!). 

This tool was originally built as a proof of concept for generating labels from Specify database extracts, because it's just easier. However, it can generate labels from any input CSV file with sensible field headings. 

This project will hopefully find it's way to being a full fledged web app available online somewhere, but in the meantime we need to run it locally.

## Installation

You will need to have the following software downloaded AND installed on your machine (downloading and installing are not the same thing):

- Node.js: [https://nodejs.org/](https://nodejs.org/)
- git: [https://git-scm.com/download](https://git-scm.com/download)

Create a folder on your hard drive (name it whatever you like), then open that folder. Click in the address bar of the folder and type `cmd` and hit enter to open a command window. Copy paste the following command into the command window and press enter: `git clone https://github.com/NSCF/SvelteSpecifyLabels.git`. This will download the label tool onto your machine.

When it's done, type `cd sveltespecifylabels` in the command window and enter, then `npm install` and enter, then `npm run dev` and enter. The command window will show you a URL that you need to copy and paste into your web browser, and press enter.

You only need to do the clone and install once. Then each time you want to make labels, just open the command window in the SvelteSpecifyLabels folder, and run `npm run dev`. Make sure to check the GitHub repo from time to time for updates. If there are updates since you last used the tool, run `git pull` to get the latest updates before `npm run dev`.

## Usage
Drag and drop a CSV file with your specimen data onto the grey block on the screen and then use the various options to customize your labels as you would like. When you press print, remember to set the page size and margins in the print window as required (try not to waste label paper).

Your settings will be saved on the machine for future use (but you will have to set everything again if you make labels on a different computer).

***Rest assured that none of your data is saved anywhere or sent over the internet. You (or someone who knows Javascript) are welcome to check the code in this repo to confirm this.***

### Field headings
The input CSV file must have reasonable field headings in order for the fields to be added to the label. The headings in the file are mapped to Darwin Core fields and some additional specimen/accession specific fields. 

There is an example CSV file in the folder, called example.csv.

_Please note that at this point date ranges with startDate and endDate are not yet implemented. Hopefully they will be soon!_

To see all the fields that are used go to src/lib/fieldMappings.js. This shows you the fields that are included on the labels, and their alternative names (aliases) that they can have in the input file. If you want to map a field in your file to one of the label fields, open the fieldMappings file on your computer in a text editor (e.g. Notepad or Notepad++) and add your field name to the list for that field. For example:

```catalogNumber: ['1.collectionobject.catalogNumber', 'Catalog Number', 'CatNum', 'catnum', 'catalognumber', 'My Catalog Number Field'], ```

Note that field names in the list must be in quotes and are separated from each other by a comma. 

It's best to make these changes while the app is running. Once you've made the changes save the fieldMappings file. If there are no problems then your command window will show a little message about a bundle and 'say waiting for changes'. If there is a problem there will be a whole lot of stuff about syntax errors, parsers, etc. Don't worry about that, you just need to make sure you have the commas and quotes correct in the mappings file. Try again and save until it works.

If you have a field in your dataset that appears on your labels but you don't want it to, simply rename the field in the file so that the field mappings won't recognize it.

## Feedback

If you encounter errors or have suggestions, please make use of the Issues feature in Github: [https://github.com/NSCF/SvelteSpecifyLabels/issues](https://github.com/NSCF/SvelteSpecifyLabels/issues)



