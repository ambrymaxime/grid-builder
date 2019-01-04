function arraysEqual(a1,a2) {
    return JSON.stringify(a1)==JSON.stringify(a2);
}

function isArrayValuesAreConsecutives(arr) {
  return arr.sort(function(a,b){return a-b;}).reduce(function(prev, cur, index, array){
          return prev + Math.max(0, cur - array[Math.abs(index-1)] - 1);
      }, 0);
}
function isArrayValuesAreAllEquals(arr) {
  var L= arr.length-1;
  while(L){
      if(arr[L--]!==arr[L]) return false;
  }
  return true;
}

function compareNumbers(a, b) {
  return a - b;
}

function getOccurencesOfOneSection(arr,id) {
  var counts = {};

  for (var i = 0; i < arr.length; i++) {
    var num = arr[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  return counts[id];
}

function getOccurences(arr) {
  var counts = {};

  for (var i = 0; i < arr.length; i++) {
    var num = arr[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  return counts;
}

function getUniquesColumns(array) {
  var allUniquesColumns = [];
  $.each(array, function(i, el){
    if($.inArray(el, allUniquesColumns) === -1) allUniquesColumns.push(el);
  });
  return allUniquesColumns;
}

function getAllColumns(matrix) {
  var allColumns = [];

  for (var i = 1; i < matrix.length; i++) {
    var currentColumns = matrix[i].row_columns;
    var currentColumnsString = '"';
    for (var j = 0; j < currentColumns.length; j++) {
      allColumns.push(currentColumns[j].row_columns_id);
    }
  }

  return allColumns;
}

function getAllUniquesColumns(matrix) {
  var allColumns = [];

  for (var i = 1; i < matrix.length; i++) {
    var currentColumns = matrix[i].row_columns;
    var currentColumnsString = '"';
    for (var j = 0; j < currentColumns.length; j++) {
      allColumns.push(currentColumns[j].row_columns_id);
    }
  }

  var res = getUniquesColumns(allColumns).sort(compareNumbers);
  return res;
}

function renameKeys(obj, newKeys) {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}
