var socket = io(); //we'll use this later

/////////////////////////// DATA INITIALIZATION ////////////////////////
var initList = [];
var npcTemplateList = [];
var savedEncounterList = [];

/////////////////////////// LOCAL STORAGE ////////////////////////
/* Check for the three lists in local browser storage. If it exists,
/  load it into the active memory. If not create it in storage   */
if (localStorage.initList) {
  console.log("Loading Local store: Init List");
  //console.log(localStorage.initList);
  initList = JSON.parse(localStorage.initList);
  updateInitList();
} else {
  localStorage.initList = JSON.stringify(initList);
}

if (localStorage.npcTemplateList) {
  console.log("Loading Local store: Template List");
  //console.log(localStorage.npcTemplateList);
  npcTemplateList = JSON.parse(localStorage.npcTemplateList);
  updateNpcTemplateList();
} else {
  localStorage.npcTemplateList = JSON.stringify(npcTemplateList);
}

if (localStorage.savedEncounterList) {
  console.log("Loading Local store: Saved Encounter List");
  //console.log(localStorage.savedEncounterList);
  savedEncounterList = JSON.parse(localStorage.savedEncounterList);
  updatesavedEncounterList();
} else {
  localStorage.savedEncounterList = JSON.stringify(savedEncounterList);
}



