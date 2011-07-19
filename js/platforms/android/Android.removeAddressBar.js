/*
*  @author Vitaliy Stepanenko
*  Idea from: http://stackoverflow.com/questions/4068559/removing-address-bar-from-browser-to-view-on-android
*  
*  try also: 
* if(navigator.userAgent.match(/Android/i)){
*    window.scrollTo(0,1);
*  } 
* 
* 
*/
if (typeof Andorid == 'undefined') {
    var Android = {}
}
Android.removeAddressBar = function() {
    if (navigator.userAgent.match(/Android/i)) {
        window.scrollTo(0,0); // reset in case prev not scrolled  
        var nPageH = $(document).height();
        var nViewH = window.outerHeight;
        if (nViewH > nPageH) {
            nViewH -= 250;  // try to replace line nViewH -=250 with nViewH = nviewH / window.devicePixelRatio. It works exactly as i check on a HTC Magic (PixelRatio = 1) and a Samsung Galaxy Tab 7" (PixelRatio = 1.5).
            $('BODY').css('height',nViewH + 'px');
        }
        window.scrollTo(0,1);
    }
}