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

    inputTable.innerHTML += '<td><button id="create_user" onclick="create_user_row()">Create User</button></td>'
}

function create_user_row() {
    const obj = Object.fromEntries(inputs.map(input => [input, document.getElementById(input).value]))
    upsert_user(obj)
}

/** Inserts or updates a user */
function upsert_user(obj, id = undefined) {
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
    let userData_Table = document.getElementById("user_data")
    let userRow_Data = document.getElementById(row_value)
    let editing_data_row = document.getElementById("editing_row")

    fetch(`${api}/admin/game/${row_value}`, { method: "DELETE", headers: { 'X-XSRF-TOKEN': csrfToken } }).then(() => {
        if (userData_Table.rows.length > 0) {
            userData_Table.removeChild(userRow_Data)
            if (editing_data_row) userData_Table.removeChild(editing_data_row)
        }
    }).catch(error => console.error(error))
}

function edit_user_menu(edit_user_button, userId) {
    const currentRow = document.getElementById(userId)

    const editInputs = document.createElement("tr")
    editInputs.id = "editing_row"

    editInputs.innerHTML += `<td>${userId}</td>`
    for (const input of inputs) {
        editInputs.innerHTML += `<td><input type="text" id="${input}-${userId}" placeholder="${input}"></td>`
    }

    const saveUserButton = document.createElement("td")
    const saveUser_OnClick = document.createElement("button")
    saveUser_OnClick.type = "button"
    saveUser_OnClick.textContent = "Save New Game"
    saveUser_OnClick.onclick = () => {
        upsert_user(Object.fromEntries(inputs.map(input => [input, document.getElementById(`${input}-${userId}`).value])), userId)
        cancel_row_edit(editInputs.id)
    }
    saveUserButton.appendChild(saveUser_OnClick)
    editInputs.appendChild(saveUserButton)

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

    $(edit_user_button).ready(function() { // TODO: This is the sole place we use jQuery. We should either use it more or remove it entirely.
        $(editInputs).insertAfter(currentRow)
    })
}

function cancel_row_edit(row_value) {
    let userData_Table = document.getElementById("user_data")
    let userRow_Data = document.getElementById(row_value)

    if (userData_Table.rows.length > 0) {
        userData_Table.removeChild(userRow_Data)
    }
}

/** Adds a row with a user from json */
function upsertRow(user_data, id = undefined) { // TODO: Remove the id param on rewrite
    const userRow_Table = document.getElementById("user_data")
    const row = document.createElement("tr")
    for (const col in user_data) {
        let td = document.createElement("td")
        td.textContent = user_data[col]
        row.appendChild(td)
    }

    // TODO: Rewrite
    const editUserButton = document.createElement("td")
    let editUser_OnClick = document.createElement("button")
    editUser_OnClick.type = "button"
    editUser_OnClick.textContent = "Edit User"
    editUser_OnClick.onclick = () => edit_user_menu(this, user_data.id)
    editUserButton.appendChild(editUser_OnClick)
    row.appendChild(editUserButton)

    const removeUserButton = document.createElement("td")
    let removeUser_OnClick = document.createElement("button")
    removeUser_OnClick.type = "button"
    removeUser_OnClick.textContent = "Remove User"
    removeUser_OnClick.addEventListener("click", function(){remove_row(parseInt(user_data.id))})
    removeUserButton.appendChild(removeUser_OnClick)
    row.appendChild(removeUserButton)

    row.id = user_data.id
    if (typeof id !== "undefined") document.getElementById(id).outerHTML = row.outerHTML // Update row TODO: This breaks the edit user button
    else userRow_Table.appendChild(row) // Insert row
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