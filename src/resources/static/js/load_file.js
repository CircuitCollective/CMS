const api_url = "http://localhost:8080/api"

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
    inputFile_Location.addEventListener("change", () =>
            fetch(`${api_url}/game/batch`, {
                method: "POST",
                body: new FormData(document.getElementById("form"))
            }).then(obtain_database_data))
}
obtain_database_data()