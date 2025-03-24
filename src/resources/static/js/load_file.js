let api_url = "http://localhost:8080/api"
let inputFile_Location = document.getElementById("desired_file_upload") //Gain access to the location of the chosen file
let chooseFile_Button = document.getElementById("choose_desired_file") //Gain access to the choose file button
let textFile_Name = document.getElementById("text_file_name") //Gain access to name of the chosen file.

//Add an addEventListener() "click" event that showcases
//the file name chosen to be imported to the database.
chooseFile_Button.addEventListener("click", function(){inputFile_Location.click()})

//Add an addEventListener() "change" event that showcases the file
//name chosen to be imported to the database on the webpage.
inputFile_Location.addEventListener("change", function (){
    if(inputFile_Location.value) {
        textFile_Name.innerHTML = inputFile_Location.value;
    }
})

//The purpose of this function is import CSV data obtained from the
//file selector and parse its contents to be displayed to the webpage.
function import_csv_data() {
    inputFile_Location.addEventListener("change", () =>
        fetch(`${api_url}/admin/game/batch`, {
            method: "POST",
            body: new FormData(document.getElementById("form"))
        }).then(obtain_database_data).catch(error => console.log(error.message)));
}