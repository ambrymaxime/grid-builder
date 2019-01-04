// GLOBAL
var selectedSection = [];
var cancelMatrix = {};
var matrix = [
  {
    "columns" : [
      { "col_height": 1, "col_height_type": "fr" },
      { "col_height": 25, "col_height_type": "%" },
      { "col_height": 1, "col_height_type": "fr" },
      { "col_height": 1, "col_height_type": "fr" },
    ],
  },
  {
    "row_height" : 1,
    "row_height_type" : "fr",
    "row_columns" : [
      { "row_columns_id": 3 },
      { "row_columns_id": 2 },
      { "row_columns_id": 1 },
      { "row_columns_id": 6 },
    ],
  },
  {
    "row_height" : 1,
    "row_height_type" : "fr",
    "row_columns" : [
      { "row_columns_id": 4 },
      { "row_columns_id": 2 },
      { "row_columns_id": 5 },
      { "row_columns_id": 6 },
    ],
  },
  {
    "row_height" : 1,
    "row_height_type" : "fr",
    "row_columns" : [
      { "row_columns_id": 7 },
      { "row_columns_id": 7 },
      { "row_columns_id": 7 },
      { "row_columns_id": 6 },
    ],
  },
  {
    "row_height" : 1,
    "row_height_type" : "fr",
    "row_columns" : [
      { "row_columns_id": 8 },
      { "row_columns_id": 8 },
      { "row_columns_id": 8 },
      { "row_columns_id": 8 },
    ],
  },
];

// FUNCTIONS

function cancel() {
  selectedSection = [];
  matrix = cancelMatrix;
  afficher(matrix);
}

function fusionColumns(pos, newIdSection) {

  //Récupération des éléments suivant et du précédent pour comparaison
  for (var i = 1; i < matrix.length; i++) {
    var currentRowColumns = matrix[i].row_columns;
    var sectionsAfterPosInCurrentCol = [];
    //Si on est en première colonne, alors il y a pas de précédents
    if (pos == 0) {
      var previousIdToCheckForEquality = currentRowColumns[pos].row_columns_id;
    }
    else {
      var previousIdToCheckForEquality = currentRowColumns[pos].row_columns_id;
    }

    //Puis on récupères les sections a comparer
    for (var j = pos + 1; j < currentRowColumns.length; j++) {
      sectionsAfterPosInCurrentCol.push(currentRowColumns[j].row_columns_id);
    }
    sectionsAfterPosInCurrentCol.shift();

    //Comparaison - on vérifie et on réécrit les valeurs
    if (sectionsAfterPosInCurrentCol[0] == previousIdToCheckForEquality) {
      newIdSection = newIdSection + 1;
      for (var k = 0; k < sectionsAfterPosInCurrentCol.length; k++) {
        if (sectionsAfterPosInCurrentCol[k] == previousIdToCheckForEquality) {
          sectionsAfterPosInCurrentCol[k] = newIdSection;
        }
      }
    }

    for (var l = 0; l < sectionsAfterPosInCurrentCol.length; l++) {
      currentRowColumns[pos+l+2].row_columns_id = sectionsAfterPosInCurrentCol[l];
    }
  }
}

function updateSections(matrix) {

  var oldIds = getAllColumns(matrix);
  var newIds = [];
  var idMaxFound = Math.max.apply(Math, oldIds);
  var idsNotFound = [];

  //Valeurs des ids non trouvés
  for (var i = 1; i < idMaxFound+1; i++) {
    var isFound = oldIds.indexOf(i);
    if (isFound == -1) {
      idsNotFound.push(i);
    }
  }

  //On créé un tableau avec les nouveaux ids de toutes les sections
  for (var z = 0; z < idsNotFound.length; z++) {
    for (var j = 0; j < oldIds.length; j++) {
      if (z == idsNotFound.length - 1) {
        if (idsNotFound[z] < oldIds[j] && oldIds[j] <= idMaxFound) {
          oldIds[j] = oldIds[j] - (z+1);
        }
      }
      else {
        if (idsNotFound[z] < oldIds[j] && oldIds[j] <= idsNotFound[z+1]) {
          oldIds[j] = oldIds[j] - (z+1);
        }
      }
    }
  }

  newIds = oldIds;
  var pulser = 0;
  //On mets a jour les sections dans la matrix
  for (var i = 1; i < matrix.length; i++) {
    var currentColumns = matrix[i].row_columns;
    if (i > 1) {
      pulser = pulser + currentColumns.length - 1;
    }
    for (var j = 0; j < currentColumns.length; j++) {
      currentColumns[j].row_columns_id = newIds[i+j+pulser-1];
    }
  }

}

