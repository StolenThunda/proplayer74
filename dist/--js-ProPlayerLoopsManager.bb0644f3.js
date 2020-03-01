// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"--js-ProPlayerLoopsManager.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ProPlayerLoopsManager =
/*#__PURE__*/
function () {
  function ProPlayerLoopsManager() {
    _classCallCheck(this, ProPlayerLoopsManager);

    this.a_Collections = [];
    this.n_LastActiveCollectionID = -1;
  }

  _createClass(ProPlayerLoopsManager, [{
    key: "hasLists",
    value: function hasLists() {
      return this.a_Collections.length > 0;
    }
  }, {
    key: "setLastActiveCollectionID",
    value: function setLastActiveCollectionID(nCollectionID) {
      this.n_LastActiveCollectionID = nCollectionID; //console.log("Setting last active list to:" + nListID);
    }
  }, {
    key: "getLastActiveListID",
    value: function getLastActiveListID() {
      return this.n_LastActiveCollectionID;
    }
  }, {
    key: "resetAll",
    value: function resetAll() {
      for (var i = 0; i < this.a_Collections.length; i++) {
        this.a_Collections[i].reset();
      }

      this.a_Collections.length = 0;
      $('#addUserLoopButton').toggleClass('disabled', true);
      $('#saveUserLoopsButton').toggleClass('disabled', true);
    }
  }, {
    key: "createNewCollection",
    value: function createNewCollection(strUIParentID, strCollectionRole, bEditable) {
      var theCollection = this.getCollectionByRole(strCollectionRole);

      if (theCollection == null) {
        var newCollectionID = this.a_Collections.length;
        theCollection = new ProPlayerLoopsCollection(newCollectionID, strUIParentID, strCollectionRole, bEditable);
        this.appendCollection(theCollection);
      } else {
        theCollection.reset();
        this.pushUserLoopInterfaceState();
      }

      return theCollection;
    }
  }, {
    key: "addListToCollectionFromArray",
    value: function addListToCollectionFromArray(aLoopsArray, strCollectionRole, strListTitle, bResetCollection) {
      //The collection must already exist before calling this method.
      var theCollection = this.getCollectionByRole(strCollectionRole);

      if (theCollection !== null) {
        if (bResetCollection) {
          //only reset the collection if indicated, otherwise append new list.
          theCollection.reset();
        }

        theCollection.addListFromLoopArray(aLoopsArray, strListTitle);
        theCollection.rebuildLoopsUIList();
      }

      this.pushUserLoopInterfaceState();
    }
  }, {
    key: "appendCollection",
    value: function appendCollection(newCollection) {
      this.a_Collections.push(newCollection);
    }
  }, {
    key: "getCollectionAt",
    value: function getCollectionAt(nIndex) {
      return this.a_Collections[nIndex];
    }
  }, {
    key: "getCollectionByID",
    value: function getCollectionByID(nCollectionID) {
      var theCollection = null;

      for (var i = 0; i < this.a_Collections.length; i++) {
        if (this.a_Collections[i].getID() == nCollectionID) {
          theCollection = this.a_Collections[i];
          break;
        }
      }

      return theCollection;
    }
  }, {
    key: "getCollectionByRole",
    value: function getCollectionByRole(strCollectionRole) {
      var theCollection = null;

      for (var i = 0; i < this.a_Collections.length; i++) {
        if (this.a_Collections[i].getRole() == strCollectionRole) {
          theCollection = this.a_Collections[i];
        }
      }

      return theCollection;
    }
  }, {
    key: "loopSelected",
    value: function loopSelected(nCollectionID, nListIndex, nLoopIndex) {
      //console.log("Loop Selected: " + nListID + "," + nLoopIndex);
      this.clearActiveLoopsExcept(nCollectionID, nListIndex);
      this.setLastActiveCollectionID(nCollectionID);
      var theCollection = this.getCollectionByID(nCollectionID);
      theCollection.loopSelected(nListIndex, nLoopIndex);
    }
  }, {
    key: "loopToggleSelected",
    value: function loopToggleSelected(nCollectionID, nListIndex, nLoopIndex) {
      this.clearActiveLoopsExcept(nCollectionID, nListIndex);
      this.setLastActiveCollectionID(nCollectionID);
      this.getCollectionByID(nCollectionID).loopToggleSelected(nListIndex, nLoopIndex);
    }
  }, {
    key: "activateNextLoop",
    value: function activateNextLoop() {
      var theID = -1;

      if (this.hasCollections()) {
        theID = this.getLastActiveCollectionID();

        if (theID == -1) {
          theID = this.getCollectionListWithLoops();
        }

        if (theID !== -1) {
          this.getCollectionByID(theID).activateNextLoop();
        }
      }

      return theID;
    }
  }, {
    key: "activatePreviousLoop",
    value: function activatePreviousLoop() {
      var theID = -1;

      if (this.hasCollections()) {
        theID = this.getLastActiveCollectionID();

        if (theID == -1) {
          theID = this.getFirstCollectionWithLoops();
        }

        if (theID !== -1) {
          this.getCollectionByID(theID).activatePreviousLoop();
        }
      }

      return theID;
    }
  }, {
    key: "clearActiveLoopsExcept",
    value: function clearActiveLoopsExcept(nCollectionID, nListIndex) {
      //console.log("Clearing active loops");
      //Step 1: clear other lists.
      for (var i = 0; i < this.a_Collections.length; i++) {
        //console.log("Clearing active loops for list: " + nListID)
        var _theCollection = this.a_Collections[i];

        if (_theCollection.getID() == nCollectionID) {
          _theCollection.clearActiveLoopsExcept(nListIndex);
        } else {
          _theCollection.clearAllActiveLoops();
        }
      }
    }
  }, {
    key: "clearAllActiveLoops",
    value: function clearAllActiveLoops() {
      //Step 1: clear other lists.
      for (var i = 0; i < this.a_Collections.length; i++) {
        this.a_Collections[i].clearAllActiveLoops();
      }
    }
  }, {
    key: "addUserLoop",
    value: function addUserLoop() {
      var theLoop = thePlayer.getEngineLoop();

      if (theLoop !== null) {
        var bWasPlaying = thePlayer.theEngine.isPlaying();

        if (bWasPlaying) {
          thePlayer.theEngine.stopPlayback();
        }

        var loopName = prompt('Enter loop name.', theLoop.getName());

        if (bWasPlaying) {
          thePlayer.theEngine.startPlayback();
        }

        if (loopName != null) {
          theCollection = this.getCollectionByRole('user');
          theLoop.setName(loopName);
          theCollection.addInstantLoop(theLoop);
          theCollection.rebuildLoopsUIList();
          this.pushUserLoopInterfaceState();
        }
      }
    }
  }, {
    key: "removeLoopFromList",
    value: function removeLoopFromList(nCollectionID, nListIndex, nLoopIndex) {
      var theCollection = this.getCollectionByID(nCollectionID);
      theCollection.removeLoop(nListIndex, nLoopIndex);
      theCollection.rebuildLoopsUIList();
      this.pushUserLoopInterfaceState();
    }
  }, {
    key: "getUserLoopsArray",
    value: function getUserLoopsArray() {
      return this.getCollectionByRole('user').getLoopsArray();
    }
  }, {
    key: "pushUserLoopInterfaceState",
    value: function pushUserLoopInterfaceState() {
      var bAddButtonEnabled = false;
      var bSaveButtonEnabled = false;
      var userLoopsCollection = this.getCollectionByRole('user'); //console.log("User List is: " + userList);

      if (userLoopsCollection == null) {
        //console.log("Showing no segment loaded error");
        $('#userLoopListEmpty').toggle(true);
      } else {
        $('#userLoopList').toggleClass('dirty', userLoopsCollection.isDirty());
        bSaveButtonEnabled = userLoopsCollection.isDirty();
        var theLoop = thePlayer.getEngineLoop();

        if (theLoop !== null) {
          bAddButtonEnabled = !userLoopsCollection.findMatchingLoop(theLoop);
        }
      }

      $('#addUserLoopButton').toggleClass('disabled', !bAddButtonEnabled);
      $('#saveUserLoopsButton').toggleClass('disabled', !bSaveButtonEnabled);
    }
  }, {
    key: "savingUserData",
    value: function savingUserData() {
      this.getCollectionByRole('user').showLoadingIndicator();
    }
  }, {
    key: "getFirstListWithLoops",
    value: function getFirstListWithLoops() {
      var nIndex = -1;

      for (var i = 0; i < this.a_Collections.length; i++) {
        if (this.a_Collections[i].getCollectionLoopCount() > 0) {
          nIndex = i;
          break;
        }
      }

      return nIndex;
    }
  }]);

  return ProPlayerLoopsManager;
}();