/////////////////////////// CRUD FUNCTIONS ////////////////////////
////// PC AND NPC FUNCTIONS //////
function addPc(name) {
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

function addNpc(name, hp) {
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

function addNpcGroup(groupName, quantity, npcName, hp) {
  var members = [];
  for (var i = 1; i <= quantity; i++) {
    var member = {
      type: "npc",
      name: npcName+i,
      hp: hp,
      notes: ""
    }
    members.push(member);
  }

  var newNpcGroup = {
    type: 'npcGroup',
    name: groupName,
    init: 0,
    members: members
  }

  initList.push(newNpcGroup);
  updateInitList();

}

function findPcNpcIndex(name) {
  return initList.findIndex(obj => obj.name == name);
}

function editPcNpcInit(name, init) {
  initList[findPcNpcIndex(name)].init = init;
  updateInitList();
}

function editNpcHp(name, hp, groupName) {
  if (groupName) {
    var groupIndex = findPcNpcIndex(groupName);
    var memberIndex = initList[groupIndex].members.findIndex(obj => obj.name == name);
    initList[groupIndex].members[memberIndex].hp = Number(hp);
  } else {
    initList[findPcNpcIndex(name)].hp = hp;
  }
  updateInitList();
}

function editPcNpcNotes(name, notes, groupName) {
  if (groupName) {
    var groupIndex = findPcNpcIndex(groupName);
    var memberIndex = initList[groupIndex].members.findIndex(obj => obj.name == name);
    initList[groupIndex].members[memberIndex].notes = notes;
  } else {
    initList[findPcNpcIndex(name)].notes = notes;
  }

  updateInitList();
}

function deletePcNpc(name) {
  initList.splice(findPcNpcIndex(name),1);
  updateInitList();
}

////// NPC TEMPLATE FUNCTIONS //////
function addNpcTemplate(name, hp) {
  var newTemplate = {
    name: name,
    hp: hp
  }
  npcTemplateList.push(newTemplate);
  updateNpcTemplateList();
}

function findNpcTemplateIndex(name) {
    return npcTemplateList.findIndex(obj => obj.name == name);
}

function addNpcFromTemplate(name, hp) {
  var quantity = Number($('#'+name+'-templateQuantity').val());
  if (quantity == 1) {
    var count = 1;
    while (count) {
      var newName = name + count.toString();
      if (findPcNpcIndex(newName) == -1) {
        addNpc(newName, hp);
        count = 0;
      } else {
        count++;
      }
    }
  } else {
    var count = 1;
    while (count) {
      var groupName = name + 'Group' + count.toString();
      if (findPcNpcIndex(groupName) == -1) {
        addNpcGroup(groupName, quantity, name, hp);
        count = 0;
      } else {
        count++;
      }
    }
  }
}

function deleteNpcTemplate(name) {
  npcTemplateList.splice(findNpcTemplateIndex(name),1);
  updateNpcTemplateList();
}

////// SAVED ENCOUNTER FUNCTIONS //////
function addSavedEncounter(encounterList, name) {
  var newEncounter = {
    name: name,
    encounter: JSON.parse(JSON.stringify(encounterList))
  };
  savedEncounterList.push(newEncounter);
  updatesavedEncounterList();
}

function findSavedEncounterIndex(name) {
    return savedEncounterList.findIndex(obj => obj.name == name);
}

function loadSavedEncounter(name, overwrite) {
  var encounter = savedEncounterList[findSavedEncounterIndex(name)].encounter;
  if (overwrite) {
    //issue warning before doing
    initList = JSON.parse(JSON.stringify(encounter));
  } else {
    initList = initList.concat(JSON.parse(JSON.stringify(encounter)));
  }
  updateInitList();
}

function clearEncounter() {

}

function deleteSavedEncounter(name) {
  savedEncounterList.splice(findSavedEncounterIndex(name), 1);
  updatesavedEncounterList();
}


/////////////////////////// VIEW LIST UPDATES ////////////////////////
/* Comparse the inititives of two PCs/NPCs for use in sorting  */
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
      .appendTo(initPlayer);
    var nameSpan = $('<span>')
      .addClass('text-center')
      .append(initList[i].name)
      .appendTo(nameCol);
    var controlCol = $('<div>')
      .addClass('col-8')
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
        .attr('onclick','editPcNpcInit("'+initList[i].name+'", '+ii+')')
        .append(ii)
        .appendTo(initMenu);
    }

    if (initList[i].type == "pc") {
      var controlBtnGroup = $('<div>')
        .addClass('btn-group')
        .appendTo(controlCol);
      var notesButton = $('<button>')
        .attr('type', 'button')
        .addClass('btn')
        .addClass('btn-secondary')
        .attr('data-toggle', 'modal')
        .attr('data-target', '#notesModal')
        .attr('onclick', 'displayNotesUpdate("'+initList[i].name+'", "'+initList[i].notes+'")')
        .append('<i class="fas fa-sticky-note pr-1"></i>')
        .append(initList[i].notes)
        .appendTo(controlBtnGroup);

    } else if (initList[i].type == "npc") {
      initPlayer.addClass('bg-light');
      var controlBtnGroup = $('<div>')
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
        .appendTo(controlBtnGroup);
      var notesButton = $('<button>')
        .attr('type', 'button')
        .addClass('btn')
        .addClass('btn-secondary')
        .attr('data-toggle', 'modal')
        .attr('data-target', '#notesModal')
        .attr('onclick', 'displayNotesUpdate("'+initList[i].name+'", "'+initList[i].notes+'")')
        .append('<i class="fas fa-sticky-note pr-1"></i>')
        .append(initList[i].notes)
        .appendTo(controlBtnGroup);

    } else if (initList[i].type == "npcGroup") {
      initPlayer.addClass('bg-light');
      nameSpan.addClass('align-top');
      //console.log(initList[i].members);
      for (var member in initList[i].members) {
        console.log(initList[i].members[member]);
        var controlBtnGroup = $('<div>')
          .addClass('btn-group')
          .addClass('float-left')
          .addClass('mb-1')
          .addClass('mr-1')
          .appendTo(controlCol);
        var memberName = $('<button>')
          .attr('type', 'button')
          .addClass('btn btn-outline-primary')
          .attr('disabled', 'true')
          .append(initList[i].members[member].name)
          .appendTo(controlBtnGroup);
        var hpButton = $('<button>')
          .attr('type', 'button')
          .addClass('btn')
          .addClass('btn-danger')
          .attr('data-toggle', 'modal')
          .attr('data-target', '#hpModal')
          .attr('onclick', 'displayHpUpdate("'+initList[i].members[member].name+'", '+initList[i].members[member].hp+', "'+initList[i].name+'")')
          .append(initList[i].members[member].hp)
          .appendTo(controlBtnGroup);
        var notesButton = $('<button>')
          .attr('type', 'button')
          .addClass('btn')
          .addClass('btn-secondary')
          .attr('data-toggle', 'modal')
          .attr('data-target', '#notesModal')
          .attr('onclick', 'displayNotesUpdate("'+initList[i].members[member].name+'", "'+initList[i].members[member].notes+'", "'+initList[i].name+'")')
          .append('<i class="fas fa-sticky-note pr-1"></i>')
          .append(initList[i].members[member].notes)
          .appendTo(controlBtnGroup);
      }

    }

    var delButton = $('<button>')
      .attr('type', 'button')
      .addClass('close')
      .attr('onclick', 'deletePcNpc("' + initList[i].name + '")')
      .append('&times;')
      .appendTo(initPlayer);

    initPlayer.appendTo('#init-list');
  }
  //console.log("Saving to Local store");
  localStorage.initList = JSON.stringify(initList);
  serverLog(JSON.stringify(initList));
}

