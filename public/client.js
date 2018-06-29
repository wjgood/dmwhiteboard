var socket = io(); //we'll use this later

var initList = [];
var pcList = [];

function addPC(name) {
  var newPc = {
    name: name,
    init: 0
  };
  //console.log("Adding PC: ");
  //console.log(newPc);
  pcList.push(newPc);
}

function findPCindex(name) {
  return pcList.findIndex(obj => obj.name == name);
}

function editPCinit(name, init) {
  pcList[findPCindex(name)].init = init;
  updateInitList()
}

function deletePC(name) {
  pcList.splice(findPCindex(name),1);
}

function returnPCs() {
  return pcList;
}

function initCompare(pcA, pcB) {
  return (pcB.init - pcA.init);
}

function updateInitList() {
  //console.log("PC List: ");
  //console.log(pcList);
  pcList.sort(initCompare);
  //console.log("PC List: ");
  //console.log(pcList);
  $('#init-list').empty();
  for (var i = 0; i < pcList.length; i++)
  {
    //console.log("PC: ");
    //console.log(pcList[i]);
    var initPlayer = $('<div>')
      .addClass('row')
      .addClass('border-bottom')
      .addClass('py-1');
    var initCol = $('<div>')
      .addClass('col-1')
      .addClass('no-border')
      .appendTo(initPlayer);
    var nameCol = $('<div>')
      .addClass('col')
      .addClass('no-border')
      .append(pcList[i].name)
      .appendTo(initPlayer);
    var controlCol = $('<div>')
      .addClass('col-4')
      .addClass('no-border')
      .appendTo(initPlayer);

    var initBadge = $('<span>')
      .addClass('badge')
      .append(pcList[i].init)
      .appendTo(initCol);
    if (pcList[i].init == 0) initBadge.addClass('badge-secondary');
    else if (pcList[i].init <= 5) initBadge.addClass('badge-danger');
    else if (pcList[i].init <= 10) initBadge.addClass('badge-warning');
    else if (pcList[i].init <= 15) initBadge.addClass('badge-info');
    else if (pcList[i].init <= 20) initBadge.addClass('badge-primary');
    else if (pcList[i].init > 20) initBadge.addClass('badge-success');

    var btnGroup = $('<div>')
      .addClass('btn-group')
      .appendTo(controlCol);
    var initButton = $('<button>')
      .attr('type', 'button')
      .addClass('btn')
      .addClass('btn-primary')
      .addClass('dropdown-toggle')
      .attr('data-toggle', 'dropdown')
      .append('<i class="fas fa-info"></i>')
      .appendTo(btnGroup);
    var initMenu = $('<div>')
      .addClass('dropdown-menu')
      .addClass('scrollable-menu')
      .appendTo(btnGroup);
    for (var ii = 30; ii > 0; ii--)
    {
      var num = $('<button>')
        .addClass('btn')
        .addClass('dropdown-item')
        .attr('onclick','editPCinit("'+pcList[i].name+'", '+ii+')')
        .append(ii)
        .appendTo(initMenu);
    }

    initPlayer.appendTo('#init-list');
  }
}

$('#addPC').keypress(function(event) {
  if (event.which == 13) {
    if ($('#addPC'))
    {
      //console.log("Adding PC: " + $('#addPC').val());
      addPC($('#addPC').val());
      $('#addPC').val('');
      updateInitList();
      $('[data-toggle="popover"]').popover();
    }
  }
});
