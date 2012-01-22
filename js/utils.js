function rndInt(min, max)
{
    if (min instanceof Array) return rndInt(min[0],min[1]);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}