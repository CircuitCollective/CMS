let initialized_row_value = 0
let url_backend = "http://localhost:8080"

function create_user_row() {
    const generated_id = Math.floor(Math.random() * 1000) + 1 //variable to store randomly generated id

    const input_name = document.getElementById("name")
    const value_name = input_name.value

    const input_program = document.getElementById("program")
    const value_program = input_program.value

    const input_faculty = document.getElementById("faculty")
    const value_faculty = input_faculty.value

    if (value_name === "" || value_program === "" || value_faculty === "") {
        alert("The input fields cannot be empty!")
        return;
    }

    initialized_row_value++
    let userData = document.getElementById("user_data")
    let userRow = document.createElement("tr")
    userRow.id = String(initialized_row_value)

    let userID  = document.createElement("td")
    userID.innerHTML = generated_id
    userRow.appendChild(userID)

    let userName = document.createElement("td")
    userName.innerHTML = value_name
    userRow.appendChild(userName)

    let userProgram  = document.createElement("td")
    userProgram.innerHTML = value_program
    userRow.appendChild(userProgram)

    let userFaculty  = document.createElement("td")
    userFaculty.innerHTML = value_faculty
    userRow.appendChild(userFaculty)

    let editUserButton = document.createElement("td")
    let editUser_OnClick = document.createElement("button")
    editUser_OnClick.type = "button"
    editUser_OnClick.textContent = "Edit User"
    editUser_OnClick.addEventListener("click", function(){edit_user_menu(this, parseInt(userRow.id))})
    editUserButton.appendChild(editUser_OnClick)
    userRow.appendChild(editUserButton)

    let removeUserButton = document.createElement("td")
    let removeUser_OnClick = document.createElement("button")
    removeUser_OnClick.type = "button"
    removeUser_OnClick.textContent = "Remove User"
    removeUser_OnClick.addEventListener("click", function(){remove_row(parseInt(userRow.id))})
    removeUserButton.appendChild(removeUser_OnClick)
    userRow.appendChild(removeUserButton)

    fetch(`${url_backend}/game/${generated_id}`, {
        method: "PUT",
        body: JSON.stringify({
            "id" : generated_id,
            "name": value_name,
            "program": value_program,
            "faculty": value_faculty,
        }),
        headers: {
            "Content-Type": "application/json",
        }
    }).then(obtain_database_data)
        .catch(error => {console.log(error.message)})

    userData.appendChild(userRow)


    input_name.value = ""
    input_program.value = ""
    input_faculty.value = ""
}

function remove_row(row_value) {
    let userData_Table = document.getElementById("user_data")
    let userRow_Data = document.getElementById(row_value)
    let editing_data_row = document.getElementById("editing_row")

    if (userData_Table.rows.length > 0) {
        userData_Table.removeChild(userRow_Data)
        userData_Table.removeChild(editing_data_row)
    }
}



function edit_user_menu(edit_user_button, user_row_id) {
    let get_current_row = document.getElementById(user_row_id)

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

    const newProgram_input = document.createElement("td")
    const edit_program = document.createElement("input")
    edit_program.type = "text"
    edit_program.id = "new_program"
    edit_program.placeholder = "New Program"
    newProgram_input.appendChild(edit_program)
    edit_row_inputs.appendChild(newProgram_input)

    const newFaculty_input = document.createElement("td")
    const edit_faculty = document.createElement("input")
    edit_faculty.type = "text"
    edit_faculty.id = "new_faculty"
    edit_faculty.placeholder = "New Faculty"
    newFaculty_input.appendChild(edit_faculty)
    edit_row_inputs.appendChild(newFaculty_input)

    const saveUserButton = document.createElement("td")
    const saveUser_OnClick = document.createElement("button")
    saveUser_OnClick.type = "button"
    saveUser_OnClick.textContent = "Save New User"
    saveUser_OnClick.addEventListener("click", function(){
        save_edited_user(edit_user_button,
            edit_row_inputs.id,
            edit_id,
            edit_name,
            edit_program,
            edit_faculty)
    })
    saveUserButton.appendChild(saveUser_OnClick)
    edit_row_inputs.appendChild(saveUserButton)

    const cancelEditButton = document.createElement("td")
    const cancelEdit_OnClick = document.createElement("button")
    cancelEdit_OnClick.type = "button"
    cancelEdit_OnClick.textContent = "Cancel"
    cancelEdit_OnClick.addEventListener("click", function(){
        cancel_row_edit(edit_row_inputs.id)
    })
    cancelEditButton.appendChild(cancelEdit_OnClick)
    edit_row_inputs.appendChild(cancelEditButton)

    $(edit_user_button).ready(function() {
        $(edit_row_inputs).insertAfter(get_current_row)
    })
}