var ProPlayerLoopsCollection =
/*#__PURE__*/
function () {
  function ProPlayerLoopsCollection(nCollectionID, strListWrapperID, strCollectionRole, bEditable) {
    _classCallCheck(this, ProPlayerLoopsCollection);

    this.str_UIWrapperID = '#' + strListWrapperID;
    this.b_Editable = bEditable;
    this.n_CollectionID = nCollectionID;
    this.str_Role = strCollectionRole;
    this.a_Lists = [];
    this.b_IsDirty = false;
  }

  _createClass(ProPlayerLoopsCollection, [{
    key: "getListCount",
    value: function getListCount() {
      return this.a_Lists.length;
    }
  }, {
    key: "getID",
    value: function getID() {
      return this.n_CollectionID;
    }
  }, {
    key: "getRole",
    value: function getRole() {
      return this.str_Role;
    }
  }, {
    key: "getEditable",
    value: function getEditable() {
      return this.b_Editable;
    }
  }, {
    key: "isDirty",
    value: function isDirty() {
      return this.b_IsDirty;
    }
  }, {
    key: "setDirty",
    value: function setDirty(bDirty) {
      this.b_IsDirty = bDirty;
    }
  }, {
    key: "clearLoopsUIList",
    value: function clearLoopsUIList() {
      $(this.str_UIWrapperID).empty();
    }
  }, {
    key: "showLoadingIndicator",
    value: function showLoadingIndicator() {
      thePlayer.spinner(this.str_UIWrapperID);
    }
  }, {
    key: "getListAt",
    value: function getListAt(nIndex) {
      var theList = null;

      if (this.validListIndex(nIndex)) {
        theList = this.a_Lists[nIndex];
      }

      return theList;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.clearLoopsUIList();
      this.a_Lists.length = 0;
      this.setDirty(false);
      $(this.str_UIWrapperID + 'Empty').toggle(true);
    }
  }, {
    key: "getLoopsArray",
    value: function getLoopsArray() {
      var loopsArray = [];

      for (var i = 0; i < this.a_Lists.length; i++) {
        var theLoops = this.a_Lists[i].getLoopsArray();

        for (j = 0; j < theLoops.length; j++) {
          loopsArray.push(theLoops[j]);
        }
      }

      console.log(loopsArray);
      return loopsArray;
    }
  }, {
    key: "getCollectionLoopCount",
    value: function getCollectionLoopCount() {
      var theTotal = 0;

      for (var i = 0; i < this.a_Lists.length; i++) {
        theTotal += this.a_Lists[i].getListLoopCount();
      }

      return theTotal;
    }
  }, {
    key: "setNewLoopName",
    value: function setNewLoopName(nListIndex, nLoopIndex, strNewName) {
      var theLoop = this.getLoopAt(nListIndex, nLoopIndex);

      if (theLoop !== null) {
        theLoop.setName(strNewName);
        this.setDirty(true);
      }
    }
  }, {
    key: "getLoopAt",
    value: function getLoopAt(nListIndex, nLoopIndex) {
      if (this.validListIndex(nListIndex)) {
        return this.a_Lists[nListIndex].getLoopAt(nLoopIndex);
      } else {
        return null;
      }
    }
  }, {
    key: "validListIndex",
    value: function validListIndex(nListIndex) {
      return nListIndex < this.a_Lists.length ? true : false;
    }
  }, {
    key: "rebuildLoopsUIList",
    value: function rebuildLoopsUIList() {
      thePlayer.spinner(this.str_UIWrapperID);
      $(this.str_UIWrapperID + 'Empty').toggle(false); //this function assumes the loop list has already been reset

      var strListHTML = '';
      var bEditable = this.getEditable();
      var collectionID = this.getID();
      var bUseAccordion = this.a_Lists.length > 1;

      if (bUseAccordion) {
        // strListHTML += '<ul class="accordion sidebar-accordion" id="loopsListAccordion-' + this.getRole() + '" ';
        // strListHTML += 'data-accordion data-allow-all-closed="true" data-multi-expand="false">';
        strListHTML = "<ul class=\"accordion sidebar-accordion\" id=\"loopsListAccordion-".concat(this.getRole(), "\n\t\t\tdata-accordion data-allow-all-closed=\"true\" data-multi-expand=\"false\">");
      }

      for (var listIndex = 0; listIndex < this.a_Lists.length; listIndex++) {
        var theList = this.a_Lists[listIndex];

        if (bUseAccordion) {
          // strListHTML += '<li class="accordion-item" data-accordion-item>';
          // strListHTML += '<a class="accordion-title">' + theList.getListTitle() + '</a>';
          // strListHTML += '<div class="accordion-content" data-tab-content>';
          strListHTML = "<li class=\"accordion-item\" data-accordion-item>\n\t\t\t\t\t<a class=\"accordion-title\">".concat(theList.getListTitle(), "</a>\n\t\t\t\t\t<div class=\"accordion-content\" data-tab-content>\n\t\t\t\t");
        }

        strListHTML += '<ul class="sidebar-list dark">';

        for (var loopIndex = 0; loopIndex < theList.getLoopsArray().length; loopIndex++) {
          var theLoop = theList.getLoopAt(loopIndex);
          theLoop.setChecked(false);
          var loopItem = '<li class="sidebar-list-item loop button" id="loopItem-';
          loopItem += collectionID + '-' + listIndex + '-' + loopIndex + '">';
          var bStacking = theList.enableLoopStacking(loopIndex);

          if (bStacking || bEditable) {
            var theClass = '';

            if (bStacking && bEditable) {
              theClass = 'both';
            }

            loopItem += '<a class="sidebar-list-item-link ' + theClass;
            loopItem += '" onClick="thePlayer.loopsManager.loopSelected(';
            loopItem += collectionID + ',' + listIndex + ',' + loopIndex + ')">';
            loopItem += theLoop.getName();
            loopItem += '</a>';

            if (bStacking) {
              loopItem += '<a class="sidebar-list-item-button check-button ';
              loopItem += theClass + '" onClick="thePlayer.loopsManager.loopToggleSelected(';
              loopItem += collectionID + ',' + listIndex + ',' + loopIndex + '); return false;"></a>';
            }

            if (bEditable) {
              loopItem += '<a class="sidebar-list-item-button delete-button ';
              loopItem += theClass + '" onClick="thePlayer.loopsManager.removeLoopFromList(';
              loopItem += collectionID + ',' + listIndex + ',' + loopIndex + '); return false;"></a>';
            }
          } else {
            loopItem += '<a onClick="thePlayer.loopsManager.loopSelected(';
            loopItem += collectionID + ',' + listIndex + ',' + loopIndex + ')">';
            loopItem += theLoop.getName();
            loopItem += '</a>';
          }

          loopItem += '</li>';
          strListHTML += loopItem;
        }

        strListHTML += '</ul>';

        if (bUseAccordion) {
          strListHTML += '</div></li>';
        }
      }

      $(this.str_UIWrapperID).html(strListHTML);

      if (this.getCollectionLoopCount() == 0) {
        //console.log("Showing error message for empty list.");
        $(this.str_UIWrapperID + 'Empty').toggle(true);
      }

      if (bUseAccordion) {
        var accordionID = '#loopsListAccordion-' + this.getRole();
        $(accordionID).foundation();
      }
    }
  }, {
    key: "appendList",
    value: function appendList(newList) {
      this.a_Lists.push(newList);
    }
  }, {
    key: "addListFromLoopArray",
    value: function addListFromLoopArray(aLoopsArray, strListTitle) {
      //array must elements assumed to be in [name, start, end] format\
      //Clear this collection before calling this if you don't want the new
      // list appended.
      var theListIndex = this.a_Lists.length;
      var theList = new ProPlayerLoopsList(this.getID(), theListIndex, strListTitle);
      theList.createFromLoopArray(aLoopsArray);
      this.appendList(theList);
      this.setDirty(false);
    }
  }, {
    key: "findMatchingLoop",
    value: function findMatchingLoop(loopToMatch) {
      bMatchFound = false;

      for (var i = 0; i < this.a_Lists.length; i++) {
        if (this.a_Lists[i].findMatchingLoop(loopToMatch)) {
          bMatchFound = true;
          break;
        }
      }

      return bMatchFound;
    }
  }, {
    key: "clearActiveLoopsExcept",
    value: function clearActiveLoopsExcept(nListIndex) {
      for (var i = 0; i < this.a_Lists.length; i++) {
        if (i !== nListIndex) {
          this.a_Lists[i].clearActiveLoops();
          this.a_Lists[i].refreshLoopCheckedStates();
        }
      }
    }
  }, {
    key: "clearAllActiveLoops",
    value: function clearAllActiveLoops() {
      for (var i = 0; i < this.a_Lists.length; i++) {
        this.a_Lists[i].clearActiveLoops();
        this.a_Lists[i].refreshLoopCheckedStates();
      }
    }
  }, {
    key: "loopSelected",
    value: function loopSelected(nListIndex, nLoopIndex) {
      if (this.validListIndex(nListIndex)) {
        this.getListAt(nListIndex).loopSelected(nLoopIndex);
      }
    }
  }, {
    key: "loopToggleSelected",
    value: function loopToggleSelected(nListIndex, nLoopIndex) {
      if (this.validListIndex(nListIndex)) {
        this.getListAt(nListIndex).loopToggleSelected(nLoopIndex);
      }
    }
  }, {
    key: "addInstantLoop",
    value: function addInstantLoop(theLoop) {
      var theList = this.getListAt(0);

      if (theList == null) {
        theList = new ProPlayerLoopsList(this.getID(), 0);
        this.appendList(theList);
      }

      theList.addInstantLoop(theLoop);
      this.setDirty(true);
    }
  }, {
    key: "addInstantLoopToList",
    value: function addInstantLoopToList(nListIndex, theLoop) {
      if (this.validListIndex(nListIndex)) {
        this.getListAt(nListIndex).addInstantLoop(theLoop);
        this.setDirty(true);
      }
    }
  }, {
    key: "removeLoop",
    value: function removeLoop(nListIndex, nLoopIndex) {
      if (this.validListIndex(nListIndex)) {
        this.getListAt(nListIndex).removeLoop(nLoopIndex);
        this.setDirty(true);
      }
    }
  }]);

  return ProPlayerLoopsCollection;
}();