function afficher(matrix) {
  var gridAreas = "";
  var gridRows = "";
  var gridColumns = "";

  var allColumns = [];

  for (var h = 0; h < matrix[0].columns.length; h++) {
    //CSS: Tailles des cols
    var currentColumnHeight = matrix[0].columns[h].col_height;
    var currentColumnHeightType = matrix[0].columns[h].col_height_type;
    gridColumns = gridColumns+" "+currentColumnHeight+currentColumnHeightType;
  }

  for (var i = 1; i < matrix.length; i++) {
    //CSS : Tailles des rows
    var currentRowHeight = matrix[i].row_height;
    var currentRowHeightType = matrix[i].row_height_type;
    gridRows = gridRows+" "+currentRowHeight+currentRowHeightType;

    //CSS : Création de la grille en remplissant les rows par les colonnes puis concaténation avec la variable globales
    var currentColumns = matrix[i].row_columns;
    var currentColumnsString = '"';
    for (var j = 0; j < currentColumns.length; j++) {
      //Ajout de la colonne dans le CSS
      currentColumnsString += " section"+currentColumns[j].row_columns_id;
      //Ajout de l'id de la colonne dans le tableau de toutes les colonnes;
      allColumns.push(currentColumns[j].row_columns_id);
    }
    currentColumnsString += '"';
    currentColumnsString = currentColumnsString.substring(0,1) + currentColumnsString.substring(2, currentColumnsString.length);;
    gridAreas += currentColumnsString;
  }

  //HTML : Ajout des sections dans le container

  //On compte les occurences
  var allSectionsIds = getAllColumns(matrix);
  var occurences = getOccurences(allSectionsIds);

  //Puis on affiche en concéquence
  var sectionsToPrint = getUniquesColumns(allColumns).sort(compareNumbers);
  var container = $('.gridbuilder').html('');
  for (var i = 0; i < sectionsToPrint.length; i++) {
    //S'il y a plusieurs occurences
    var occs = occurences[i+1];
    if (occs != 1) {
      container.append('<div data-id="'+(i+1)+'" class="uk-visible-toggle section'+sectionsToPrint[i]+'">section-'+sectionsToPrint[i]+'<ul class="uk-hidden-hover uk-iconnav"><li><a class="uk-text-danger split" href="#" uk-icon="icon: shrink; ratio: 1.5"></a></li></ul></div>');
    }
    else {
      container.append('<div data-id="'+(i+1)+'" class="section'+sectionsToPrint[i]+'">section-'+sectionsToPrint[i]+'</div>');
    }
  }

  //Mise en place du CSS et HTML
  gridAreas = gridAreas.substring(0,gridAreas.length-1);
  $('.gridbuilder').css('grid-template-rows',gridRows);
  $('.gridbuilder').css('grid-template-columns',gridColumns);
  $('.gridbuilder').css('grid-template-areas',gridAreas);

  afficherControllers(matrix);
}

