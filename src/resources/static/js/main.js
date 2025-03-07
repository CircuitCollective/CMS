let initialized_row_value = 0

const api = "http://localhost:8080/api"

function create_user_row() {
    let generated_id = String(Math.floor(Math.random() * 100000000000000000000000) + 1)

    const input_name = document.getElementById("name")
    const value_name = input_name.value

    const input_desc = document.getElementById("desc")
    const value_desc = input_desc.value

    const input_stock = document.getElementById("stock")
    const value_stock = input_stock.value

    const input_tags = document.getElementById("tags")
    const value_tags = input_tags.value

    if (value_name === "" || value_desc === "" || value_stock === "" || value_tags === "") {
        alert("The input fields cannot be empty!")
        return;
    }

    initialized_row_value++
    let gameData = document.getElementById("game_data")
    let gameRow = document.createElement("tr")
    gameRow.id = String(initialized_row_value)

    let gameID  = document.createElement("td")
    gameID.innerHTML = generated_id
    gameRow.appendChild(gameID)

    let gameName = document.createElement("td")
    gameName.innerHTML = value_name
    gameRow.appendChild(gameName)

    let gameDescription = document.createElement("td")
    gameDescription.innerHTML = value_desc
    gameRow.appendChild(gameDescription)

    let gameStock = document.createElement("td")
    gameStock.innerHTML = value_stock
    gameRow.appendChild(gameStock)

    let gameTags = document.createElement("td")
    gameTags.innerHTML = value_tags
    gameRow.appendChild(gameTags)

    let editGameButton = document.createElement("td")
    let editGame_OnClick = document.createElement("button")
    editGame_OnClick.type = "button"
    editGame_OnClick.textContent = "Edit Game"
    editGame_OnClick.addEventListener("click", function(){edit_game_menu(this, parseInt(gameRow.id))})
    editGameButton.appendChild(editGame_OnClick)
    gameRow.appendChild(editGameButton)

    let removeGameButton = document.createElement("td")
    let removeGame_OnClick = document.createElement("button")
    removeGame_OnClick.type = "button"
    removeGame_OnClick.textContent = "Remove Game"
    removeGame_OnClick.addEventListener("click", function(){remove_row(parseInt(gameRow.id))})
    removeGameButton.appendChild(removeGame_OnClick)
    gameRow.appendChild(removeGameButton)

    fetch(`${api}/admin/game`, {
        method: "PUT",
        body: JSON.stringify({
            "name": value_name,
            "desc": value_desc,
            "stock": value_stock,
            "tags": value_tags
        }),
        headers: {
            "Content-Type": "application/json",
        }
    }).then(obtain_database_data).catch(error => console.log(error.message))

    gameData.appendChild(gameRow)


    input_name.value = ""
    input_desc.value = ""
    input_stock.value = ""
    input_tags.value = ""
}

function remove_row(row_value) {
    let gameData_Table = document.getElementById("game_data")
    let gameRow_Data = document.getElementById(row_value)
    let editing_data_row = document.getElementById("editing_row")

    if (gameData_Table.rows.length > 0) {
        gameData_Table.removeChild(gameRow_Data)
        gameData_Table.removeChild(editing_data_row)

        fetch(`${api}/admin/game/${gameRow_Data.id}`)
            .then(obtain_database_data)
            .catch(error => console.log(error.message))
    }
}



function edit_game_menu(edit_game_button, game_row_id) {
    let get_current_row = document.getElementById(game_row_id)

    let edit_row_inputs = document.createElement("tr")
    edit_row_inputs.id = "editing_row"


    const newID_input = document.createElement("td")
    const edit_id = document.createElement("input")
    edit_id.type = "text"
    edit_id.id = "new_id"
    edit_id.placeholder = "New ID"
    newID_input.appendChild(edit_id)
    edit_row_inputs.appendChild(newID_input)

    const newName_input = document.createElement("td")
    const edit_name = document.createElement("input")
    edit_name.type = "text"
    edit_name.id = "new_name"
    edit_name.placeholder = "New Name"
    newName_input.appendChild(edit_name)
    edit_row_inputs.appendChild(newName_input)

    const newDescription_input = document.createElement("td")
    const edit_desc = document.createElement("input")
    edit_desc.type = "text"
    edit_desc.id = "new_desc"
    edit_desc.placeholder = "New Description"
    newDescription_input.appendChild(edit_desc)
    edit_row_inputs.appendChild(newDescription_input)

    const newStock_input = document.createElement("td")
    const edit_stock = document.createElement("input")
    edit_stock.type = "text"
    edit_stock.id = "new_stock"
    edit_stock.placeholder = "New Stock"
    newStock_input.appendChild(edit_stock)
    edit_row_inputs.appendChild(newStock_input)

    const newTags_input = document.createElement("td")
    const edit_tags = document.createElement("input")
    edit_tags.type = "text"
    edit_tags.id = "new_tags"
    edit_tags.placeholder = "New Tags"
    newTags_input.appendChild(edit_tags)
    edit_row_inputs.appendChild(newTags_input)

    const saveGameButton = document.createElement("td")
    const saveGame_OnClick = document.createElement("button")
    saveGame_OnClick.type = "button"
    saveGame_OnClick.textContent = "Save Updated Game"
    saveGame_OnClick.addEventListener("click", function(){
        save_edited_game(edit_game_button,
            edit_row_inputs.id,
            edit_id,
            edit_name,
            edit_desc,
            edit_stock,
            edit_tags)
    })
    saveGameButton.appendChild(saveGame_OnClick)
    edit_row_inputs.appendChild(saveGameButton)

    const cancelEditButton = document.createElement("td")
    const cancelEdit_OnClick = document.createElement("button")
    cancelEdit_OnClick.type = "button"
    cancelEdit_OnClick.textContent = "Cancel"
    cancelEdit_OnClick.addEventListener("click", function(){
        cancel_row_edit(edit_row_inputs.id)
    })
    cancelEditButton.appendChild(cancelEdit_OnClick)
    edit_row_inputs.appendChild(cancelEditButton)

    $(edit_game_button).ready(function() {
        $(edit_row_inputs).insertAfter(get_current_row)
    })
}

