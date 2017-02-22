import SmoothAnimaiton from './smoothAnimation';
const noop = (e = {}) => 0
export default (array = [], Index = {},{onNew = noop,onDel = noop,onUpdate = noop} = {}) => {
  const result = [];
  const tmpIndex = {};
  let index = 0;
  for (const e of array) {
    const i = index ++;
    const id = e.id || (i + 1);
    if(!id){
      throw new Error({err : "EMPTY ID", array})
    }
    if (!Index[id]) {
      Index[id] = new SmoothAnimaiton(e);
      onNew(Index[id])
    } else {
      Index[id].update(e);
      onUpdate(Index[id])
    }
    tmpIndex[id] = true;
    result.push(Index[id]);
  }
  for (const i in Index) {
    if (!tmpIndex[i]) {
      Index[i] && onDel(Index[i])
      Index[i] = undefined;
    }
  }

  return result;
};