function afficherControllers(matrix) {
  //COLUMNS
  $('.columns').html('');
  var gridColumns = "";
  for (var h = 0; h < matrix[0].columns.length; h++) {
    var currentColumnHeight = matrix[0].columns[h].col_height;
    var currentColumnHeightType = matrix[0].columns[h].col_height_type;
    gridColumns = gridColumns+" "+currentColumnHeight+currentColumnHeightType;
    $('.columns').append('<div class="section-controllers-column" data-position="'+h+'"><a class="buttons remove-column" uk-icon="icon: minus"></a><input  class="uk-input" type="text" value="'+(currentColumnHeight+currentColumnHeightType)+'"><a class="buttons add-column" uk-icon="icon: plus"></a></div>')
  }
  $('.columns').css('grid-template-columns',gridColumns);

  //ROWS
  $('.rows').html('');
  var gridRows = "";
  for (var i = 1; i < matrix.length; i++) {
    //CSS : Tailles des rows
    var currentRowHeight = matrix[i].row_height;
    var currentRowHeightType = matrix[i].row_height_type;
    gridRows = gridRows+" "+currentRowHeight+currentRowHeightType;
    $('.rows').append('<div class="section-controllers-row" data-position="'+i+'"><a class="buttons remove-row" uk-icon="icon: minus"></a><input  class="uk-input" type="text" value="'+(currentRowHeight+currentRowHeightType)+'"><a class="buttons add-row" uk-icon="icon: plus"></a></div>')
  }
  $('.rows').css('grid-template-rows',gridRows);

}

function addColumn(pos) {
  // Ajout de la colonne : splice(indiceDePosition, 0 = ajout, elementARajouter);
  matrix[0].columns.splice(pos+1, 0, { "col_height": 1, "col_height_type": "fr" });

  //Ajout de la colonne dans les rows
  var newIdSection = getAllUniquesColumns(matrix).length + 1;
  for (var i = 1; i < matrix.length; i++) {
    var currentRowColumns = matrix[i].row_columns;
    currentRowColumns.splice(pos+1, 0, { "row_columns_id": newIdSection });
  }

  //Découpe des sections traversée
  fusionColumns(pos, newIdSection);

}

function removeColumn(pos) {
  // Ajout de la colonne : splice(indiceDePosition, 0 = ajout, elementARajouter);
  matrix[0].columns.splice(pos, 1);

  //Ajout de la colonne dans les rows
  for (var i = 1; i < matrix.length; i++) {
    var currentRowColumns = matrix[i].row_columns;
    currentRowColumns.splice(pos, 1);
  }

}

function addRow(pos) {

  //Ajout de la row dans et ses nouvelles colonnes
  var nbColumns = matrix[0].columns.length;
  var nbRows = matrix.length - 1;
  var lastSectionId = getAllUniquesColumns(matrix).length + 1;
  var row_columns_init = [];

  //Ajout des cols dans la row
  for (var i = 0; i < nbColumns; i++) {
    row_columns_init.push({ "row_columns_id": lastSectionId })
  }

  //Ajout de la row a la matrix
  matrix.splice(pos+1, 0,
    {
      "row_height" : 1,
      "row_height_type" : "fr",
      "row_columns" : row_columns_init,
    },
  );


  //Fusion des éléments après l'ajout de la row

  //On créé les tableaux de rows
  var nbColumns = matrix[0].columns.length;
  var nbRows = matrix.length - 1;

  var allColumns = getAllColumns(matrix);
  var nbSections = allColumns.length;

  var newRows = [];

  for (var i = 0; i < nbColumns; i++) {
    var sectionsInRows = [];
    for (var j = 0; j < nbSections; j = j + nbColumns) {
      sectionsInRows.push(allColumns[i+j]);
    }
    if (sectionsInRows[pos-1] == sectionsInRows[pos+1]) {
      lastSectionId = lastSectionId + 1;
      for (var k = pos + 1; k < sectionsInRows.length; k++) {
        if (sectionsInRows[k] == sectionsInRows[pos-1]) {
          sectionsInRows[k] = lastSectionId;
        }
      }
    }
    newRows.push(sectionsInRows);
  }

  var newColumns = [];
  for (var i = 0; i < nbColumns; i++) {
    for (var k = 0; k < newRows[0].length; k++) {
      newColumns.push(newRows[i][k]);
    }
  }

  newColumns = newColumns.filter(function (el) {
    return el != null;
  });

  //On remet les valeurs dans l'ordre de colonnes
  var nbSectionsNewColumns = newColumns.length;

  var newColumnsOrdered = [];
  for (var j = 0; j < nbRows; j++) {
    for (var i = 0; i < nbSectionsNewColumns; i = i + nbRows) {
      newColumnsOrdered.push(newColumns[i+j]);
    }
  }

  //Puis on met les bonnes valeurs dans la matrix
  for (var i = 1; i < matrix.length; i++) {
    var currentColumns = matrix[i].row_columns;
    for (var j = 0; j < currentColumns.length; j++) {
      // allColumns.push(currentColumns[j].row_columns_id);
      currentColumns[j].row_columns_id = newColumnsOrdered[0];
      newColumnsOrdered.shift();
    }
  }

}