function updateNpcTemplateList() {
  $('#template-list').empty();
  for (var i = 0; i < npcTemplateList.length; i++) {
    var templateNpc = $('<div>')
      .addClass('row')
      .addClass('border-bottom')
      .addClass('py-1');
    var nameCol = $('<div>')
      .addClass('col-4')
      .addClass('no-border')
      .addClass('my-auto')
      .append(npcTemplateList[i].name)
      .appendTo(templateNpc);
    var hpCol = $('<div>')
      .addClass('col-1')
      .addClass('no-border')
      .addClass('my-auto')
      .append(npcTemplateList[i].hp)
      .appendTo(templateNpc);

    var controlCol = $('<div>')
      .addClass('input-group')
      .addClass('col-6')
      .addClass('no-border')
      .appendTo(templateNpc);

    var addNumber = $('<input>')
      .attr('type', 'text')
      .addClass('form-control')
      .addClass('col-3')
      .attr('id', npcTemplateList[i].name+'-templateQuantity')
      .attr('value', 1)
      .attr('size', 2)
      .appendTo(controlCol);

    var controlBtns = $('<div>')
      .addClass('input-group-append')
      .appendTo(controlCol);

    var addButton = $('<button>')
      .attr('type', 'button')
      .addClass('btn')
      .addClass('btn-success')
      .attr('onclick', 'addNpcFromTemplate("'+npcTemplateList[i].name+'", '+npcTemplateList[i].hp+')')
      .append('<i class="fas fa-plus"></i>')
      .appendTo(controlBtns);

    var delButton = $('<button>')
      .attr('type', 'button')
      .addClass('close')
      .attr('onclick', 'deleteNpcTemplate("' + npcTemplateList[i].name + '")')
      .append('&times;')
      .appendTo(templateNpc);

    templateNpc.appendTo($('#template-list'));
  }

   //console.log("Saving to Local store");
  localStorage.npcTemplateList = JSON.stringify(npcTemplateList);
  serverLog( JSON.stringify(npcTemplateList));
}

function updatesavedEncounterList() {
  $('#scenario-list').empty();
  for (var i = 0; i < savedEncounterList.length; i++) {
    var encounter = $('<div>')
      .addClass('row')
      .addClass('border-bottom')
      .addClass('py-1');
    var nameCol = $('<div>')
      .addClass('col-5')
      .addClass('my-auto')
      .append(savedEncounterList[i].name)
      .appendTo(encounter);
    var controlCol = $('<div>')
      .addClass('btn-group')
      .addClass('col-6')
      .appendTo(encounter);

    var insertBtn = $('<button>')
      .attr('type', 'button')
      .addClass('btn btn-success')
      .attr('onclick', 'loadSavedEncounter("' + savedEncounterList[i].name + '", false)')
      .append("Insert")
      .appendTo(controlCol);
    var overwriteBtn = $('<button>')
      .attr('type', 'button')
      .addClass('btn btn-outline-danger')
      .attr('onclick', 'loadSavedEncounter("' + savedEncounterList[i].name + '", true)')
      .append("Overwrite")
      .appendTo(controlCol);

    var delButton = $('<button>')
      .attr('type', 'button')
      .addClass('close')
      .attr('onclick', 'deleteSavedEncounter("' + savedEncounterList[i].name + '")')
      .append('&times;')
      .appendTo(encounter);

    encounter.appendTo($('#scenario-list'));
  }

  //console.log("Saving to encounter list")
  localStorage.savedEncounterList = JSON.stringify(savedEncounterList);
  serverLog(JSON.stringify(savedEncounterList));
}


/////////////////////////// EVENT HANDLERS ////////////////////////
$('#addPcName').keypress(function(event) {
  if (event.which == 13) {
    tryAddPc($('#addPcName').val());
  }
});

$('#addPc').click(function() {
  tryAddPc($('#addPcName').val());
});

function tryAddPc(name) {
  if (name && (findPcNpcIndex(name) < 0)) {
    addPc(name);
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
      editPcNpcInit(editList[i], 0);
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
    addNpc(name, hp);
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
      deletePcNpc(editList[i]);
  }
});

