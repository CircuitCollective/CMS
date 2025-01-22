let value = 0;
function add_user() {
    const input_id = document.getElementById("id")
    const value_id = input_id.value

    const input_name = document.getElementById("name")
    const value_name = input_name.value

    const input_program = document.getElementById("id")
    const value_program = input_program.value

    const input_faculty = document.getElementById("name")
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
    editUser_OnClick.addEventListener("click", function(){edit_row(parseInt(userRow.id))})
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

    input_id.value = ""
    input_name.value = ""
}

function remove_row(row_value) {
    let userData_Table = document.getElementById("user_data")
    let userRow_Data = document.getElementById(row_value)

    if (userData_Table.rows.length > 0) {
        userData_Table.removeChild(userRow_Data)
    }
}

function edit_row(row_value) {
    let userData_Table = document.getElementById("user_data")
    let userRow_Data = document.getElementById(row_value)
}