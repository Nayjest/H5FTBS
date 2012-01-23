/**
* Animation Manager class
*/
(function(){
    
    var defaults = {
        delay: 1,   
    }
    
    AnimationManager = function(config){
        if (!config) config = {};
        mergeUndefined(config, defaults);
        merge(this,config);
        
    }
    
    AnimationManager.prototype = {
       move: function(layer, targetOffset, speed){           
           var delay = this.delay;
           var doMove = function() {
             var finished = false;
             if (layer.offset[0]<targetOffset[0]-1)  {                 
                 layer.offset[0]++;
             } else if (layer.offset[0]>targetOffset[0]+1) {
                 layer.offset[0]--;
             } else {
                 finished = true;
             }
             
             if (layer.offset[1]<targetOffset[1]-1)  {                 
                 layer.offset[1]++;
             } else if (layer.offset[1]>targetOffset[1]+1) {
                 layer.offset[1]--;
             } else {
                 if (finished) {
                     layer.update();
                     return true;   
                 }
             }
             layer.update();
             setTimeout(doMove, delay);
           }
           setTimeout(doMove, delay);
       }
    }

})();