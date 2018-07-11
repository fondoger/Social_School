import { AsyncStorage } from 'react-native';



function init() {
  return AsyncStorage.getAllKeys()
  .then(keys => AsyncStorage.multiGet(keys))
  .then(response => {
    for (i in response) {
      Storage[response[i][0]] = JSON.parse(response[i][1]);
    }
  });
}

function setItem(k, v) {
  Storage[k] = v;
  return AsyncStorage.setItem(k, JSON.stringify(v));
}

function multiSet(items) {
  for (i in items) {
    Storage[items[i][0]] = items[i][1];
    items[i][1] = JSON.stringify(items[i][1]);
  }
  return AsyncStorage.multiSet(items);
}

function multiRemove(keys) {
  for (i in keys) {
    Storage[keys[i]] = null;
  }
  return AsyncStorage.multiRemove(keys);
}

const Storage = {
  init,
  setItem,
  multiSet,
  multiRemove,
};

export default Storage;