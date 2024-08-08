export default function readFileAsUint8Array(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function(event) {
          const arrayBuffer = event.target.result;
          const uint8Array = new Uint8Array(arrayBuffer);
          resolve(uint8Array);
      };

      reader.onerror = function() {
          reject(new Error("An error occurred while reading the file."));
      };

      reader.readAsArrayBuffer(file);
  });
}