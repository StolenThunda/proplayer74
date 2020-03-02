export function ProPlayerSegment()
{
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
     
    this.setIsLoaded = function(bLoaded){ this.b_IsLoaded = bLoaded; }
    this.setEntryID = function(strEntryID){ this.str_EntryID = strEntryID; }
    this.setYTMatchingEntryID = function(strYTMatchingEntryID){ this.str_YTMatchingEntryID = strYTMatchingEntryID; }
    this.setSegmentType = function(strType){ this.str_SegmentType = strType; }
    this.setPrimaryMediaType = function(strMediaType){ this.str_PrimaryMediaType = strMediaType; }
    this.setVimeoCode = function(strVimeoCode){ this.str_VimeoCode = strVimeoCode; }
	this.setYouTubeCode = function(strYouTubeCode){ this.str_YouTubeCode = strYouTubeCode; }
	this.setMP3Filename = function(strMP3Filename){ this.str_MP3Filename = strMP3Filename; }
	this.setSoundSliceCode = function(strSoundSliceCode){ this.str_SoundSliceCode = strSoundSliceCode; }
	this.setPDFFilename = function(strPDFFilename){ this.str_PDFFilename = strPDFFilename; }
	this.setMediaURL = function(strURL){ this.str_URL = strURL; }
	this.setGPXFilename = function(strGPXFilename){ this.str_GPXFilename = strGPXFilename; }
	this.setTitle = function(strTitle){ this.str_Title = strTitle; }
	this.setDisplayName = function(strDisplayName){ this.str_DisplayName = strDisplayName; }
	this.setFullDisplayName = function(strFullDisplayName){ this.str_FullDisplayName = strFullDisplayName; }
	this.setChaptersArray = function(aChaptersArray){ this.a_ChaptersArray = aChaptersArray; }
    this.setLoopsArray = function(aLoopsArray){ this.a_LoopsArray = aLoopsArray; }
    this.setFacebookUser = function(strUser){ this.str_FacebookUser = strUser;}
    this.setFacebookVideoCode = function(strCode){ this.str_FacebookVideoCode = strCode; }
    this.setInstagramID = function(strID){ this.str_InstagramID = strID; }
    this.setHTMLContent = function(strHTML){ this.str_HTMLContent = strHTML; }
    this.setMediaStartTime = function(fTime){ this.f_MediaStartTime = fTime;}
    this.setDescription = function( strDescription ){ this.str_Description = strDescription; }
    
    this.isLoaded = function(){ return this.b_IsLoaded; }
	this.getEntryID = function(){ return this.str_EntryID; }
    this.getYTMatchingEntryID = function(){ return this.str_YTMatchingEntryID; }
    this.getSegmentType = function(){ return this.str_SegmentType; }
    this.getPrimaryMediaType = function(){ return this.str_PrimaryMediaType; }
    this.getVimeoCode = function(){ return this.str_VimeoCode; }
	this.getYouTubeCode = function(){ return this.str_YouTubeCode; }
	this.getMP3Filename = function(){ return this.str_MP3Filename; }
	this.getSoundSliceCode = function(){ return this.str_SoundSliceCode; }
	this.getPDFFilename = function(){ return this.str_PDFFilename; }
	this.getMediaURL = function(){ return this.str_URL; }
	this.getGPXFilename = function(){ return this.str_GPXFilename; }
	this.getTitle = function(){ return this.str_Title; }
	this.getDisplayName = function(){ return this.str_DisplayName; }
	this.getFullDisplayName = function(){ return this.str_FullDisplayName; }
	this.getChaptersArray = function(){ return this.a_ChaptersArray; }
    this.getLoopsArray = function(){ return this.a_LoopsArray; }
    this.getFacebookUser = function(){ return this.str_FacebookUser;}
    this.getFacebookVideoCode = function(){ return this.str_FacebookVideoCode; }
    this.getInstagramID = function(){ return this.str_InstagramID; }
    this.getHTMLContent = function(){ return this.str_HTMLContent; }
    this.getMediaStartTime = function(){ return this.f_MediaStartTime; }
    this.getDescription = function(){ return this.str_Description; }
    
    this.resetAll = function()
    {
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
    }
	this.allowUserData = function()
	{
		let bAllowUserData = false;
		if(	this.getSegmentType() == "entry" && 		//It must be an entry
			this.getEntryID() != "" &&					//the entryID must be set.
			(this.getPrimaryMediaType() == "vimeo" ||	//It must either be Vimeo
			this.getPrimaryMediaType() == "youtube" ||	//or YouTube
			this.getPrimaryMediaType() == "mp3"))		//or an MP3
		{
			bAllowUserData = true;
		}
		return bAllowUserData;
	}      

	this.allowChapters = function()
	{
		let bAllowUserData = false;
		if(	this.getSegmentType() == "entry" && 		//It must be an entry
			this.getEntryID() != "" &&					//the entryID must be set.
			(this.getPrimaryMediaType() == "vimeo" ||	//It must either be Vimeo
			this.getPrimaryMediaType() == "youtube" ||	//or YouTube
			this.getPrimaryMediaType() == "mp3"))		//or an MP3
		{
			bAllowUserData = true;
		}
		return bAllowUserData;
	}
	
	this.allowLoops = function()
	{
		let bAllowUserData = false;
		if(	this.getSegmentType() == "entry" && 		//It must be an entry
			this.getEntryID() != "" &&					//the entryID must be set.
			(this.getPrimaryMediaType() == "vimeo" ||	//It must either be Vimeo
			this.getPrimaryMediaType() == "youtube" ||	//or YouTube
			this.getPrimaryMediaType() == "mp3"))		//or an MP3
		{
			bAllowUserData = true;
		}
		return bAllowUserData;
	}
	
	this.allowImport = function()
	{
		let bAllowImport = false;
		if(	this.getSegmentType() == "other" && 		//It must NOT be an entry
			this.getEntryID() == "" &&					//the entryID must be blank
			this.getPrimaryMediaType() == "youtube")	//it MUST be a Youtube video.
		{
			bAllowImport = true;
		}
		return bAllowImport;
	}
	
	
	this.inferMediaType = function()
	{
		if( this.getVimeoCode() !== "")
		{
			this.setPrimaryMediaType("vimeo")
		}
		else if( this.getYouTubeCode() !== "" )
		{
			this.setPrimaryMediaType("youtube")
		}
		else if( this.getFacebookVideoCode() !== "" )
		{
			this.setPrimaryMediaType("facebook")
		}
		else if( this.getInstagramID() !== "" )
		{
			this.setPrimaryMediaType("instagram")
		}
		else if( this.getMP3Filename() !== "" )
		{
			this.setPrimaryMediaType("mp3")
		}
		else if( this.getSoundSliceCode() !== "" )
		{
			this.setPrimaryMediaType("soundslice")
		}
		else if( this.getPDFFilename() !== "" )
		{
			this.setPrimaryMediaType("pdf")
		}
		else if( this.getMediaURL() !== "" )
		{
			this.setPrimaryMediaType("url")
		}
		else
		{
			this.setPrimaryMediaType("html")
		}
	}


	this.setUserLoopsEntryIDsFromString = function( strUserLoopEntryIDs )
	{
		let theIDs = strUserLoopEntryIDs.split("|");
		for(let i = 0; i < theIDs.length; i++)
		{
			if(theIDs[i] !== "")
			{
				this.a_UserLoopEntryIDs.push( theIDs[i] );
			}
		}
	}
	
	this.getUserLoopsEntryIDs = function()
	{
		return this.a_UserLoopEntryIDs;
	}
	
	this.getUserLoopEntryIDsCount = function()
	{
		return this.a_UserLoopEntryIDs.length;
	}
}
