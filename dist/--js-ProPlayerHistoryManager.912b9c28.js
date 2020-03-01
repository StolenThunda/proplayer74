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
})({"--js-ProPlayerHistoryManager.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProPlayerHistoryManager = function ProPlayerHistoryManager(strHistoryListWrapperID) {
  _classCallCheck(this, ProPlayerHistoryManager);

  this.str_ActiveSegmentTitle = "";
  this.str_ActiveSegmentURL = "";
  this.n_ActiveSegmentEntryID = 0;
  this.str_ActiveSegmentFullName = "";
  this.a_ResumeItems = {};
  this.str_HistoryListWrapperID = "#" + strHistoryListWrapperID;
  this.str_ChannelName = "";
  this.n_PackageID = 0;
  this.arrayHistoryItems = {};
  this.objCurrentHistoryItem = {
    url: "",
    title: "",
    name: "",
    channel: ""
  };

  this.clearHistory = function () {
    this.arrayHistoryItems = [];
    $('#historyList li').remove();
    historyString = "<li class='sidebar-list-item'><span>No recently watched items are available.</span></li>";
    $('#historyList').html(historyString);
    $('#clearHistoryButton').toggle(true);
  };

  this.reset = function () {
    $(str_HistoryListWrapperID).empty();
  };

  this.addHistoryItem = function (strPackageID, strSegmentID, strPackageTitle, strPackageChannel, strSegmentTitle, strType) {
    //console.log("Attempting to add history item");
    aHistoryItems = JSON.parse(localStorage.getItem('proPlayerHistory'));

    if (aHistoryItems === null) {
      aHistoryItems = [];
    }

    var bMatchFound = false;
    var nMatchIndex = 0;

    for (var i = 0; i < aHistoryItems.length; i++) {
      if (aHistoryItems[i].packageID == strPackageID) {
        bMatchFound = true;
        nMatchIndex = i;
        break;
      }
    }

    if (bMatchFound) {
      aHistoryItems.splice(nMatchIndex, 1);
    }

    var newHistoryItem = {
      packageTitle: strPackageTitle,
      packageChannel: strPackageChannel,
      segmentTitle: strSegmentTitle,
      packageID: strPackageID,
      segmentID: strSegmentID,
      type: strType
    };
    aHistoryItems.unshift(newHistoryItem);
    localStorage.setItem('proPlayerHistory', JSON.stringify(aHistoryItems));
  };
  /*
      this.reloadHistory()
      {
          var historyVersion = Cookies.get('historyVersion');
          if(history == undefined)
          {
              Cookies.remove('recentlyViewed');
          }
          else
          {
              this.arrayHistoryItems = Cookies.getJSON('recentlyViewed');
              if(this.arrayHistoryItems == undefined)
              {
                  this.arrayHistoryItems = [];
              }
              
              //populate current item object
              this.objCurrentHistoryItem['url'] = this.str_ActiveSegmentURL;
              this.objCurrentHistoryItem['packageID'] = this.str_ActiveSegmentURL;
              this.objCurrentHistoryItem['title'] = this.str_ActiveSegmentTitle;
              this.objCurrentHistoryItem['name'] = this.str_ActiveSegmentFullName;
              if(	this.str_ChannelName  == 'Pro Player Packages' )
              {
                  
                  this.objCurrentHistoryItem['channel'] = "Courses";
              }
              else
              {
                  this.objCurrentHistoryItem['channel'] = this.str_ChannelName;
              }
              
  
              var historyString = "";
              if( this.arrayHistoryItems.length > 0)
              {
                  $('#clearHistoryButton').toggle(true);
                  for(let  var i = 0; i < this.arrayHistoryItems.length; i++)
                  {
                      if(this.arrayHistoryItems[i]['channel'] == "Pro Player Packages")
                      {
                          this.arrayHistoryItems[i]['channel'] = "Courses";
                      }
                      historyItem = this.arrayHistoryItems[i];
                      historyString += '<li class="sidebar-list-item history"><a href="/';
                      historyString += historyItem['url'] + '">';
                      
                      historyString += '<span class="channel">' + historyItem['channel'] + '</span>';
                      historyString += '<span class="title">' + historyItem['title'] + '</span>';
                      historyString += '<span class="name">' + historyItem['name'] + '</span>';
                      historyString += '</a></li>';
                  }
                  $('#historyList').html( historyString );
                  
                  if(this.n_ActiveSegmentEntryID != 0 && this.arrayHistoryItems[0]["url"] != this.objCurrentHistoryItem["url"])
                  {
                      this.arrayHistoryItems.unshift(this.objCurrentHistoryItem);
                      if(this.arrayHistoryItems.length > 10)
                      {
                          this.arrayHistoryItems.pop();
                      }
                      Cookies.set('recentlyViewed', this.arrayHistoryItems, { expires: 365 });
                  }
              }
              else
              {
                  historyString = "<li class='sidebar-list-item'><span>No recently watched items are available.</span></li>";
                  $(str_HistoryListWrapperID).html( historyString );
                  
                  if(this.n_ActiveSegmentEntryID  != 0)
                  {
                      this.arrayHistoryItems = [];
                      this.arrayHistoryItems[0] = this.objCurrentHistoryItem;
                      Cookies.set('recentlyViewed', this.arrayHistoryItems, { expires: 365 });
                  }
              }
      }
      
      this.saveCookieValues()
      {
          if(this.n_ActiveSegmentEntryID != 0)
          {
              this.a_ResumeItems = Cookies.getJSON('savedResumeItems');
              if(this.a_ResumeItems == undefined)
              {
                  this.a_ResumeItems = {};
              }
              if( this.n_PackageID != 0)
              {
                  this.a_ResumeItems[this.n_PackageID] = this.n_ActiveSegmentEntryID;
                  Cookies.set('savedResumeItems', this.a_ResumeItems, { expires: 365 });
              }
          }
          
      }
      */


  this.getLastHistoryItem = function () {
    var historyItems = JSON.parse(localStorage.getItem('proPlayerHistory'));

    if (historyItems !== null) {
      //console.log("Returning last history item...");
      return historyItems[0];
    } else {
      return null;
    }
  };
};
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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","--js-ProPlayerHistoryManager.js"], null)
//# sourceMappingURL=/--js-ProPlayerHistoryManager.912b9c28.js.map