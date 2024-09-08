import numberInputSettings from './numberInputSettings.js'

export default {
		showCollectionName: false,
		collectionName: null,
		institutionName: null,
		labelPerSpecimen: false,
		useRomanNumeralMonths: false,
		detLabel: false,
		italicizeNames: false,
		includeBarcode: true,
    includeQRCode: false,
		qrCodeErrorLevel: 'Q',
		qrCodeOnDetLabels: false,
		includeTaxonAuthorities: false,
		excludeNoCatnums: false,
		includeCollectorInSort: false,
		underline: false,
    italics: false,
		labelSize: 'standard',
		font: 'Courier',
		fontSize: "10",
		labelWidth: 9,
		qrCodeDims: numberInputSettings.qrCodeDims.default
}