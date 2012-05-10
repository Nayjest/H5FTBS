<div id="sidebar">
    <h2>Map editor</h2>

    <div>
        <span id="mapInfo"></span>
    </div>
    <div>
        <label for="mapName">Map name:</label>
        <input id="mapName">
    </div>
    <div>
        <select id="cell" size="5">
            <optgroup label="plane">
                <option value="grass/1">grass</option>
                <option value="ground/1">ground</option>
            </optgroup>
            <optgroup label="water">
            </optgroup>
        </select>
    </div>
    <div>
        <select id="unit" size="5">
            <optgroup label="human">
                <option value="human/peasant/peasant">Peasant</option>
                <option value="human/cleric/cleric">Cleric</option>
            </optgroup>
        </select>
    </div>
    <div>
        <button id="btnSave">Save</button>
    </div>
</div>