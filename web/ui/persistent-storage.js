function hasStorage() {
  return typeof(Storage) !== "undefined";
}

const storageVersion = 'v1';
function makeKey(k) {
  return `${storageVersion}.${k}`;
}

export default
class PersistenStorage {

  static
  save(key, data){
    localStorage.setItem(makeKey(key), JSON.stringify(data));
  }

  static
  load(key){
    try {
      const data = JSON.parse(localStorage.getItem(makeKey(key)))
      return data;
    } catch(e){
      console.log('Failed to load from storage', e);
    }
    return null;
  }
}
