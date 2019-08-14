function ProPlayerUserDataManager()
{
	
	this.n_SegmentID = -1;
	this.b_UserDataDirty = false;
	this.setDirty = function(bDirty){ this.b_UserDataDirty = bDirty;}	
	this.isDirty = function(){ return this.b_UserDataDirty;}
	this.getSegmentID = function(){ return this.n_SegmentID; }
	this.setNewSegmentID = function( nSegmentID )
	{
		this.resetAll();
		this.n_SegmentID = nSegmentID;
	}
	
	
	this.resetAll = function()
	{
		$('#userSegmentDataFormWrapper').empty();
		this.n_SegmentID = -1;
		this.b_UserDataDirty = false;
	}
	
	this.reloadUserData = function()
	{
		this.loadUserDataForm();
		
	}
	this.loadUserDataForm = function()
	{
		var requestURL = gc_BranchPath + '/--ajax-load-user-data-form/?';
		requestURL += 'segmentID=' + this.getSegmentID();
		//console.log("Loading user data from: " + requestURL);
		$('#userSegmentDataFormWrapper').load(requestURL, function(){
			thePlayer.userDataManager.pushUserLoops();
			
		});
		
	}
	
	this.pushUserLoops = function()
	{
		var loopsText = $('textarea[name=cf_member_segment_data_loops]').val();
		var validLoopsArray = this.validateJSON( loopsText );
		if( validLoopsArray)
		{
			//console.log("Found user loops, adding list.");
			thePlayer.loopsManager.createNewCollection( "userLoopList", "user", true );
			thePlayer.loopsManager.addListToCollectionFromArray(validLoopsArray, "user", "Your Loops", false);
		}
		else
		{
			//console.log("Adding empty array for User list");
			thePlayer.loopsManager.createNewCollection( "userLoopList", "user", true );
		}
		
		this.importAllSegmentLoops();
	}
	
	this.importAllSegmentLoops = function()
	{
		$.get(gc_BranchPath + '/--ajax-get-segment-user-loops/' + this.n_SegmentID, function(data){
			thePlayer.userDataManager.processImportedSegmentLoops( data );
		})
		
	}
	
	this.processImportedSegmentLoops = function( arrImportedLoops )
	{
		if(this.validateJSON(arrImportedLoops))
		{
			let theImportedLoopData = JSON.parse(arrImportedLoops);
			thePlayer.loopsManager.createNewCollection( "communityLoopList", "community", false );
			for(let i = 0; i < theImportedLoopData.memberLoopCollections.length; i++)
			{
				let theMemberLoops = theImportedLoopData.memberLoopCollections[i];
				thePlayer.loopsManager.addListToCollectionFromArray(theMemberLoops.memberLoops, "community", theMemberLoops.memberName, false );
			}
		}
	}
	
	this.updateUserDataForm = function()
	{
		let userLoopsArray = thePlayer.loopsManager.getUserLoopsArray();
		if(userLoopsArray.length != 0)
		{
			$('textarea[name=cf_member_segment_data_loops]').val(JSON.stringify(userLoopsArray));
		}
		else
		{
			$('textarea[name=cf_member_segment_data_loops]').val("");
		}
	}
	
	this.saveUserData = function()
	{
		this.updateUserDataForm();
		var theForm = $("form#userSegmentDataForm");
		formData = $(theForm).serialize();
		//console.log(formData);
		$.ajax({
			  type: 'POST',
			  url: $(theForm).attr('action'),
			  data: formData
		})
		.done(function(response) {
			thePlayer.userDataManager.reloadUserData();
		});	
	}
	this.validateJSON = function(jsonString)
	{
	    try {
	        var o = JSON.parse(jsonString);
	
	        // Handle non-exception-throwing cases:
	        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
	        // but... JSON.parse(null) returns null, and typeof null === "object", 
	        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
	        if (o && typeof o === "object") {
	            return o;
	        }
	    }
	    catch (e) { }
	
	    return false;
	};	
}