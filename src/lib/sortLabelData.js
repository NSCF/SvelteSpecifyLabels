function sortOnLabelFields(a,b) {

  if (a.catalogNumber && !b.catalogNumber){
    return -1
  }

  if (!a.catalogNumber && b.catalogNumber) {
    return 1
  }

  if (a.catalogNumber && b.catalogNumber ) {
    if (a.catalogNumber < b.catalogNumber) {
      return -1;
    }
    if ( a.catalogNumber > b.catalogNumber ){
      return 1;
    }
  }

  if (a.recordNumber && b.recordNumber) {
    if (a.recordNumber < b.recordNumber){
      return -1;
    }
    if ( a.recordNumber > b.recordNumber ){
      return 1;
    }
  }

  return 0

}

export default function sortLabelData(labelData, ) {
  if (labelData && Array.isArray(labelData) && labelData.length) {

    //sort first on storage location, then catalog number, then collector number
    labelData.sort((a, b) => {
      if (sortOnStorage) {
        if (a.storageBox < b.storageBox){
          return -1;
        }
        if ( a.storageBox > b.storageBox ){
          return 1;
        }
        if ( a.storageBox == b.storageBox ){
          return sortOnLabelFields(a, b)
        }
        return 0;
      }
      else {
        return sortOnLabelFields(a, b)
      }
    })

  }
}

export function sortOnAll(labelData, sortOnStorage, sortOnCollectors) {
  if (labelData && Array.isArray(labelData) && labelData.length) {

    labelData.sort((a, b) => {
      
      if (sortOnStorage) {
        if (!a.storageBox) return 1
        if (!b.storageBox) return -1
        if (a.storageBox < b.storageBox) return -1
        if ( a.storageBox > b.storageBox ) return 1
      }

      if (!a.catalogNumber) return 1
      if (!b.catalogNumber) return -1
      if (a.catalogNumber < b.catalogNumber) return -1
      if (a.catalogNumber > b.catalogNumber) return 1

      if (sortOnCollectors) {
        if (!a.recordedBy) return 1
        if (!b.recordedBy) return -1
        if (a.recordedBy < b.recordedBy) return -1
        if (a.recordedBy > b.recordedBy) return 1
      }

      if (!a.recordNumber) return 1
      if (!b.recordNumber) return -1
      if (a.recordNumber < b.recordNumber) return -1
      if (a.recordNumber > b.recordNumber) return 1

      return 0

    })
  }
}