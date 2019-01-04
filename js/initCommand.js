$(document).ready(function() {
  afficher(matrix);
  $('.fusion').hide();
});

$('.columns').on('click','.add-column', function() {
  if (matrix[0].columns.length > 12) {
    UIkit.notification.closeAll();
    UIkit.notification({
      message: 'Limite de colonnes atteinte.',
      pos: 'bottom-right',
      timeout: 3500
    });
  }
  else {
    cancelMatrix = JSON.parse(JSON.stringify(matrix));
    var position = $(this).parent().data('position');
    addColumn(position);
    afficher(matrix);
    selectedSection = [];
    UIkit.notification.closeAll();
    UIkit.notification({
      message: 'Colonne ajoutée. <a onclick="cancel()">Annuler</a>',
      pos: 'bottom-right',
      timeout: 3500
    });
  }
});

$('.columns').on('click','.remove-column', function() {
  if (matrix[0].columns.length <= 1) {
    UIkit.notification.closeAll();
    UIkit.notification({
      message: 'Une colonne nécessaire.',
      pos: 'bottom-right',
      timeout: 3500
    });
  }
  else {
    cancelMatrix = JSON.parse(JSON.stringify(matrix));
    var position = $(this).parent().data('position');
    removeColumn(position);
    updateSections(matrix);
    afficher(matrix);
    selectedSection = [];
    UIkit.notification.closeAll();
    UIkit.notification({
      message: 'Colonne supprimée. <a onclick="cancel()">Annuler</a>',
      pos: 'bottom-right',
      timeout: 3500
    });
  }
});

$('.rows').on('click','.add-row', function() {
  if (matrix.length > 8) {
    UIkit.notification.closeAll();
    UIkit.notification({
      message: 'Limite de lignes atteinte.',
      pos: 'bottom-right',
      timeout: 3500
    });
  }
  else {
    cancelMatrix = JSON.parse(JSON.stringify(matrix));
    var position = $(this).parent().data('position');
    addRow(position);
    afficher(matrix);
    selectedSection = [];
    UIkit.notification.closeAll();
    UIkit.notification({
      message: 'Ligne ajoutée. <a onclick="cancel()">Annuler</a>',
      pos: 'bottom-right',
      timeout: 3500
    });
  }
});

$('.rows').on('click','.remove-row', function() {
  if (matrix.length < 3) {
    UIkit.notification.closeAll();
    UIkit.notification({
      message: 'Une ligne nécessaire.',
      pos: 'bottom-right',
      timeout: 3500
    });
  }
  else {
    cancelMatrix = JSON.parse(JSON.stringify(matrix));
    var position = $(this).parent().data('position');
    removeRow(position);
    updateSections(matrix);
    afficher(matrix);
    selectedSection = [];
    UIkit.notification.closeAll();
    UIkit.notification({
      message: 'Ligne supprimée. <a onclick="cancel()">Annuler</a>',
      pos: 'bottom-right',
      timeout: 3500
    });
  }
});

$('.work-space').on('keyup','input', function() {
  var position = $(this).parent().data('position');
  var size = $(this).val();
  var type = $(this).parent().parent().attr('class');
  if (type == 'columns') {
    updateSizeColumn(position,size);
  }
  else {
    updateSizeRow(position,size);
  }
});


$('.gridbuilder').on('click','div', function(e) {
  if (e.target.tagName == "svg") {
    //DIVISON
    if ($(e.target.parentNode).hasClass('split')) {
      var id = $(e.target.parentNode.parentNode.parentNode.parentNode).data('id');
      cancelMatrix = JSON.parse(JSON.stringify(matrix));
      split(id);
      updateSections(matrix);
      afficher(matrix);
      selectedSection = [];
      UIkit.notification.closeAll();
      UIkit.notification({
        message: 'Séparation réussie. <a onclick="cancel()">Annuler</a>',
        pos: 'bottom-right',
        timeout: 3500
      });
    }
    //FUSION
    else if ($(e.target.parentNode).hasClass('fusion')) {
      cancelMatrix = JSON.parse(JSON.stringify(matrix));
      fusion();
      updateSections(matrix);
      afficher(matrix);
      selectedSection = [];
      UIkit.notification.closeAll();
      UIkit.notification({
        message: 'Fusion réussie. <a onclick="cancel()">Annuler</a>',
        pos: 'bottom-right',
        timeout: 3500
      });
    }
    else {
      UIkit.notification({
        message: 'Il semble y avoir eu un petit soucis',
        pos: 'bottom-right',
        timeout: 3500
      });
    }
  }
  //SELECTION
  else {
    var id = $(this).data('id');
    if ($(this).attr('data-state')) {
      $(this).removeAttr('data-state');
      updateSelected(id,false)
    }
    else {
      $(this).attr('data-state','selected');
      updateSelected(id,true)
    }
    if (isFusionable()) {
      $('.fusion').show();
    }
    else {
      $('.fusion').hide();
    }
  }

});
