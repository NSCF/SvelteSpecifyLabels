export const fieldsMappings = { 
  //this uses DwC, mostly...
  catalogNumber: ['1.collectionobject.catalogNumber', 'Catalog Number', 'CatNum', 'catnum', 'catalognumber'], 
  collectorNumber:['1.collectionobject.fieldNumber', 'recordNumber', 'Field Number', 'collNum', 'collNo', 'collectorNo', 'collectornumber'],
  geography: ['1,10,2.locality.text2', 'Orig. Prov'],
  country: ['1,10,2,3.geography.Country', 'Country','country'],
  stateProvince: ['1,10,2,3.geography.State', 'Province', 'province','state', 'State', 'admin1', 'stateprovince'],
  admin1Type: ['stateProvinceType'], //specific for Arthrobase extracts
  county: ['district', 'municipality', 'County', 'District', 'Municipality', 'admin2', 'county'],
  admin2Type: [], //specific for Arthrobase extracts
  locality: ['1,10,2.locality.localityName', 'Locality Name'],
  fullLocality: [],//empty because searches on the key name only
  fullCoordsString: [], //ditto
  verbatimCoordinates: ['1,10,2.locality.relationToNamedPlace', 'Orig. Coord', 'verbatimCoords', 'original coords', 'verbatimcoordinates'], //odd mapping here due to field usage in Specify
  verbatimLatitude: ['1,10,2.locality.lat1text', 'Lat1text', 'verbatimLat', 'verbatimlatitude'],
  verbatimLongitude: ['1,10,2.locality.long1text', 'Long1text', 'verbatimLong', 'verbatimlongitude'],
  decimalLatitude: ['Latitude1', '1,10,2.locality.latitude1', 'ddLat', 'ddlat', 'decimalLat', 'decimallatitude'],
  decimalLongitude:['Longitude1', '1,10,2.locality.longitude1', 'ddLong', 'ddLon', 'decimalLong', 'decimalLon', 'decimallongitude'],
  maxUncertainty: ['1,10,2,123-geocoorddetails.geocoorddetail.maxUncertaintyEst', 'Max Uncertainty Est', 'uncertainty'],
  maxUncertaintyUnit:['1,10,2,123-geocoorddetails.geocoorddetail.maxUncertaintyEstUnit', 'Max Uncertainty Est Unit', 'uncertaintyUnit', 'uncertaintyunit'],
  coordsSource: ['1,10,2.locality.latLongMethod', 'Lat/Long Method', 'georeferenceSources', 'georefSource', 'georefSources', 'coordsMethod', 'coordsSource'], //because its should not be a georeference!!
  verbatimSRS: ['Datum', '1,10,2.locality.datum', 'geodeticDatum', 'datum'],
  labelElevation: [],
  verbatimElevation: ['1,10,2.locality.verbatimElevation', 'elevation', 'altitude', 'Verbatim Elev.'],
  minElevationMeters:['Min Elevation in meters', '1,10,2.locality.minElevation', 'minElev'],
  maxElevationMeters:['Max Elevation in meters', '1,10,2.locality.maxElevation', 'maxElev'],
  habitat: [],
  collectionDate: ['verbatimEventDate','dateCollected', 'eventDate', 'collectingDate', 'date'],
  collectionStartDate: ['Start Date', '1,10.collectingevent.startDate', 'startdate'],
  collectionEndDate: ['End Date', '1,10.collectingevent.endDate', 'enddate'],
  collectionStartTime: ['Start Time', 'start time', 'starttime'],
  collectionEndTime: ['End Time', 'end time', 'endtime'],
  permitNumber: ['permit', 'permitcode', 'permitCode', 'permitnumber'],
  recordedBy: ['Collectors [Aggregated]', '1,10,30-collectors.collectingevent.collectors', 'collector', 'collectors'],
  samplingProtocol: ['collectionMethod', '1,10.collectingevent.method', 'Collecting Information/Method', 'collectMethods', 'collectmethod'],
  eventConditions: ['conditions'],
  eventRemarks:[], //TODO add the relevant Specify fields
  specimenStageSex: ['1,63-preparations.preparation.text4', 'Stage Sex Count', 'lifeStageSexCounts'],
  sex:['Sex', '1,63-preparations.preparation.text1'],
  lifeStage: ['stage', 'Stage', 'lifestage', '1,63-preparations.preparation.text2'],
  specimenCount:['1,63-preparations.preparation.countAmt', 'Count', 'count', 'countAmt'],
  seriesSampleCounts:[], //just for Arthrobase
  occurrenceRemarks: ['Remarks', 'Collection Object Remarks', '1.collectionobject.remarks', 'Collection Object/Remarks', 'seriesNote', 'notes'],

  //det stuff
  labelDetName: ['verbatimIdentification', 'verbatimdet'], //can be used for verbatimIdentification, if we have that
  acceptedName: ['1,9-determinations,4-preferredtaxon.taxon.fullName','Preferred Taxon/Full Name', 'acceptedName', 'acceptedNameUsage'],
  canonicalName: ['1,9-determinations,4.taxon.fullName', 'Full Name', 'Taxon/Full Name'], 
  scientificName: [],
  scientificNameAuthorship: ['1,9-determinations,4.taxon.author', 'Author', 'author', 'authority', 'taxonAuthority', 'nameAuthority'],
  identificationQualifier:['Qualifier', '1,9-determinations.determination.qualifier', 'qualifier'],
  identificationConfidence:['1,9-determinations.determination.confidence', 'Confidence'],
  identificationMethod:['1,9-determinations.determination.method', 'Determinations/Method', 'detMethod'],
  identificationReferences: ['detReferences'],
  identifiedBy:['detBy'],
  detByLast: ['Last Name', '1,9-determinations,5-determiner.agent.lastName'],
  detByFirst: ['First Name', '1,9-determinations,5-determiner.agent.firstName'],
  detByMiddleInitial: ['Middle Initial', '1,9-determinations,5-determiner.agent.middleInitial'],
  dateIdentified: ['Determined Date', '1,9-determinations.determination.determinedDate'],
  identificationRemarks: ['1,9-determinations.determination.remarks', 'Determinations/Remarks', 'Determinations Remarks', 'detRemarks', 'detNotes', 'detNote'],

  //type data
  typeStatus: ['Type Status', '1,9-determinations.determination.typeStatusName', 'typestatus'], 
  typeNumber: ['Type Number', '1,9-determinations.determination.text1', 'typenumber'],

  //storage
  storageBox: ['Box', '1,63-preparations,58.storage.Box', 'storage', 'storageLocation', 'storagelocation']
}