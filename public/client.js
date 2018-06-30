var socket = io(); //we'll use this later


var initList = [];
//var pcList = [];
var npcTemplateList = [];

if (localStorage.initList) {
  console.log("Loading Local store");
  console.log(localStorage.initList);
  initList = JSON.parse(localStorage.initList);
  updateInitList();
}
else {
  localStorage.initList = JSON.stringify(initList);
}

if (localStorage.npcTemplateList) {
  console.log("Loading Local store");
  console.log(localStorage.npcTemplateList);
  npcTemplateList = JSON.parse(localStorage.npcTemplateList);
  updateNpcTemplateList();
}
else {
  localStorage.npcTemplateList = JSON.stringify(npcTemplateList);
}


function findPCindex(name) {
  return initList.findIndex(obj => obj.name == name);
}

function findNpcTemplateIndex(name) {
    return npcTemplateList.findIndex(obj => obj.name == name);
}

function addPC(name) {
  var newPc = {
    type: "pc",
    name: name,
    init: 0,
    notes: ""
  };
  //console.log("Adding PC: ");
  //console.log(newPc);
  //pcList.push(newPc);
  initList.push(newPc);
  updateInitList();
}

function addNPC(name, hp) {
  var newNpc = {
    type: "npc",
    name: name,
    hp: hp,
    init: 0,
    notes: ""
  };
  initList.push(newNpc);
  updateInitList();
}

function addNpcTemplate(name, hp) {
  var newTemplate = {
    name: name,
    hp: hp
  }
  npcTemplateList.push(newTemplate);
  updateNpcTemplateList();
}

function addNpcFromTemplate(name, hp) {
  var count = 1;
  while (count) {
    var newName = name + count.toString();
    if (findPCindex(newName) == -1)
    {
      addNPC(newName, hp);
      count = 0;
    }
    else {
      count++;
    }
  }
}

function editPCinit(name, init) {
  initList[findPCindex(name)].init = init;
  updateInitList();
}

function editNpcHp(name, hp) {
  initList[findPCindex(name)].hp = hp;
  updateInitList();
}

function editPcNotes(name, notes) {
  console.log(name);
  initList[findPCindex(name)].notes = notes;
  updateInitList();
}

function deletePC(name) {
  initList.splice(findPCindex(name),1);
  updateInitList();
}

function deleteNpcTemplate(name) {
  npcTemplateList.splice(findNpcTemplateIndex(name),1);
  updateNpcTemplateList();
}



function initCompare(pcA, pcB) {
  return (pcB.init - pcA.init);
}

function updateInitList() {
  initList.sort(initCompare);
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
      .addClass('my-auto')
      .append(initList[i].name)
      .appendTo(initPlayer);
    var controlCol = $('<div>')
      .addClass('col-7')
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
    for (var ii = 30; ii >= 0; ii--)
    {
      var num = $('<button>')
        .addClass('btn')
        .addClass('dropdown-item')
        .attr('onclick','editPCinit("'+initList[i].name+'", '+ii+')')
        .append(ii)
        .appendTo(initMenu);
    }

    var controllBtnGroup = $('<div>')
      .addClass('btn-group')
      .appendTo(controlCol);

    if (initList[i].type == "npc")
    {
      initPlayer.addClass('bg-light');
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

    var notesButton = $('<button>')
      .attr('type', 'button')
      .addClass('btn')
      .addClass('btn-secondary')
      .attr('data-toggle', 'modal')
      .attr('data-target', '#notesModal')
      .attr('onclick', 'displayNotesUpdate("'+initList[i].name+'", "'+initList[i].notes+'")')
      .append('<i class="fas fa-sticky-note pr-1"></i>')
      .append(initList[i].notes)
      .appendTo(controllBtnGroup);

    var delButton = $('<button>')
      .attr('type', 'button')
      .addClass('close')
      .attr('onclick', 'deletePC("' + initList[i].name + '")')
      .append('&times;')
      .appendTo(initPlayer);

    initPlayer.appendTo('#init-list');
  }
  console.log("Saving to Local store");
  localStorage.initList = JSON.stringify(initList);
}

