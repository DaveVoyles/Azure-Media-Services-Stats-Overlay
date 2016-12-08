(function (mediaPlayer) {
    "use strict";

    mediaPlayer.plugin('contentTitle', function (options) {
        var player         = this;    
        var overlay        = document.getElementById('overlay');
        var overlayBtn     = document.getElementById('overlayBtn');
        var overlayText    = document.getElementById('overlayText');
        var bOverlayHidden = "false";
        var log            = console.log.bind(console); // Shorthand for console.log
        var p              = player.mediaPlayer;
        var res            = p.videoWidth          + " x " + p.videoHeight; 
        var widthHeight    = player.options_.width + " x " + player.options_.height;
      
      
      /**
       * Make the overlay width 1/2 of the width of the video player
       */
      function setOverlayWidth () {
        var sWidth          = "" + player.options_.width / 2 + "px";
        overlay.style.width = sWidth;
      };      
      setOverlayWidth();

      
      /**
       * Takes player source URL and determines if it is using http || https.
       * @return {string} - "http" or "https" 
       */
      function getHttpStatus () {
        var endpoint = p.src;
        
        // Head returns 'http' or 'https'
        // ^  Start of Line
        // .  Match zero or more
        // *  Match previous char
        // \  Literal next char
        var re                 = /^.*:\/\//;
        var head               = re.exec( endpoint );      
        
       if (head[0] === "https://") {
          return "https"; 
        } else { 
          return "http";
        }
        
      }
      

      /**
       * Data object used to store misc values of AMS player.
       */
      var data = {
          "curPlaybackBitrate": "", 
          "mimeType"          : p.type,
          "src"               : p.src,
          "curTime"           : "",
          "stream type"       : "", // TODO
          "connSpeed"         : "", // TODO
          "res"               : "",
          "dimensions"        : "",
          "avgBandwidthKbps"  : "",
          "curDlBitrate"      : "" ,
          "streamType"        : ""
        }
      
      
      /**
       * Instantiates a formatted block of text based on info returnes from data object.
       * @param {object} stats - Accepts data object, which is automatically updated every (x) seconds. 
       * @return {string} - Formatted string which will be set as the innerText of the overlay
       */
      function createTextBlock (stats) {        
        var sData = 
          "Mime Type: "      + stats.mimeType          + '\n' +
          "Dimensions: "     + stats.dimensions        + '\n' +
          "Res: "            + stats.res               + '\n' +  
          "Dl Bitrate: "     + stats.curDlBitrate      + '\n' +  
          "Avg Bandwidth: "  + stats.avgBandwidthKbps  + '\n' +
          "Stream Type: "    + stats.streamType        + '\n' ;
        
        return sData;
      }
      
      
      /**
       * Sets the text value of the overlay with updated stats from data object.
       */
      function updateOverlayText () {
        overlayText.innerText = createTextBlock(data);
      }
      
      
      /**
      * Conver size to bytes
      * @param {number} bytes - downlaod value
      * @param {string} decimals - Where should the placeholder be?
      * @return {number} parseFloat - size changes, depending on initial size of bytes passed in
      */
      function formatBytes(bytes,decimals) {
          if(bytes == 0) return '0 Byte';
          var k     = 1000;
          var dm    = decimals + 1 || 3;
          var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
          var i     = Math.floor(Math.log(bytes) / Math.log(k));

          return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      }
      

      /**
       * Updates data object every (x) seconds, which the stats overlay text object then reads 
       */
      function setValuesForStatsOverlay () {       
        setInterval(function () { data.curTime            = p.currentTime},                         1000);
        setInterval(function () { data.curDlBitrate       = formatBytes(p.currentDownloadBitrate)}, 1000);   
        setInterval(function () { data.avgBandwidthKbps   = formatBytes(p.videoBufferData._bandwidthTracker.averageBandwidthInKbps)}, 1000);
        setInterval(function () { data.dimensions         =  player.options_.width + " x " + player.options_.height                },  1000); 
        setInterval(function () { data.curDlBitrate       = formatBytes(p.currentDownloadBitrate)}, 1000);
        setInterval(function () { data.curPlaybackBitrate = formatBytes(p.currentPlaybackBitrate)}, 1000);
        setInterval(function () { data.res                =  p.videoWidth + " x " + p.videoHeight}, 1000);            
        setTimeout(function  () { data.streamType         = getHttpStatus()                      }, 1000);        
        setInterval(function () { updateOverlayText()                                            }, 1000); 
        // retrieve values for DEBUGGING
         console.log(player);
        // console.log(player.mediaPlayer);          
      }
      
      
      /**
       * Toggles visibiltiy of overlay. Ideally this would be embedded as a btn in the AMS player.
       */
      function toggleOverlayVisibility()  {		
        var bVisibility           = (bOverlayHidden  === "false") ? "hidden" : "visible";	        
        overlay.style.visibility  = bVisibility;
        bOverlayHidden            = (bOverlayHidden  === "false") ? "true"   : "false";		
      };


        /**
         * Main function -- Entry point of this application
         */
        player.ready(function () {
          log("player ready");
          player.on('play', setValuesForStatsOverlay);    
          overlay.onclick    = toggleOverlayVisibility;
          overlayBtn.onclick = toggleOverlayVisibility;     
        });
    });
}(window.amp));
