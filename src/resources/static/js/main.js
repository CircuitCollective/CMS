const api = "http://localhost:8080/api"
const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');

//Used to initialize the value of a game object's
//row value after an object's initialization.
let initialized_row_value = 0

function create_game_object_row(empty_id = undefined) {
    //Collect the data from the input fields submitted by
    //the administrator and store their values in variables.
    const input_name = document.getElementById("name")
    const value_name = input_name.value

    const input_desc = document.getElementById("desc")
    const value_desc = input_desc.value

    const input_stock = document.getElementById("stock")
    const value_stock = input_stock.value

    const input_revenue = document.getElementById("revenue")
    const value_revenue = input_revenue.value

    const input_price = document.getElementById("price")
    const value_price = input_price.value

    const input_genres = document.getElementById("genres")
    const value_genres = input_genres.value

    const input_platforms = document.getElementById("platforms")
    const value_platforms = input_platforms.value

    //Statement used to create an alert prompt that prevents the administrator
    //from initializing an empty game object into the database.
    if (value_name === "" ||
        value_desc === "" ||
        value_stock === "" ||
        value_revenue === "" ||
        value_price === "" ||
        value_genres === "" ||
        value_platforms === "") {
        alert("The input fields cannot be empty!")
        return;
    }

    //Using the fetch() method initializes a new game object into the database
    //via JSON using the stores values obtained from the input fields.
    fetch(`${api}/admin/game/${empty_id ?? -1}`, {
        method: "PUT",
        body: JSON.stringify({
            "name": value_name,
            "desc": value_desc,
            "stock": parseInt(value_stock),
            "revenue": parseFloat(value_revenue),
            "price": parseFloat(value_price),
            "genres": new Set(value_genres),
            "platforms": new Set(value_platforms),
        }),
        headers: {
            "Content-Type": "application/json",
            'X-XSRF-TOKEN': csrfToken,
        }
    }).then(response => console.log(response))
        .then(response => response.json())
        .then(load_database_data)
        .catch(error => console.log(error.message))

    //After initializing a new game object, set the values
    //of all input fields back to their default values.
    input_name.value = ""
    input_desc.value = ""
    input_stock.value = ""
    input_revenue.value = ""
    input_price.value = ""
    input_genres.value = ""
    input_platforms.value = ""
}

//The purpose of this function is remove and delete both the game object
//in the database, but also the game information displayed on the webpage.
function remove_row(row_value) {
    let gameData_Table = document.getElementById("game_data") //Gain access to the database table
    let gameRow_Data = document.getElementById(row_value)
    let editing_data_row = document.getElementById("editing_row")

    if (gameData_Table.rows.length > 0) {
        gameData_Table.removeChild(gameRow_Data)
        gameData_Table.removeChild(editing_data_row)

        fetch(`${api_url}/admin/game/${gameRow_Data.id}`, {
            method: "DELETE",
            headers: {
                'X-XSRF-TOKEN': csrfToken
            }
        }).then(response => console.log(response))
            .catch(error => console.log(error.message))
    }
}


