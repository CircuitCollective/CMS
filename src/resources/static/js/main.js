const api = "http://localhost:8080/api"
const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');

const inputs = ["name", "desc", "stock", "revenue", "price", "tags", "genres", "platforms", "stockByLocation"] // Maintained list of input values
const colors = {name: "#fc63f0", desc: "#fd68a6", tags: "#7676fa"} // Colors for each field TODO: Use these
const listInputs = new Set(["tags", "genres", "platforms"]) // Inputs with potentially many values
const mapInputs = new Set(["stockByLocation"])

/** Function that runs on page load. Sets up the game list, search, and csv parsing behavior. */
function init() {
    // Game list
    const inputTable = document.getElementById("game_creation_inputs")
    const inputHead = document.getElementById("game_creation_head")
    const itemsRow = document.getElementById("items_row")

    itemsRow.innerHTML += '<th>id</th>'
    for (const input of inputs) {
        inputHead.innerHTML += `<th>${input}</th>`
        inputTable.innerHTML += `<td><input type="text" id="${input}" placeholder="${input}"></td>`
        itemsRow.innerHTML += `<th>${input}</th>`
    }

    inputTable.innerHTML += '<td><button id="create_game" onclick="upsertGame(Object.fromEntries(inputs.map(input => [input, document.getElementById(input).value])))">Create Game</button></td>'

    // CSV Parsing
    const file = document.getElementById("file")
    file.addEventListener("change", () =>
        fetch(`${api}/admin/game/batch`, { method: "POST", body: new FormData(document.getElementById("form")) }).then(r => r.ok ? refresh() : r.json().then(console.error)))

    // Search Bar
    const searchInput = document.getElementById("search_bar")
    searchInput.addEventListener("keydown", e => { // On enter: update search
        if (e.key !== "Enter") return

        const query = searchInput.value
        if (query.trim() === "") refresh() // Blank: do full refresh
        else { // Otherwise: load search results
            clearGameList()
            fetch(`${api}/game/search?l=25&q=${query}`)
                .then(response => response.json())
                .then(response => response.forEach(upsertRow))
                .catch(error => console.error(error))
        }
    })
}

/** Inserts or updates a game from given {@link json}. This validates the inputs and then saves to the database. Use {@link upsertRow} if you wish to update a row directly. */
function upsertGame(json, id = undefined) {
    for (let input in json) {
        let value = json[input]

        try {
            if (listInputs.has(input)) { // List inputs are split into a list with trimming applied
                json[input] = value = value.trim().split(/[,\n]+/).map(v => v.trim()) // Split at , or \n. Inefficient but shouldn't matter
                if (value.some(v => v.trim() === '')) throw new Error(`The ${input} list cannot have any blank items!`)
            }
            else if (mapInputs.has(input)) {
                json[input] = value = JSON.parse(value)
                // TODO: No validation for now, fix this? Better error for bad json parsing?
            }
            else if (typeof value !== "number" && value.trim() === '') throw new Error(`The ${input} field cannot be empty!`)
            // Blank values are bad
        } catch (e) {
            alert(e.message)
            return
        }
    }

    fetch(`${api}/admin/game/${id ?? -1}`, {
        method: "PUT",
        body: JSON.stringify(json),
        headers: {
            "Content-Type": "application/json",
            'X-XSRF-TOKEN': csrfToken
        }
    }).then(r => {
        if (r.ok) r.json().then(upsertRow)
        else if (r.status === 400) r.json().then(r => alert(r.message)) // TODO: Parse the errors to be prettier?
        else r.json().then(t => { console.error(r); console.error(t) })
    })
}

/** Adds a row with a game from json */
function upsertRow(gameData) {
    const row = document.createElement("tr")
    row.innerHTML += `<td>${gameData.id}</td>`
    for (const col of inputs) {
        const td = document.createElement("td")
        if (listInputs.has(col)) { // Newline for each list input
            if (!gameData[col].length) td.innerHTML += "<p style='color:gray;font-style:italic'>None</p>" // Blank list input
            else gameData[col].forEach((item, idx) => { // List input with values
                const rowItem = document.createElement("p")
                td.appendChild(rowItem)
                rowItem.style.backgroundColor = idx % 2 ? "lightgray" : "white" // TODO: Better colors
                rowItem.style.margin = "0"
                rowItem.textContent = item
            })
        } else if (mapInputs.has(col)) { // TODO: Parse out the json and display it nicely
            td.textContent = JSON.stringify(gameData[col], null, 1)
        } else td.textContent = gameData[col] // No newline needed: add text directly
        row.appendChild(td)
    }

    row.innerHTML += `<td><button type="button" onclick="startGameEdit(this, ${gameData.id})">Edit Game</button>` // Edit button
    row.innerHTML += `<td><button type="button" onclick="deleteGame(${gameData.id})">Remove Game</button>`// Delete button

    row.id = gameData.id
    // Update the row if it exists, create it otherwise
    const existingRow = document.getElementById(gameData.id)
    existingRow ? existingRow.replaceWith(row) : document.getElementById("game_data").appendChild(row)
}

