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
})({"--js-ProPlayerCommentManager.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProPlayerCommentsManager = function ProPlayerCommentsManager(parentWraperDivID) {
  _classCallCheck(this, ProPlayerCommentsManager);

  this.n_SegmentID = 0;
  this.n_PackageID = 0;
  this.commentsLoadedOnce = false;
  this.b_FilterComments = false;
  this.str_CommentsListWrapperID = "#" + parentWraperDivID;

  this.reset = function () {
    //console.log("Resetting Comments Data");
    this.n_SegmentID = 0;
    this.n_PackageID = 0;
    this.commentsLoadedOnce = false;
    this.b_FilterComments = false;
    $(this.str_CommentsListWrapperID).empty();
  };

  this.setNewPackageAndSegmentIDs = function (nPackageID, nSegmentID) {
    this.reset();
    this.n_PackageID = nPackageID;
    this.n_SegmentID = nSegmentID;
  };

  this.setNewPackageID = function (nPackageID) {
    this.reset();
    this.n_PackageID = nPackageID;
  };

  this.setNewSegmentID = function (nSegmentID) {
    this.n_SegmentID = nSegmentID;
  };

  this.setAuthorCommentFilter = function (bFilter) {
    if (bFilter != this.b_FilterComments) {
      this.b_FilterComments = bFilter;
      this.reloadComments();
    }
  };

  this.reloadComments = function () {
    this.commentsLoadedOnce = true;

    if (this.n_PackageID != '0') {
      $(this.str_CommentsListWrapperID).empty();
      thePlayer.spinner(this.str_CommentsListWrapperID);
      var theURL = gc_BranchPath + '/--ajax-load-comments/';
      theURL += "?package_id=" + this.n_PackageID;

      if (this.n_SegmentID !== "0") {
        theURL += '&segment_id=' + this.n_SegmentID;
      } else {
        theURL += '&segment_id=-1';
      }

      if (this.b_FilterComments) {
        theURL += '&author=yes';
      } else {
        theURL += '&author=no';
      }

      $(this.str_CommentsListWrapperID).load(theURL, function () {
        var cmtList = $('.cmt-wrapper.level-0');

        for (var i = 0; i < cmtList.length; i++) {
          var theKids = $(cmtList[i]).find('li.level-1');

          if (theKids.length > 0) {
            var maxTime = 0;

            for (var j = 0; j < theKids.length; j++) {
              var theTime = $(theKids[j]).data('date');
              maxTime = Math.max(maxTime, theTime);
            }

            $(cmtList[i]).attr('data-last-update', maxTime);
          } else {
            var theTime = $(cmtList[i]).data('date');
            $(cmtList[i]).attr('data-last-update', theTime);
          }
        }

        tinysort('ul#cmts-list>li', {
          data: 'last-update',
          order: 'desc'
        });
        $('#ask-button').toggleClass('disabled', false);
      });
    } else {
      $('#ask-button').toggleClass('disabled', true);
    }
  };

  this.loadMoreComments = function () {
    var currentOffset = parseInt($('#cmts-list').attr('data-offset')); //console.log('Offset is currently ' + currentOffset);

    currentOffset += 2;
    var nextURL = gc_BranchPath + "/--ajax-comment-list/" + this.n_PackageID + "/" + currentOffset;
    $.get(nextURL, function (data) {
      $('#cmts-list').attr('data-offset', currentOffset);
      $("#cmts-list").append(data);
    });
  };
  /*****************************************
  **********   Comment Functions  **********
  *****************************************/


  this.replyToComment = function (nCommentID) {
    if (nCommentID > 0) {
      var theFormID = "comment-" + nCommentID + "-form";
      var theForm = "<div class='comment-reply-form thread-reply-form' id='" + theFormID + "'></div>";
      var theReplyDiv = '#cmt-' + nCommentID + '-reply-wrapper';
      $(theReplyDiv).after(theForm);
      $('#' + theFormID).html('<div class="text-center"><i class="fa fa-2x fa-spinner fa-spin"></i></div>');
      var theFormURL = gc_BranchPath + "/--ajax-load-comment-form/?entry_id=" + this.n_PackageID;
      theFormURL += "&comment_id=" + nCommentID;

      if (this.n_SegmentID > 0) {
        theFormURL += "&segment_id=" + this.n_SegmentID;
      }

      $('#' + theFormID).load(theFormURL, function () {
        $('#' + theFormID + ' form textarea').focus();
      });
      $('#comment-' + nCommentID + '-reply-button').toggleClass('disabled', true);
    } else {
      var theFormID = "comment-0-form";
      var theForm = "<div class='comment-reply-form' id='comment-0-form'></div>";
      $('#add-cmt-wrapper').after(theForm);
      $('#' + theFormID).html('<div class="text-center"><i class="fa fa-2x fa-spinner fa-spin"></i></div>');
      var theFormURL = gc_BranchPath + "/--ajax-load-comment-form/?entry_id=" + this.n_PackageID;

      if (this.n_SegmentID > 0) {
        theFormURL += "&segment_id=" + this.n_SegmentID;
      }

      $('#' + theFormID).load(theFormURL, function () {
        $('#comment-0-form form textarea').focus();
      });
      $('#ask-button').toggleClass('disabled', true);
      $('#no-questions').toggle(false);
    }
  };

  this.submitThreadedCmt = function (sender) {
    $(sender).html('<i class="fa fa-spinner fa-spin"></i> ');
    var theForm = $(sender).closest('form');
    formData = $(theForm).serialize();
    $.ajax({
      type: 'POST',
      url: $(theForm).attr('action'),
      data: formData
    }).done(function (response) {
      thePlayer.commentsManager.reloadComments();
    });
  };

  this.deleteCmtForm = function (nCommentID) {
    if (nCommentID) {
      var theCommentID = nCommentID;
      var replyWrapperID = '#comment-' + theCommentID + '-form';
      $(replyWrapperID).remove();
      $('#comment-' + nCommentID + '-reply-button').toggleClass('disabled', false);
    } else {
      $('#comment-0-form').remove();
      $('#ask-button').toggleClass('disabled', false);

      if ($('#no-questions') != undefined) {
        $('#no-questions').toggle(true);
      }
    }
  };

  this.subscribeAction = function (sender) {
    $.ajax({
      type: 'POST',
      url: $(sender).attr('data-action')
    }).done(function (response) {
      thePlayer.commentsManager.reloadComments();
    });
  };

  this.updateCommentFormCharacterCount = function (sender) {
    var text_length = $(sender).val().length;
    var text_remaining = 500 - text_length;
    var updateDiv = $(sender).siblings('.comment-character-counter')[0];
    $(updateDiv).html(text_remaining + ' characters remaining');
  };

  this.toggleCmtReplies = function (nCommentID) {
    $('#comment-' + nCommentID + '-wrapper').toggleClass('expanded');
  };

  this.deleteCmt = function (nCommentID, strURL) {
    $.post(strURL, {
      status: "close",
      comment_id: nCommentID
    }, function (data) {
      thePlayer.commentsManager.reloadComments();
    });
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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","--js-ProPlayerCommentManager.js"], null)
//# sourceMappingURL=/--js-ProPlayerCommentManager.6690890a.js.map