function edit_game_menu(edit_game_button, game_row_id) {
    let get_current_row = document.getElementById(game_row_id)

    let edit_row_inputs = document.createElement("tr")
    edit_row_inputs.id = "editing_row"

    const idCannot_BeChanged = document.createElement("td")
    idCannot_BeChanged.innerHTML = "ID Cannot Be Edited"
    idCannot_BeChanged.style.backgroundColor = "#0cabdc"
    edit_row_inputs.appendChild(idCannot_BeChanged)

    //Add editing input field in the editing menu for the game's name.
    const newName_input = document.createElement("td")
    newName_input.style.backgroundColor = "#0cabdc"
    const edit_name = document.createElement("input")
    edit_name.type = "text"
    edit_name.id = "new_name"
    edit_name.style.width = "280px"
    edit_name.style.height = "55px"
    edit_name.style.fontWeight = "bolder"
    edit_name.placeholder = "New Name"
    newName_input.appendChild(edit_name)
    edit_row_inputs.appendChild(newName_input)

    //Add editing input field in the editing menu for the game's description
    const newDescription_input = document.createElement("td")
    newDescription_input.style.backgroundColor = "#0cabdc"
    const edit_desc = document.createElement("input")
    edit_desc.type = "text"
    edit_desc.id = "new_desc"
    edit_desc.style.width = "280px"
    edit_desc.style.height = "55px"
    edit_desc.style.fontWeight = "bolder"
    edit_desc.placeholder = "New Description"
    newDescription_input.appendChild(edit_desc)
    edit_row_inputs.appendChild(newDescription_input)

    //Add editing input field in the editing menu for the game's stock
    const newStock_input = document.createElement("td")
    newStock_input.style.backgroundColor = "#0cabdc"
    const edit_stock = document.createElement("input")
    edit_stock.type = "text"
    edit_stock.id = "new_stock"
    edit_stock.style.width = "280px"
    edit_stock.style.height = "55px"
    edit_stock.style.fontWeight = "bolder"
    edit_stock.placeholder = "New Stock"
    newStock_input.appendChild(edit_stock)
    edit_row_inputs.appendChild(newStock_input)

    //Add editing input field in the editing menu for the game's revenue generated
    const newRevenue_input = document.createElement("td")
    newRevenue_input.style.backgroundColor = "#0cabdc"
    const edit_revenue = document.createElement("input")
    edit_revenue.type = "text"
    edit_revenue.id = "new_revenue"
    edit_revenue.style.width = "280px"
    edit_revenue.style.height = "55px"
    edit_revenue.style.fontWeight = "bolder"
    edit_revenue.placeholder = "New Revenue"
    newRevenue_input.appendChild(edit_revenue)
    edit_row_inputs.appendChild(newRevenue_input)

    //Add editing input field in the editing menu for the game's price
    const newPrice_input = document.createElement("td")
    newPrice_input.style.backgroundColor = "#0cabdc"
    const edit_price = document.createElement("input")
    edit_price.type = "text"
    edit_price.id = "new_price"
    edit_price.style.width = "280px"
    edit_price.style.height = "55px"
    edit_price.style.fontWeight = "bolder"
    edit_price.placeholder = "New Price"
    newPrice_input.appendChild(edit_price)
    edit_row_inputs.appendChild(newPrice_input)

    //Add editing input field in the editing menu for the game's genre tags.
    const newGenres_input = document.createElement("td")
    newGenres_input.style.backgroundColor = "#0cabdc"
    const edit_genres = document.createElement("input")
    edit_genres.type = "text"
    edit_genres.id = "new_genres"
    edit_genres.style.width = "280px"
    edit_genres.style.height = "55px"
    edit_genres.style.fontWeight = "bolder"
    edit_genres.placeholder = "New Genre(s)"
    newGenres_input.appendChild(edit_genres)
    edit_row_inputs.appendChild(newGenres_input)

    //Add editing input field in the editing menu for the game's platform tags.
    const newPlatforms_input = document.createElement("td")
    newPlatforms_input.style.backgroundColor = "#0cabdc"
    const edit_platforms = document.createElement("input")
    edit_platforms.type = "text"
    edit_platforms.id = "new_platforms"
    edit_platforms.style.width = "280px"
    edit_platforms.style.height = "55px"
    edit_platforms.style.fontWeight = "bolder"
    edit_platforms.placeholder = "New Platform(s)"
    newPlatforms_input.appendChild(edit_platforms)
    edit_row_inputs.appendChild(newPlatforms_input)

    //Initializes a clickable "Save Updated Game" button that will
    //initialize and update the current game object with new values.
    const saveGameButton = document.createElement("td")
    saveGameButton.style.backgroundColor = "#0cabdc"
    const saveGame_OnClick = document.createElement("button")
    saveGame_OnClick.type = "button"
    saveGame_OnClick.style.padding = "15px 23px"
    saveGame_OnClick.style.backgroundColor = "#8ac1ee"
    saveGame_OnClick.style.border = "4px solid"
    saveGame_OnClick.style.borderColor = "#543ade"
    saveGame_OnClick.style.fontWeight = "bold"
    saveGame_OnClick.textContent = "Save Updated Game"
    saveGame_OnClick.addEventListener("click", function(){
        save_edited_game(edit_game_button, edit_row_inputs.id, edit_name,
            edit_desc, edit_stock, edit_revenue,
            edit_price, edit_genres, edit_platforms)
    })
    saveGameButton.appendChild(saveGame_OnClick)
    edit_row_inputs.appendChild(saveGameButton)

    //Initializes a clickable "Cancel" button that will abruptly leave the
    //editing menu, cancelling the editing of a game object completely and
    //leaving its current information in tack.
    const cancelEditButton = document.createElement("td")
    cancelEditButton.style.backgroundColor = "#0cabdc"
    const cancelEdit_OnClick = document.createElement("button")
    cancelEdit_OnClick.type = "button"
    cancelEdit_OnClick.style.padding = "15px 23px"
    cancelEdit_OnClick.style.backgroundColor = "#8ac1ee"
    cancelEdit_OnClick.style.border = "4px solid"
    cancelEdit_OnClick.style.borderColor = "#543ade"
    cancelEdit_OnClick.style.fontWeight = "bold"
    cancelEdit_OnClick.textContent = "Cancel"
    cancelEdit_OnClick.addEventListener("click", function(){
        cancel_row_edit(edit_row_inputs.id)
    })
    cancelEditButton.appendChild(cancelEdit_OnClick)
    edit_row_inputs.appendChild(cancelEditButton)

    //This code is using jQuery to make sure that editing menu for
    //the chosen game object is below the specified object.
    $(edit_game_button).ready(function() {
        $(edit_row_inputs).insertAfter(get_current_row)
    })
}

