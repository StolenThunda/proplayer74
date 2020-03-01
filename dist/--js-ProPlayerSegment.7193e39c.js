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
})({"--js-ProPlayerSegment.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProPlayerSegment = function ProPlayerSegment() {
  _classCallCheck(this, ProPlayerSegment);

  this.b_IsLoaded = false;
  this.str_Title = "";
  this.str_SegmentType = ""; // Must be "entry" or "other"

  this.str_PrimaryMediaType = ""; // must be vimeo, youtube, mp3, soundslice, url

  this.str_EntryID = ""; //this must be a valid TXBA Media Segment Entry ID

  this.str_VimeoCode = "";
  this.str_YouTubeCode = "";
  this.str_MP3Filename = "";
  this.str_SoundSliceCode = "";
  this.str_PDFFilename = "";
  this.str_MediaURL = "";
  this.f_MediaStartTime = 0;
  this.str_GPXFilename = "";
  this.str_DisplayName = "";
  this.str_FullDisplayName = "";
  this.str_FacebookUser = "";
  this.str_FacebookVideoCode = "";
  this.str_InstagramID = "";
  this.str_HTMLContent = "";
  this.a_ChaptersArray = [];
  this.a_LoopsArray = [];
  this.str_YTMatchingEntryID = "";
  this.str_Description = "";
  this.a_UserLoopEntryIDs = [];

  this.setIsLoaded = function (bLoaded) {
    this.b_IsLoaded = bLoaded;
  };

  this.setEntryID = function (strEntryID) {
    this.str_EntryID = strEntryID;
  };

  this.setYTMatchingEntryID = function (strYTMatchingEntryID) {
    this.str_YTMatchingEntryID = strYTMatchingEntryID;
  };

  this.setSegmentType = function (strType) {
    this.str_SegmentType = strType;
  };

  this.setPrimaryMediaType = function (strMediaType) {
    this.str_PrimaryMediaType = strMediaType;
  };

  this.setVimeoCode = function (strVimeoCode) {
    this.str_VimeoCode = strVimeoCode;
  };

  this.setYouTubeCode = function (strYouTubeCode) {
    this.str_YouTubeCode = strYouTubeCode;
  };

  this.setMP3Filename = function (strMP3Filename) {
    this.str_MP3Filename = strMP3Filename;
  };

  this.setSoundSliceCode = function (strSoundSliceCode) {
    this.str_SoundSliceCode = strSoundSliceCode;
  };

  this.setPDFFilename = function (strPDFFilename) {
    this.str_PDFFilename = strPDFFilename;
  };

  this.setMediaURL = function (strURL) {
    this.str_URL = strURL;
  };

  this.setGPXFilename = function (strGPXFilename) {
    this.str_GPXFilename = strGPXFilename;
  };

  this.setTitle = function (strTitle) {
    this.str_Title = strTitle;
  };

  this.setDisplayName = function (strDisplayName) {
    this.str_DisplayName = strDisplayName;
  };

  this.setFullDisplayName = function (strFullDisplayName) {
    this.str_FullDisplayName = strFullDisplayName;
  };

  this.setChaptersArray = function (aChaptersArray) {
    this.a_ChaptersArray = aChaptersArray;
  };

  this.setLoopsArray = function (aLoopsArray) {
    this.a_LoopsArray = aLoopsArray;
  };

  this.setFacebookUser = function (strUser) {
    this.str_FacebookUser = strUser;
  };

  this.setFacebookVideoCode = function (strCode) {
    this.str_FacebookVideoCode = strCode;
  };

  this.setInstagramID = function (strID) {
    this.str_InstagramID = strID;
  };

  this.setHTMLContent = function (strHTML) {
    this.str_HTMLContent = strHTML;
  };

  this.setMediaStartTime = function (fTime) {
    this.f_MediaStartTime = fTime;
  };

  this.setDescription = function (strDescription) {
    this.str_Description = strDescription;
  };

  this.isLoaded = function () {
    return this.b_IsLoaded;
  };

  this.getEntryID = function () {
    return this.str_EntryID;
  };

  this.getYTMatchingEntryID = function () {
    return this.str_YTMatchingEntryID;
  };

  this.getSegmentType = function () {
    return this.str_SegmentType;
  };

  this.getPrimaryMediaType = function () {
    return this.str_PrimaryMediaType;
  };

  this.getVimeoCode = function () {
    return this.str_VimeoCode;
  };

  this.getYouTubeCode = function () {
    return this.str_YouTubeCode;
  };

  this.getMP3Filename = function () {
    return this.str_MP3Filename;
  };

  this.getSoundSliceCode = function () {
    return this.str_SoundSliceCode;
  };

  this.getPDFFilename = function () {
    return this.str_PDFFilename;
  };

  this.getMediaURL = function () {
    return this.str_URL;
  };

  this.getGPXFilename = function () {
    return this.str_GPXFilename;
  };

  this.getTitle = function () {
    return this.str_Title;
  };

  this.getDisplayName = function () {
    return this.str_DisplayName;
  };

  this.getFullDisplayName = function () {
    return this.str_FullDisplayName;
  };

  this.getChaptersArray = function () {
    return this.a_ChaptersArray;
  };

  this.getLoopsArray = function () {
    return this.a_LoopsArray;
  };

  this.getFacebookUser = function () {
    return this.str_FacebookUser;
  };

  this.getFacebookVideoCode = function () {
    return this.str_FacebookVideoCode;
  };

  this.getInstagramID = function () {
    return this.str_InstagramID;
  };

  this.getHTMLContent = function () {
    return this.str_HTMLContent;
  };

  this.getMediaStartTime = function () {
    return this.f_MediaStartTime;
  };

  this.getDescription = function () {
    return this.str_Description;
  };

  this.resetAll = function () {
    this.b_IsLoaded = false;
    this.str_Title = "";
    this.str_SegmentType = ""; // Must be "entry" or "other"

    this.str_PrimaryMediaType = ""; // must be vimeo, youtube, mp3, soundslice, url

    this.str_EntryID = ""; //this must be a valid TXBA Media Segment Entry ID

    this.str_YTMatchingEntryID = "";
    this.str_VimeoCode = "";
    this.str_YouTubeCode = "";
    this.str_MP3Filename = "";
    this.str_SoundSliceCode = "";
    this.str_PDFFilename = "";
    this.str_MediaURL = "";
    this.str_GPXFilename = "";
    this.str_StartTime = "";
    this.str_DisplayName = "";
    this.str_FullDisplayName = "";
    this.str_FacebookUser = "";
    this.str_FacebookVideoCode = "";
    this.str_HTMLContent = "";
    this.a_ChaptersArray.length = 0;
    this.a_LoopsArray.length = 0;
    this.str_Description = "";
  };

  this.allowUserData = function () {
    var bAllowUserData = false;

    if (this.getSegmentType() == "entry" && //It must be an entry
    this.getEntryID() != "" && ( //the entryID must be set.
    this.getPrimaryMediaType() == "vimeo" || //It must either be Vimeo
    this.getPrimaryMediaType() == "youtube" || //or YouTube
    this.getPrimaryMediaType() == "mp3")) //or an MP3
      {
        bAllowUserData = true;
      }

    return bAllowUserData;
  };

  this.allowChapters = function () {
    var bAllowUserData = false;

    if (this.getSegmentType() == "entry" && //It must be an entry
    this.getEntryID() != "" && ( //the entryID must be set.
    this.getPrimaryMediaType() == "vimeo" || //It must either be Vimeo
    this.getPrimaryMediaType() == "youtube" || //or YouTube
    this.getPrimaryMediaType() == "mp3")) //or an MP3
      {
        bAllowUserData = true;
      }

    return bAllowUserData;
  };

  this.allowLoops = function () {
    var bAllowUserData = false;

    if (this.getSegmentType() == "entry" && //It must be an entry
    this.getEntryID() != "" && ( //the entryID must be set.
    this.getPrimaryMediaType() == "vimeo" || //It must either be Vimeo
    this.getPrimaryMediaType() == "youtube" || //or YouTube
    this.getPrimaryMediaType() == "mp3")) //or an MP3
      {
        bAllowUserData = true;
      }

    return bAllowUserData;
  };

  this.allowImport = function () {
    var bAllowImport = false;

    if (this.getSegmentType() == "other" && //It must NOT be an entry
    this.getEntryID() == "" && //the entryID must be blank
    this.getPrimaryMediaType() == "youtube") //it MUST be a Youtube video.
      {
        bAllowImport = true;
      }

    return bAllowImport;
  };

  this.inferMediaType = function () {
    if (this.getVimeoCode() !== "") {
      this.setPrimaryMediaType("vimeo");
    } else if (this.getYouTubeCode() !== "") {
      this.setPrimaryMediaType("youtube");
    } else if (this.getFacebookVideoCode() !== "") {
      this.setPrimaryMediaType("facebook");
    } else if (this.getInstagramID() !== "") {
      this.setPrimaryMediaType("instagram");
    } else if (this.getMP3Filename() !== "") {
      this.setPrimaryMediaType("mp3");
    } else if (this.getSoundSliceCode() !== "") {
      this.setPrimaryMediaType("soundslice");
    } else if (this.getPDFFilename() !== "") {
      this.setPrimaryMediaType("pdf");
    } else if (this.getMediaURL() !== "") {
      this.setPrimaryMediaType("url");
    } else {
      this.setPrimaryMediaType("html");
    }
  };

  this.setUserLoopsEntryIDsFromString = function (strUserLoopEntryIDs) {
    var theIDs = strUserLoopEntryIDs.split("|");

    for (var i = 0; i < theIDs.length; i++) {
      if (theIDs[i] !== "") {
        this.a_UserLoopEntryIDs.push(theIDs[i]);
      }
    }
  };

  this.getUserLoopsEntryIDs = function () {
    return this.a_UserLoopEntryIDs;
  };

  this.getUserLoopEntryIDsCount = function () {
    return this.a_UserLoopEntryIDs.length;
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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","--js-ProPlayerSegment.js"], null)
//# sourceMappingURL=/--js-ProPlayerSegment.7193e39c.js.map