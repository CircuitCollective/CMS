let value = 0;
function create_user_row() {
    const value_id = String(Math.round((Math.random() * 100)))

    const input_name = document.getElementById("name")
    const value_name = input_name.value

    const input_program = document.getElementById("program")
    const value_program = input_program.value

    const input_faculty = document.getElementById("faculty")
    const value_faculty = input_faculty.value

    if (value_id === "" || value_name === "" || value_program === "" || value_faculty === "") {
        return;
    }

    value++
    let userData = document.getElementById("user_data")
    let userRow = document.createElement("tr")
    userRow.id = String(value)

    let userID  = document.createElement("td")
    userID.innerHTML = value_id
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
    editUser_OnClick.addEventListener("click", function(){edit_user_data(this)})
    editUserButton.appendChild(editUser_OnClick)
    userRow.appendChild(editUserButton)

    let removeUserButton = document.createElement("td")
    let removeUser_OnClick = document.createElement("button")
    removeUser_OnClick.type = "button"
    removeUser_OnClick.textContent = "Remove User"
    removeUser_OnClick.addEventListener("click", function(){remove_row(parseInt(userRow.id))})
    removeUserButton.appendChild(removeUser_OnClick)
    userRow.appendChild(removeUserButton)


    userData.appendChild(userRow)

    input_name.value = ""
    input_program.value = ""
    input_faculty.value = ""
}

function remove_row(row_value) {
    let userData_Table = document.getElementById("user_data")
    let userRow_Data = document.getElementById(row_value)

    if (userData_Table.rows.length > 0) {
        userData_Table.removeChild(userRow_Data)
    }
}

function edit_user_data(edit_user_button) {
    let userData_Row = edit_user_button.parentNode.parentNode

    let newID_Data = userData_Row.cells[0]
    let newName_Data = userData_Row.cells[1]
    let newProgram_Data = userData_Row.cells[2]
    let newFaculty_Data = userData_Row.cells[3]

    let newID_Input = prompt("Please enter the updated ID information for this specific user:", newID_Data.innerHTML)
    let newName_Input = prompt("Please enter the updated Name information for this specific user:", newName_Data.innerHTML)
    let newProgram_Input = prompt("Please enter the updated Program information for this specific user:", newProgram_Data.innerHTML)
    let newFaculty_Input = prompt("Please enter the updated Faculty information for this specific user:", newFaculty_Data.innerHTML)

    newID_Data.innerHTML = newID_Input
    newName_Data.innerHTML = newName_Input
    newProgram_Data.innerHTML = newProgram_Input
    newFaculty_Data.innerHTML = newFaculty_Input
}