const api = "http://localhost:8080/api"
const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1')

//Used to initialize the value of a game object's
//row value after an object's initialization.
let initialized_row_value = 0

function create_game_object_row(initialized_id = undefined) {
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

    const input_tags = document.getElementById("tags")
    const value_tags = input_tags.value

    const input_stock_location = document.getElementById("stockByLocation")
    const value_stock_location = input_stock_location.value

    //Statement used to create an alert prompt that prevents the administrator
    //from initializing an empty game object into the database.
    if (value_name === "" ||
        value_desc === "" ||
        value_stock === "" ||
        value_revenue === "" ||
        value_price === "" ||
        value_genres === "" ||
        value_platforms === "" ||
        value_tags === "" ||
        value_stock_location === "") {
        alert("The input fields cannot be empty!")
        return;
    }

    //Using the fetch() method initializes a new game object into the database
    //via JSON using the stores values obtained from the input fields.
    fetch(`${api}/admin/game/${initialized_id ?? -1}`, {
        method: "PUT",
        body: JSON.stringify({
            "name": value_name,
            "desc": value_desc,
            "stock": parseInt(value_stock),
            "revenue": parseFloat(value_revenue),
            "price": parseFloat(value_price),
            "genres": value_genres.split(","),
            "platforms": value_platforms.split(","),
            "tags": value_tags.split(","),
            "stockByLocation": JSON.parse(value_stock_location),
        }),
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken
        }
    }).then(response => {
        if (response.ok) response.json().then(initialize_game_data) //add new game data!
        else if (response.status === 400) response.json().then(response => alert(response.message))
        else response.json().then(error => {console.error(response); console.error(error)})
    })

    //After initializing a new game object, set the values
    //of all input fields back to their default values.
    input_name.value = ""
    input_desc.value = ""
    input_stock.value = ""
    input_revenue.value = ""
    input_price.value = ""
    input_genres.value = ""
    input_platforms.value = ""
    input_tags.value = ""
    input_stock_location.value = ""
}

function initialize_game_data(new_game_data) {
    let gameDataList = document.getElementById("game_data")

    let addRow = document.createElement("tr")
    addRow.id = String(new_game_data.id)

    let addID  = document.createElement("td")
    addID.innerHTML = new_game_data.id
    addRow.appendChild(addID)

    let addName = document.createElement("td")
    addName.innerHTML = new_game_data.name
    addRow.appendChild(addName)

    let addDescription = document.createElement("td")
    addDescription.innerHTML = new_game_data.desc
    addRow.appendChild(addDescription)

    let addStock = document.createElement("td")
    addStock.innerHTML = new_game_data.stock
    addRow.appendChild(addStock)

    let addRevenue = document.createElement("td")
    addRevenue.innerHTML = new_game_data.revenue
    addRow.appendChild(addRevenue)

    let addPrice = document.createElement("td")
    addPrice.innerHTML = new_game_data.price
    addRow.appendChild(addPrice)

    let addGenres = document.createElement("td")
    addGenres.innerHTML = String(new_game_data.genres).split(",").join("<br>")
    addRow.appendChild(addGenres)

    let addPlatforms = document.createElement("td")
    addPlatforms.innerHTML = String(new_game_data.platforms).split(",").join("<br>")
    addRow.appendChild(addPlatforms)

    let addTags = document.createElement("td")
    addTags.innerHTML = String(new_game_data.tags).split(",").join("<br>")
    addRow.appendChild(addTags)


    let addStockLocation = document.createElement("td")
    const locations = Object.keys(new_game_data.stockByLocation)
    const values = Object.values(new_game_data.stockByLocation)
    const stock_by_location = []
    for (let i = 0; i < locations.length; i++) {
        stock_by_location[i] = locations[i] + ": " + values[i] + " In Stock"
    }
    addStockLocation.innerHTML = String(stock_by_location).split(",").join("<br>")
    addRow.appendChild(addStockLocation)

    const editButton = document.createElement("td")
    const editOnClick = document.createElement("button")
    editOnClick.type = "button"
    editOnClick.style.padding = "15px 23px"
    editOnClick.style.backgroundColor = "#ce6ae0"
    editOnClick.style.border = "4px solid"
    editOnClick.style.borderColor = "#584e9d"
    editOnClick.style.fontWeight = "bold"
    editOnClick.textContent = "Edit Game"
    editOnClick.textContent = "Edit Game"
    editOnClick.addEventListener("click", function(){edit_game_menu(this, parseInt(addRow.id))})
    editButton.appendChild(editOnClick)
    addRow.appendChild(editButton)

    let removeButton = document.createElement("td")
    const removeOnClick = document.createElement("button")
    removeOnClick.type = "button"
    removeOnClick.style.padding = "15px 23px"
    removeOnClick.style.backgroundColor = "#d52ae8"
    removeOnClick.style.border = "4px solid"
    removeOnClick.style.borderColor = "#584e9d"
    removeOnClick.style.fontWeight = "bold"
    removeOnClick.textContent = "Remove Game"
    removeOnClick.addEventListener("click", function(){remove_row(parseInt(addRow.id))})
    removeButton.appendChild(removeOnClick)
    addRow.appendChild(removeButton)


    //Update the row if it exists, create a new row otherwise
    const existingGameData = document.getElementById(addRow.id)
    existingGameData ? existingGameData.replaceWith(addRow) : gameDataList.appendChild(addRow)
}

