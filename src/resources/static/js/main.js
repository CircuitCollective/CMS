const api = "http://localhost:8080/api"
const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');

const inputs = ["name", "desc", "stock", "tags"] // Maintained list of input values
const listInputs = new Set(["tags"]) // Inputs with potentially many values

function init() {
    const inputTable = document.getElementById("game_creation_inputs")
    const inputHead = document.getElementById("game_creation_head")
    const itemsRow = document.getElementById("items_row")

    itemsRow.innerHTML += '<th>id</th>'
    for (const input of inputs) {
        inputHead.innerHTML += `<th>${input}</th>`
        inputTable.innerHTML += `<td><input type="text" id="${input}" placeholder="${input}"></td>`
        itemsRow.innerHTML += `<th>${input}</th>`
    }

    inputTable.innerHTML += '<td><button id="create_game" onclick="create_game_row()">Create Game</button></td>'
}

function create_game_row() {
    const obj = Object.fromEntries(inputs.map(input => [input, document.getElementById(input).value]))
    upsert_game(obj)
}

/** Inserts or updates a game */
function upsert_game(obj, id = undefined) {
    for (let input in obj) {
        let value = obj[input]

        // List inputs are split into a list with trimming applied
        if (listInputs.has(input)) obj[input] = value = value.split(",").map(v => v.trim())
        // Blank values are bad
        if (value == null || (!Array.isArray(value) && typeof value !== "number" && value.trim() === '' || Array.isArray(value) && value.some(v => v.trim() === ''))) {
            alert(`The ${input} field cannot be empty!`)
            return
        }
    }

    console.log(obj)

    fetch(`${api}/admin/game/${id ?? -1}`, {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
            'X-XSRF-TOKEN': csrfToken
        }
    }).then(r => {
        if (r.ok) r.json().then(r => upsertRow(r, id))
        else if (r.status === 400) r.json().then(r => alert(r.message)) // TODO: Parse the errors to be prettier?
        else r.json().then(t => { console.error(r); console.error(t) })
    })
}

function remove_row(row_value) {
    let gameData_Table = document.getElementById("game_data")
    let gameRow_Data = document.getElementById(row_value)
    let editing_data_row = document.getElementById("editing_row")

    fetch(`${api}/admin/game/${row_value}`, { method: "DELETE", headers: { 'X-XSRF-TOKEN': csrfToken } }).then(() => {
        if (gameData_Table.rows.length > 0) {
            gameData_Table.removeChild(gameRow_Data)
            if (editing_data_row) gameData_Table.removeChild(editing_data_row)
        }
    }).catch(error => console.error(error))
}

function edit_game_menu(edit_game_button, gameId) {
    const currentRow = document.getElementById(gameId)

    const editInputs = document.createElement("tr")
    editInputs.id = "editing_row"

    editInputs.innerHTML += `<td>${gameId}</td>`
    for (const input of inputs) {
        editInputs.innerHTML += `<td><input type="text" id="${input}-${gameId}" placeholder="${input}"></td>`
    }

    const saveGameButton = document.createElement("td")
    const saveGame_OnClick = document.createElement("button")
    saveGame_OnClick.type = "button"
    saveGame_OnClick.textContent = "Save New Game"
    saveGame_OnClick.onclick = () => {
        upsert_game(Object.fromEntries(inputs.map(input => [input, document.getElementById(`${input}-${gameId}`).value])), gameId)
        cancel_row_edit(editInputs.id)
    }
    saveGameButton.appendChild(saveGame_OnClick)
    editInputs.appendChild(saveGameButton)

    // TODO: Rewrite
    const cancelEditButton = document.createElement("td")
    const cancelEdit_OnClick = document.createElement("button")
    cancelEdit_OnClick.type = "button"
    cancelEdit_OnClick.textContent = "Cancel"
    cancelEdit_OnClick.addEventListener("click", function(){
        cancel_row_edit(editInputs.id)
    })
    cancelEditButton.appendChild(cancelEdit_OnClick)
    editInputs.appendChild(cancelEditButton)

    $(edit_game_button).ready(function() { // TODO: This is the sole place we use jQuery. We should either use it more or remove it entirely.
        $(editInputs).insertAfter(currentRow)
    })
}

function cancel_row_edit(row_value) {
    let gameData_Table = document.getElementById("game_data")
    let gameRow_Data = document.getElementById(row_value)

    if (gameData_Table.rows.length > 0) {
        gameData_Table.removeChild(gameRow_Data)
    }
}

/** Adds a row with a game from json */
function upsertRow(game_data, id = undefined) { // TODO: Remove the id param on rewrite
    const gameRow_Table = document.getElementById("game_data")
    const row = document.createElement("tr")
    for (const col in game_data) {
        let td = document.createElement("td")
        td.textContent = game_data[col]
        row.appendChild(td)
    }

    // TODO: Rewrite
    const editGameButton = document.createElement("td")
    let editGame_OnClick = document.createElement("button")
    editGame_OnClick.type = "button"
    editGame_OnClick.textContent = "Edit Game"
    editGame_OnClick.onclick = () => edit_game_menu(this, game_data.id)
    editGameButton.appendChild(editGame_OnClick)
    row.appendChild(editGameButton)

    const removeGameButton = document.createElement("td")
    let removeGame_OnClick = document.createElement("button")
    removeGame_OnClick.type = "button"
    removeGame_OnClick.textContent = "Remove Game"
    removeGame_OnClick.addEventListener("click", function(){remove_row(parseInt(game_data.id))})
    removeGameButton.appendChild(removeGame_OnClick)
    row.appendChild(removeGameButton)

    row.id = game_data.id
    if (typeof id !== "undefined") document.getElementById(id).replaceWith(row) // Update row
    else gameRow_Table.appendChild(row) // Insert row
}

function obtain_database_data() {
    fetch(`${api}/game`)
        .then(response => response.json())
        .then(response => response.forEach(r => upsertRow(r)))
        .catch(error => console.error(error))
}

document.addEventListener('DOMContentLoaded', function() {
    obtain_database_data()
    init()
}, false);