function removeRow(pos) {
  //Suppression de la row de la matrix
  matrix.splice(pos, 1);
}

function updateSizeColumn(pos,size) {
  if (size.match(/\d+/)) {
    var sizeValue = size.match(/\d+/)[0];
  }
  if (size.match(/([a-zA-Z]|\%)+/g)) {
    var sizeType = size.match(/([a-zA-Z]|\%)+/g)[0];
  }
  if (sizeType == "%" || sizeType == "fr" || sizeType == "px") {
    matrix[0].columns.splice(pos, 1, { "col_height": parseInt(sizeValue), "col_height_type": sizeType });
    afficher(matrix);
  }
}

function updateSizeRow(pos,size) {
  if (size.match(/\d+/)) {
    var sizeValue = size.match(/\d+/)[0];
  }
  if (size.match(/([a-zA-Z]|\%)+/g)) {
    var sizeType = size.match(/([a-zA-Z]|\%)+/g)[0];
  }
  var columnsOfCurrentRow = matrix[pos].row_columns;

  if (sizeType == "%" || sizeType == "fr" || sizeType == "px") {
    matrix.splice(pos, 1,
      {
        "row_height" : parseInt(sizeValue),
        "row_height_type" : sizeType,
        "row_columns" : columnsOfCurrentRow,
      },
    );
    afficher(matrix);
  }
}

function split(id) {

  var allSectionsIds = getAllColumns(matrix);
  var allOccurences = getOccurences(allSectionsIds);
  var nbOccurencesOfCurrentId = allOccurences[id];
  var lastId = getAllUniquesColumns(matrix).length;

  //On remplace les occurences par le dernier id créé
  for (var i = 0; i < allSectionsIds.length; i++) {
    if (allSectionsIds[i] == id) {
      lastId = lastId + 1;
      allSectionsIds[i] = lastId;
    }
  }

  //Et on met a jour la matrix
  for (var i = 1; i < matrix.length; i++) {
    var currentColumns = matrix[i].row_columns;
    for (var j = 0; j < currentColumns.length; j++) {
      currentColumns[j].row_columns_id = allSectionsIds[0];
      allSectionsIds.shift();
    }
  }

}

function updateSelected(id,action) {
  //Action : true = add, false = remove
  if (action) {
    var occs = getOccurencesOfOneSection(getAllColumns(matrix),id);
    for (var i = 0; i < occs; i++) {
      selectedSection.push(id);
    }
  }
  else {
    selectedSection = selectedSection.filter(function(e) { return e !== id })
  }
}