function save_edited_user(edit_user_button, row_value, edited_id, edited_name, edited_program, edited_faculty) {
    if (edited_id.value === "" || edited_name.value === "" || edited_program.value === "" || edited_faculty.value === "") {
        alert("The input fields cannot be empty!")
        return
    }

    let userData_Table = document.getElementById("user_data")
    let userRow_Data = document.getElementById(row_value)
    let edit_user_row = edit_user_button.parentNode.parentNode

    let newID_Data = edit_user_row.cells[0]
    let newName_Data = edit_user_row.cells[1]
    let newProgram_Data = edit_user_row.cells[2]
    let newFaculty_Data = edit_user_row.cells[3]

    newID_Data.innerHTML = edited_id.value
    newName_Data.innerHTML = edited_name.value
    newProgram_Data.innerHTML = edited_program.value
    newFaculty_Data.innerHTML = edited_faculty.value

    edited_id.value = ""
    edited_name.value = ""
    edited_program.value = ""
    edited_faculty.value = ""

    if (userData_Table.rows.length > 0) {
        userData_Table.removeChild(userRow_Data)
    }
}

function cancel_row_edit(row_value) {
    let userData_Table = document.getElementById("user_data")
    let userRow_Data = document.getElementById(row_value)

    if (userData_Table.rows.length > 0) {
        userData_Table.removeChild(userRow_Data)
    }
}


function obtain_database_data() {
    fetch(`${url_backend}/game/}`)
        .then(response => response.json())
        .then(load_database_data)
        .catch(error => {console.log(error.message)})
    function load_database_data(database_data) {
        let userRow_Table = document.getElementById("user_data")

        for (const row_data of database_data) {
            let loadUser_Data = document.createElement("tr")

            let loadedUser_ID = document.createElement("td")
            loadedUser_ID.innerHTML = row_data.id
            loadUser_Data.appendChild(loadedUser_ID)

            let loadedUser_Name = document.createElement("td")
            loadedUser_Name.innerHTML = row_data.name
            loadUser_Data.appendChild(loadedUser_Name)

            let loadedUser_Program = document.createElement("td")
            loadedUser_Program.innerHTML = row_data.program
            loadUser_Data.appendChild(loadedUser_Program)

            let loadedUser_Faculty = document.createElement("td")
            loadedUser_Faculty.innerHTML = row_data.faculty
            loadUser_Data.appendChild(loadedUser_Faculty)


            const editUserButton = document.createElement("td")
            let editUser_OnClick = document.createElement("button")
            editUser_OnClick.type = "button"
            editUser_OnClick.textContent = "Edit User"
            editUser_OnClick.addEventListener("click", function(){edit_user_data(this)})
            editUserButton.appendChild(editUser_OnClick)
            loadUser_Data.appendChild(editUserButton)

            const removeUserButton = document.createElement("td")
            let removeUser_OnClick = document.createElement("button")
            removeUser_OnClick.type = "button"
            removeUser_OnClick.textContent = "Remove User"
            removeUser_OnClick.addEventListener("click", function(){remove_row(parseInt(row_data.id))})
            removeUserButton.appendChild(removeUser_OnClick)
            loadUser_Data.appendChild(removeUserButton)

            userRow_Table.appendChild(loadUser_Data)
        }
    }
}

(function() {
    obtain_database_data()
})()