var ProPlayerLoopsList =
/*#__PURE__*/
function () {
  function ProPlayerLoopsList(nCollectionID, nListID, strListTitle) {
    _classCallCheck(this, ProPlayerLoopsList);

    this.a_Loops = [];
    this.n_CollectionID = nCollectionID;
    this.n_ListID = nListID;
    this.str_ListTitle = strListTitle;
  }

  _createClass(ProPlayerLoopsList, [{
    key: "getCollectionID",
    value: function getCollectionID() {
      return this.n_CollectionID;
    }
  }, {
    key: "getListID",
    value: function getListID() {
      return this.n_ListID;
    }
  }, {
    key: "getListTitle",
    value: function getListTitle() {
      return this.str_ListTitle;
    }
  }, {
    key: "setLoopsList",
    value: function setLoopsList(a_newLoopsList) {
      this.a_Loops = a_newLoopsList;
    }
  }, {
    key: "getLoopAt",
    value: function getLoopAt(nIndex) {
      return this.a_Loops[nIndex];
    }
  }, {
    key: "getLoopStart",
    value: function getLoopStart(nIndex) {
      return this.getLoopAt(nIndex).getLoopStart();
    }
  }, {
    key: "getLoopEnd",
    value: function getLoopEnd(nIndex) {
      return this.getLoopAt(nIndex).getLoopEnd();
    }
  }, {
    key: "getListLoopCount",
    value: function getListLoopCount() {
      return this.a_Loops.length;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.a_Loops.length = 0;
    }
  }, {
    key: "addLoopFromValues",
    value: function addLoopFromValues(strName, fLoopStart, fLoopEnd) {
      this.a_Loops.push(new InstantLoop(strName, fLoopStart, fLoopEnd));
    }
  }, {
    key: "addInstantLoop",
    value: function addInstantLoop(theLoop) {
      this.a_Loops.push(theLoop);
      return this.a_Loops.length - 1;
    }
  }, {
    key: "setNewLoopName",
    value: function setNewLoopName(nLoopIndex, strNewName) {
      this.getLoopAt(nLoopIndex).setName(strNewName);
    }
  }, {
    key: "activateNextLoop",
    value: function activateNextLoop() {
      var currentIndex = this.getFirstActiveLoop();

      if (currentIndex > -1) {
        if (currentIndex < this.a_Loops.length - 1) {
          this.loopSelected(currentIndex + 1);
        } else {
          this.loopSelected(0);
        }
      }
    }
  }, {
    key: "activatePreviousLoop",
    value: function activatePreviousLoop() {
      var currentIndex = this.getFirstActiveLoop();

      if (currentIndex > -1) {
        if (currentIndex > 0) {
          this.loopSelected(currentIndex - 1);
        } else {
          this.loopSelected(this.a_Loops.length - 1);
        }
      }
    }
  }, {
    key: "getFirstActiveLoop",
    value: function getFirstActiveLoop() {
      var nIndex = -1;

      if (this.a_Loops.length > 0) {
        nIndex = 0;

        for (var i = 0; i < this.a_Loops.length; i++) {
          if (this.a_Loops[i].getChecked()) {
            nIndex = i;
            break;
          }
        }
      }

      return nIndex;
    }
  }, {
    key: "removeLoop",
    value: function removeLoop(nIndex) {
      //console.log('Current List: ' + this.a_Loops);
      //console.log('Removing Loop at: ' + nIndex);
      this.a_Loops.splice(nIndex, 1); //console.log('New List: ' + this.a_Loops);
    }
  }, {
    key: "createFromLoopArray",
    value: function createFromLoopArray(aLoopsArray) {
      //array must elements assumed to be in [name, start, end] format
      for (var i = 0; i < aLoopsArray.length; i++) {
        this.addLoopFromValues(aLoopsArray[i][0], aLoopsArray[i][1], aLoopsArray[i][2]);
      }
    }
  }, {
    key: "appendFromLoopArray",
    value: function appendFromLoopArray(aLoopsArray) {
      //array must elements assumed to be in [name, start, end] format
      for (var i = 0; i < aLoopsArray.length; i++) {
        this.addLoopFromValues(aLoopsArray[i][0], aLoopsArray[i][1], aLoopsArray[i][2]);
      }
    }
  }, {
    key: "findMatchingLoop",
    value: function findMatchingLoop(loopToMatch) {
      var bMatchFound = false;

      for (var i = 0; i < this.a_Loops.length; i++) {
        var myLoop = this.a_Loops[i];

        if (Math.abs(loopToMatch.getLoopStart() - myLoop.getLoopStart()) < 0.1 && Math.abs(loopToMatch.getLoopEnd() - myLoop.getLoopEnd()) < 0.1) {
          bMatchFound = true;
        }
      }

      return bMatchFound;
    }
  }, {
    key: "getLoopsArray",
    value: function getLoopsArray() {
      var newArray = []; //array must elements assumed to be in [name, start, end] format

      for (var i = 0; i < this.a_Loops.length; i++) {
        newArray.push([this.a_Loops[i].getName(), this.a_Loops[i].getLoopStart(), this.a_Loops[i].getLoopEnd()]);
      }

      return newArray;
    }
  }, {
    key: "loopSelected",
    value: function loopSelected(nLoopIndex) {
      this.clearActiveLoops();
      this.toggleLoopCheckedState(nLoopIndex);
      this.refreshLoopCheckedStates(); //console.log("Activating Loop At: " + nLoopIndex);

      var theLoop = this.getLoopAt(nLoopIndex); //console.log('Activating Loop:' + theLoop);

      thePlayer.theEngine.loadLoop(this.getLoopAt(nLoopIndex).getLoopStart(), this.getLoopAt(nLoopIndex).getLoopEnd());
    }
  }, {
    key: "loopToggleSelected",
    value: function loopToggleSelected(nLoopIndex) {
      //console.log('Loop Toggle Selected: ' + nLoopIndex);
      this.processLoopToggle(nLoopIndex);
      this.refreshLoopCheckedStates();
      var theLoop = this.computeStackedLoop();

      if (theLoop !== null) {
        thePlayer.theEngine.loadLoop(theLoop.getLoopStart(), theLoop.getLoopEnd());
      }
    }
  }, {
    key: "toggleLoopCheckedState",
    value: function toggleLoopCheckedState(nLoopIndex) {
      var isLoopAlreadyChecked = this.getLoopAt(nLoopIndex).getChecked();

      if (isLoopAlreadyChecked && this.isLoopAMiddle(nLoopIndex)) {
        // If this loop is already checked, and user clicks check again,
        // clear all checked loops and turn this one back
        this.clearActiveLoops();
        this.getLoopAt(nLoopIndex).setChecked(true);
      } else {
        var previousLoopChecked = this.getLoopAt(nLoopIndex).toggleChecked();

        if (previousLoopChecked) {
          for (var i = nLoopIndex - 1; i >= 0; i--) {
            if (!this.getLoopAt(nLoopIndex).getChecked() || !this.getLoopAt(nLoopIndex).getStackable()) {
              previousLoopChecked = false;
            }

            this.getLoopAt(nLoopIndex).setChecked(previousLoopChecked);
          }

          previousLoopChecked = true;

          for (var _i = nLoopIndex + 1; _i < this.a_Loops.length; _i++) {
            if (!this.getLoopAt(_i).getChecked() || !this.getLoopAt(_i).getStackable()) {
              previousLoopChecked = false;
            }

            this.getLoopAt(_i).setChecked(previousLoopChecked);
          }
        }
      }
    }
  }, {
    key: "previousLoopConnected",
    value: function previousLoopConnected(i) {
      bConnected = false;

      if (i > 0) {
        var myStartTime = this.getLoopStart(i);
        var myEndTime = this.getLoopEnd(i);
        var previousStartTime = this.getLoopStart(i - 1);
        var previousEndTime = this.getLoopEnd(i - 1);

        if (myStartTime > previousStartTime && myEndTime > previousEndTime && myStartTime - previousEndTime < 2) {
          bConnected = true;
        }
      }

      return bConnected;
    }
  }, {
    key: "nextLoopConnected",
    value: function nextLoopConnected(i) {
      bConnected = false;

      if (i < this.a_Loops.length - 1) {
        var myStartTime = this.getLoopStart(i);
        var myEndTime = this.getLoopEnd(i);
        var nextStartTime = this.getLoopStart(i + 1);
        var nextEndTime = this.getLoopEnd(i + 1);

        if (myStartTime < nextStartTime && myEndTime < nextEndTime && nextStartTime - myEndTime < 2) {
          bConnected = true;
        }
      }

      return bConnected;
    }
  }, {
    key: "enableLoopStacking",
    value: function enableLoopStacking(nLoopIndex) {
      var bEnableStacking = false;

      if (!this.previousLoopConnected(nLoopIndex) && this.nextLoopConnected(nLoopIndex) && this.nextLoopConnected(nLoopIndex + 1)) {
        //Is this the first loop in a series,
        //meaning i, i+1, and i+2 are stackable, but i-1 is not
        bEnableStacking = true;
      } else if (this.previousLoopConnected(nLoopIndex) && this.nextLoopConnected(nLoopIndex)) {
        //Is this in the middle of a series?
        //meaning i, i-1 and i+1 are all stackable
        bEnableStacking = true;
      } else if (this.previousLoopConnected(nLoopIndex - 1) && this.previousLoopConnected(nLoopIndex)) {
        //Is this the end of a chain?
        //meaning i-2, i-1 and i are stackable, but i+1 is not.
        bEnableStacking = true;
      }

      this.getLoopAt(nLoopIndex).setStackable(bEnableStacking);
      return bEnableStacking;
    }
  }, {
    key: "clearActiveLoops",
    value: function clearActiveLoops() {
      for (var i = 0; i < this.a_Loops.length; i++) {
        this.getLoopAt(i).setChecked(false);
      }

      this.refreshLoopCheckedStates();
    }
  }, {
    key: "refreshLoopCheckedStates",
    value: function refreshLoopCheckedStates() {
      for (var i = 0; i < this.a_Loops.length; i++) {
        $(this.getLoopParentID(i)).toggleClass('active', this.getLoopAt(i).getChecked());
      }
    }
  }, {
    key: "getLoopParentID",
    value: function getLoopParentID(nIndex) {
      return '#loopItem-' + this.getCollectionID() + '-' + this.getListID() + '-' + nIndex;
    }
  }, {
    key: "processLoopToggle",
    value: function processLoopToggle(nSelectedIndex) {
      //console.log("Processing Loop Toggle At: " + nSelectedIndex);
      var bLoopAlreadyChecked = this.getLoopAt(nSelectedIndex).getChecked();
      var bLoopIsMiddle = this.isLoopAMiddle(nSelectedIndex); //Case 1: Loop is already checked and is between two other checked loops.
      //Action: clear all checked loops, toggle selected one back on.

      if (bLoopAlreadyChecked && bLoopIsMiddle) {
        // If this loop is already checked, and user clicks check again,
        // clear all checked loops and turn this one back
        this.clearActiveLoops();
        this.getLoopAt(nSelectedIndex).setChecked(true);
      } else if (bLoopAlreadyChecked && !bLoopIsMiddle) {
        //This loop is already checked, but is not a middle meaning it is the end of a range.
        //We simply need to toggle it and not touch the others.
        this.getLoopAt(nSelectedIndex).setChecked(false);
      } else if (!bLoopAlreadyChecked) {
        //Case 2: Loop is being toggled on
        //Actions: Search for loop range to toggle on.
        var previousCheckedLoopIndex = this.findPreviousStackableCheckedLoop(nSelectedIndex);
        var nextCheckedLoopIndex = this.findNextStackableCheckedLoop(nSelectedIndex);

        if (previousCheckedLoopIndex >= 0) {
          this.setStackableLoopRange(previousCheckedLoopIndex, nSelectedIndex);
        } else if (nextCheckedLoopIndex >= 0) {
          this.setStackableLoopRange(nSelectedIndex, nextCheckedLoopIndex);
        } else {
          //No other connected checked loops exist. Clear everything
          //and toggle this one on.
          this.clearActiveLoops();
          this.getLoopAt(nSelectedIndex).setChecked(true);
        }
      }
    }
  }, {
    key: "setStackableLoopRange",
    value: function setStackableLoopRange(nLowerIndex, nHigherIndex) {
      for (var i = nLowerIndex; i <= nHigherIndex; i++) {
        this.getLoopAt(i).setChecked(true);
      }
    }
  }, {
    key: "findPreviousStackableCheckedLoop",
    value: function findPreviousStackableCheckedLoop(startIndex) {
      nFoundIndex = -1;

      for (var i = startIndex - 1; i >= 0; i--) {
        if (this.getLoopAt(i).getChecked() && this.getLoopAt(i).getStackable()) {
          nFoundIndex = i;
        }
      }

      return nFoundIndex;
    }
  }, {
    key: "findNextStackableCheckedLoop",
    value: function findNextStackableCheckedLoop(startIndex) {
      nFoundIndex = -1;
      var nLength = this.a_Loops.length;

      for (var i = startIndex + 1; i < nLength; i++) {
        if (this.getLoopAt(i).getChecked() && this.getLoopAt(i).getStackable()) {
          nFoundIndex = i;
        }
      }

      return nFoundIndex;
    }
  }, {
    key: "toggleLoopCheckedState",
    value: function toggleLoopCheckedState(nLoopIndex) {
      var isLoopAlreadyChecked = this.getLoopAt(nLoopIndex).getChecked();

      if (isLoopAlreadyChecked && this.isLoopAMiddle(nLoopIndex)) {
        // If this loop is already checked, and user clicks check again,
        // clear all checked loops and turn this one back
        this.clearActiveLoops();
        this.getLoopAt(nLoopIndex).setChecked(true);
      } else {
        this.getLoopAt(nLoopIndex).setChecked(!this.getLoopAt(nLoopIndex).getChecked());
        var previousLoopChecked = this.getLoopAt(nLoopIndex).getChecked();

        if (previousLoopChecked) {
          for (var i = nLoopIndex - 1; i >= 0; i--) {
            if (!this.getLoopAt(i).getChecked() || !this.getLoopAt(i).getStackable()) {
              previousLoopChecked = false;
            }

            this.getLoopAt(i).setChecked(previousLoopChecked);
          }

          previousLoopChecked = true;

          for (var _i2 = nLoopIndex + 1; _i2 < this.a_Loops.length; _i2++) {
            if (!this.getLoopAt(_i2).getChecked() || !this.getLoopAt(_i2).getStackable()) {
              previousLoopChecked = false;
            }

            this.getLoopAt(_i2).setChecked(previousLoopChecked);
          }
        }
      }
    }
  }, {
    key: "isLoopAMiddle",
    value: function isLoopAMiddle(nLoopIndex) {
      var lowerLoop = false;
      var higherLoop = false;

      for (var i = 0; i < this.a_Loops.length; i++) {
        if (this.getLoopAt(i).getChecked() && this.getLoopAt(i).getStackable()) {
          if (i < nLoopIndex) {
            //console.log('Lower selected loop found');
            lowerLoop = true;
          } else if (i > nLoopIndex) {
            //console.log('Higher selected loop found');
            higherLoop = true;
          }
        }
      } //console.log('Loop is middle: ' + (lowerLoop && higherLoop));


      return lowerLoop && higherLoop;
    }
  }, {
    key: "computeStackedLoop",
    value: function computeStackedLoop() {
      var loopStart = 0;
      var loopEnd = 0;
      var loopInitialized = false;
      var nLength = this.a_Loops.length;

      for (var i = 0; i < nLength; i++) {
        var theLoop = this.getLoopAt(i);

        if (theLoop.getChecked()) {
          if (!loopInitialized) {
            loopStart = theLoop.getLoopStart();
            loopEnd = theLoop.getLoopEnd();
            loopInitialized = true;
          } else {
            loopStart = Math.min(loopStart, theLoop.getLoopStart());
            loopEnd = Math.max(loopEnd, theLoop.getLoopEnd());
          }
        }
      } //console.log("New Loop calculated: " + loopStart + "," + loopEnd);


      if (this.validateLoop(loopStart, loopEnd)) {
        return new InstantLoop('Combined Loop', loopStart, loopEnd); //this.theEngine.loadLoop( loopStart, loopEnd );
      } else {
        return null; //this.theEngine.stopLooping();
      }
    }
  }, {
    key: "validateLoop",
    value: function validateLoop(loopStart, loopEnd) {
      var loopValid = true;

      if (loopStart < 0 || loopStart > loopEnd || loopEnd <= 0 || loopStart == loopEnd) {
        loopValid = false;
      }

      return loopValid;
    }
  }]);

  return ProPlayerLoopsList;
}();

