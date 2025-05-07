/* eslint-disable @typescript-eslint/no-explicit-any */
function useSerialize() {
  const transformToUpperCase = (obj: any, include: string[] = []) => {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "string" && include.includes(key)) {
        newObj[key] = obj[key].toUpperCase();
      } else {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  };

  return {
    transformToUpperCase,
  };
}

export default useSerialize;
