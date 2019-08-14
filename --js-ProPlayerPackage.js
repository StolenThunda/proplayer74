function ProPlayerPackage()
{
	
	this.str_PackageType = ""; // must be "entry" or "other"
	this.b_Loaded = false;
	this.str_EntryID = "";
	this.str_Title = "";
	this.str_ChannelName = "";
	this.str_ChannelShortName = "";
	this.str_DefaultSegmentEntryID = "";
	this.str_Description = "";
	this.str_Overview = "";
	this.str_ImageURL = "";
	this.str_Tuning = "";
	this.a_Sections = [];
	this.str_Date = "";	
	this.str_ErrorMessage = "";
	
	
	this.setPackageType = function(strType){ this.str_PackageType = strType; }
	this.setLoaded = function(bLoaded){ this.b_Loaded = bLoaded;}
	this.setEntryID = function(nEntryID){ this.str_EntryID = nEntryID;}
	this.setTitle = function(strTitle){ this.str_Title = strTitle;}
	this.setChannelName = function(strChannelName){ this.str_ChannelName = strChannelName;}
	this.setChannelShortName = function(strChannelShortName){ this.str_ChannelShortName = strChannelShortName;}
	this.setDefaultSegmentEntryID = function(strEntryID){ this.str_DefaultSegmentEntryID = strEntryID;}
	this.setDescription = function(strDescription){ this.str_Description = strDescription;}
	this.setOverview = function(strOverview){ this.str_Overview = strOverview;}
	this.setImageURL = function(strImageURL){ this.str_ImageURL = strImageURL;}
	this.setSections = function(objSections){ this.a_Sections = objSections;}
	this.setDate = function(strDate){ this.str_Date = strDate; }
	this.setErrorMessage = function(strError){ this.str_ErrorMessage = strError; }
	this.setTuning = function(strTuning){this.str_Tuning = strTuning;}
	
	this.getPackageType = function(){ return this.str_PackageType; }
	this.isLoaded = function(){ return this.b_Loaded;}
	this.getEntryID = function(){ return this.str_EntryID;}
	this.getTitle = function(){ return this.str_Title;}
	this.getChannelName = function(){ return this.str_ChannelName;}
	this.getChannelShortName = function(){ return this.str_ChannelShortName;}
	this.getDefaultSegmentEntryID = function(){ return this.str_DefaultSegmentEntryID;}
	this.getDescription = function(){ return this.str_Description;}
	this.getOverview = function(){ return this.str_Overview;}
	this.getImageURL = function(){ return this.str_ImageURL;}
	this.getSections = function(){ return this.a_Sections;}
	this.getDate = function(){ return this.str_Date;}
	this.getErrorMessage = function(){ return this.str_ErrorMessage;}
	this.getTuning = function(){ return this.str_Tuning;}
	
	
	this.resetAll = function()
	{			
		this.str_PackageType = ""; // must be "entry" or "other"
		this.b_Loaded = false;
		this.str_EntryID = "";
		this.str_Title = "";
		this.str_ChannelName = "";
		this.str_ChannelShortName = "";
		this.str_DefaultSegmentEntryID = "";
		this.str_Description = "";
		this.str_Overview = "";
		this.str_ImageURL = "";
		this.a_Sections = [];
		this.str_Date = "";	
		this.str_ErrorMessage = "";
	}
	
	this.isEntry = function()
	{
		return this.str_PackageTYpe == "entry";
	}
	
	this.hasSections = function()
	{
		return this.a_Sections.length > 0;
	}
}