function updateNpcTemplateList() {
  $('#template-list').empty();
  for (var i = 0; i < npcTemplateList.length; i++) {
    var templateNpc = $('<div>')
      .addClass('row')
      .addClass('border-bottom')
      .addClass('py-1');
    var nameCol = $('<div>')
      .addClass('col')
      .addClass('no-border')
      .addClass('my-auto')
      .append(npcTemplateList[i].name)
      .appendTo(templateNpc);
    var hpCol = $('<div>')
      .addClass('col-2')
      .addClass('no-border')
      .addClass('my-auto')
      .append(npcTemplateList[i].hp)
      .appendTo(templateNpc);
    var controlCol = $('<div>')
      .addClass('col-4')
      .addClass('no-border')
      .appendTo(templateNpc);
    var addButton = $('<button>')
      .attr('type', 'button')
      .addClass('btn')
      .addClass('btn-success')
      .attr('onclick', 'addNpcFromTemplate("'+npcTemplateList[i].name+'", '+npcTemplateList[i].hp+')')
      .append('<i class="fas fa-plus"></i>')
      .appendTo(controlCol);

    var delButton = $('<button>')
      .attr('type', 'button')
      .addClass('close')
      .attr('onclick', 'deleteNpcTemplate("' + npcTemplateList[i].name + '")')
      .append('&times;')
      .appendTo(templateNpc);

    templateNpc.appendTo($('#template-list'));
  }

  console.log("Saving to Local store");
  localStorage.npcTemplateList = JSON.stringify(npcTemplateList);
}




$('#addPcName').keypress(function(event) {
  if (event.which == 13) {
    tryAddPc($('#addPcName').val());
  }
});

$('#addPc').click(function() {
  tryAddPc($('#addPcName').val());
});

function tryAddPc(name) {
  if (name && (findPCindex(name) < 0)) {
    addPC(name);
    $('#addPcName').val('');
  }
  else {
    var alert = $('<div>')
      .addClass('row')
      .addClass('alert')
      .addClass('alert-warning')
      .addClass('alert-dismissible')
      .addClass('fade')
      .addClass('show')
      .attr('role', 'alert')
      .append('Make sure your PC has a unique name!')
      .append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
      .insertBefore($('#rowAddPC'));
  }
}

$('#resetPCs').click(function() {
  var editList = [];
  for (var i = 0; i < initList.length; i++) {
    if (initList[i].type == "pc") {
      editList.push(initList[i].name);
    }
  }
  for(var i = 0; i < editList.length; i++) {
      editPCinit(editList[i], 0);
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

$('#addNpc').click(function() {
    var npcName = $('#addNpcName').val();
    var npcHP = $('#addNpcHp').val();
    tryAddNPC(npcName, npcHP);
});

function tryAddNPC(name, hp) {
  if (name && hp)
  {
    addNPC(name, hp);
    $('#addNpcName').val('');
    $('#addNpcHp').val('');
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

$('#addNpcTemplate').click(function() {
    var name = $('#addNpcName').val();
    var hp = $('#addNpcHp').val();
    if (name && hp)
    {
      addNpcTemplate(name, hp);
      $('#addNpcName').val('');
      $('#addNpcHp').val('');
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
});

$('#deleteNPCs').click(function() {
  var editList = [];
  for (var i = 0; i < initList.length; i++) {
    if (initList[i].type == "npc") {
      editList.push(initList[i].name);
    }
  }
  for(var i = 0; i < editList.length; i++) {
      deletePC(editList[i]);
  }
});

function displayHpUpdate(name, hp) {
  $('#updateNpcName').val(name);
  $('#updateNpcHp').val(hp);
  $('#updateNpcHpSubmit').attr('onclick', 'hpUpdateFromModal()');
}

function hpUpdateFromModal() {
  editNpcHp($('#updateNpcName').val(), $('#updateNpcHp').val());
}

function displayNotesUpdate(name, notes) {
  $('#updateNotesName').val(name);
  $('#updateNotesText').val(notes);
  $('#updateNotesSubmit').attr('onclick', 'notesUpdateFromModal()')
}

function notesUpdateFromModal() {
  editPcNotes($('#updateNotesName').val(), $('#updateNotesText').val());
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

  // addNPC('Goblin A', 33);
  // editPCinit('Goblin A', 14)
  // addNPC('Goblin B', 33);
  // editPCinit('Goblin B', 7)
  // addNPC('Goblin C', 33);
  // editPCinit('Goblin C', 4)
  // addNPC('Bugbear', 50);
  // editPCinit('Bugbear', 12)
  // addNPC('Giant', 89);
  // editPCinit('Giant', 10)
  // addNPC('Dragon', 150);
  // editPCinit('Dragon', 9)

  addNpcTemplate('Goblin', 30);
  addNpcTemplate('Bandit', 45);
  addNpcTemplate('Bugbear', 60);
  addNpcTemplate('Giant', 85);
  addNpcTemplate('Dragon', 110);
  addNpcTemplate('Big Dragon', 150);

}

//loadTestData();
