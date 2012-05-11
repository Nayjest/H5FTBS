define([], function () {
    return {
        back:[0],
        map:{
            terrain:{
                water:[1, 4],
                ground:[5, 8],

                mountains:[10, 19],
                groundDecorations:[20, 29],
                trees:[30, 39],
                buildings:[40, 49],
                objects:[50, 59],
                units:[60, 69],
                effects:[70, 79]
            },
            cellHighlight:9
        },
        gui:[100]
    };
});