$('#saveEncounterBtn').click(function() {
  var name = $('#saveEncounterName').val();
  if (name) {
    addSavedEncounter(initList, name);
    $('#saveEncounterName').val('');
  } else {
    var alert = $('<div>')
      .addClass('row')
      .addClass('alert')
      .addClass('alert-warning')
      .addClass('alert-dismissible')
      .addClass('fade')
      .addClass('show')
      .attr('role', 'alert')
      .append('Make sure your saved encounter has a name!')
      .append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
      .insertBefore($('#rowMainLists'));
  }
});


/////////////////////////// HP UPDATE BOX ////////////////////////
function displayHpUpdate(name, hp, groupName) {
  $('#updateNpcName').val(name);
  $('#updateNpcGroupName').val(groupName);
  $('#updateNpcHp').val(hp);
  $('#updateNpcHpHealText').val(0);
  $('#updateNpcHpDamageText').val(0);
  $('#updateNpcHpSubmit').attr('onclick', 'hpUpdateFromModal()');
}

$('#updateNpcHpHealBtn').click(function() {
  var hp =  Number($('#updateNpcHp').val());
  var healing = Number($('#updateNpcHpHealText').val());
  $('#updateNpcHp').val(hp+1);
  $('#updateNpcHpHealText').val(healing+1);
});

$('#updateNpcHpHealText').change(function() {
  console.log("test");
  var healing = Number($('#updateNpcHpHealText').val());
  var hp =  Number($('#updateNpcHp').val());
  $('#updateNpcHp').val(hp+healing);
});

$('#updateNpcHpDamageBtn').click(function() {
  var hp =  Number($('#updateNpcHp').val());
  var damage = Number($('#updateNpcHpDamageText').val());
  $('#updateNpcHp').val(hp-1);
  $('#updateNpcHpDamageText').val(damage+1);
});

$('#updateNpcHpDamageText').change(function() {
  var damage = Number($('#updateNpcHpDamageText').val());
  var hp =  Number($('#updateNpcHp').val());
  $('#updateNpcHp').val(hp-damage);

});

function hpUpdateFromModal() {
  editNpcHp($('#updateNpcName').val(), Number($('#updateNpcHp').val()), $('#updateNpcGroupName').val());
}


/////////////////////////// NOTES UPDATE BOX ////////////////////////
function displayNotesUpdate(name, notes, groupName) {
  $('#updateNotesName').val(name);
  $('#updateNotesGroupName').val(groupName);
  $('#updateNotesText').val(notes);
  $('#updateNotesSubmit').attr('onclick', 'notesUpdateFromModal()')
}

function notesUpdateFromModal() {
  editPcNpcNotes($('#updateNotesName').val(), $('#updateNotesText').val(), $('#updateNotesGroupName').val() );
}


/////////////////////////// SERVER COMMS ////////////////////////
socket.on('connect', function() {
  //socket.emit('test','hi');
});

socket.on('test', function(message) {
  console.log("Message from server: " + message);
});

function serverLog(message) {
  socket.emit('log', message);
}


/////////////////////////// TEST DATA ////////////////////////
function loadTestData() {
  addPc('Bug');
  editPcNpcInit('Bug', 25);
  addPc('Maveth');
  editPcNpcInit('Maveth', 19);
  addPc('Gwen');
  editPcNpcInit('Gwen', 17);
  addPc('Meredia');
  editPcNpcInit('Meredia', 14);
  addPc('Art');
  editPcNpcInit('Art', 12);
  addPc('Vimack');
  editPcNpcInit('Vimack', 3);
  addPc('Storm');
  editPcNpcInit('Storm', 6);

  // addNpc('Goblin A', 33);
  // editPcNpcInit('Goblin A', 14)
  // addNpc('Goblin B', 33);
  // editPcNpcInit('Goblin B', 7)
  // addNpc('Goblin C', 33);
  // editPcNpcInit('Goblin C', 4)
  // addNpc('Bugbear', 50);
  // editPcNpcInit('Bugbear', 12)
  // addNpc('Giant', 89);
  // editPcNpcInit('Giant', 10)
  // addNpc('Dragon', 150);
  // editPcNpcInit('Dragon', 9)

  addNpcTemplate('Goblin', 30);
  addNpcTemplate('Bandit', 45);
  addNpcTemplate('Bugbear', 60);
  addNpcTemplate('Giant', 85);
  addNpcTemplate('Dragon', 110);
  addNpcTemplate('BigDragon', 150);

}

//loadTestData();
