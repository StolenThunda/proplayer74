/*jslint this:true, white:true */
function ProPlayer() {
    'use strict';
    this.gc_BranchPath = '/' + '{branch_path}';
    this.theMobileDetect = new MobileDetect(window.navigator.userAgent);

    // Top Level Objects
    this.browserTool = new ProPlayerBrowser("contentBrowser");
    this.favoritesManager = new ProPlayerFavoritesManager("favoritesList");
    this.historyManager = new ProPlayerHistoryManager("historyList");
    this.commentsManager = new ProPlayerCommentsManager("cmtList");
    this.loopsManager = new ProPlayerLoopsManager();
    this.userDataManager = new ProPlayerUserDataManager();
    this.thePackage = new ProPlayerPackage();
    this.theSegment = new ProPlayerSegment();
    this.theEngine = null;
    this.packageOverviewTemplate = '';
    this.strFavoritesListWrapperID = "favoritesList";
    this.strCommentsListWrapperID = "cmtList";
    this.spinnerDiv = '<div class="spinner"><i class="fa fa-spinner fa-spin"></i></div>';
    this.bPackageDataLoadingStarted = false;
    this.bPackageDataLoadingFinished = false;
    this.bSegmentDataLoadingStarted = false;
    this.bSegmentDataLoadingFinished = false;
    this.b_LoadingFinished = false;
    this.b_UpdateURL = false;
    this.b_KeepSidebarOpen = false;
    this.n_SidebarToggleTimerID = -1;
    /******************************/
    /* Interface callback functions */
    /******************************/

    this.initializeWithoutPackage = function(bUpdateURL) {
        this.resetEverything();
        this.mediaLoadDefaultPage();
        this.closeSidebar();
        this.pushSegmentDownloadsMenu();
        this.pushFullscreenButtonState();
        this.pushHomeButtonState();
        this.userDataManager.resetAll();
        this.favoritesManager.reloadFavorites();
        this.reattachKeyboardEvents();
        this.enableSidebarTabs();
        this.pushPackageTitle("TXBA Pro Player");
        this.pushSegmentTitle("Version 7.4 (Tony Branch)");
        if (bUpdateURL) {
            this.updateURL();
        }
    };

    /******************************/
    /***    All Reset Functions **/
    /******************************/

    this.resetEverything = function() {
        //first shut everything down and reset everything.
        this.toolsCloseToolWindow();
        this.resetPackage();
        this.resetSegment();
        this.resetLoadingFlags();
    };

    this.resetLoadingFlags = function() {
        this.bPackageDataLoadingFinished = false;
        this.bSegmentDataLoadingFinished = false;
        this.bPackageDataLoadingStarted = false;
        this.bSegmentDataLoadingStarted = false;
        this.b_LoadingFinished = false;
        this.b_UpdateURL = false;
    };
    this.resetPackageTitle = function() {
        this.pushPackageTitle("TXBA Pro Player");
        $("#proPlayerWrapper").toggleClass("has-info", false);
    };

    this.resetPlayerTitle = function() {
        this.resetPackageTitle("TXBA Pro Player");
        this.pushSegmentTitle("No Media Loaded");
        $("#proPlayerWrapper").toggleClass("has-info", false);
    };
    this.resetPackage = function() {
        this.thePackage.resetAll();
        this.resetPackageSections();
        this.resetPackageTitle();
        this.resetPackageOverview();
        this.closeInfoPane();
        this.commentsManager.reset();
        this.favoritesManager.reset();
    };

    this.resetPackageSections = function() {
        //console.log('Deleting segments list');
        $('#sectionList').empty();
        $('#sectionListEmpty').toggle(true);
    };

    this.resetSegment = function() {
        if (typeof this.theEngine != "undefined") {
            this.theEngine.prepareForDestruction();
            delete this.theEngine;
        }

        this.theSegment.resetAll();
        this.userDataManager.resetAll();
        $('#mediaWrapper').empty();
        this.resetSegmentChapters();
        this.resetSegmentLoops();
        this.resetSegmentTitle();
    };
    this.resetSegmentChapters = function() {
        $('#chapterList').empty();
        $('#chapterListEmpty').text("No segment loaded.");
        $('#chapterListEmpty').toggle(true);
    };

    this.resetSegmentLoops = function() {
        this.loopsManager.resetAll();
    };
    this.resetSegmentTitle = function() {
        this.pushSegmentTitle("&nbsp;");
    };
    this.resetSelectedSegment = function() {
        $('.sidebar-list-item.segment.active').toggleClass('active', false);
    };

    this.resetPackageOverview = function() {
        $('#packageOverviewWrapper').toggle(false);
        $('#packageOverviewWrapper').appendTo('body');

    };

    this.bailOut = function() {
        // When loading encounters an error, this is where it comes back to
        // We reset everything and go back to the homescreen.
        if (this.thePackage.getErrorMessage() !== "") {
            alert(this.thePackage.getErrorMessage());
        }
        this.initializeWithoutPackage();
    };


    /******************************************/
    /*********   All Opening Functions  ********/
    /*******************************************/


    this.openPackage = function(strPackageID, bUpdateURL) {
        this.resetEverything();
        this.b_UpdateURL = bUpdateURL;
        this.openSectionsSidebar();
        this.beginFetchPackageData(strPackageID);
        this.waitForPackageData(strPackageID);
    };

    this.openPackageWithSegment = function(strPackageID, strSegmentID, bUpdateURL) {
        this.resetEverything();
        this.b_UpdateURL = bUpdateURL;
        this.beginFetchPackageData(strPackageID);
        this.beginFetchSegmentData(strSegmentID);
        this.waitForPackageAndSegmentData();
    };

    this.openSegmentWithinCurrentPackage = function(strSegmentID, bUpdateURL) {
        //console.log("Opening segment: " + strSegmentID);
        this.resetPackageOverview();
        this.closeInfoPane();
        this.resetSegment();
        this.resetLoadingFlags();
        this.b_UpdateURL = bUpdateURL;
        this.beginFetchSegmentData(strSegmentID);
        this.waitForSegmentData();
    };

    this.openExternalYouTubeVideo = function(strYTCode, bUpdateURL) {
        this.resetEverything();
        this.b_UpdateURL = bUpdateURL;
        this.beginFetchYouTubeData(strYTCode);
        this.waitForYouTubeData();
    };

    this.openExternalFBVideo = function(strFBUserID, strFBVideoID, bUpdateURL) {
        //console.log("Opening FB Video for User/ID: " + strFBUserID + "," + strFBVideoID);
        this.resetEverything();
        this.b_UpdateURL = bUpdateURL;
        this.beginFetchFacebookData(strFBUserID, strFBVideoID);
        this.waitForFacebookData();
    };


    this.openExternalInstagramVideo = function(strInstagramID, bUpdateURL) {
        //console.log("Opening FB Video for User/ID: " + strFBUserID + "," + strFBVideoID);
        this.resetEverything();
        this.b_UpdateURL = bUpdateURL;
        this.beginFetchInstagramData(strInstagramID);
        this.waitForInstagramData();
    };


    this.openUnknownPackageType = function(packageOptions, bUpdateURL) {
        if (packageOptions.type == "entry") {
            this.openPackage(packageOptions.packageID, bUpdateURL);
        } else if (packageOptions.type == "youtube") {
            this.openExternalYouTubeVideo(packageOptions.packageID, bUpdateURL);
        } else if (packageOptions.type == "facebook") {
            this.openExternalFBVideo(packageOptions.fbUserID, packageOptions.fbVideoID, bUpdateURL);
        }
    };


    this.openUnknownPackageFromSegments = function(strSegment1, strSegment2, strSegment3, bUpdateURL) {
            if (strSegment1 === "") {
                this.initializeWithoutPackage(bUpdateURL);
            } else if (strSegment1 == "youtube") {
                this.openExternalYouTubeVideo(strSegment2, bUpdateURL);
                this.openSidebar();
            } else if (strSegment1 == "facebook") {
                this.openExternalFBVideo(strSegment2, strSegment3, bUpdateURL);
                this.openSidebar();
            } else {
                if (strSegment2 !== "") {
                    this.openPackageWithSegment(strSegment1, strSegment2, bUpdateURL);
                    this.openSidebar();
                } else {
                    this.openPackage(strSegment1, bUpdateURL);
                    this.openSidebar();
                }
            }

        };
        /*****************************************
         *************   Begin Loading Functions  ************
         *****************************************/
    this.beginFetchPackageData = function(strPackageID) {
        this.bPackageDataLoadingStarted = true;
        $.get(gc_BranchPath + '/--ajax-get-package-info/' + strPackageID, function(data) {
            let tempData = jQuery.parseJSON(data);
            if (tempData.packageError === "") {
                thePlayer.thePackage.setEntryID(tempData.packageID);
                thePlayer.thePackage.setTitle(tempData.packageTitle);
                thePlayer.thePackage.setChannelName(tempData.packageChannel);
                thePlayer.thePackage.setChannelShortName(tempData.packageChannelSlug);
                thePlayer.thePackage.setDate(tempData.packageDate);
                thePlayer.thePackage.setDefaultSegmentEntryID(tempData.packageDefaultSegmentID);
                thePlayer.thePackage.setDescription(tempData.packageDescription);
                thePlayer.thePackage.setOverview(tempData.packageOverview);
                thePlayer.thePackage.setImageURL(tempData.packageImage);
                thePlayer.thePackage.setSections(tempData.sections);
                thePlayer.thePackage.setTuning(tempData.packageTuning);
                thePlayer.thePackage.setLoaded(true);
                thePlayer.bPackageDataLoadingFinished = true;
            } else {
                thePlayer.thePackage.setLoaded(false);
                thePlayer.thePackage.setErrorMessage(tempData.packageError);
            }
        });

    };

    this.beginFetchSegmentData = function(strSegmentID) {
        //console.log("Beginning Fetch of segment data.");
        this.showMediaLoading();
        this.pushSelectedSegmentState(strSegmentID);
        this.bSegmentDataLoadingStarted = true;
        $.get(gc_BranchPath + '/--ajax-get-segment-info/' + strSegmentID, function(data) {
            //console.log("Finished loading segment info;");
            let tempData = jQuery.parseJSON(data);
            //console.log(tempData);
            thePlayer.theSegment.setEntryID(tempData.segmentEntryID);
            thePlayer.theSegment.setSegmentType("entry");
            thePlayer.theSegment.setVimeoCode(tempData.segmentVimeoCode);
            thePlayer.theSegment.setYouTubeCode(tempData.segmentYouTubeCode);
            thePlayer.theSegment.setMP3Filename(tempData.segmentMP3Filename);
            thePlayer.theSegment.setSoundSliceCode(tempData.segmentSoundSliceCode);
            thePlayer.theSegment.setPDFFilename(tempData.segmentPDFFilename);
            thePlayer.theSegment.setMediaURL(tempData.segmentURL);
            thePlayer.theSegment.setGPXFilename(tempData.segmentGPXFilename);
            thePlayer.theSegment.setTitle(tempData.segmentTitle);
            thePlayer.theSegment.setDisplayName(tempData.segmentDisplayName);
            thePlayer.theSegment.setFullDisplayName(tempData.segmentFullDisplayName);
            thePlayer.theSegment.setChaptersArray(tempData.chaptersArray);
            thePlayer.theSegment.setLoopsArray(tempData.loopsArray);
            thePlayer.theSegment.setMediaStartTime(tempData.mediaStartTime);
            thePlayer.theSegment.setHTMLContent(tempData.segmentHTML);
            thePlayer.theSegment.setDescription(tempData.segmentShortDescription);
            thePlayer.theSegment.setUserLoopsEntryIDsFromString(tempData.userLoopEntryIDs);
            thePlayer.theSegment.setIsLoaded(true);
            thePlayer.theSegment.inferMediaType();

            thePlayer.bSegmentDataLoadingFinished = true;
        });
    };

    this.beginFetchYouTubeData = function(strYTCode) {
        //segment info must be reset prior to calling this function.
        this.showMediaLoading();
        $.get(gc_BranchPath + '/--ajax-get-yt-info/' + strYTCode, function(data) {
            //console.log("Finished loading YT Info:");
            let tempData = jQuery.parseJSON(data);
            //console.log(tempData);
            thePlayer.theSegment.setYTMatchingEntryID(tempData.matchingYTEntryID);
            thePlayer.theSegment.setSegmentType("other");
            thePlayer.theSegment.setPrimaryMediaType("youtube");
            thePlayer.theSegment.setYouTubeCode(tempData.segmentYouTubeCode);
            thePlayer.theSegment.setFullDisplayName(tempData.segmentFullDisplayName);
            thePlayer.theSegment.setDescription(tempData.segmentShortDescription);
            thePlayer.theSegment.setIsLoaded(true);
            thePlayer.bSegmentDataLoadingFinished = true;
        });
    };

    this.beginFetchFacebookData = function(strFBUser, strFBCode) {
        //segment info must be reset prior to calling this function.
        this.showMediaLoading();
        this.theSegment.setFacebookUser(strFBUser);
        this.theSegment.setFacebookVideoCode(strFBCode);
        this.theSegment.setSegmentType("other");
        this.theSegment.setPrimaryMediaType("facebook");
        this.theSegment.setIsLoaded(true);
        thePlayer.theSegment.inferMediaType();
        this.bSegmentDataLoadingFinished = true;
    };


    this.beginFetchInstagramData = function(strInstgramID) {
        //segment info must be reset prior to calling this function.
        this.showMediaLoading();
        this.theSegment.setInstagramID(strInstgramID);
        this.theSegment.setSegmentType("other");
        this.theSegment.setPrimaryMediaType("instagram");
        this.theSegment.setIsLoaded(true);
        thePlayer.theSegment.inferMediaType();
        this.bSegmentDataLoadingFinished = true;
    };


    /*****************************************
     *************   WAITING FUNCTIONS  ************
     *****************************************/

    this.waitForPackageData = function() {
        if (this.bPackageDataLoadingFinished) {
            if (!this.thePackage.getErrorMessage()) {
                this.processOnlyNewPackageData();
            } else {
                this.bailOut();
            }
        } else {
            setTimeout(function() { thePlayer.waitForPackageData(); }, 250);
        }
    };

    this.waitForSegmentData = function() {
        if (this.bSegmentDataLoadingFinished) {
            this.processOnlyNewSegmentData();
        } else {
            setTimeout(function() { thePlayer.waitForSegmentData(); }, 250);
        }

    };
    this.waitForPackageAndSegmentData = function() {
        if (this.bPackageDataLoadingFinished && this.bSegmentDataLoadingFinished) {
            if (!this.thePackage.getErrorMessage()) {
                this.processBothNewPackageAndSegmentData();
            } else {
                this.bailOut();
            }
        } else {
            setTimeout(function() { thePlayer.waitForPackageAndSegmentData(); }, 250);
        }

    };

    this.waitForYouTubeData = function() {
        if (this.bSegmentDataLoadingFinished) {
            //console.log("YouTube Data Loaded.");
            this.processNewYouTubeData();
        } else {
            setTimeout(function() { thePlayer.waitForYouTubeData(); }, 250);
        }
    };


    this.waitForFacebookData = function() {
        if (this.bSegmentDataLoadingFinished) {
            this.processNewFacebookData();
        } else {
            setTimeout(function() { thePlayer.waitForFacebookData(); }, 250);
        }
    };

    this.waitForInstagramData = function() {
        if (this.bSegmentDataLoadingFinished) {
            this.processNewInstagramData();
        } else {
            setTimeout(function() { thePlayer.waitForInstagramData(); }, 250);
        }
    };
    this.cleanUpLoading = function() {
        this.pushHomeButtonState();
        this.pushFullscreenButtonState();

        if (this.isIOS()) {
            $('body').toggleClass('is-ios', true);
        }

        if (this.isSafari()) {
            $('body').toggleClass('is-safari', true);
        }

        if (this.isChrome()) {
            $('body').toggleClass('is-chrome', true);
        }
        this.b_LoadingIsFinished = true;
        if (this.b_UpdateURL) {
            this.updateURL();
        }
    };


    /*****************************************/
    /******  New Data Processing Functions ***/
    /*****************************************/
    this.processOnlyNewPackageData = function() {
        // This function should only be called when ONLY a new package is being
        // loaded.

        //First, if this package has a default segment, begin opening that so the media
        //can load while we're doing the rest.
        if (this.thePackage.getDefaultSegmentEntryID() !== "") {
            this.openSegmentWithinCurrentPackage(this.thePackage.getDefaultSegmentEntryID(), this.b_UpdateURL);
        } else {
            //only load package overview if we're not also loading the default segment.
            this.pushInfoPaneData();
            this.pushPackageOverviewData();
        }

        this.pushPackageSectionList();
        this.pushPackageTitle();
        this.pushInfoPaneData();
        //this function is called after package data has been loaded
        this.commentsManager.setNewPackageID(this.thePackage.getEntryID());
        this.favoritesManager.setNewPackageID(this.thePackage.getEntryID());
        this.favoritesManager.reloadFavorites();
        this.commentsManager.reloadComments();

        this.openSectionsSidebar();
        this.openFirstSection();
        this.cleanUpLoading();
        this.enableSidebarTabs();
        this.updateLocalHistory();
        this.updateURL();
        this.reattachKeyboardEvents();

    };

    this.processOnlyNewSegmentData = function() {
        //console.log("Processing New Segment Data");
        this.processOnlyNewSegmentMedia();

        this.pushSelectedSegmentState();
        this.pushSegmentChapters();
        this.extractSegmentLoops();
        this.pushSegmentTitle();
        this.pushSegmentDownloadsMenu();
        this.pushFullscreenButtonState();
        this.pushInfoPaneData();

        this.enableSidebarTabs();
        this.mobileSidebarCheck();
        this.updateLocalHistory();
        this.cleanUpLoading();

        this.commentsManager.setNewSegmentID(this.theSegment.getEntryID());
        this.commentsManager.reloadComments();

        if (this.theSegment.allowUserData()) {
            this.userDataManager.setNewSegmentID(this.theSegment.getEntryID());
            this.userDataManager.loadUserDataForm();
        }
    };

    this.processBothNewPackageAndSegmentData = function() {
        // This function should only be called when processing BOTH
        // a new Package AND a new embedded Segment at the same time.

        //First, start loading the media so that can process while we do the rest.
        this.processOnlyNewSegmentMedia();

        //Update interface elements related to Package.
        this.pushPackageSectionList();
        this.pushPackageTitle();
        this.pushInfoPaneData();

        //Deal with comments.
        this.commentsManager.setNewPackageID(this.thePackage.getEntryID());
        this.commentsManager.setNewSegmentID(this.theSegment.getEntryID());
        this.commentsManager.reloadComments();

        //this function is called after package data has been loaded
        this.favoritesManager.setNewPackageID(this.thePackage.getEntryID());
        this.favoritesManager.reloadFavorites();

        //Now open the Sidebar
        this.openSectionsSidebar();
        this.openFirstSection();

        //Now do the segment stuff that doesn't overlap with package stuff.

        this.pushSelectedSegmentState();
        this.pushSegmentChapters();
        this.extractSegmentLoops();
        this.pushSegmentTitle();
        this.pushSegmentDownloadsMenu();
        this.pushFullscreenButtonState();

        this.updateLocalHistory();
        if (this.theSegment.allowUserData()) {
            this.userDataManager.setNewSegmentID(this.theSegment.getEntryID());
            this.userDataManager.loadUserDataForm();
        }

        this.cleanUpLoading();
        this.enableSidebarTabs();
    };

    this.processNewYouTubeData = function() {
        //console.log("Processing new YouTube Data");
        if (this.theSegment.getYTMatchingEntryID() !== "") {
            var matchingSegmentID = this.theSegment.getYTMatchingEntryID();

            //We just need to open the matching segment as a package, because
            // in the package loading code, the segment will set itself as
            // the default segment, and the package loading code will trigger
            // a load when it finds that data.

            //console.log("Matching Entry found for new YouTube Video");
            this.openPackage(matchingSegmentID, true);
        } else {
            this.processOnlyNewSegmentData();
            this.favoritesManager.reloadFavorites();
            this.loadSaveYouTubeInterface();
            this.enableSidebarTabs();
        }
    };
    this.processNewFacebookData = function() {
        //console.log("Processing new Facebook Data");
        this.processOnlyNewSegmentData();
        this.enableSidebarTabs();
    };

    this.processNewInstagramData = function() {
        //console.log("Processing new Facebook Data");
        this.processOnlyNewSegmentData();
        this.enableSidebarTabs();
    };

    this.processOnlyNewSegmentMedia = function() {

        this.resetPackageOverview();
        let mediaType = this.theSegment.getPrimaryMediaType();

        //console.log("Processing new Segment Media:" + mediaType);
        switch (mediaType) {
            case "vimeo":
                this.mediaLoadVimeo(this.theSegment.getVimeoCode());
                break;
            case "youtube":
                this.mediaLoadYouTube(this.theSegment.getYouTubeCode());
                break;
            case "mp3":
                this.mediaLoadMP3(this.theSegment.getMP3Filename());
                break;
            case "soundslice":
                this.mediaLoadSoundSlice(this.theSegment.getSoundSliceCode());
                break;
            case "pdf":
                this.mediaLoadPDFViewer(this.theSegment.getPDFFilename());
                break;
            case "url":
                this.mediaLoadURL(this.theSegment.getMediaURL());
                break;
            case "facebook":
                this.mediaLoadFacebook(this.theSegment.getFacebookUser(), this.theSegment.getFacebookVideoCode());
                break;
            case "instagram":
                this.mediaLoadInstagram(this.theSegment.getInstagramID());
                break;
            case "html":
                this.mediaLoadHTML();
                break;
        }
    };


    this.extractSegmentLoops = function() {
        //loops manager is assumed to be reset by this point.
        this.loopsManager.createNewCollection("loopList", "system", false);
        this.loopsManager.addListToCollectionFromArray(this.theSegment.getLoopsArray(), "system");
    };





    /******************************/
    /* Interface Update Functions */
    /*****************************
     */

    this.pushHomeButtonState = function() {
        if (this.thePackage.isLoaded() || this.theSegment.isLoaded()) {
            $('#resetPlayerButton').toggle(true);
        } else {
            $('#resetPlayerButton').toggle(false);
        }
    };

    this.pushPackageSectionList = function() {
        //console.log('Updating sections');
        this.spinner('#sectionList');
        var sections = this.thePackage.getSections();
        var segmentListString = "";
        var bUseSections = sections.length > 1 ? true : false;
        if (bUseSections) {
            segmentListString += '<ul class="accordion sidebar-accordion" id="segmentListAccordion" data-accordion data-allow-all-closed="true" data-multi-expand="false">';
        }
        for (let i = 0; i < sections.length; i++) {
            if (bUseSections) {
                segmentListString += '<li class="accordion-item ';
                segmentListString += '" data-accordion-item>';
                segmentListString += '<a class="accordion-title">' + sections[i].sectionTitle + ' <sup>' + sections[i].segments.length + '</sup></a>';
                segmentListString += '<div class="accordion-content" id="section-' + i + '" data-tab-content>';
            }
            segmentListString += '<ul class="sidebar-list">';
            for (let j = 0; j < sections[i].segments.length; j++) {
                var theSegment = sections[i].segments[j];
                segmentListString += '<li class="sidebar-list-item segment ';
                segmentListString += this.getSegmentClass(theSegment);
                segmentListString += '" id="segment-item-' + theSegment.segmentID + '">';
                segmentListString += '<a onClick="thePlayer.openSegmentWithinCurrentPackage(\'' + theSegment.segmentID + '\', true); return false;"';
                segmentListString += 'title="' + theSegment.segmentFullTitle + '">';
                segmentListString += theSegment.segmentTitle + '</a></li>';
            }
            segmentListString += '</ul>';
            if (bUseSections) {
                segmentListString += '</div></li>';
            }
        }
        if (bUseSections) {
            segmentListString += '</ul>';
        }

        $('#sectionList').html(segmentListString);

        if (bUseSections) {
            //console.log('Setting up Accordion for the first time');
            $('#segmentListAccordion').foundation();
        }
        if ($('#sectionList').children().length === 0) {
            $('#sectionListEmpty').text("No segments to show.");
            $('#sectionListEmpty').toggle(true);
        } else {
            $('#sectionListEmpty').toggle(false);
        }
    };

    this.pushPackageTitle = function(strTitleOverride) {
        if (typeof strTitleOverride != "undefined") {
            $('.packageTitle').html(strTitleOverride);
        } else if (this.thePackage.isLoaded()) {
            $('.packageTitle').html(this.thePackage.getTitle());
            $("#proPlayerWrapper").toggleClass("has-info", true);
        } else {
            $('.packageTitle').html("TXBA Pro Player");
            $("#proPlayerWrapper").toggleClass("has-info", false);
        }
    };


    this.pushPackageOverviewData = function() {
        $('#packageTitle').html("<h1>" + this.thePackage.getTitle() + "</h1>");
        $('#packageImage').html("<img class='bordered' src='" + this.thePackage.getImageURL() + "'/>");
        $('#packageDescription').html(this.thePackage.getDescription());
        $('#packageOverview').html(this.thePackage.getOverview());
        $('#packageOverviewWrapper').appendTo('#mediaWrapper');
        $('#packageOverviewWrapper').toggle(true);

    };

    this.pushSegmentTitle = function(strTitle) {
        if (typeof strTitle != "undefined") {
            $('.segmentTitle').html(strTitle);
        } else {
            $('.segmentTitle').html(this.theSegment.getFullDisplayName());
            $("#proPlayerWrapper").toggleClass("has-info", true);
        }
    };



    this.pushInfoPaneData = function() {
        $("#proPlayerWrapper").toggleClass("has-info", true);
        $('#info-package-name').html(this.thePackage.getTitle());
        $('#info-segment-name').html(this.theSegment.getFullDisplayName());
        $('#info-package-tuning').html("<strong>Tuning</strong>: " + this.thePackage.getTuning());
        if (!this.theSegment.isLoaded()) {
            $('#info-package-description').html(this.thePackage.getDescription());
            $('#info-segment-overview').html(this.thePackage.getOverview());
        } else {
            $('#info-package-description').html("");
            $('#info-segment-overview').html(this.theSegment.getDescription());
        }
    };
    this.pushSelectedSegmentState = function(nForceSegment) {
        this.resetSelectedSegment();

        if (!nForceSegment && !this.theSegment.isLoaded()) {
            return;
        }

        var newSegmentElementID = '#segment-item-';
        if (nForceSegment) {
            newSegmentElementID += nForceSegment;
        } else if (this.theSegment.isLoaded()) {
            newSegmentElementID += this.theSegment.getEntryID();
        }

        //console.log("Setting active segment ID: " + newSegmentElementID);
        $(newSegmentElementID).toggleClass('active', true);

        var parentElement = $(newSegmentElementID).closest('.accordion-content');
        var parentLink = $(newSegmentElementID).closest('.accordion-item');
        if (parentElement.length !== 0 && !$(parentLink).hasClass('is-active')) {
            $('#segmentListAccordion').foundation('toggle', parentElement);
        }
    };





    this.pushSegmentDownloadsMenu = function() {
        $("#downloads-list").empty();
        if (this.theSegment.isLoaded() && this.theSegment.getMP3Filename() !== "") {
            $("#downloadsToggle").toggle(true);
            $("#downloadsToggle").toggle(true);
            var newItem = "<li class='sidebar-list-item segment download'><a href='";
            newItem += "https://cdn.texasbluesalley.com/audio/" + this.theSegment.getMP3Filename();
            newItem += "' download='" + this.theSegment.getMP3Filename() + "'>Download MP3</a></li>";
            $("#downloads-list").append(newItem);
        } else {
            $("#downloadsToggle").toggle(false);
        }

    }

    this.pushFullscreenButtonState = function() {
        if (this.theSegment.isLoaded() &&
            (this.theSegment.getVimeoCode() !== "" ||
                this.theSegment.getYouTubeCode() !== "" ||
                this.theSegment.getMP3Filename() !== "" ||
                this.theSegment.getSoundSliceCode() !== "")) {
            $("#fullscreenButton").toggle(true);
        } else {
            $("#fullscreenButton").toggle(false);
        }
    };

    this.pushSegmentChapters = function() {
        if (!this.theSegment.isLoaded()) {
            $('#chapterListEmpty').text("No segment loaded.");
            $('#chapterListEmpty').toggle(true);
        } else if (this.theSegment.getChaptersArray().length === 0) {
            $('#chapterListEmpty').text("This segment does not have any chapter markers.");
            $('#chapterListEmpty').toggle(true);
        } else {
            $('#chapterListEmpty').toggle(false);
            //this function assumes the chapter list has already been reset
            var chapters = this.theSegment.getChaptersArray();
            for (let i = 0; i < chapters.length; i++) {
                var chapterItem = '<li class="sidebar-list-item chapter" id="chapterItem-' + i + '">';
                chapterItem += '<a onClick="thePlayer.chapterSelected(this,' + i + ')">';
                chapterItem += chapters[i][0];
                chapterItem += '</a></li>';
                $('#chapterList').append(chapterItem);
            }

        }
    };





    this.getEngineLoop = function() {
        if (typeof this.theEngine !== "undefined" && this.theEngine.getLoopDefined()) {
            return new InstantLoop("", this.theEngine.getLoopStart(), this.theEngine.getLoopEnd());
        } else {
            return null;
        }
    };
    /*****************************************
     ********  Media Loading Functions	******
     *****************************************/
    this.mediaLoadDefaultPage = function() {
        $('#mediaWrapper').load(gc_BranchPath + '/--ajax-load-default-page');

    };
    this.mediaLoadVimeo = function(nVimeoID) {
        $('#mediaWrapper').load(gc_BranchPath + '/--ajax-load-media/vimeo/' + nVimeoID, function() {
            thePlayer.reattachKeyboardEvents();
        });
    };
    this.mediaLoadYouTube = function(strYouTubeCode) {
        this.showMediaLoading();
        $('#mediaWrapper').load(gc_BranchPath + '/--ajax-load-media/youtube/' + strYouTubeCode, function() {
            thePlayer.reattachKeyboardEvents();
        });

    };

    this.mediaLoadFacebook = function(strFacebookUser, strFacebookCode) {
        //console.log("About to load FB video for user/id: " + strFacebookUser + "," + strFacebookCode);
        this.showMediaLoading();
        $('#mediaWrapper').load(gc_BranchPath + '/--ajax-load-media/facebook/' + strFacebookUser + '/' + strFacebookCode, function() {
            thePlayer.reattachKeyboardEvents();
        });

    };

    this.mediaLoadInstagram = function(strInstagramID) {
        //console.log("About to load FB video for user/id: " + strFacebookUser + "," + strFacebookCode);
        this.showMediaLoading();
        $('#mediaWrapper').load(gc_BranchPath + '/--ajax-load-media/instagram/' + strInstagramID, function() {
            thePlayer.reattachKeyboardEvents();
        });

    };

    this.mediaLoadMP3 = function(strMP3Filename) {
        $('#mediaWrapper').load(gc_BranchPath + '/--ajax-load-media/audio/' + strMP3Filename, function() {
            thePlayer.reattachKeyboardEvents();
        });

    };
    this.mediaLoadSoundSlice = function(strSoundSliceCode) {
        $('#mediaWrapper').load(gc_BranchPath + '/--ajax-load-soundslice/' + strSoundSliceCode);
    }
    this.mediaLoadPDFViewer = function(strPDFFilename) {
        //console.log('Trying to load ' + strPDFFilename );
        $('#mediaWrapper').load(gc_BranchPath + '/--ajax-load-pdf/' + strPDFFilename);
    };

    this.mediaLoadURL = function(theURL) {
        var contentString = "<iframe id='content-frame' src='";
        contentString += decodeURIComponent(theURL) + "' frameBorder='0'></iframe>";
        $('#mediaWrapper').html(contentString);
    };

    this.mediaLoadHTML = function() {
        var contentString = "<div class='media-content-wrapper'>";
        contentString += this.theSegment.getHTMLContent();
        contentString += "</div>";
        $('#mediaWrapper').html(contentString);
    };


    this.triggerSaveUserData = function() {
        this.loopsManager.savingUserData();
        this.userDataManager.saveUserData();
    };


    /**********************************/
    /*** Chapter And Loop Related Functions ***/
    /**********************************/

    this.chapterSelected = function(sender, nChapterIndex) {
        var theChapter = this.theSegment.getChaptersArray()[nChapterIndex];
        //console.log('Chapter Selected: ' + nChapterIndex);
        //console.log( this.theSegment.chapters[ nChapterIndex] );

        //console.log( "Calling engine gotoChapter" );
        this.loopsManager.clearAllActiveLoops();


        var chapterParentItemID = '#chapterItem-' + nChapterIndex;
        $(chapterParentItemID).toggleClass('active', true);

        this.theEngine.goToChapter(theChapter[1]);
        window.setTimeout(function() {
            $(".sidebar-list-item.chapter.active").toggleClass('active', false);
        }, 200);
    };



    this.engineLoopHasChanged = function() {
        this.loopsManager.pushUserLoopInterfaceState();
    };
    /*****************************************
     *************	Tool Window Functions ************
     *****************************************/

    this.toolsShowBrowser = function() {
        this.closeInfoPane();
        //console.log('Opening Browser');
        if (typeof this.theEngine !== "undefined") {
            this.theEngine.stopPlayback();
        }

        if (thePlayer.browserTool.b_BrowserLoaded === true) {
            $('#browser-wrapper').appendTo('#toolWindowInnerWrapper');
            $('#browser-wrapper').toggle(true);
            this.browserTool.reloadResultsFavoritesForms();
        } else {
            $('#toolWindowInnerWrapper').load(gc_BranchPath + '/--ajax-browser', function() {
                thePlayer.browserTool.b_BrowserLoaded = true;
                thePlayer.browserTool.browserReset();
            });
        }
        $('#toolWindowTitle').text('Browser');
        $('#toolWindowOuterWrapper').data('tool', 'browser');
        $('#toolWindowOuterWrapper').toggle(true);
    };

    this.toolsShowTuner = function() {
        this.closeInfoPane();
        if (typeof this.theEngine !== "undefined") {
            this.theEngine.stopPlayback();
        }

        var contentString = "<iframe src='/dev/tuner'></iframe>";
        $('#toolWindowInnerWrapper').html(contentString);
        $('#toolWindowTitle').text('Tuner');
        $('#toolWindowOuterWrapper').data('tool', 'tuner');
        $('#toolWindowOuterWrapper').toggle(true);
    };

    this.toolsShowSpiderTool = function() {
        this.closeInfoPane();
        if (typeof this.theEngine !== "undefined") {
            this.theEngine.stopPlayback();
        }

        var contentString = "<iframe src='/dev/spider'></iframe>";
        $('#toolWindowInnerWrapper').html(contentString);
        $('#toolWindowTitle').text('Spider Drills Tool');
        $('#toolWindowOuterWrapper').data('tool', 'spider');
        $('#toolWindowOuterWrapper').toggle(true);
    };

    this.toolsShowFretboardTool = function() {
        this.closeInfoPane();
        if (typeof this.theEngine !== "undefined") {
            this.theEngine.stopPlayback();
        }

        var contentString = "<iframe src='/dev/fretboard'></iframe>";
        $('#toolWindowInnerWrapper').html(contentString);
        $('#toolWindowTitle').text('Fretboard Tool');
        $('#toolWindowOuterWrapper').data('tool', 'fretboard');

        $('#toolWindowOuterWrapper').toggle(true);
    };

    this.toolsCloseToolWindow = function() {
        $('#toolWindowOuterWrapper').toggle(false);
        if ($('#toolWindowOuterWrapper').data('tool') == "browser") {
            $('#browser-wrapper').toggle(false);
            $('#browser-wrapper').appendTo('body');
            this.favoritesManager.fullRefresh();
        }
        $('#toolWindowInnerWrapper').empty();
        $('#toolWindowTitle').text('');

    };


    /**********************************/
    /*** From here on down, it's a mishmosh of functions ***/
    /**********************************/


    this.getSegmentClass = function(theSegment) {
        if (theSegment.segmentVimeoCode !== '' || theSegment.segmentYouTubeCode !== '') { return "video"; } else if (theSegment.segmentMP3Filename !== '') { return "audio"; } else if (theSegment.segmentSoundSliceCode !== '') { return "tablature"; } else if (theSegment.segmentPDFCode !== '') { return "pdf"; } else if (theSegment.segmentURL !== '') { return "url"; } else if (theSegment.segmentGPXFilename !== '') { return "gpx"; } else { return "html"; }
    }


    /*****************************************
     ********* Window Related Stuff	   ************
     *****************************************/
    this.toggleSidebar = function() {
        clearTimeout(this.n_SidebarToggleTimerID);
        $('#proPlayerWrapper').toggleClass("sidebar-closed");

        if ($('#proPlayerWrapper').hasClass('sidebar-closed')) {
            //in all cases, if (after toggling) the sidebar is closed
            //we turn off the keep sidebar open flag so that the side hover
            //area will work to open it again.
            this.b_KeepSidebarOpen = false;
            $('#proPlayerWrapper').toggleClass('sidebar-sticky', false);
        }

    };

    this.toggleSidebarButtonCallback = function() {
        if ($('#proPlayerWrapper').hasClass('sidebar-closed')) {
            //BEFORE toggling, if the sidebar is close, we enable the
            //keep open flag so that hovinger will be disabled. We only
            //do this when the top button is clicked to open the sidebar.
            this.b_KeepSidebarOpen = true;
            $('#proPlayerWrapper').toggleClass('sidebar-sticky', true);
        }
        this.toggleSidebar();

    };
    this.openSidebar = function() {
        $('#proPlayerWrapper').toggleClass("sidebar-closed", false);
    };

    this.closeSidebar = function() {
        $('#proPlayerWrapper').toggleClass("sidebar-closed", true);
    };

    this.enableSidebarTabs = function() {
        //console.log("Enabling sidebar tabs");
        $('#sectionsTab').toggleClass('enabled', this.thePackage.isLoaded());
        $('#chaptersTab').toggleClass('enabled', this.theSegment.allowChapters());
        $('#loopsTab').toggleClass('enabled', this.theSegment.allowLoops());
        $('#commentsTab').toggleClass('enabled', this.thePackage.isLoaded());
        $("#importTab").toggleClass('enabled', this.theSegment.allowImport());

        $('#sidebarPanelTabs li.enabled:first a').trigger('click');
    };
    this.toggleKeyboardShortcuts = function() {
        $("#keyboardShortcuts").toggle();
        $("#keyboardShortcutsButton").toggleClass('active');
    };

    this.openFirstSection = function() {
        var sectionAccordionItems = $('#segmentListAccordion .accordion-content');
        if (typeof sectionAccordionItems !== "undefined" && sectionAccordionItems.length > 0) {
            $('#segmentListAccordion').foundation('toggle', $(sectionAccordionItems[0]));
        }
    };

    this.openSectionsSidebar = function() {
        this.openSidebar();
        $('#sidebarPanelTabs').foundation('selectTab', 'segmentsPanel');
    };

    this.openChaptersSidebar = function() {
        this.openSidebar();
        $('#sidebarPanelTabs').foundation('selectTab', 'chaptersPanel');
    };

    this.openLoopsSidebar = function() {
        this.openSidebar();
        $('#sidebarPanelTabs').foundation('selectTab', 'loopsPanel');
    };

    this.showLoopsSidebarList = function(nListIndex) {
        this.openLoopsSidebar();
        let listTab = $('#loopListsTabsContent').children('.tabs-panel')[nListIndex];
        let tabID = $(listTab).attr('id');
        $('#loopsPanelTabs').foundation('selectTab', tabID);
    };
    this.openFavoritesSidebar = function() {
        this.openSidebar();
        $('#sidebarPanelTabs').foundation('selectTab', 'favoritesPanel');
    };


    this.openCommentsSidebar = function() {
        this.openSidebar();
        $('#sidebarPanelTabs').foundation('selectTab', 'commentsPanel');
    };

    this.mobileSidebarCheck = function() {
        if (!Foundation.MediaQuery.atLeast('large')) {
            this.toggleSidebar();
        }
    };
    this.updateURL = function() {
        let theURL = "/watch/";
        let theState = {};
        let theTitle = "";

        let currentState = history.state;
        let bPushNewState = true;

        //First, check if we're pushing the same state that we already have loaded.

        //console.log("Checking: " + JSON.stringify(currentState));
        if (currentState !== null) {
            if (currentState.type == "package" &&
                currentState.segment1 == this.thePackage.getEntryID() &&
                currentState.segment2 == this.theSegment.getEntryID()) {
                //we have a match, get out of here.
                bPushNewState = false;
            } else if (currentState.type == "youtube" &&
                this.theSegment.getSegmentType() == "other" &&
                currentState.segment2 == this.theSegment.getYouTubeCode()) {
                //It's a matching YouTube video
                bPushNewState = false;
            } else if (currentState.type == "facebook" &&
                this.theSegment.getSegmentType() == "other" &&
                currentState.segment2 == this.theSegment.getFacebookUser() &&
                currentState.segment3 == this.theSegment.getFacebookVideoCode()) {
                //Matching facebook video.
                bPushNewState = false;
            }
        }

        if (bPushNewState) {
            if (this.thePackage.isLoaded()) {
                theState.type = "package";
                theState.segment1 = this.thePackage.getEntryID();
                theTitle += this.thePackage.getTitle();
                theURL += this.thePackage.getEntryID();
                if (this.theSegment.isLoaded()) {
                    theState.segment2 = this.theSegment.getEntryID();
                    theURL += "/" + this.theSegment.getEntryID();
                    theTitle += ":" + this.theSegment.getTitle();
                } else {
                    theState.segment2 = "";
                }
                theState.segment3 = "";
            } else if (this.theSegment.isLoaded() && this.theSegment.getSegmentType() == "other") {
                if (this.theSegment.getPrimaryMediaType() == "youtube") {
                    theState.type = "youtube";
                    theState.segment1 = "youtube";
                    theState.segment2 = this.theSegment.getYouTubeCode();
                    theState.segment3 = "";
                    theURL += "youtube/" + this.theSegment.getYouTubeCode();
                    theTitle = "YouTube: " + this.theSegment.getDisplayName();
                } else if (this.theSegment.getPrimaryMediaType() == "facebook") {
                    theState.type = "facebook";
                    theState.segment1 = "facebook";
                    theState.segment2 = this.theSegment.getFacebookUser();
                    theState.segment3 = this.theSegment.getFacebookVideoCode();
                    theTitle = "Facebook Video";

                    theURL += theState.segment1 + "/" + theState.segment2 + "/" + theState.segment3;
                }
            } else {
                theState.segment1 = "";
                theState.segment2 = "";
                theState.segment3 = "";
                theState.type = "empty";
                theTitle = "TXBA Pro Player";
            }

            //console.log("Pushing: " + JSON.stringify(theState));
            //console.log("Title is: " + theTitle);
            history.pushState(theState, theTitle, theURL);
        }
    }

    window.onpopstate = function(event) {
        //console.log(event.state);
        let theState = event.state;
        //console.log("Popping state: " + JSON.stringify(theState));
        if (theState !== null) {
            if (theState.type === "facebook" && theState.segment1 === "facebook" && theState.segment2 !== "" && theState.segment3 !== "") {
                thePlayer.openExternalFBVideo(theState.segment2, theState.segment3, false)
            } else if (theState.type === "youtube" && theState.segment1 === "youtube" && theState.segment2 !== "") {
                thePlayer.openExternalYouTubeVideo(theState.segment2, false);
            } else if (theState.type === "package" && theState.segment1 !== "" && theState.segment2 === "") {
                thePlayer.openPackage(theState.segment1, false);
            } else if (theState.type === "package" && theState.segment1 !== "" && theState.segment2 !== "") {
                if (theState.segment1 === thePlayer.thePackage.getEntryID()) {
                    thePlayer.openSegmentWithinCurrentPackage(theState.segment2, false);
                } else {
                    thePlayer.openPackageWithSegment(theState.segment1, theState.segment2, false);
                }
            } else if (theState.type === "empty") {
                thePlayer.initializeWithoutPackage(false);
            }
        }
    };

    this.setupMobileiOS = function() {

        if (isIOS()) {
            var viewportmeta = document.querySelector('meta[name="viewport"]');
            if (viewportmeta) {
                viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
                document.body.addEventListener('gesturestart', function() {
                    viewportmeta.content = 'width=device-width, minimum-scale=.6, maximum-scale=1.6';
                }, false);
            }
        }
        if (isIPhone()) {
            $('.not-on-iPhones').toggle(false);
        }

    }




    this.isIOS = function() {
        return (this.theMobileDetect.is('iphone') || this.theMobileDetect.is('ipad') || this.theMobileDetect.is('ipod'));
    };

    this.isIPhone = function() {
        return (this.theMobileDetect.is('iphone') || this.theMobileDetect.is('ipod'));
    };

    this.isIE = function() {
        strUserAgent = window.navigator.userAgent;
        return ((strUserAgent.search('Trident') > -1) || (strUserAgent.search('Edge') > -1));
    };

    this.isSafari = function() {
        strUserAgent = window.navigator.userAgent;
        return ((strUserAgent.search('Safari') > -1) && (strUserAgent.search('Chrome') == -1));
    };

    this.isChrome = function() {
        strUserAgent = window.navigator.userAgent;
        return (strUserAgent.search('Chrome') > -1);
    };
    this.isWindows10 = function() {
        strUserAgent = window.navigator.userAgent;
        return (strUserAgent.search('Windows NT 10') > -1);
    };

    this.getChannelTypeString = function(strChannelShortName) {
        var strType = 'Item';
        switch (strChannelShortName) {
            case 'pro_player_packages':
                strType = 'Course';
                break;
            case 'free_lesson_friday':
                strType = 'Lesson';
                break;
            case 'tone_tuesday':
            case 'performances':
            case 'youtube_video':
                strType = 'Video';
                break;
            case 'backing_tracks':
                strType = 'Track';
                break;
        }
        return strType;
    };

    this.fullscreenToggle = function() {
        if (typeof this.theEngine !== "undefined") {
            this.theEngine.MediaPlayer.enterFullScreen();
        } else if (this.theSegment.getPrimaryMediaType() === "soundslice") {
            $('iframe#ssembed')[0].requestFullscreen();
        }
    };

    this.spinner = function(elementID) {
        //console.log('Activating spinner on ' + elementID);
        var strSpinner = "<div id='spinner'><i class='fa fa-spinner fa-spin fa-2x'></i></div>";
        $(elementID).html(strSpinner);
    };

    this.closeBrowserRequested = function() {
        this.toolsCloseToolWindow();
        this.favoritesManager.fullRefresh();
    };


    this.updateLocalHistory = function() {

        if (this.thePackage.isLoaded() && this.theSegment.isLoaded() && this.theSegment.getSegmentType() !== "other") {
            //console.log('Updating history');
            this.historyManager.addHistoryItem(this.thePackage.getEntryID(), this.theSegment.getEntryID(),
                this.thePackage.getTitle(), this.thePackage.getChannelName(),
                this.theSegment.getFullDisplayName(), 'entry');
        }
    };


    this.toggleInfoPane = function() {
        if (this.theSegment.isLoaded() || this.thePackage.isLoaded()) {
            $('#infoPane').slideToggle();
        }

    };
    this.showInfoPane = function() {
        if (this.theSegment.isLoaded() || this.thePackage.isLoaded()) {
            $('#infoPane').toggle(true);
        }
    };

    this.closeInfoPane = function() {
        $('#infoPane').toggle(false);
    };
    this.showMediaLoading = function() {
        this.resetPackageOverview();
        $('#mediaWrapper').html(this.spinnerDiv);
    };

    this.triggerNextLoop = function() {
        let listIndex = this.loopsManager.activateNextLoop();

        if (listIndex > -1 && this.isSidebarOpen()) {
            this.showLoopsSidebarList(listIndex);
        }
    };

    this.triggerPreviousLoop = function() {
        let listIndex = this.loopsManager.activatePreviousLoop();
        if (listIndex > -1 && this.isSidebarOpen()) {
            this.showLoopsSidebarList(listIndex);
        }
    };

    this.isSidebarOpen = function() {
        return !$("#proPlayerWrapper").hasClass('sidebar-closed');
    };

    this.reattachKeyboardEvents = function() {
        //console.log('Reattaching Mouse Events');
        Mousetrap.bind('s', function() { thePlayer.toggleSidebar(); });

        if (this.thePackage.isLoaded()) {
            Mousetrap.bind('1', function() { thePlayer.openSectionsSidebar(); });
            Mousetrap.bind('5', function() { thePlayer.openCommentsSidebar(); });
        }

        if (this.theSegment.allowChapters()) {
            Mousetrap.bind('2', function() { thePlayer.openChaptersSidebar(); });
        }
        if (this.theSegment.allowLoops()) {
            Mousetrap.bind('3', function() { thePlayer.openLoopsSidebar(); });
            Mousetrap.bind('j', function() { thePlayer.triggerNextLoop(); });
            Mousetrap.bind('k', function() { thePlayer.triggerPreviousLoop(); });
        }

        Mousetrap.bind('4', function() { thePlayer.openFavoritesSidebar(); });
        Mousetrap.bind('?', function() { thePlayer.toggleKeyboardShortcuts(); });


        if (typeof this.theEngine !== "undefined") {
            Mousetrap.bind('space', function() { thePlayer.theEngine.onButtonTogglePlayback(); });
            Mousetrap.bind('right', function() { thePlayer.theEngine.onButtonPlaybackForward1(); });
            Mousetrap.bind('left', function() { thePlayer.theEngine.onButtonPlaybackRewind1(); });
            Mousetrap.bind('alt+right', function() { thePlayer.theEngine.onButtonPlaybackForward5(); });
            Mousetrap.bind('alt+left', function() { thePlayer.theEngine.onButtonPlaybackRewind5(); });

            Mousetrap.bind('i', function() { thePlayer.theEngine.onButtonRestartLoop(); });

            Mousetrap.bind('shift+right', function() { thePlayer.theEngine.onButtonPlaybackForwardPoint5(); });
            Mousetrap.bind('shift+left', function() { thePlayer.theEngine.onButtonPlaybackRewindPoint5(); });

            Mousetrap.bind('shift+up', function() { thePlayer.theEngine.onButtonPlaybackRestart(); });
            Mousetrap.bind('a', function() { thePlayer.theEngine.onButtonSetLoopStart(); });
            Mousetrap.bind('b', function() { thePlayer.theEngine.onButtonSetLoopEnd(); });
            Mousetrap.bind('l', function() { thePlayer.theEngine.onButtonToggleLooping(); });
            Mousetrap.bind('s+up', function() { thePlayer.theEngine.increasePlaybackRate(); });
            Mousetrap.bind('s+down', function() { thePlayer.theEngine.decreasePlaybackRate(); });
            Mousetrap.bind('z', function() { thePlayer.theEngine.toggleZoomEnabled(); });
            Mousetrap.bind('/', function() { thePlayer.theEngine.toggleVideoControls(); });
            $("#playback-play").keydown(function(event) {
                event.preventDefault();
            });
        }


        $("body").keydown(function(event) {

            //console.log('Body received key: ' + event.which);
            //console.log(event);
            if (event.which === 32 && (event.target.nodeName === "BODY" || event.target.nodeName === "A")) {
                event.preventDefault();
            }
        });
    }

    this.convertOldCookies = function() {
        //Resolution
        var savedResolution = Cookies.get('resolution');
        if (typeof savedResolution != "undefined") {
            localStorage.setItem('proPlayerResolution', savedResolution);
            Cookies.remove('resolution');
        }

        var savedVolume = Cookies.get('volume');
        if (typeof savedVolume != "undefined") {
            localStorage.setItem('proPlayerVolume', savedVolume);
            Cookies.remove('volume');
        }

        var savedFlip = Cookies.get('playerFlipped');
        if (typeof savedFlip != "undefined") {
            localStorage.setItem('proPlayerFlipped', savedFlip);
            Cookies.remove('playerFlipped');
        }


        var savedHistory = Cookies.getJSON('proPlayerHistory');
        if (typeof savedHistory != "undefined") {
            localStorage.setItem('proPlayerHistory', JSON.stringify(savedHistory));
            Cookies.remove('proPlayerHistory');
        }

        Cookies.remove('packageResumeItems');
        Cookies.remove('savedResumeItems');
        Cookies.remove('recentlyViewed');
        Cookies.remove('savedPlaybackPositions');

    };

    this.showPlayerError = function() {
        //console.log("Player Error");
    };


    /*****************************************
     *************   External Video Code  ************
     *****************************************/
    this.loadSaveYouTubeInterface = function() {
        $('#saveYTSegmentFormWrapper').load(gc_BranchPath + '/--ajax-load-save-YT-segment-form', function() {
            thePlayer.pushLoadYTInfo();
        })
    };

    this.pushLoadYTInfo = function() {
        $("form#saveYouTubeSegmentForm input[name=title]").val("YouTube: " + this.theSegment.getYouTubeCode());
        $("form#saveYouTubeSegmentForm input[name=cf_media_display_name]").val(this.theSegment.getFullDisplayName());
        $("form#saveYouTubeSegmentForm input[name=cf_media_yt_code]").val(this.theSegment.getYouTubeCode());
        $("form#saveYouTubeSegmentForm input[name=cf_media_short_description]").val(this.theSegment.getDescription());
    };

    this.submitSaveYouTubeForm = function() {
        let theName = $("form#saveYouTubeSegmentForm input[name=title]").val();
        let theDisplayName = $("form#saveYouTubeSegmentForm input[name=cf_media_display_name]").val();
        let theYTCode = $("form#saveYouTubeSegmentForm input[name=cf_media_yt_code]").val();

        if (theName !== "" && theDisplayName !== "" && theYTCode !== "") {
            var theForm = $("form#saveYouTubeSegmentForm");
            formData = $(theForm).serialize();
            //console.log(formData);
            $.ajax({
                    type: 'POST',
                    url: $(theForm).attr('action'),
                    data: formData
                })
                .done(function(response) {
                    //console.log(response);
                    $('#saveYTSegmentFormWrapper').empty();
                    thePlayer.reloadYouTube();
                });


        }
    };

    this.reloadYouTube = function() {
        this.openExternalYouTubeVideo(this.theSegment.getYouTubeCode(), false);
    };

    this.showYouTubeLinkPrompt = function() {
        var url = prompt("Enter the YouTube Video Link");

        if (typeof url !== "undefined" || url !== '') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length === 11) {
                this.openExternalYouTubeVideo(match[2], true);
            } else {
                alert('The YouTube link provided was not valid.');
            }
        }
    };

    this.showFacebookLinkPrompt = function() {
        var url = prompt("Enter the Facebook Video Link");

        if (typeof url !== "undefined" || url !== '') {
            var regExp = /^(?:(?:https?:)?\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9\.]+)\/videos\/(?:[a-zA-Z0-9\.]+\/)?([0-9]+)/;

            var match = url.match(regExp);
            //console.log(match);

            if (match) {
                this.openExternalFBVideo(match[1], match[2]);
            } else {
                alert('The Facebook Video link provided was not valid.');
            }
        }
    };

    this.showInstagramLinkPrompt = function() {
        var url = prompt("Enter the Instagram Video Link");

        if (typeof url !== "undefined" || url !== '') {
            var regExp = /^(?:https?:\/\/(?:www\.)?)?instagram\.com(?:\/p\/(\w+)\/?)/;

            var match = url.match(regExp);
            //console.log(match);

            if (match) {
                this.openExternalInstagramVideo(match[1]);
            } else {
                alert('The Instagram Video link provided was not valid.');
            }
        }
    }

    this.testFetchYouTubeData = function(strYTCode) {
        $.get(gc_BranchPath + '/--ajax-get-yt-info/' + strYTCode, function(data) {
            var theData = jQuery.parseJSON(data);
            //console.log(theData);
        });

    };

    this.startSidebarToggleHover = function() {
        if (!this.b_KeepSidebarOpen) {
            this.n_SidebarToggleTimerID = setTimeout(function() {
                thePlayer.toggleSidebar();
            }, 250);
        }
    };

    this.cancelSidebarToggleHover = function() {
        clearTimeout(this.n_SidebarToggleTimerID);
        n_SidebarToggleTimerID = -1;
    };

    this.enginePlaybackToggled = function(bIsPlaying) {
        $('#mediaPlayerWrapper').toggleClass('paused', !bIsPlaying);
        $('#mediaPlayerWrapper').toggleClass('playing', bIsPlaying);
    };

}