//The purpose of this function is to update the game object and
//information with new values after the administrator enters their
//new desired information.
function save_edited_game(edit_user_button, row_value, edited_name,
                          edited_desc, edited_stock, edited_revenue,
                          edited_price, edited_genres, edited_platforms) {

    //Statement used to create an alert prompt that prevents
    //the administrator from entering empty information.
    if (edited_name.value === "" ||
        edited_desc.value === "" ||
        edited_stock.value === "" ||
        edited_revenue.value === "" ||
        edited_price.value === "" ||
        edited_genres.value === "" ||
        edited_platforms.value === "") {
        alert("The input fields cannot be empty!")
        return
    }


    let gameData_Table = document.getElementById("game_data") //Gain access to the database table
    let gameRow_Data = document.getElementById(row_value) //Gain access to the game object through its row value.
    let edit_user_row = edit_user_button.parentNode.parentNode //Gain access to the values of the game object through the location of the edit button.

    //Gain access to the contents of the chosen game object.
    let newName_Data = edit_user_row.cells[1]
    let newDescription_Data = edit_user_row.cells[2]
    let newStock_Data = edit_user_row.cells[3]
    let newRevenue_Data = edit_user_row.cells[4]
    let newPrice_Data = edit_user_row.cells[5]
    let newGenres_Data = edit_user_row.cells[6]
    let newPlatforms_Data = edit_user_row.cells[7]


    //Replaces the current values of the game object's
    //information with brand-new information.
    newName_Data.innerHTML = edited_name.value
    newDescription_Data.innerHTML = edited_desc.value
    newStock_Data.innerHTML = edited_stock.value
    newRevenue_Data.innerHTML = edited_revenue.value
    newPrice_Data.innerHTML = edited_price.value
    newGenres_Data.innerHTML = edited_genres.value
    newPlatforms_Data.innerHTML = edited_platforms.value


    //Using the fetch() method to update the current game object's values in the
    //database via JSON using the stores values obtained from the input fields.
    fetch(`${api}/admin/game/${gameRow_Data.id}`, {
        method: "PUT",
        body: JSON.stringify({
            "name": edited_name,
            "desc": edited_desc,
            "stock": edited_stock,
            "revenue": edited_revenue,
            "price": edited_price,
            "genres": edited_genres,
            "platforms": edited_platforms
        }),
        headers: {
            "Content-Type": "application/json",
            'X-XSRF-TOKEN': csrfToken,
        }
    }).then(response => console.log(response))
        .catch(error => {
            console.log(error.message)
        })

    //After initializing the game object's updated values, set the
    //values of all input fields back to their default values.
    edited_name.value = ""
    edited_desc.value = ""
    edited_stock.value = ""
    edited_revenue.value = ""
    edited_price.value = "";
    edited_genres.value = ""
    edited_platforms.value = ""

    //Delete the editing menu after initializing
    //the updated object values.
    if (gameData_Table.rows.length > 0) {
        gameData_Table.removeChild(gameRow_Data)
    }
}