function isFusionable() {
  //Récupération des colonnes
  var columns = [];
  var occurencesOfSelected = [];
  var allSectionsIds = getAllColumns(matrix);

  for (var i = 0; i < selectedSection.length; i++) {
    var occurences = getOccurencesOfOneSection(allSectionsIds,selectedSection[i]);
    occurencesOfSelected.push(occurences);
  }

  for (var i = 1; i < matrix.length; i++) {
    var columnsIds = [];
    var currentColumns = matrix[i].row_columns;
    for (var j = 0; j < currentColumns.length; j++) {
      columnsIds.push(currentColumns[j].row_columns_id);
    }
    columns.push(columnsIds);
  }

  //Récupération des coords des colonnes
  var allColumnsWithCoords = [];
  for (var i = 0; i < columns.length; i++) {
    var oneColumnsWithCoords = []
    for (var j = 0; j < columns[i].length; j++) {
      oneColumnsWithCoords.push([i,j]);
    }
    allColumnsWithCoords.push(oneColumnsWithCoords);
  }

  //Récupération des coords des colonnes séléctionnées
  var selectedSectionUniques = getUniquesColumns(selectedSection);
  var selectedColumnsCoord = [];
  for (var m = 0; m < selectedSectionUniques.length; m++) {
    for (var i = 0; i < columns.length; i++) {
      for (var j = 0; j < columns[i].length; j++) {
        if (selectedSectionUniques[m] == columns[i][j]) {
          selectedColumnsCoord.push(allColumnsWithCoords[i][j]);
        }
      }
    }
  }

  for (var i = 0; i < selectedColumnsCoord.length; i++) {
    selectedColumnsCoord[i].reverse();
  }

  //Réorganisation des coords
  selectedColumnsCoord.sort();

  //Comparaison des coords pour savoir si fusion possible
  updateExpandButton();

  //Si plus d'un élément est séléctionné
  if (selectedSectionUniques.length > 1) {

    var isAllSelectedAreInTheSameColumn = true;
    var isAllSelectedAreInTheSameRow = true;
    var isAllSelectedFollowingEachOther = true;

    for (var i = 0; i < selectedColumnsCoord.length; i++) {
      //Est-ce que les selections sont dans la même colonnes ?
      if (isAllSelectedAreInTheSameColumn) {
        //On compare que si l'élément d'après ne dépasse du tableau
        if (i+1 != selectedColumnsCoord.length) {
          if(selectedColumnsCoord[i][0] == selectedColumnsCoord[i+1][0]) {
            isAllSelectedAreInTheSameColumn = true;
          }
          else {
            isAllSelectedAreInTheSameColumn = false;
            break;
          }
        }
      }
    }
    //Si oui, les éléments se suivent-ils ?
    if (isAllSelectedAreInTheSameColumn) {
      for (var i = 0; i < selectedColumnsCoord.length; i++) {
        if (isAllSelectedAreInTheSameColumn) {
          //On compare que si l'élément d'après ne dépasse du tableau
          if (i+1 != selectedColumnsCoord.length) {
            if(selectedColumnsCoord[i][1] == (selectedColumnsCoord[i+1][1] - 1)) {
              isAllSelectedFollowingEachOther = true;
            }
            else {
              isAllSelectedFollowingEachOther = false;
              break;
            }
          }
        }
      }
      //Si les éléments se suivent
      if (isAllSelectedFollowingEachOther) {
        return 1;
      }
      else {
        return 0;
      }
    }
    //Si pas dans la même colonne
    else {
      for (var i = 0; i < selectedColumnsCoord.length; i++) {
        //Est-ce que les selections sont dans la même lignes ?
        if (isAllSelectedAreInTheSameRow) {
          //On compare que si l'élément d'après ne dépasse du tableau
          if (i+1 != selectedColumnsCoord.length) {
            if(selectedColumnsCoord[i][1] == selectedColumnsCoord[i+1][1]) {
              isAllSelectedAreInTheSameRow = true;
            }
            else {
              isAllSelectedAreInTheSameRow = false;
              break;
            }
          }
        }
      }
      //Si oui, les éléments se suivent-ils ?
      if (isAllSelectedAreInTheSameRow) {
        for (var i = 0; i < selectedColumnsCoord.length; i++) {
          if (isAllSelectedAreInTheSameRow) {
            //On compare que si l'élément d'après ne dépasse du tableau
            if (i+1 != selectedColumnsCoord.length) {
              if(selectedColumnsCoord[i][0] == (selectedColumnsCoord[i+1][0] - 1)) {
                isAllSelectedFollowingEachOther = true;
              }
              else {
                isAllSelectedFollowingEachOther = false;
                break;
              }
            }
          }
        }
        //Si les éléments se suivent
        if (isAllSelectedFollowingEachOther) {
          return 1;
        }
        else {
          return 0;
        }
      }
      //Si pas dans la même colonne
      else {

        //Est-ce que les selections sont un rectangle replit ?
        var xColumns = [];
        var yColumns = [];

        //On récupère les coords en x
        for (var i = 0; i < selectedColumnsCoord.length; i++) {
          xColumns.push(selectedColumnsCoord[i][0]);
          yColumns.push(selectedColumnsCoord[i][1]);
        }

        var occurencesOfCoordsX = getOccurences(xColumns);
        var occurencesOfCoordsY = getOccurences(yColumns);
        var occurencesOfCoordsXArray = Object.values(occurencesOfCoordsX);
        var occurencesOfCoordsYArray = Object.values(occurencesOfCoordsY);
        var isRectangleForX = isArrayValuesAreAllEquals(occurencesOfCoordsXArray);
        var isRectangleForY = isArrayValuesAreAllEquals(occurencesOfCoordsYArray);

        var xColumnsGrouped = getUniquesColumns(xColumns);
        var yColumnsGrouped = getUniquesColumns(yColumns);

        var xColumnsGroupedSorted = getUniquesColumns(xColumns).sort();
        var yColumnsGroupedSorted = getUniquesColumns(yColumns).sort();

        //Si c'est un rectangle
        if (isRectangleForX && isRectangleForY) {

          //On vérifie qu'il y ai pas d'espace, de décalages ou de trous

          if(arraysEqual(xColumnsGrouped,xColumnsGroupedSorted) && arraysEqual(yColumnsGrouped,yColumnsGroupedSorted)) {
            var isThereSpaceBetweenSelected = false;

            for (var i = 0; i < xColumnsGrouped.length; i++) {
              var isFound = xColumnsGrouped.indexOf(i+xColumnsGrouped[0]);
              if (isFound == -1) {
                isThereSpaceBetweenSelected = true;
              }
            }
            for (var i = 0; i < yColumnsGrouped.length; i++) {
              var isFound = yColumnsGrouped.indexOf(i+yColumnsGrouped[0]);
              if (isFound == -1) {
                isThereSpaceBetweenSelected = true;
              }
            }
            if (isThereSpaceBetweenSelected) {
              return 0;
            }
            else {
              return 1;
            }
          }
          else {
            return 0;
          }
        }
        else {
          return 0;
        }
      }
    }
  }
  else {
    return 0;
  }
}