function save_edited_game(edit_user_button, row_value, edited_id, edited_name, edited_desc, edited_stock, edited_tags) {
    if (edited_id.value === "" || edited_name.value === "" || edited_desc.value === "" || edited_stock.value === "" || edited_tags.value === "") {
        alert("The input fields cannot be empty!")
        return
    }

    let gameData_Table = document.getElementById("game_data")
    let gameRow_Data = document.getElementById(row_value)
    let edit_user_row = edit_user_button.parentNode.parentNode

    let newID_Data = edit_user_row.cells[0]
    let newName_Data = edit_user_row.cells[1]
    let newDescription_Data = edit_user_row.cells[2]
    let newStock_Data = edit_user_row.cells[3]
    let newTags_Data = edit_user_row.cells[4]


    newID_Data.innerHTML = edited_id.value
    newName_Data.innerHTML = edited_name.value
    newDescription_Data.innerHTML = edited_desc.value
    newStock_Data.innerHTML = edited_stock.value
    newTags_Data.innerHTML = edited_tags.value

    fetch(`${api}/admin/game`, {
        method: "PUT",
        body: JSON.stringify({
            "id": edited_id,
            "name": edited_name,
            "desc": edited_desc,
            "stock": edited_stock,
            "tags": edited_tags
        }),
        headers: {
            "Content-Type": "application/json",
        }
    }).then(response => console.log(response))

    edited_id.value = ""
    edited_name.value = ""
    edited_desc.value = ""
    edited_stock.value = ""
    edited_tags.value = ""

    if (gameData_Table.rows.length > 0) {
        gameData_Table.removeChild(gameRow_Data)
    }
}

function cancel_row_edit(row_value) {
    let gameData_Table = document.getElementById("game_data")
    let gameRow_Data = document.getElementById(row_value)

    if (gameData_Table.rows.length > 0) {
        gameData_Table.removeChild(gameRow_Data)
    }
}


function obtain_database_data() {
    fetch(`${api}/admin/game/}`)
        .then(response => response.json())
        .then(load_database_data)
        .catch(error => {console.log(error.message)})
    function load_database_data(database_data) {
        let gameRow_Table = document.getElementById("game_data")

        for (const row_data of database_data) {
            let gameData = document.getElementById("game_data")
            let gameRow = document.createElement("tr")
            gameRow.id = String(initialized_row_value)

            let gameID  = document.createElement("td")
            gameID.innerHTML = row_data.id
            gameRow.appendChild(gameID)

            let gameName = document.createElement("td")
            gameName.innerHTML = row_data.name
            gameRow.appendChild(gameName)

            let gameDescription = document.createElement("td")
            gameDescription.innerHTML = row_data.desc
            gameRow.appendChild(gameDescription)

            let gameStock = document.createElement("td")
            gameStock.innerHTML = row_data.stock
            gameRow.appendChild(gameStock)

            let gameTags = document.createElement("td")
            gameTags.innerHTML = row_data.tags
            gameRow.appendChild(gameTags)

            let editGameButton = document.createElement("td")
            let editGame_OnClick = document.createElement("button")
            editGame_OnClick.type = "button"
            editGame_OnClick.textContent = "Edit Game"
            editGame_OnClick.addEventListener("click", function(){edit_game_menu(this, parseInt(gameRow.id))})
            editGameButton.appendChild(editGame_OnClick)
            gameRow.appendChild(editGameButton)

            let removeGameButton = document.createElement("td")
            let removeGame_OnClick = document.createElement("button")
            removeGame_OnClick.type = "button"
            removeGame_OnClick.textContent = "Remove Game"
            removeGame_OnClick.addEventListener("click", function(){remove_row(parseInt(gameRow.id))})
            removeGameButton.appendChild(removeGame_OnClick)
            gameRow.appendChild(removeGameButton)
        }
    }
}