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
    var initPlayer = $('<li>')
      .addClass('list-group-item');
    var initBadge = $('<span>')
      .addClass('badge')
      //.addClass('badge-secondary')
      .addClass('mr-1')
      .append(pcList[i].init);
    if (pcList[i].init == 0) initBadge.addClass('badge-secondary');
    else if (pcList[i].init <= 5) initBadge.addClass('badge-danger');
    else if (pcList[i].init <= 10) initBadge.addClass('badge-warning');
    else if (pcList[i].init <= 15) initBadge.addClass('badge-info');
    else if (pcList[i].init <= 20) initBadge.addClass('badge-primary');
    else if (pcList[i].init > 20) initBadge.addClass('badge-success');
    // var initButton = $('<a>')
    //   //.attr('type', 'button')
    //   .attr('href', '#')
    //   .addClass('initEdit')
    //   .attr('id', pcList[i].name)
    //   //.addClass('btn')
    //   //.addClass('btn-sm')
    //   //.addClass('btn-primary')
    //   .addClass('ml-4')
    //   .attr('data-toggle', 'popover')
    //   .attr('data-trigger', 'click')
    //   .attr('data-html', 'true')
    //   //.attr('title', 'Set Initiative')
    //   .attr('data-content', '<div class="input-group input-group-sm mb-3"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-sm">Set Initiative</span>  </div>  <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"></div>')
    //   .append('<i class="fas fa-info"></i>');

    var btnGroup = $('<div>')
      .addClass('btn-group')
      .addClass('ml-4');
    var initButton = $('<button>').attr('type', 'button')
      .addClass('btn').addClass('btn-primary')
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
    initPlayer.append(initBadge);
    initPlayer.append(pcList[i].name);
    initPlayer.append(btnGroup);
    initPlayer.appendTo('#init-list');
  }
}

$('#addPC').keypress(function(event) {
  if (event.which == 13) {
    if ($('#addPC'))
    {
      //console.log("Adding PC: " + $('#addPC').val());
      addPC($('#addPC').val());
      $('#adPC').val('');
      updateInitList();
      $('[data-toggle="popover"]').popover();
    }
  }
});
