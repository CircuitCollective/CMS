//Used to initialize the value of a game object's
//row value after an object's initialization.
let initialized_row_value = 0

//Used to initialize the value of a game object's
//row value after an object loads its data from
//either a file.
let loaded_data_row_value = 0

const api_url = "http://localhost:8080/api"

//The purpose of this function is to create a new
//game object with list on the database's front-end.
function create_game_object_row() {

    //Gain access to the front-end's input fields and
    //gain their inputted values.
    const input_name = document.getElementById("name")
    const value_name = input_name.value

    const input_desc = document.getElementById("desc")
    const value_desc = input_desc.value

    const input_stock = document.getElementById("stock")
    const value_stock = input_stock.value

    const input_tags = document.getElementById("tags")
    const value_tags = input_tags.value

    //Statement used to create an alert prompt that prevents the
    //admin from initializing an empty game object into the database.
    if (value_name === "" || value_desc === "" || value_stock === "" || value_tags === "") {
        alert("The input fields cannot be empty!")
        return;
    }

    initialized_row_value++ //increase the new role value by one
    let gameData = document.getElementById("game_data") //Gain access to the database table
    let gameRow = document.createElement("tr") //Initialize a new row to store the game object information
    gameRow.id = String(initialized_row_value) //Set the row's numerical id value

    //Initializing the game object's ID, Name,
    //Description, Stock Value, & Tags elements
    //and add them to the row.
    const pending_id = "ID Pending" //Sets the new object ID as pending as the object true ID is initialized in the database
    let gameID  = document.createElement("td") //Initializes gameID table element.
    gameID.innerHTML = pending_id //Store the "ID Pending" value into the gameID table element as the object's true ID will be uploaded to the front-end upon reload.
    gameRow.appendChild(gameID) //Store the gameID table element into the row object.

    let gameName = document.createElement("td") //Initializes gameName table element.
    gameName.innerHTML = value_name //Get the game's name obtained from the input field and store in the table element.
    gameRow.appendChild(gameName)//Store the gameName table element into the row object.

    let gameDescription = document.createElement("td") //Initializes gameDescription table element.
    gameDescription.innerHTML = value_desc //Get the game description obtained from the input field and store in the table element.
    gameRow.appendChild(gameDescription) //Store the gameDescription table element into the row object.

    let gameStock = document.createElement("td") //Initializes gameStock table element.
    gameStock.innerHTML = value_stock //Get the game's stock value obtained from the input field and store in the table element.
    gameRow.appendChild(gameStock) //Store the gameStock table element into the row object.

    let gameTags = document.createElement("td") //Initializes gameTags table element.
    gameTags.innerHTML = value_tags //Get the game's genre tags obtained from the input field and store in the table element.
    gameRow.appendChild(gameTags) //Store the gameTags table element into the row object.


    //Initializes a clickable "Edit Game" button that will initialize a menu below the
    //chosen game object for the administrator to update its contents in both the
    //front-end and the back-end.
    let editGameButton = document.createElement("td")
    let editGame_OnClick = document.createElement("button")
    editGame_OnClick.type = "button"
    editGame_OnClick.textContent = "Edit Game"
    editGame_OnClick.addEventListener("click", function(){edit_game_menu(this, parseInt(gameRow.id))})
    editGameButton.appendChild(editGame_OnClick)
    gameRow.appendChild(editGameButton)

    //Initializes a clickable "Remove Game" button that will delete the chosen
    //game object and its contents from both the front-end and the back-end.
    let removeGameButton = document.createElement("td")
    let removeGame_OnClick = document.createElement("button")
    removeGame_OnClick.type = "button"
    removeGame_OnClick.textContent = "Remove Game"
    removeGame_OnClick.addEventListener("click", function(){remove_row(parseInt(gameRow.id))})
    removeGameButton.appendChild(removeGame_OnClick)
    gameRow.appendChild(removeGameButton)

    //Using the fetch() method initializes a new game object into the database
    //via JSON using the stores values obtained from the input fields.
    fetch(`${api_url}/admin/game`, {
        method: "PUT",
        body: JSON.stringify({
            "name": value_name,
            "desc": value_desc,
            "stock": value_stock,
            "tags": new Set(value_tags)
        }),
        headers: {
            "Content-Type": "application/json",
        }
    }).then(obtain_database_data)
        .catch(error => console.log(error.message))

    //After all elements have been initialized and added to the row
    //all the row and its contents to the database's game list table.
    gameData.appendChild(gameRow)


    //After initializing a new game object, set the values
    //of all input fields back to their default values.
    input_name.value = ""
    input_desc.value = ""
    input_stock.value = ""
    input_tags.value = ""
}


//The purpose of this function
function remove_row(row_value) {
    let gameData_Table = document.getElementById("game_data") //Gain access to the database table
    let gameRow_Data = document.getElementById(row_value)
    let editing_data_row = document.getElementById("editing_row")

    if (gameData_Table.rows.length > 0) {
        gameData_Table.removeChild(gameRow_Data)
        gameData_Table.removeChild(editing_data_row)

        fetch(`${api_url}/admin/game/${gameRow_Data.id}`)
            .then(response => console.log(response))
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

    //This code using jQuery is just to make sure that editing
    //menu for the chosen game object
    $(edit_game_button).ready(function() {
        $(edit_row_inputs).insertAfter(get_current_row)
    })
}

function save_edited_game(edit_user_button, row_value,
                          edited_id, edited_name,
                          edited_desc, edited_stock, edited_tags) {

    if (edited_id.value === "" ||
        edited_name.value === "" ||
        edited_desc.value === "" ||
        edited_stock.value === "" ||
        edited_tags.value === "") {
        alert("The input fields cannot be empty!")
        return
    }

    let gameData_Table = document.getElementById("game_data") //Gain access to the database table
    let gameRow_Data = document.getElementById(row_value)
    let edit_user_row = edit_user_button.parentNode.parentNode

    //Gain access to the contents of the chosen game object.
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

    //Using the fetch() method to update the current game object's values in
    //the database via JSON using the stores values obtained from the input fields.
    fetch(`${api_url}/admin/game`, {
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
        .catch(error => {console.log(error.message)})

    //After initializing the game object's updated values, set the
    //values of all input fields back to their default values.
    edited_id.value = ""
    edited_name.value = ""
    edited_desc.value = ""
    edited_stock.value = ""
    edited_tags.value = ""

    //Delete the editing menu after initializing
    //the updated object values.
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

function clearGame_ListData() {
    document.getElementById("game_data").innerHTML = "";
}


function obtain_database_data() {
    fetch(`${api_url}/game/}`)
        .then(response => response.json())
        .then(response => response.forEach(load_database_data))
        .catch(error => {console.log(error.message)})
    function load_database_data(database_data) {
        let gameRow_Table = document.getElementById("game_data")

        for (const row_data of database_data) {
            loaded_data_row_value++
            let gameRow = document.createElement("tr")
            gameRow.id = String(loaded_data_row_value)

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
            gameTags.innerHTML = String(row_data.tags)
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

            gameRow_Table.appendChild(gameRow)
        }
    }
}

function refresh_the_page() {
    clearGame_ListData()
    obtain_database_data()
}
document.addEventListener("DOMContentLoaded", function() {
    refresh_the_page()
}, false)