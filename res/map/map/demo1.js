(function () {
    var cellsTypes = {
        1:'grass',
        2:'ground'
    };
    //var Gex = require('map/gex/Gex');
    var cellsData = [
        [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1]
    ];
    var cells = [];

    for (var y = cellsData.length; y--;) {
        for (var x = cellsData[y].length; x--;) {
            if (!cells[x]) cells[x] = [];
            cells[x][y] = 'map/cell/gex/' + cellsTypes[cellsData[y][x]] + '/1';
        }
    }
    //cells[1][1] = {_class:'Gex',type: 7,layer:'map/cell/gex/ground/layer'};
    return {
        cells:cells,
        size:[cells.length, cells[0].length]
    }
})();
