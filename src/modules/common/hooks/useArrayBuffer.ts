/* eslint-disable @typescript-eslint/no-explicit-any */
function useArrayBuffer() {
  function arrayBufferToString(buffer: ArrayBuffer) {
    let str = "";
    const array = new Uint8Array(buffer);
    for (let i = 0; i < array.length; i++) {
      str += String.fromCharCode(array[i]);
    }
    return str;
  }

  function stringToArrayBuffer(str: string): ArrayBuffer {
    const buffer = new ArrayBuffer(str.length);
    const array = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i++) {
      array[i] = str.charCodeAt(i);
    }
    return buffer;
  }

  return {
    arrayBufferToString,
    stringToArrayBuffer,
  };
}

export default useArrayBuffer;
