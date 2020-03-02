
import { ProPlayer } from './--js-ProPlayer';
	
const gc_BranchPath = '/'+ '{branch_path}';
	
var thePlayer;
(function()
// if( isIE() )
// {
//     showIEWarning();
// };

 
{
    // debugger
    thePlayer = new ProPlayer;
    
    $(document).foundation();
    new FastClick(document.body);
        
    thePlayer.openUnknownPackageFromSegments( '{segment_2}', '{segment_3}', '{segment_4}', false);

})();


function isIE()
{
    strUserAgent = window.navigator.userAgent;
    return ((strUserAgent.indexOf('MSIE') > -1) || (strUserAgent.indexOf('Trident') > -1));
}

function showIEWarning()
{
    var theButtons = document.getElementsByClassName('toolbar-button');
    for(i = 0; i < theButtons.length; i++)
    {
        theButtons[i].style.display = 'none';
    }
    
    var warningString = "<div class='media-content-wrapper'><div class='text-center' style='max-width: 500px; margin: 0 auto;'>";
    warningString += "<h2>Internet Explorer is not supported</h2>";
    warningString += "<p>It looks like you're using Internet Explorer. Microsoft has abandoned IE in favor of their newer Edge browser. ";
    warningString += "Because they're no longer updating it, certain features in the Pro Player do not work in Internet Explorer. ";
    warningString += "We suggest using <strong><a href='https://www.google.com/chrome/'>Google Chrome</a></strong> or ";
    warningString += "<strong><a href='https://www.mozilla.org/firefox/'>Mozilla Firefox</a></strong> ";
    warningString += "because both of those browsers are updated regularly.</p></div></div>";
    
    document.getElementById("mediaWrapper").innerHTML = warningString;
}