var InstantLoop =
/*#__PURE__*/
function () {
  function InstantLoop(strName, fStartTime, fStopTime) {
    _classCallCheck(this, InstantLoop);

    this.str_Name = strName;
    this.f_StartTime = parseFloat(fStartTime);
    this.f_EndTime = parseFloat(fStopTime);
    this.b_Stackable = false;
    this.b_Checked = false;

    if (strName == '') {
      this.str_Name = this.f_StartTime.toFixed(2) + ' - ' + this.f_EndTime.toFixed(2);
    }
  } //Setters


  _createClass(InstantLoop, [{
    key: "setLoopStart",
    value: function setLoopStart(fStartTime) {
      this.f_StartTime = parseFloat(fStartTime);
    }
  }, {
    key: "setLoopEnd",
    value: function setLoopEnd(fEndTime) {
      this.f_EndTime = parseFloat(fStopTime);
    }
  }, {
    key: "setStackable",
    value: function setStackable(bStackable) {
      this.b_Stackable = bStackable;
    }
  }, {
    key: "setChecked",
    value: function setChecked(bChecked) {
      this.b_Checked = bChecked;
    }
  }, {
    key: "setName",
    value: function setName(strName) {
      this.str_Name = strName;
    } //Getters

  }, {
    key: "getLoopStart",
    value: function getLoopStart() {
      return this.f_StartTime;
    }
  }, {
    key: "getLoopEnd",
    value: function getLoopEnd() {
      return this.f_EndTime;
    }
  }, {
    key: "getStackable",
    value: function getStackable() {
      return this.b_Stackable;
    }
  }, {
    key: "getChecked",
    value: function getChecked() {
      return this.b_Checked;
    }
  }, {
    key: "getName",
    value: function getName() {
      return this.str_Name;
    }
  }, {
    key: "toggleChecked",
    value: function toggleChecked() {
      var bWasChecked = this.b_Checked;
      this.b_Checked = !bWasChecked;
      return this.b_Checked;
    }
  }, {
    key: "validate",
    value: function validate() {
      if (this.f_EndTime < this.f_StartTime + 0.1) {
        return false;
      }

      return true;
    }
  }, {
    key: "getDefaultName",
    value: function getDefaultName() {
      return this.f_StartTime.toFixed(2) + ' - ' + this.f_EndTime.toFixed(2);
    }
  }]);

  return InstantLoop;
}();
},{}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "31294" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","--js-ProPlayerLoopsManager.js"], null)
//# sourceMappingURL=/--js-ProPlayerLoopsManager.bb0644f3.js.map