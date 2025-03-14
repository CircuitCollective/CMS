let inputFile_Location = document.getElementById("desired_file_upload") //Gain access to the location of the chosen file
let chooseFile_Button = document.getElementById("choose_desired_file") //Gain access to the choose file button
let textFile_Name = document.getElementById("text_file_name") //Gain access to name of the chosen file.

chooseFile_Button.addEventListener("click", function(){inputFile_Location.click()})
inputFile_Location.addEventListener("change", function (){
    if(inputFile_Location.value) {
        textFile_Name.innerHTML = inputFile_Location.value;
    }
})

function import_csv_data() {
    inputFile_Location.addEventListener("change", () =>
            fetch(`${api_url}/admin/game/batch`, {
                method: "POST",
                body: new FormData(document.getElementById("form"))
            }).then(obtain_database_data))
}

document.addEventListener("DOMContentLoaded", function() {
    refresh_the_page()
}, false)