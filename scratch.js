import chardet from 'chardet';
import path from 'path'

const fileDir = String.raw`C:\Users\Ian Engelbrecht\Downloads`
const fileName = 'LabelsTest.csv'

const encoding = chardet.detectFileSync(path.resolve(path.join(fileDir, fileName)));
console.log('encoding is', encoding)