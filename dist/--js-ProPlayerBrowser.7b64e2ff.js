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
})({"--js-ProPlayerBrowser.js":[function(require,module,exports) {
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProPlayerBrowser = function ProPlayerBrowser(strWrapperDiv) {
  _classCallCheck(this, ProPlayerBrowser);

  this.b_BrowserLoaded = false;
  this.strBrowserWrapperID = "#" + strWrapperDiv;
  this.strActiveChannel = "";
  this.n_DependentsToProcess = 0;
  this.n_UpdateTimer = -1;
  this.filterSectionList = new BrowserFilterSectionList(this);
  this.b_IsProcessing = false;

  this.initializeBrowser = function () {};
  /*****************************************
   *** Initialization/Reset Functions  ********
   *****************************************/


  this.openBrowser = function () {};

  this.closeBrowser = function () {
    //console.log('Close Browser Called');
    $(this.strBrowserWrapperID).empty();
    $(this.strBrowserWrapperID).toggle(false);
  };

  this.browserReset = function () {
    $('#filter-level-1 .selected').toggleClass('active', false);
    this.strActiveChannel = '';
    this.browserResetFilters();
    this.resetResults();
    this.n_DependentsToProcess = 0;
    this.filterSectionList.reset();
    this.spinner("results");
    $('#results').load(gc_BranchPath + '/--ajax-browser-default-entries/', function () {
      thePlayer.browserTool.loadResultsFavoritesForms();
    });
    $('#sidebar-instructions').toggleClass('hidden', false);
  };

  this.resetResults = function () {
    $('#results .row').remove();
    $('#results').empty();
  };
  /*****************************************
   *************  Interface Callbacks  ************
   *****************************************/


  this.browserChannelCallback = function (strChannel, sender) {
    if (this.isProcessing()) {
      //console.log("Previous process has not finished, bailing.");
      return;
    }

    this.initializeProcessing();
    this.strActiveChannel = strChannel;
    this.resetResults(); //unselect previously selected content type.

    $('ul.browser-top-filter-list li a.active').toggleClass('active', false);

    if (sender) {
      $(sender).toggleClass('active', true);
    }

    this.browserLoadFilters(strChannel);
  };

  this.toggleSearchFilter = function (strFilterID, strSectionID) {
    if (this.isProcessing()) {
      //console.log("Previous process has not finished, bailing.");
      return;
    }

    this.initializeProcessing();
    var theFilterID = "input#" + strFilterID;
    var theSection = $("#browserFilterSection-" + strSectionID); //console.log(theSection);

    var bEnableStacking = $(theSection).data('section-stackable') == "yes";
    var sectionType = $(theSection).data('section-type');
    var bWasChecked = $(theFilterID).prop('checked');

    if (bWasChecked == undefined) {
      bWasChecked = false;
    }

    if (bWasChecked && !bEnableStacking) {
      //We are toggling on a checkbox, but stacking is not enabled for this section.
      // We must clear all other checked inputs in this group.
      var _theCheckboxes = $(theSection).find('input:checkbox');

      for (var i = 0; i < _theCheckboxes.length; i++) {
        if ($(_theCheckboxes[i]).attr('id') !== strFilterID) {
          //console.log('Unchecking: ' + $(theCheckboxes[i]).attr('id'));
          $(_theCheckboxes[i]).prop('checked', false);
        }
      }
    }

    var filterSectionID = "#filterSection-" + strSectionID;
    var theCheckboxes = $(theSection).find('input:checkbox:checked');

    if (theCheckboxes.length > 0) {
      //console.log("Marking section to have filters on: " + filterSectionID);
      $(filterSectionID).toggleClass('has-filters', true);
    } else {
      $(filterSectionID).toggleClass('has-filters', false);
    }

    this.resetResults();
    this.showResultsLoading();
    this.processDependents(strSectionID);
    this.waitForDependentsToFinishUpdating();
  };
  /*****************************************
   *************   Filtering  ************
   *****************************************/


  this.browserResetFilters = function () {
    $('#sidebarFiltersWrapper form').remove();
  };

  this.browserLoadFilters = function (strChannel) {
    this.browserResetFilters();
    this.spinner("sidebarFiltersWrapper");
    var theURL = gc_BranchPath + "/--ajax-browser-filters/" + strChannel;
    $("#sidebarFiltersWrapper").load(theURL, function () {
      if (strChannel != "youtube") {
        thePlayer.browserTool.submitSearch();
        $('#filterAccordion').foundation();
        thePlayer.browserTool.refreshActiveFilters();
        thePlayer.browserTool.buildFilterSectionData();
      } else {
        thePlayer.browserTool.clearActiveFilters();
        thePlayer.browserTool.finalCleanup();
      }
    });
  };

  this.removeKeywordFilter = function () {
    $("#browserSearchKeywordsReset").toggle(false);
    $("input#browserSearchKeywords").val("");
    this.applyKeywordFilter();
  };

  this.removeActiveFilter = function (strFilterID, strSectionID) {
    //first uncheck the filter because that's what would have happened if we clicked
    // on it.
    $("#" + strFilterID).prop('checked', false);
    this.toggleSearchFilter(strFilterID, strSectionID);
  };

  this.clearActiveFilters = function () {
    $("#activeFiltersWrapper").html("");
    $("#activeFiltersWrapper").toggleClass("hidden", true);
  };

  this.refreshActiveFilters = function () {
    //console.log("Refreshing Active Filters");
    var filtersString = "";
    var sections = $('ul#filterAccordion li.accordion-item');

    for (var i = 0; i < sections.length; i++) {
      var sectionTitle = $(sections[i]).children('a.accordion-title').first().text();
      var sectionID = $(sections[i]).data('section-id');
      var checkedFilters = $(sections[i]).find('input:checkbox:checked');

      if (checkedFilters.length > 0) {
        filtersString += "<span class='active-filter-group'><span class='active-filter-group-title'>";
        filtersString += sectionTitle + ":</span> ";

        for (var j = 0; j < checkedFilters.length; j++) {
          filtersString += "<a class='active-filter-item' onClick='thePlayer.browserTool.removeActiveFilter(\"";
          filtersString += $(checkedFilters[j]).attr('id');
          filtersString += "\", ";
          filtersString += "\"" + sectionID + "\"); return false;'>";
          filtersString += $(checkedFilters[j]).siblings('label').first().text();
          filtersString += " <i class='fa fa-times-circle'></i></a>";
        }

        filtersString += "</span>";
      }
    }

    var strKeywords = $("input#browserSearchKeywords").val();

    if (strKeywords != "") {
      filtersString += "<span class='active-filter-group'><span class='active-filter-group-title'>";
      filtersString += "Keywords:</span> ";
      filtersString += "<a class='active-filter-item' onClick='thePlayer.browserTool.removeKeywordFilter(); return false;'>";
      filtersString += strKeywords;
      filtersString += " <i class='fa fa-times-circle'></i></a>";
      filtersString += "</span>";
    }

    if (filtersString == "") {
      filtersString += "<span class='active-filter-group'><span class='active-filter-group-title'>";
      filtersString += "Showing: All</span>";
      filtersString += "</span>";
    }

    $("#activeFiltersWrapper").removeClass('hidden');
    $("#activeFiltersWrapper").html(filtersString);
  };
  /*****************************************
   *************  Search Results   ************
   *****************************************/


  this.resetSearch = function () {
    $('input:checkbox').prop('checked', false);
    $('.has-filters').removeClass('has-filters');
    this.refreshActiveFilters();
    this.submitSearch();
  };

  this.submitSearch = function () {
    var theForm = $("form#searchForm");
    formData = $(theForm).serialize(); //console.log(formData);

    $.ajax({
      type: 'POST',
      url: $(theForm).attr('action'),
      data: formData
    }).done(function (response) {
      $('#results').html(response);
      thePlayer.browserTool.finalCleanup();
      thePlayer.browserTool.loadResultsFavoritesForms();
    });
  };

  this.applyKeywordFilter = function () {
    var theKeywords = $("input#browserSearchKeywords").val();

    if (theKeywords != "") {
      $("#browserSearchKeywordsReset").toggle(true);
    }

    this.refreshActiveFilters();
    this.showResultsLoading();
    this.submitSearch();
  };

  this.doYouTubeSearch = function () {
    if (this.isProcessing()) {
      //console.log("Previous process has not finished, bailing.");
      return;
    }

    this.initializeProcessing();
    var searchPath = gc_BranchPath + "/--ajax-browser-search-youtube/";
    var searchKeywords = $('input#browserSearchKeywords').val();

    if (searchKeywords != '') {
      var searchURL = encodeURI(searchPath + searchKeywords);
      this.resetResults();
      this.showResultsLoading();
      $('#results').load(searchURL, function () {
        thePlayer.browserTool.finalCleanup();
      });
    }
  };

  this.goToResultsPage = function (resultsURL) {
    if (this.isProcessing()) {
      //console.log("Previous process has not finished, bailing.");
      return;
    }

    this.initializeProcessing();
    this.resetResults();
    this.spinner("results");
    $('#results').load(resultsURL, function () {
      thePlayer.browserTool.finalCleanup();
      thePlayer.browserTool.loadResultsFavoritesForms();
    });
  };

  this.nextYouTubeResultsPage = function (strSearchTerm, offsetNumber) {
    if (this.isProcessing()) {
      //console.log("Previous process has not finished, bailing.");
      return;
    }

    this.initializeProcessing();
    this.resetResults();
    this.showResultsLoading();
    var strNextURL = gc_BranchPath + '/';
    strNextURL += '--ajax-browser-search-youtube/';
    strNextURL += strSearchTerm + '/';
    strNextURL += offsetNumber;
    var strNextURL = encodeURI(strNextURL);
    $('#results').load(strNextURL, function () {
      thePlayer.browserTool.finalCleanup();
    });
  };
  /*****************************************
   ******   Dependency Functions  **********
   *****************************************/


  this.buildFilterSectionData = function () {
    this.filterSectionList.reset();
    var allSections = $('ul.filter-list');

    for (var i = 0; i < allSections.length; i++) {
      var newSectionObject = new BrowserFilterSection();
      newSectionObject.setSectionID($(allSections[i]).data('section-id'));
      newSectionObject.setSectionType($(allSections[i]).data('section-type'));
      newSectionObject.setSectionDOMID("#browserFilterSection-" + $(allSections[i]).data('section-id'));
      newSectionObject.setChannelID($(allSections[i]).data('section-channel-id'));
      newSectionObject.setGroupID($(allSections[i]).data('section-group-id'));
      var tmpDependenciesArray = null;
      var tmpDependenciesString = $(allSections[i]).data('section-dependencies');

      if (tmpDependenciesString != "") {
        tmpDependenciesArray = tmpDependenciesString.split("|");
      } else {
        tmpDependenciesArray = [];
      }

      newSectionObject.setParentIDs(tmpDependenciesArray);
      this.filterSectionList.addSection(newSectionObject);
    }

    this.filterSectionList.computeSectionFamilies();
  };

  this.processDependents = function (strMasterSectionID) {
    /*
        #Order Of Operations
        
        1. Get an array of dependencies for the master section being changed.
        2. Update each of those dependent sections.
            a. Scan through the sections each dependent section is dependent on.
            b. Get a list of all enabled inputs.
            c. Create the update url and update from that.
    */
    var theSection = this.filterSectionList.getSectionByID(strMasterSectionID);
    var theChildren = theSection.getChildren(); //If there aren't any dependents found, there's nothing to do

    if (theChildren.length == 0) {
      return;
    }

    this.n_DependentsToProcess = theChildren.length;
    this.filterSectionList.rebuildFilterSectionKeys();

    for (var i = 0; i < theChildren.length; i++) {
      var childParents = theChildren[i].getParents(); //initialize our tag and category filter strings

      var theTagKeys = "";
      var theCategoryKeys = ""; //cycle through all sections we depend on and collect any checked input values.

      for (var j = 0; j < childParents.length; j++) {
        var theKeyIDsString = childParents[j].getKeyString();
        var theKeyType = childParents[j].getSectionType();

        if (theKeyType == "tag") {
          theTagKeys += theKeyIDsString;
        } else {
          theCategoryKeys += theKeyIDsString;
        }
      } // Check if any of the key strings is empty and set it to -1,
      // otherwise trim the last | off the end;


      if (theTagKeys == "") {
        theTagKeys = "-1";
      }

      if (theCategoryKeys == "") {
        theCategoryKeys = "-1";
      }
      /*
          Now we have a list of categories and tags to key on (from all sections we
          depend on. We are ready to construct a url to send to the refiner.
      */


      if (theTagKeys !== "-1" || theCategoryKeys !== "-1") {
        var theURL = gc_BranchPath + '/--ajax-browser-filter-refiner/';
        theURL += theChildren[i].getSectionID() + "/"; //what is the ID of the section we're updating

        theURL += theChildren[i].getSectionType() + "/"; //what type of items are we retrieving (cats or tags)

        theURL += theChildren[i].getChannelID() + "/"; //what channel are we looking at

        theURL += theChildren[i].getGroupID() + "/"; //what is the group (cat or tag) that we are filtering

        theURL += theCategoryKeys + "/"; //what are the categories we have to match

        theURL += theTagKeys + "/"; //what are the tags we have to match

        $.get(theURL, function (data) {
          var theDependent = JSON.parse(data);
          thePlayer.browserTool.processDependentFilterSection(theDependent);
        });
      } else {
        this.restoreFilterSection(theChildren[i].getSectionID());
      }
    }
  };

  this.processDependentFilterSection = function (dependentObject) {
    var theIDs = dependentObject.ids;
    var theSectionID = dependentObject.sectionID;
    var theInputs = $('#browserFilterSection-' + theSectionID).find('input:checkbox');

    for (var i = 0; i < theInputs.length; i++) {
      var theInputID = $(theInputs[i]).val();
      var theIndex = theIDs.indexOf(parseInt(theInputID));

      if (theIndex == -1) {
        $(theInputs[i]).prop('checked', false);
        $(theInputs[i]).closest('li').toggleClass('hidden', true);
        $(theInputs[i]).closest('li').toggleClass('visible', false);
      } else {
        //console.log("Input WAS found in matching IDs");
        $(theInputs[i]).closest('li').toggleClass('hidden', false);
        $(theInputs[i]).closest('li').toggleClass('visible', true);
      }
    }

    var theFilters = $('#browserFilterSection-' + theSectionID).find('li.filter.visible');

    if (theFilters.length == 0) {
      $('#browserFilterSection-' + theSectionID).closest('.accordion-item').toggleClass('has-filters', false);
      $('#browserFilterSection-' + theSectionID).closest('.accordion-item').hide();
    } else {
      $('#browserFilterSection-' + theSectionID).closest('.accordion-item').show();
    }

    this.dependentFinishedUpdating(theSectionID);
  };

  this.dependentFinishedUpdating = function (strSectionID) {
    this.n_DependentsToProcess--;
  };

  this.waitForDependentsToFinishUpdating = function () {
    if (this.n_DependentsToProcess > 0) {
      this.n_UpdateTimer = setTimeout(function () {
        thePlayer.browserTool.waitForDependentsToFinishUpdating();
      }, 100);
      return;
    }

    clearTimeout(this.n_UpdateTimer);
    this.n_UpdateTimer = -1;
    this.submitSearch();
    this.refreshActiveFilters();
  };

  this.restoreFilterSection = function (strSectionID) {
    var theSection = $("#browserFilterSection-" + strSectionID);
    var theInputs = $(theSection).find('input:checkbox');

    for (var i = 0; i < theInputs.length; i++) {
      $(theInputs[i]).closest('li').toggleClass('hidden', false);
      $(theInputs[i]).closest('li').toggleClass('visible', true);
    }

    $(theSection).closest('.accordion-item').show();
    this.dependentFinishedUpdating(strSectionID);
  };
  /*****************************************
   *************   Fav Forms Loading  ************
   *****************************************/


  this.reloadResultsFavoritesForms = function () {
    var theResults = $('.browser-result-fav-wrapper.fav-enabled');
    var theIDs = "";

    for (var i = 0; i < theResults.length; i++) {
      $(theResults[i]).empty();
    }

    this.loadResultsFavoritesForms();
  };

  this.loadResultsFavoritesForms = function () {
    var theResults = $('.browser-result-fav-wrapper.fav-enabled');
    var theIDs = "";

    for (var i = 0; i < theResults.length; i++) {
      theIDs += $(theResults[i]).data('entry-id');

      if (i != theResults.length - 1) {
        theIDs += "|";
      }
    }

    var theURL = gc_BranchPath + "/--ajax-browser-load-favorite-forms/";
    theURL += theIDs;
    $.get(theURL, function (data) {
      var theFavorites = JSON.parse(data);
      thePlayer.browserTool.pushResultsFavoritesForms(theFavorites);
    });
  };

  this.pushResultsFavoritesForms = function (arrFavorites) {
    var theForms = arrFavorites.formsArray;

    for (var i = 0; i < theForms.length; i++) {
      var theEntryID = theForms[i].itemID;
      var theItem = $('#favWrapper-' + theEntryID);
      $(theItem).html(theForms[i].itemForm);
      var theMetaID = "#browserResultItem-" + theEntryID;

      if (theForms[i].itemChapters != "" && theForms[i].itemChapters != "0") {
        $(theMetaID).toggleClass('has-chapters', true);
      } else {
        $(theMetaID).toggleClass('has-chapters', false);
      }

      if (theForms[i].itemLoops != "" && theForms[i].itemLoops != "0") {
        $(theMetaID).toggleClass('has-loops', true);
      } else {
        $(theMetaID).toggleClass('has-loops', false);
      }

      if (theForms[i].itemUserLoops != "" && theForms[i].itemUserLoops != "0") {
        $(theMetaID).toggleClass('has-user-loops', true);
      } else {
        $(theMetaID).toggleClass('has-user-loops', false);
      }
    }
  };

  this.initializeProcessing = function () {
    //console.log("Initializing Processing.");
    this.b_IsProcessing = true;
    $('#browser-wrapper').toggleClass("updating", true);
  };

  this.isProcessing = function () {
    return this.b_IsProcessing;
  };

  this.finalCleanup = function () {
    // this function should only be called when all operations are done
    // 1. Filters are loaded.
    // 2. Results are loaded
    //console.log("Finished Processing.");
    this.b_IsProcessing = false;
    $('#browser-wrapper').toggleClass("updating", false);
  };

  this.toggleFavoriteInBrowser = function (sender) {
    //console.log('Submitting Favorite');
    var formID = $(sender).closest('form.submitFavoriteForm');
    courseID = $(formID).attr('data-id');
    formData = $(formID).serialize();
    badgeWrapperID = $(formID).closest('.browser-result-fav-wrapper').attr('id');
    $('#' + badgeWrapperID + ' button').html('<i class="fa fa-spinner fa-spin fa-2x"></i>');
    $.ajax({
      type: 'POST',
      url: $(formID).attr('action'),
      data: formData
    }).done(function (response) {
      $('#' + badgeWrapperID).load(gc_BranchPath + "/--ajax-browser-favorite-entry/" + courseID);
    });
  };
  /*****************************************
   *****   Misc Display Functions  *********
   *****************************************/


  this.spinner = function (elementID) {
    var strSpinner = "<div id='spinner'><i class='fa fa-spinner fa-spin fa-2x'></i></div>";
    $('#' + elementID).html(strSpinner);
  };

  this.showResultsLoading = function () {
    this.spinner("results");
  };

  this.browserDisplayInstructions = function (nCode) {
    var strMessage = "<div class='browser-message'>";

    if (nCode == 0) {
      // Nothing selected
      strMessage += "Pick a type of content from the choices above.";
    } else if (nCode == 1) {
      // Tag Group Selected
      strMessage += "Choose a tag.";
    } else if (nCode == 2) {
      // Category Group Selected
      strMessage += "Choose a category.";
    } else if (nCode == 3) {
      // Search Selected
      strMessage += "Enter a search keyword.";
    }

    strMessage += "</div>";
    $('#results').html(strMessage);
  };
};

var BrowserFilterSectionList =
/*#__PURE__*/
function () {
  function BrowserFilterSectionList(browserTool) {
    _classCallCheck(this, BrowserFilterSectionList);

    this.theBrowser = browserTool;
    this.a_Sections = [];
  }

  _createClass(BrowserFilterSectionList, [{
    key: "reset",
    value: function reset() {
      this.a_Sections = [];
    }
  }, {
    key: "addSection",
    value: function addSection(objSection) {
      this.a_Sections.push(objSection);
    }
  }, {
    key: "computeSectionFamilies",
    value: function computeSectionFamilies() {
      // First, compute parents based on Parents ID array used when creating each section.
      for (var i = 0; i < this.a_Sections.length; i++) {
        var theSection = this.a_Sections[i];
        var theParentIDs = theSection.getParentIDs();

        for (var j = 0; j < theParentIDs.length; j++) {
          theSection.addParent(this.getSectionByID(theParentIDs[j]));
        }
      } //Now that parents are all setup, add the children.


      for (var _i = 0; _i < this.a_Sections.length; _i++) {
        var _theSection = this.a_Sections[_i];

        var theParents = _theSection.getParents();

        for (var _j = 0; _j < theParents.length; _j++) {
          theParents[_j].addChild(_theSection);
        }
      }
    }
  }, {
    key: "getSectionByID",
    value: function getSectionByID(strSectionID) {
      var theMatchingIndex = -1;

      for (var i = 0; i < this.a_Sections.length; i++) {
        if (this.a_Sections[i].getSectionID() == strSectionID) {
          theMatchingIndex = i;
          break;
        }
      }

      return this.a_Sections[theMatchingIndex];
    } // any checked inputs into an array with that section

  }, {
    key: "rebuildFilterSectionKeys",
    value: function rebuildFilterSectionKeys() {
      for (var i = 0; i < this.a_Sections.length; i++) {
        this.a_Sections[i].rebuildKeys();
      }
    }
  }]);

  return BrowserFilterSectionList;
}();

var BrowserFilterSection =
/*#__PURE__*/
function () {
  function BrowserFilterSection() {
    _classCallCheck(this, BrowserFilterSection);

    this.str_SectionID = "";
    this.str_SectionType = "";
    this.str_ChannelID = 0;
    this.str_GroupID = "";
    this.sectionDOMID = "";
    this.a_ParentIDs = [];
    this.a_Children = []; //sections that key off of me

    this.a_Parents = []; // sections that I key off of

    this.a_Keys = [];
  }

  _createClass(BrowserFilterSection, [{
    key: "reset",
    value: function reset() {
      this.str_SectionType = "";
      this.str_ChannelID = 0;
      this.str_GroupID = "";
      this.sectionDOMID = "";
      this.a_ParentIDs = [];
      this.a_Children = []; //sections that key off of me

      this.a_Parents = []; // sections that I key off of

      this.a_Keys = [];
    }
  }, {
    key: "setSectionID",
    value: function setSectionID(strID) {
      this.str_SectionID = strID;
    }
  }, {
    key: "setSectionDOMID",
    value: function setSectionDOMID(strID) {
      this.sectionDOMID = strID;
    }
  }, {
    key: "setSectionType",
    value: function setSectionType(strType) {
      this.str_SectionType = strType;
    }
  }, {
    key: "setChannelID",
    value: function setChannelID(strID) {
      this.str_ChannelID = strID;
    }
  }, {
    key: "setGroupID",
    value: function setGroupID(strID) {
      this.str_GroupID = strID;
    }
  }, {
    key: "getSectionID",
    value: function getSectionID() {
      return this.str_SectionID;
    }
  }, {
    key: "getSectionDOMID",
    value: function getSectionDOMID() {
      return this.sectionDOMID;
    }
  }, {
    key: "getSectionType",
    value: function getSectionType() {
      return this.str_SectionType;
    }
  }, {
    key: "getChannelID",
    value: function getChannelID() {
      return this.str_ChannelID;
    }
  }, {
    key: "getGroupID",
    value: function getGroupID() {
      return this.str_GroupID;
    }
  }, {
    key: "setParentIDs",
    value: function setParentIDs(aParentIDs) {
      this.a_ParentIDs = aParentIDs;
    }
  }, {
    key: "getParentIDs",
    value: function getParentIDs() {
      return this.a_ParentIDs;
    }
  }, {
    key: "getChildren",
    value: function getChildren() {
      return this.a_Children;
    }
  }, {
    key: "addChild",
    value: function addChild(objChild) {
      this.a_Children.push(objChild);
    }
  }, {
    key: "getParents",
    value: function getParents() {
      return this.a_Parents;
    }
  }, {
    key: "addParent",
    value: function addParent(objParent) {
      this.a_Parents.push(objParent);
    }
  }, {
    key: "getKeyString",
    value: function getKeyString() {
      var theKeyString = "";

      for (var i = 0; i < this.a_Keys.length; i++) {
        theKeyString += this.a_Keys[i];

        if (i < this.a_Keys.length - 1) {
          theKeyString += "|";
        }
      }

      return theKeyString;
    }
  }, {
    key: "resetKeys",
    value: function resetKeys() {
      this.a_Keys = [];
    }
  }, {
    key: "addKey",
    value: function addKey(strKey) {
      this.a_Keys.push(strKey);
    }
  }, {
    key: "rebuildKeys",
    value: function rebuildKeys() {
      this.resetKeys();
      var tmpInputList = $(this.sectionDOMID).find('input:checkbox:checked');

      for (var i = 0; i < tmpInputList.length; i++) {
        this.addKey($(tmpInputList[i]).val());
      }
    }
  }]);

  return BrowserFilterSection;
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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","--js-ProPlayerBrowser.js"], null)
//# sourceMappingURL=/--js-ProPlayerBrowser.7b64e2ff.js.map