//Cancels editing the current game object completely.
function cancel_row_edit(row_value) {
    let gameData_Table = document.getElementById("game_data")
    let gameRow_Data = document.getElementById(row_value)

    if (gameData_Table.rows.length > 0) {
        gameData_Table.removeChild(gameRow_Data)
    }
}

///The purpose of this function is to clear the current list
//of game objects displayed on the webpage's interface.
function clearGame_ListData() {
    document.getElementById("game_data").innerHTML = "";
}


//The purpose of this function is to obtain the game objects
//stored in the database and display the information of each
//parameter on the user interface.
function load_database_data(database_data) {
    let gameRow_Table = document.getElementById("game_data")

    //id,name,desc,stock,revenue,price,genres,platforms
    for (const row_data of database_data) {
        initialized_row_value++
        let loadRow = document.createElement("tr")
        loadRow.id = String(initialized_row_value)

        let loadID  = document.createElement("td")
        loadID.innerHTML = row_data.id
        loadRow.appendChild(loadID)

        let loadName = document.createElement("td")
        loadName.innerHTML = row_data.name
        loadRow.appendChild(loadName)

        let loadDescription = document.createElement("td")
        loadDescription.innerHTML = row_data.desc
        loadRow.appendChild(loadDescription)

        let loadStock = document.createElement("td")
        loadStock.innerHTML = row_data.stock
        loadRow.appendChild(loadStock)

        let loadRevenue = document.createElement("td")
        loadRevenue.innerHTML = row_data.revenue
        loadRow.appendChild(loadRevenue)

        let loadPrice = document.createElement("td")
        loadPrice.innerHTML = row_data.price
        loadRow.appendChild(loadPrice)

        let loadGenres = document.createElement("td")
        loadGenres.innerHTML = String(row_data.genres).split(",").join("<br>")
        loadRow.appendChild(loadGenres)

        let loadPlatforms = document.createElement("td")
        loadPlatforms.innerHTML = String(row_data.platforms).split(",").join("<br>")
        loadRow.appendChild(loadPlatforms)

        let editGameButton = document.createElement("td")
        const editGame_OnClick = document.createElement("button")
        editGame_OnClick.type = "button"
        editGame_OnClick.style.padding = "15px 23px"
        editGame_OnClick.style.backgroundColor = "#ce6ae0"
        editGame_OnClick.style.border = "4px solid"
        editGame_OnClick.style.borderColor = "#584e9d"
        editGame_OnClick.style.fontWeight = "bold"
        editGame_OnClick.textContent = "Edit Game"
        editGame_OnClick.textContent = "Edit Game"
        editGame_OnClick.addEventListener("click", function(){edit_game_menu(this, parseInt(gameRow.id))})
        editGameButton.appendChild(editGame_OnClick)
        loadRow.appendChild(editGameButton)

        let removeGameButton = document.createElement("td")
        const removeGame_OnClick = document.createElement("button")
        removeGame_OnClick.type = "button"
        removeGame_OnClick.style.padding = "15px 23px"
        removeGame_OnClick.style.backgroundColor = "#d52ae8"
        removeGame_OnClick.style.border = "4px solid"
        removeGame_OnClick.style.borderColor = "#584e9d"
        removeGame_OnClick.style.fontWeight = "bold"
        removeGame_OnClick.textContent = "Remove Game"
        removeGame_OnClick.addEventListener("click", function(){remove_row(parseInt(gameRow.id))})
        removeGameButton.appendChild(removeGame_OnClick)
        loadRow.appendChild(removeGameButton)

        gameRow_Table.appendChild(loadRow)
    }
}

//The purpose of this function is to refresh the webpage
//and load in the game objects stored in the database.
function refresh_the_page() {
    clearGame_ListData()
    fetch(`${api}/game`)
        .then(response => response.json())
        .then(response => response.forEach(load_database_data))
        .catch(response => console.log(response))
}

//Calls an addEventListener() "DOMContentLoaded" event that refreshes the
//webpage and showcases the all the game objects from the database.
document.addEventListener("DOMContentLoaded", function() {
    refresh_the_page()
}, false)