function fusion() {
  var newIdSection = getAllUniquesColumns(matrix).length + 1;
  var selectedSectionUniques = getUniquesColumns(selectedSection);
  var allColumns = getAllColumns(matrix);

  //On remplace les éléments séléctionnés par l'id de la nouvelle future section
  for (var i = 0; i < selectedSectionUniques.length; i++) {
    for (var j = 0; j < allColumns.length; j++) {
      if(allColumns[j] == selectedSectionUniques[i]) {
        allColumns[j] = newIdSection;
      }
    }
  }

  //Puis on met les bonnes valeurs dans la matrix
  for (var i = 1; i < matrix.length; i++) {
    var currentColumns = matrix[i].row_columns;
    for (var j = 0; j < currentColumns.length; j++) {
      currentColumns[j].row_columns_id = allColumns[0];
      allColumns.shift();
    }
  }

}

function updateExpandButton() {
  var selectedSectionUniques = getUniquesColumns(selectedSection);
  $(".gridbuilder div ul li a.fusion").each(function() {
    $(this).parent().parent().remove();
  });
  $(".gridbuilder div").each(function() {
    var id = $(this).data('id');
    for (var i = 0; i < selectedSectionUniques.length; i++) {
      if (selectedSectionUniques[i] == id) {
        $(this).append('<ul class="uk-iconnav"><li><a class="uk-text-primary fusion" href="#" uk-icon="icon: expand; ratio: 1.5"></a></li></ul>');
      }
    }
  });

}
