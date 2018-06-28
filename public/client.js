var socket = io(); //we'll use this later

var masterList = [];
var pcList = [];

function addPC(name) {
  var newPc = {
    name: name,
    init: 0
  };
  pcList.push(newPc);
}

function findPCindex(name) {
  return pcList.findIndex(obj => obj.name == name);
}

function editPCinit(name, init) {
  pcList[findPCindex(name)].init = init;
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
  pcList.sort(initCompare);
  for (var pc in pcList)
  {

  }
}