/** Deletes an existing game from the database */
function deleteGame(id) {
    const gameRow = document.getElementById(id)

    fetch(`${api}/admin/game/${id}`, { method: "DELETE", headers: { 'X-XSRF-TOKEN': csrfToken } }).then(r => {
        const gameList = document.getElementById("game_data")
        if (r.ok && gameList.rows.length > 0) {
            if (gameRow) document.getElementById("game_data").removeChild(gameRow)
            stopGameEdit()
        }
    }).catch(error => console.error(error))
}

/** Begins the edit of a game by inserting a row below the current one */
function startGameEdit(edit_game_button, gameId) {
    stopGameEdit()
    const currentRow = document.getElementById(gameId)

    const editInputs = document.createElement("tr")
    editInputs.id = "editing_row"

    editInputs.innerHTML += `<td>${gameId}</td>`
    let colI = 1
    for (const input of inputs) { // Load in the existing values into the edit inputs
        const td = document.createElement("td")
        if (listInputs.has(input)) { // List inputs
            let value = ""
            for (const c of currentRow.children.item(colI++).children) if (c.style.fontStyle !== "italic") value += c.textContent + "\n" // Build list, ignore italic "none"
            const area = document.createElement("textarea")
            area.id = `${input}-${gameId}`
            area.placeholder = input
            area.value = value
            td.appendChild(area)
        } else if (mapInputs.has(input)) { // TODO: Fill this in properly
            const area = document.createElement("textarea")
            area.id = `${input}-${gameId}`
            area.placeholder = input
            area.value = currentRow.children.item(colI++).textContent
            td.appendChild(area)
        } else {
            const inp = document.createElement("input")
            inp.type = "text"
            inp.id = `${input}-${gameId}`
            inp.placeholder = input
            inp.value = currentRow.children.item(colI++).textContent
            td.appendChild(inp)
        }
        editInputs.appendChild(td)
    }

    // TODO: Rewrite
    const saveGameButton = document.createElement("td")
    const saveGame_OnClick = document.createElement("button")
    saveGame_OnClick.type = "button"
    saveGame_OnClick.textContent = "Save New Game"
    saveGame_OnClick.onclick = () => {
        upsertGame(Object.fromEntries(inputs.map(input => [input, document.getElementById(`${input}-${gameId}`).value])), gameId)
        stopGameEdit()
    }
    saveGameButton.appendChild(saveGame_OnClick)
    editInputs.appendChild(saveGameButton)

    // TODO: Rewrite
    const cancelEditButton = document.createElement("td")
    const cancelEdit_OnClick = document.createElement("button")
    cancelEdit_OnClick.type = "button"
    cancelEdit_OnClick.textContent = "Cancel"
    cancelEdit_OnClick.addEventListener("click", function(){
        stopGameEdit()
    })
    cancelEditButton.appendChild(cancelEdit_OnClick)
    editInputs.appendChild(cancelEditButton)

    $(edit_game_button).ready(function() { // TODO: This is the sole place we use jQuery. We should either use it more or remove it entirely.
        $(editInputs).insertAfter(currentRow)
    })
}

/** Removes the row for edits of the current row */
function stopGameEdit() {
    const gameList = document.getElementById("game_data")
    const gameEditRow = document.getElementById("editing_row")

    if (gameList && gameEditRow && gameList.rows.length > 0) gameList.removeChild(gameEditRow)
}

/** Refreshes the game list */
function refresh() {
    clearGameList()
    fetch(`${api}/game`)
        .then(response => response.json())
        .then(response => response.forEach(upsertRow))
        .catch(error => console.error(error))
}

/** Clears the game list */
function clearGameList() {
    document.getElementById("game_data").innerHTML = "" // Clear the existing game list
}

document.addEventListener('DOMContentLoaded', function() { // On load
    refresh()
    init()
}, false);