//The purpose of this function is remove and delete both the game object
//in the database, but also the game information displayed on the webpage.
function remove_row(row_value) {
    let gameRow_Data = document.getElementById(row_value)

    fetch(`${api_url}/admin/game/${gameRow_Data.id}`, {
        method: "DELETE",
        headers: {
            'X-XSRF-TOKEN': csrfToken
        }
    }).then(response => {
        const gameData_Table = document.getElementById("game_data") //Gain access to the database table
        if (response.ok && gameData_Table.rows.length > 0) {
            gameData_Table.removeChild(gameRow_Data)
            cancel_row_edit("editing_row")
        }
    }).catch(error => console.log(error))
}


function edit_game_menu(edit_game_button, game_row_id) {
    let get_current_row = document.getElementById(game_row_id)

    let edit_row_inputs = document.createElement("tr")
    edit_row_inputs.id = "editing_row"

    const idCannot_BeChanged = document.createElement("td")
    idCannot_BeChanged.innerHTML = "ID Cannot Be Edited"
    idCannot_BeChanged.style.backgroundColor = "#0cabdc"
    edit_row_inputs.appendChild(idCannot_BeChanged)


    const input_headers = ["New Name","New Description","New Stock","New Revenue","New Price","New Genre(s)","New Platform(s)","New Tag(s)","New Stock By Location"]
    const input_ids = ["new_name","new_desc","new_stock","new_revenue","new_price","new_genres","new_platforms","new_tags","new_stock_location"]

    //Adding all the editing input fields in the editing menu for the chosen game.
    for (let i = 0; i < input_headers.length; i++) {
        const editInput_Field = document.createElement("td")
        editInput_Field.style.backgroundColor = "#0cabdc"
        const edit_field = document.createElement("input")
        edit_field.type = "text"
        edit_field.id = input_ids[i]
        edit_field.style.width = "280px"
        edit_field.style.height = "55px"
        edit_field.style.fontWeight = "bolder"
        edit_field.placeholder = input_headers[i]
        editInput_Field.appendChild(edit_field)
        edit_row_inputs.appendChild(editInput_Field)
    }

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
        save_edited_game(game_row_id)
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
function save_edited_game(game_data_id) {
    const edit_value_name = document.getElementById("new_name").value,
        edit_value_desc = document.getElementById("new_desc").value,
        edit_value_stock = document.getElementById("new_stock").value,
        edit_value_revenue = document.getElementById("new_revenue").value,
        edit_value_price = document.getElementById("new_price").value,
        edit_value_genres = document.getElementById("new_genres").value,
        edit_value_platforms = document.getElementById("new_platforms").value,
        edit_value_tags = document.getElementById("new_tags").value,
        edit_value_stock_location = document.getElementById("new_stock_location").value

    //Statement used to create an alert prompt that prevents the administrator
    //from initializing an empty game object into the database.
    if (edit_value_name === "" ||
        edit_value_desc === "" ||
        edit_value_stock === "" ||
        edit_value_revenue === "" ||
        edit_value_price === "" ||
        edit_value_genres === "" ||
        edit_value_platforms === "" ||
        edit_value_tags === "" ||
        edit_value_stock_location === "") {
        alert("The input fields cannot be empty!")
        return;
    }

    //Using the fetch() method initializes a new game object into the database
    //via JSON using the stores values obtained from the input fields.
    fetch(`${api}/admin/game/${game_data_id}`, {
        method: "PUT",
        body: JSON.stringify({
            "name": edit_value_name,
            "desc": edit_value_desc,
            "stock": parseInt(edit_value_stock),
            "revenue": parseFloat(edit_value_revenue),
            "price": parseFloat(edit_value_price),
            "genres": String(edit_value_genres).split(","),
            "platforms": String(edit_value_platforms).split(","),
            "tags": String(edit_value_tags).split(","),
            "stockByLocation": JSON.parse(edit_value_stock_location),
        }),
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken
        }
    }).then(response => {
        if (response.ok) response.json().then(initialize_game_data) //add new game data!
        else if (response.status === 400) response.json().then(response => alert(response.message))
        else response.json().then(error => {console.error(response); console.error(error)})
    })

    //After initializing a new game object, set the values
    //of all input fields back to their default values.
    edit_value_name.value = ""
    edit_value_desc.value = ""
    edit_value_stock.value = ""
    edit_value_revenue.value = ""
    edit_value_price.value = ""
    edit_value_genres.value = ""
    edit_value_platforms.value = ""
    edit_value_tags.value = ""
    edit_value_stock_location.value = ""

    cancel_row_edit("editing_row")
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

//The purpose of this function is to refresh the webpage
//and load in the game objects stored in the database.
function refresh_the_page() {
    clearGame_ListData()
    fetch(`${api}/game`)
        .then(response => response.json())
        .then(response => response.forEach(initialize_game_data))
        .catch(error => console.log(error))
}

//Calls an addEventListener() "DOMContentLoaded" event that refreshes the
//webpage and showcases the all the game objects from the database.
document.addEventListener("DOMContentLoaded", function() {
    refresh_the_page()
}, false)