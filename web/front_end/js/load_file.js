let inputFile_Location = document.getElementById("desired_file_upload")
let chooseFile_Button = document.getElementById("choose_desired_file")
let textFile_Name = document.getElementById("text_file_name")

chooseFile_Button.addEventListener("click", function(){inputFile_Location.click()})
inputFile_Location.addEventListener("change", function (){
    if(inputFile_Location.value) {
        textFile_Name.innerHTML = inputFile_Location.value;
    }
})

function import_csv_data() {
    const csvFile = inputFile_Location.files[0]
    Papa.parse(csvFile, {
        header: true,
        complete: function (results) {
            load_csv_data(results.data)
            console.log(results)
        },
    })
}

function load_csv_data(csvData) {
    let userRow_Table = document.getElementById("user_data")

    for (const row_data of csvData) {
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



