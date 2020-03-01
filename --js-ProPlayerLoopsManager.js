class ProPlayerLoopsManager {
    constructor() {
        this.a_Collections = [];
        this.n_LastActiveCollectionID = -1;
    }
    hasLists() {
        return this.a_Collections.length > 0;
    }
    setLastActiveCollectionID(nCollectionID) {
        this.n_LastActiveCollectionID = nCollectionID;
        //console.log("Setting last active list to:" + nListID);
    }
    getLastActiveListID() {
        return this.n_LastActiveCollectionID;
    }
    resetAll() {
        for (let i = 0; i < this.a_Collections.length; i++) {
            this.a_Collections[i].reset();
        }
        this.a_Collections.length = 0;
        $('#addUserLoopButton').toggleClass('disabled', true);
        $('#saveUserLoopsButton').toggleClass('disabled', true);
    }
    createNewCollection(strUIParentID, strCollectionRole, bEditable) {
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
    addListToCollectionFromArray(aLoopsArray, strCollectionRole, strListTitle, bResetCollection) {
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
    appendCollection(newCollection) {
        this.a_Collections.push(newCollection);
    }
    getCollectionAt(nIndex) {
        return this.a_Collections[nIndex];
    }
    getCollectionByID(nCollectionID) {
        let theCollection = null;
        for (let i = 0; i < this.a_Collections.length; i++) {
            if (this.a_Collections[i].getID() == nCollectionID) {
                theCollection = this.a_Collections[i];
                break;
            }
        }
        return theCollection;
    }
    getCollectionByRole(strCollectionRole) {
        let theCollection = null;
        for (let i = 0; i < this.a_Collections.length; i++) {
            if (this.a_Collections[i].getRole() == strCollectionRole) {
                theCollection = this.a_Collections[i];
            }
        }
        return theCollection;
    }
    loopSelected(nCollectionID, nListIndex, nLoopIndex) {
        //console.log("Loop Selected: " + nListID + "," + nLoopIndex);
        this.clearActiveLoopsExcept(nCollectionID, nListIndex);
        this.setLastActiveCollectionID(nCollectionID);
        let theCollection = this.getCollectionByID(nCollectionID);
        theCollection.loopSelected(nListIndex, nLoopIndex);
    }
    loopToggleSelected(nCollectionID, nListIndex, nLoopIndex) {
        this.clearActiveLoopsExcept(nCollectionID, nListIndex);
        this.setLastActiveCollectionID(nCollectionID);
        this.getCollectionByID(nCollectionID).loopToggleSelected(nListIndex, nLoopIndex);
    }
    activateNextLoop() {
        let theID = -1;
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
    activatePreviousLoop() {
        let theID = -1;
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
    clearActiveLoopsExcept(nCollectionID, nListIndex) {
        //console.log("Clearing active loops");
        //Step 1: clear other lists.
        for (let i = 0; i < this.a_Collections.length; i++) {
            //console.log("Clearing active loops for list: " + nListID)
            let theCollection = this.a_Collections[i];
            if (theCollection.getID() == nCollectionID) {
                theCollection.clearActiveLoopsExcept(nListIndex);
            } else {
                theCollection.clearAllActiveLoops();
            }
        }
    }
    clearAllActiveLoops() {
        //Step 1: clear other lists.
        for (let i = 0; i < this.a_Collections.length; i++) {
            this.a_Collections[i].clearAllActiveLoops();
        }
    }
    addUserLoop() {
        let theLoop = thePlayer.getEngineLoop();
        if (theLoop !== null) {
            let bWasPlaying = thePlayer.theEngine.isPlaying();
            if (bWasPlaying) {
                thePlayer.theEngine.stopPlayback();
            }
            let loopName = prompt('Enter loop name.', theLoop.getName());
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
    removeLoopFromList(nCollectionID, nListIndex, nLoopIndex) {
        let theCollection = this.getCollectionByID(nCollectionID);
        theCollection.removeLoop(nListIndex, nLoopIndex);
        theCollection.rebuildLoopsUIList();
        this.pushUserLoopInterfaceState();
    }
    getUserLoopsArray() {
        return this.getCollectionByRole('user').getLoopsArray();
    }
    pushUserLoopInterfaceState() {
        let bAddButtonEnabled = false;
        let bSaveButtonEnabled = false;
        let userLoopsCollection = this.getCollectionByRole('user');
        //console.log("User List is: " + userList);
        if (userLoopsCollection == null) {
            //console.log("Showing no segment loaded error");
            $('#userLoopListEmpty').toggle(true);
        } else {
            $('#userLoopList').toggleClass('dirty', userLoopsCollection.isDirty());
            bSaveButtonEnabled = userLoopsCollection.isDirty();
            let theLoop = thePlayer.getEngineLoop();
            if (theLoop !== null) {
                bAddButtonEnabled = !userLoopsCollection.findMatchingLoop(theLoop);
            }
        }
        $('#addUserLoopButton').toggleClass('disabled', !bAddButtonEnabled);
        $('#saveUserLoopsButton').toggleClass('disabled', !bSaveButtonEnabled);
    }
    savingUserData() {
        this.getCollectionByRole('user').showLoadingIndicator();
    }
    getFirstListWithLoops() {
        let nIndex = -1;
        for (let i = 0; i < this.a_Collections.length; i++) {
            if (this.a_Collections[i].getCollectionLoopCount() > 0) {
                nIndex = i;
                break;
            }
        }
        return nIndex;
    }
}

class ProPlayerLoopsCollection {
    constructor(nCollectionID, strListWrapperID, strCollectionRole, bEditable) {
        this.str_UIWrapperID = '#' + strListWrapperID;
        this.b_Editable = bEditable;
        this.n_CollectionID = nCollectionID;
        this.str_Role = strCollectionRole;
        this.a_Lists = [];
        this.b_IsDirty = false;
    }
    getListCount() {
        return this.a_Lists.length;
    }
    getID() {
        return this.n_CollectionID;
    };
    getRole() {
        return this.str_Role;
    }
    getEditable() {
        return this.b_Editable;
    }
    isDirty() {
        return this.b_IsDirty;
    };
    setDirty(bDirty) {
        this.b_IsDirty = bDirty;
    }
    clearLoopsUIList() {
        $(this.str_UIWrapperID).empty();
    }
    showLoadingIndicator() {
        thePlayer.spinner(this.str_UIWrapperID);
    }
    getListAt(nIndex) {
        let theList = null;
        if (this.validListIndex(nIndex)) {
            theList = this.a_Lists[nIndex];
        }
        return theList;
    }
    reset() {
        this.clearLoopsUIList();
        this.a_Lists.length = 0;
        this.setDirty(false);
        $(this.str_UIWrapperID + 'Empty').toggle(true);
    }
    getLoopsArray() {
        let loopsArray = [];
        for (let i = 0; i < this.a_Lists.length; i++) {
            let theLoops = this.a_Lists[i].getLoopsArray();
            for (j = 0; j < theLoops.length; j++) {
                loopsArray.push(theLoops[j]);
            }
        }
        console.log(loopsArray);
        return loopsArray;
    }
    getCollectionLoopCount() {
        let theTotal = 0;
        for (let i = 0; i < this.a_Lists.length; i++) {
            theTotal += this.a_Lists[i].getListLoopCount();
        }
        return theTotal;
    }
    setNewLoopName(nListIndex, nLoopIndex, strNewName) {
        var theLoop = this.getLoopAt(nListIndex, nLoopIndex);
        if (theLoop !== null) {
            theLoop.setName(strNewName);
            this.setDirty(true);
        }
    }
    getLoopAt(nListIndex, nLoopIndex) {
        if (this.validListIndex(nListIndex)) {
            return this.a_Lists[nListIndex].getLoopAt(nLoopIndex);
        } else {
            return null;
        }
    }
    validListIndex(nListIndex) {
        return nListIndex < this.a_Lists.length ? true : false;
    }
    rebuildLoopsUIList() {
        thePlayer.spinner(this.str_UIWrapperID);
        $(this.str_UIWrapperID + 'Empty').toggle(false);
        //this function assumes the loop list has already been reset
        let strListHTML = '';
        let bEditable = this.getEditable();
        let collectionID = this.getID();
        let bUseAccordion = this.a_Lists.length > 1;
        if (bUseAccordion) {
            // strListHTML += '<ul class="accordion sidebar-accordion" id="loopsListAccordion-' + this.getRole() + '" ';
            // strListHTML += 'data-accordion data-allow-all-closed="true" data-multi-expand="false">';
            strListHTML = `<ul class="accordion sidebar-accordion" id="loopsListAccordion-${this.getRole()}
			data-accordion data-allow-all-closed="true" data-multi-expand="false">`;
        }
        for (let listIndex = 0; listIndex < this.a_Lists.length; listIndex++) {
            let theList = this.a_Lists[listIndex];
            if (bUseAccordion) {
                // strListHTML += '<li class="accordion-item" data-accordion-item>';
                // strListHTML += '<a class="accordion-title">' + theList.getListTitle() + '</a>';
                // strListHTML += '<div class="accordion-content" data-tab-content>';
                strListHTML = `<li class="accordion-item" data-accordion-item>
					<a class="accordion-title">${theList.getListTitle()}</a>
					<div class="accordion-content" data-tab-content>
				`;
            }
            strListHTML += '<ul class="sidebar-list dark">';
            for (let loopIndex = 0; loopIndex < theList.getLoopsArray().length; loopIndex++) {
                let theLoop = theList.getLoopAt(loopIndex);
                theLoop.setChecked(false);
                var loopItem = '<li class="sidebar-list-item loop button" id="loopItem-';
                loopItem += collectionID + '-' + listIndex + '-' + loopIndex + '">';
                let bStacking = theList.enableLoopStacking(loopIndex);
                if (bStacking || bEditable) {
                    let theClass = '';
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
            let accordionID = '#loopsListAccordion-' + this.getRole();
            $(accordionID).foundation();
        }
    }
    appendList(newList) {
        this.a_Lists.push(newList);
    }
    addListFromLoopArray(aLoopsArray, strListTitle) {
        //array must elements assumed to be in [name, start, end] format\
        //Clear this collection before calling this if you don't want the new
        // list appended.
        let theListIndex = this.a_Lists.length;
        let theList = new ProPlayerLoopsList(this.getID(), theListIndex, strListTitle);
        theList.createFromLoopArray(aLoopsArray);
        this.appendList(theList);
        this.setDirty(false);
    }
    findMatchingLoop(loopToMatch) {
        bMatchFound = false;
        for (let i = 0; i < this.a_Lists.length; i++) {
            if (this.a_Lists[i].findMatchingLoop(loopToMatch)) {
                bMatchFound = true;
                break;
            }
        }
        return bMatchFound;
    }
    clearActiveLoopsExcept(nListIndex) {
        for (let i = 0; i < this.a_Lists.length; i++) {
            if (i !== nListIndex) {
                this.a_Lists[i].clearActiveLoops();
                this.a_Lists[i].refreshLoopCheckedStates();
            }
        }
    }
    clearAllActiveLoops() {
        for (let i = 0; i < this.a_Lists.length; i++) {
            this.a_Lists[i].clearActiveLoops();
            this.a_Lists[i].refreshLoopCheckedStates();
        }
    }
    loopSelected(nListIndex, nLoopIndex) {
        if (this.validListIndex(nListIndex)) {
            this.getListAt(nListIndex).loopSelected(nLoopIndex);
        }
    }
    loopToggleSelected(nListIndex, nLoopIndex) {
        if (this.validListIndex(nListIndex)) {
            this.getListAt(nListIndex).loopToggleSelected(nLoopIndex);
        }
    }
    addInstantLoop(theLoop) {
        let theList = this.getListAt(0);
        if (theList == null) {
            theList = new ProPlayerLoopsList(this.getID(), 0);
            this.appendList(theList);
        }
        theList.addInstantLoop(theLoop);
        this.setDirty(true);
    }
    addInstantLoopToList(nListIndex, theLoop) {
        if (this.validListIndex(nListIndex)) {
            this.getListAt(nListIndex).addInstantLoop(theLoop);
            this.setDirty(true);
        }
    }
    removeLoop(nListIndex, nLoopIndex) {
        if (this.validListIndex(nListIndex)) {
            this.getListAt(nListIndex).removeLoop(nLoopIndex);
            this.setDirty(true);
        }
    }

}


class ProPlayerLoopsList {
    constructor(nCollectionID, nListID, strListTitle) {
        this.a_Loops = [];
        this.n_CollectionID = nCollectionID;
        this.n_ListID = nListID;
        this.str_ListTitle = strListTitle;
    }
    getCollectionID() {
        return this.n_CollectionID;
    }
    getListID() {
        return this.n_ListID;
    }
    getListTitle() {
        return this.str_ListTitle;
    }
    setLoopsList(a_newLoopsList) {
        this.a_Loops = a_newLoopsList;
    }
    getLoopAt(nIndex) {
        return this.a_Loops[nIndex];
    }
    getLoopStart(nIndex) {
        return this.getLoopAt(nIndex).getLoopStart();
    }
    getLoopEnd(nIndex) {
        return this.getLoopAt(nIndex).getLoopEnd();
    }
    getListLoopCount() {
        return this.a_Loops.length;
    }
    reset() {
        this.a_Loops.length = 0;
    }
    addLoopFromValues(strName, fLoopStart, fLoopEnd) {
        this.a_Loops.push(new InstantLoop(strName, fLoopStart, fLoopEnd));
    }
    addInstantLoop(theLoop) {
        this.a_Loops.push(theLoop);
        return this.a_Loops.length - 1;
    }
    setNewLoopName(nLoopIndex, strNewName) {
        this.getLoopAt(nLoopIndex).setName(strNewName);
    }
    activateNextLoop() {
        var currentIndex = this.getFirstActiveLoop();
        if (currentIndex > -1) {
            if (currentIndex < this.a_Loops.length - 1) {
                this.loopSelected(currentIndex + 1);
            } else {
                this.loopSelected(0);
            }
        }
    }
    activatePreviousLoop() {
        var currentIndex = this.getFirstActiveLoop();
        if (currentIndex > -1) {
            if (currentIndex > 0) {
                this.loopSelected(currentIndex - 1);
            } else {
                this.loopSelected(this.a_Loops.length - 1);
            }
        }
    }
    getFirstActiveLoop() {
        let nIndex = -1;
        if (this.a_Loops.length > 0) {
            nIndex = 0;
            for (let i = 0; i < this.a_Loops.length; i++) {
                if (this.a_Loops[i].getChecked()) {
                    nIndex = i;
                    break;
                }
            }
        }
        return nIndex;
    }
    removeLoop(nIndex) {
        //console.log('Current List: ' + this.a_Loops);
        //console.log('Removing Loop at: ' + nIndex);
        this.a_Loops.splice(nIndex, 1);
        //console.log('New List: ' + this.a_Loops);
    }
    createFromLoopArray(aLoopsArray) {
        //array must elements assumed to be in [name, start, end] format
        for (let i = 0; i < aLoopsArray.length; i++) {
            this.addLoopFromValues(aLoopsArray[i][0], aLoopsArray[i][1], aLoopsArray[i][2]);
        }
    }
    appendFromLoopArray(aLoopsArray) {
        //array must elements assumed to be in [name, start, end] format
        for (let i = 0; i < aLoopsArray.length; i++) {
            this.addLoopFromValues(aLoopsArray[i][0], aLoopsArray[i][1], aLoopsArray[i][2]);
        }
    }
    findMatchingLoop(loopToMatch) {
        let bMatchFound = false;
        for (let i = 0; i < this.a_Loops.length; i++) {
            let myLoop = this.a_Loops[i];
            if (Math.abs(loopToMatch.getLoopStart() - myLoop.getLoopStart()) < 0.1 &&
                Math.abs(loopToMatch.getLoopEnd() - myLoop.getLoopEnd()) < 0.1) {
                bMatchFound = true;
            }
        }
        return bMatchFound;
    }
    getLoopsArray() {
        let newArray = [];
        //array must elements assumed to be in [name, start, end] format
        for (let i = 0; i < this.a_Loops.length; i++) {
            newArray.push([
                this.a_Loops[i].getName(),
                this.a_Loops[i].getLoopStart(),
                this.a_Loops[i].getLoopEnd()
            ]);
        }
        return newArray;
    }
    loopSelected(nLoopIndex) {
        this.clearActiveLoops();
        this.toggleLoopCheckedState(nLoopIndex);
        this.refreshLoopCheckedStates();
        //console.log("Activating Loop At: " + nLoopIndex);
        var theLoop = this.getLoopAt(nLoopIndex);
        //console.log('Activating Loop:' + theLoop);
        thePlayer.theEngine.loadLoop(this.getLoopAt(nLoopIndex).getLoopStart(), this.getLoopAt(nLoopIndex).getLoopEnd());
    }
    loopToggleSelected(nLoopIndex) {
        //console.log('Loop Toggle Selected: ' + nLoopIndex);
        this.processLoopToggle(nLoopIndex);
        this.refreshLoopCheckedStates();
        var theLoop = this.computeStackedLoop();
        if (theLoop !== null) {
            thePlayer.theEngine.loadLoop(theLoop.getLoopStart(), theLoop.getLoopEnd());
        }
    }
    toggleLoopCheckedState(nLoopIndex) {
        var isLoopAlreadyChecked = this.getLoopAt(nLoopIndex).getChecked();
        if (isLoopAlreadyChecked && this.isLoopAMiddle(nLoopIndex)) {
            // If this loop is already checked, and user clicks check again,
            // clear all checked loops and turn this one back
            this.clearActiveLoops();
            this.getLoopAt(nLoopIndex).setChecked(true);
        } else {
            var previousLoopChecked = this.getLoopAt(nLoopIndex).toggleChecked();
            if (previousLoopChecked) {
                for (let i = nLoopIndex - 1; i >= 0; i--) {
                    if (!this.getLoopAt(nLoopIndex).getChecked() || !this.getLoopAt(nLoopIndex).getStackable()) {
                        previousLoopChecked = false;
                    }
                    this.getLoopAt(nLoopIndex).setChecked(previousLoopChecked);
                }
                previousLoopChecked = true;
                for (let i = nLoopIndex + 1; i < this.a_Loops.length; i++) {
                    if (!this.getLoopAt(i).getChecked() || !this.getLoopAt(i).getStackable()) {
                        previousLoopChecked = false;
                    }
                    this.getLoopAt(i).setChecked(previousLoopChecked);
                }
            }
        }
    }
    previousLoopConnected(i) {
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
    nextLoopConnected(i) {
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
    enableLoopStacking(nLoopIndex) {
        var bEnableStacking = false;
        if (!this.previousLoopConnected(nLoopIndex) &&
            this.nextLoopConnected(nLoopIndex) &&
            this.nextLoopConnected(nLoopIndex + 1)) {
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
    clearActiveLoops() {
        for (let i = 0; i < this.a_Loops.length; i++) {
            this.getLoopAt(i).setChecked(false);
        }
        this.refreshLoopCheckedStates();
    }
    refreshLoopCheckedStates() {
        for (let i = 0; i < this.a_Loops.length; i++) {
            $(this.getLoopParentID(i)).toggleClass('active', this.getLoopAt(i).getChecked());
        }
    }
    getLoopParentID(nIndex) {
        return '#loopItem-' + this.getCollectionID() + '-' + this.getListID() + '-' + nIndex;
    }
    processLoopToggle(nSelectedIndex) {
        //console.log("Processing Loop Toggle At: " + nSelectedIndex);
        var bLoopAlreadyChecked = this.getLoopAt(nSelectedIndex).getChecked();
        var bLoopIsMiddle = this.isLoopAMiddle(nSelectedIndex);
        //Case 1: Loop is already checked and is between two other checked loops.
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
    setStackableLoopRange(nLowerIndex, nHigherIndex) {
        for (let i = nLowerIndex; i <= nHigherIndex; i++) {
            this.getLoopAt(i).setChecked(true);
        }
    }
    findPreviousStackableCheckedLoop(startIndex) {
        nFoundIndex = -1;
        for (let i = startIndex - 1; i >= 0; i--) {
            if (this.getLoopAt(i).getChecked() && this.getLoopAt(i).getStackable()) {
                nFoundIndex = i;
            }
        }
        return nFoundIndex;
    }
    findNextStackableCheckedLoop(startIndex) {
        nFoundIndex = -1;
        var nLength = this.a_Loops.length;
        for (let i = startIndex + 1; i < nLength; i++) {
            if (this.getLoopAt(i).getChecked() && this.getLoopAt(i).getStackable()) {
                nFoundIndex = i;
            }
        }
        return nFoundIndex;
    }
    toggleLoopCheckedState(nLoopIndex) {
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
                for (let i = nLoopIndex - 1; i >= 0; i--) {
                    if (!this.getLoopAt(i).getChecked() || !this.getLoopAt(i).getStackable()) {
                        previousLoopChecked = false;
                    }
                    this.getLoopAt(i).setChecked(previousLoopChecked);
                }
                previousLoopChecked = true;
                for (let i = nLoopIndex + 1; i < this.a_Loops.length; i++) {
                    if (!this.getLoopAt(i).getChecked() || !this.getLoopAt(i).getStackable()) {
                        previousLoopChecked = false;
                    }
                    this.getLoopAt(i).setChecked(previousLoopChecked);
                }
            }
        }
    }
    isLoopAMiddle(nLoopIndex) {
        var lowerLoop = false;
        var higherLoop = false;
        for (let i = 0; i < this.a_Loops.length; i++) {
            if (this.getLoopAt(i).getChecked() && this.getLoopAt(i).getStackable()) {
                if (i < nLoopIndex) {
                    //console.log('Lower selected loop found');
                    lowerLoop = true;
                } else if (i > nLoopIndex) {
                    //console.log('Higher selected loop found');
                    higherLoop = true;
                }
            }
        }
        //console.log('Loop is middle: ' + (lowerLoop && higherLoop));
        return lowerLoop && higherLoop;
    }
    computeStackedLoop() {
        var loopStart = 0;
        var loopEnd = 0;
        var loopInitialized = false;
        var nLength = this.a_Loops.length;
        for (let i = 0; i < nLength; i++) {
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
        }
        //console.log("New Loop calculated: " + loopStart + "," + loopEnd);
        if (this.validateLoop(loopStart, loopEnd)) {
            return new InstantLoop('Combined Loop', loopStart, loopEnd);
            //this.theEngine.loadLoop( loopStart, loopEnd );
        } else {
            return null;
            //this.theEngine.stopLooping();
        }
    }
    validateLoop(loopStart, loopEnd) {
        var loopValid = true;
        if (loopStart < 0 || loopStart > loopEnd || loopEnd <= 0 || loopStart == loopEnd) {
            loopValid = false;
        }
        return loopValid;
    }
}


class InstantLoop {
    constructor(strName, fStartTime, fStopTime) {
        this.str_Name = strName;
        this.f_StartTime = parseFloat(fStartTime);
        this.f_EndTime = parseFloat(fStopTime);
        this.b_Stackable = false;
        this.b_Checked = false;
        if (strName == '') {
            this.str_Name = this.f_StartTime.toFixed(2) + ' - ' + this.f_EndTime.toFixed(2);
        }
    }
    //Setters
    setLoopStart(fStartTime) {
        this.f_StartTime = parseFloat(fStartTime);
    }
    setLoopEnd(fEndTime) {
        this.f_EndTime = parseFloat(fStopTime);
    }
    setStackable(bStackable) {
        this.b_Stackable = bStackable;
    }
    setChecked(bChecked) {
        this.b_Checked = bChecked;
    }
    setName(strName) {
        this.str_Name = strName;
    }
    //Getters
    getLoopStart() {
        return this.f_StartTime;
    }
    getLoopEnd() {
        return this.f_EndTime;
    }
    getStackable() {
        return this.b_Stackable;
    }
    getChecked() {
        return this.b_Checked;
    }
    getName() {
        return this.str_Name;
    }
    toggleChecked() {
        let bWasChecked = this.b_Checked;
        this.b_Checked = !bWasChecked;
        return this.b_Checked;
    }
    validate() {
        if (this.f_EndTime < this.f_StartTime + 0.1) {
            return false;
        }
        return true;
    }
    getDefaultName() {
        return this.f_StartTime.toFixed(2) + ' - ' + this.f_EndTime.toFixed(2);
    }

}