class ProPlayerHistoryManager {
	constructor(strHistoryListWrapperID) {
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
			for (let i = 0; i < aHistoryItems.length; i++) {
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
			}
			else {
				return null;
			}
		};
	}
}
		