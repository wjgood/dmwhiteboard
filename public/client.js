var socket = io(); //we'll use this later

var initList = [];
//var pcList = [];
//var npcList = [];

function addPC(name) {
  var newPc = {
    type: "pc",
    name: name,
    init: 0
  };
  //console.log("Adding PC: ");
  //console.log(newPc);
  //pcList.push(newPc);
  initList.push(newPc);
}

function addNPC(name, hp) {
  var newNpc = {
    type: "npc",
    name: name,
    hp: hp,
    init: 0
  };
  initList.push(newNpc);
}

function findPCindex(name) {
  return initList.findIndex(obj => obj.name == name);
}

function editPCinit(name, init) {
  initList[findPCindex(name)].init = init;
  updateInitList()
}

function editNpcHp(name, hp) {
  initList[findPCindex(name)].hp = hp;
  updateInitList()
}

function deletePC(name) {
  initList.splice(findPCindex(name),1);
}


function initCompare(pcA, pcB) {
  return (pcB.init - pcA.init);
}

function updateInitList() {
  //console.log("PC List: ");
  //console.log(pcList);
  initList.sort(initCompare);
  //console.log("PC List: ");
  //console.log(pcList);
  $('#init-list').empty();
  for (var i = 0; i < initList.length; i++)
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
      .append(initList[i].name)
      .appendTo(initPlayer);
    var controlCol = $('<div>')
      .addClass('col-5')
      .addClass('no-border')
      .appendTo(initPlayer);

    var initBtnGroup = $('<div>')
      .addClass('btn-group')
      .appendTo(initCol);
    var initButton = $('<button>')
      .attr('type', 'button')
      .addClass('btn')
      .addClass('dropdown-toggle')
      .attr('data-toggle', 'dropdown')
      .append(initList[i].init)
      .appendTo(initBtnGroup);
    if (initList[i].init == 0) initButton.addClass('btn-secondary');
    else if (initList[i].init <= 5) initButton.addClass('btn-danger');
    else if (initList[i].init <= 10) initButton.addClass('btn-warning');
    else if (initList[i].init <= 15) initButton.addClass('btn-info');
    else if (initList[i].init <= 20) initButton.addClass('btn-primary');
    else if (initList[i].init > 20) initButton.addClass('btn-success');

    var initMenu = $('<div>')
      .addClass('dropdown-menu')
      .addClass('scrollable-menu')
      .appendTo(initBtnGroup);
    for (var ii = 30; ii > 0; ii--)
    {
      var num = $('<button>')
        .addClass('btn')
        .addClass('dropdown-item')
        .attr('onclick','editPCinit("'+initList[i].name+'", '+ii+')')
        .append(ii)
        .appendTo(initMenu);
    }

    if (initList[i].type == "npc")
    {
      var controllBtnGroup = $('<div>')
        .addClass('btn-group')
        .appendTo(controlCol);
      var hpButton = $('<button>')
        .attr('type', 'button')
        .addClass('btn')
        .addClass('btn-danger')
        .attr('data-toggle', 'modal')
        .attr('data-target', '#hpModal')
        .attr('onclick', 'displayHpUpdate("'+initList[i].name+'", '+initList[i].hp+')')
        .append(initList[i].hp)
        .appendTo(controllBtnGroup);
      // if (initList[i].hp == 0) hpButton.addClass('btn-secondary');
      // else if (initList[i].hp <= 10) hpButton.addClass('btn-danger');
      // else if (initList[i].hp <= 20) hpButton.addClass('btn-warning');
      // else if (initList[i].hp <= 35) hpButton.addClass('btn-info');
      // else if (initList[i].hp <= 50) hpButton.addClass('btn-primary');
      // else if (initList[i].hp > 50) hpButton.addClass('btn-success');
    }



    initPlayer.appendTo('#init-list');
  }
}

$('#addPC').keypress(function(event) {
  if (event.which == 13) {
    if ($('#addPC').val())
    {
      //console.log("Adding PC: " + $('#addPC').val());
      addPC($('#addPC').val());
      $('#addPC').val('');
      updateInitList();
    }
  }
});

$('#addNpcName').keypress(function(event) {
  if (event.which == 13) {
    var npcName = $('#addNpcName').val();
    var npcHP = $('#addNpcHp').val();
    tryAddNPC(npcName, npcHP);
  }
});

$('#addNpcHp').keypress(function(event) {
  if (event.which == 13) {
    var npcName = $('#addNpcName').val();
    var npcHP = $('#addNpcHp').val();
    tryAddNPC(npcName, npcHP);
  }
});

function tryAddNPC(name, hp) {
  if (name && hp)
  {
    addNPC(name, hp);
    $('#addNpcName').val('');
    $('#addNpcHp').val('');
    updateInitList();
  }
  else
  {
    var alert = $('<div>')
      .addClass('row')
      .addClass('alert')
      .addClass('alert-warning')
      .addClass('alert-dismissible')
      .addClass('fade')
      .addClass('show')
      .attr('role', 'alert')
      .append('Make sure your NPC has both a name and HP!')
      .append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
      .insertBefore($('#rowAddNPC'));

  }
}

function displayHpUpdate(name, hp) {
  $('#updateNpcName').val(name);
  $('#updateNpcHp').val(hp);
  $('#updateNpcHpSubmit').attr('onclick', 'hpUpdateFromModal()');
}

function hpUpdateFromModal() {
  editNpcHp($('#updateNpcName').val(), $('#updateNpcHp').val());
}

function loadTestData() {
  addPC('Bug');
  editPCinit('Bug', 25);
  addPC('Maveth');
  editPCinit('Maveth', 19);
  addPC('Gwen');
  editPCinit('Gwen', 17);
  addPC('Meredia');
  editPCinit('Meredia', 14);
  addPC('Art');
  editPCinit('Art', 12);
  addPC('Vimack');
  editPCinit('Vimack', 3);
  addPC('Storm');
  editPCinit('Storm', 6);

  addNPC('Goblin A', 33);
  editPCinit('Goblin A', 14)
  addNPC('Goblin B', 33);
  editPCinit('Goblin B', 7)
  addNPC('Goblin C', 33);
  editPCinit('Goblin C', 4)
  addNPC('Bugbear', 50);
  editPCinit('Bugbear', 12)
  addNPC('Giant', 89);
  editPCinit('Giant', 10)
  addNPC('Dragon', 150);
  editPCinit('Dragon', 9)
}

loadTestData();
