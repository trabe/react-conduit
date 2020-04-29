/* global Reflect */
export const values = obj => Object.values(obj);

export const assoc = (k, v, obj) => ({ ...obj, [k]: v });

export const dissoc = (k, obj) => {
  const ret = { ...obj };
  Reflect.deleteProperty(ret, k);
  return ret;
};
