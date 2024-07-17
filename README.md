# Specimen labels using Svelte

A [Svelte](https://svelte.dev/) app for generating specimen labels with a range of options (Svelte is a front end framework for building web apps, it has nothing to do with labels!). 

This tool was originally built as a proof of concept for generating labels from Specify database extracts, because it's just easier. However, it can generate labels from any input CSV file with sensible field headings. 

This project will hopefully find it's way to being a full fledged web app available online somewhere, but in the meantime we need to run it locally.

The label design is opinionated (what the programmer thinks is best) and hence is not customizable. 

## Installation

You will need to have the following software downloaded AND installed on your machine (downloading and installing are not the same thing):

- Node.js: [https://nodejs.org/](https://nodejs.org/)
- git: [https://git-scm.com/download](https://git-scm.com/download)

Create a folder on your hard drive (name it whatever you like), then open that folder. Click in the address bar of the folder and type `cmd` and hit enter to open a command window. Copy paste the following command into the command window and press enter: `git clone https://github.com/NSCF/SvelteSpecifyLabels.git`. This will download the label tool onto your machine.

When it's done, type `cd sveltespecifylabels` in the command window and enter, then `npm install` and enter, then `npm run dev` and enter. The command window will show you a URL that you need to copy and paste into your web browser, and press enter.

You only need to do the clone and install once. Then each time you want to make labels, just open the command window in the SvelteSpecifyLabels folder, and run `npm run dev`. Make sure to check the GitHub repo from time to time for updates. If there are updates since you last used the tool, run `git pull` and `npm install` to before running `npm run dev`.

## Usage
Drag and drop a CSV file with your specimen data onto the grey block on the screen and then use the various options to customize your labels as you would like. Your settings will be saved on the machine for future use (but you will have to set everything again if you make labels on a different computer). When you press print, remember to set the page size and margins in the print window as required (try not to waste label paper).


***Rest assured that none of your data is saved anywhere or sent over the internet. You (or someone who knows Javascript) are welcome to check the code in this repo to confirm this.***

### Field headings/mappings
The input CSV file must have reasonable field headings in order for the fields to be added to the label. The headings in the file are mapped to Darwin Core fields and some additional specimen/accession specific fields. 

There is a link on the home page to an example CSV file, which includes comments in the field headings with more information. 

Your field headings don't have to match these headings perfectly. You can use the field mappings section to map your dataset fields to the label fields. These mappings will also be saved.

To see all the fields that are used you can go to the src/lib/ folder and fieldMappings.js in a text editor. This shows you the fields that are included on the labels and their alternative names (aliases) that they can have in the input file. 

## Feedback

If you encounter errors or have suggestions, please make use of the Issues feature in Github: [https://github.com/NSCF/SvelteSpecifyLabels/issues](https://github.com/NSCF/SvelteSpecifyLabels/issues)



