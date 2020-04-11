export function dedupeArrayOfObjects(array, field) {
  return array.filter((expense, index, self) => {
    const firstIndex = self.findIndex(
      element => expense[field] === element[field]
    );
    return index === firstIndex;
  });
}

export function groupBy(array, field) {
  return array.reduce((accum, each) => {
    if (!accum[each[field]]) {
      accum[each[field]] = [];
    }

    accum[each[field]].push(each);

    return accum;
  }, {});
}

export function mostCommonKey(keyToCount) {
  let topKey;

  Object.keys(keyToCount).forEach(key => {
    if (topKey === undefined) {
      topKey = key;
    } else if (keyToCount[key].length > keyToCount[topKey].length) {
      topKey = key;
    }
  });

  return topKey;
}
