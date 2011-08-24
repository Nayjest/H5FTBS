$(document).ready(function(){

    
       $('.noselect').live('selectstart dragstart', function(evt){ evt.preventDefault(); return false; });
       
        
        map = MapGenerator.create({size:[20,10],cellSize:[74,64]}).fill(Gex.generators.grass).map;
});