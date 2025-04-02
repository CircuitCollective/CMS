let inputFile_Location = document.getElementById("file") //Gain access to the location of the chosen file
let chooseFile_Button = document.getElementById("choose_desired_file") //Gain access to the choose file button
let textFile_Name = document.getElementById("text_file_name") //Gain access to name of the chosen file.

//Add an addEventListener() "click" event that showcases
//the file name chosen to be imported to the database.
chooseFile_Button.addEventListener("click", function(){inputFile_Location.click()})

//Add an addEventListener() "change" event that showcases the file
//name chosen to be imported to the database on the webpage.
inputFile_Location.addEventListener("change", function (){
    textFile_Name.innerHTML = inputFile_Location.value

    fetch(`${api}/admin/game/batch`, {
        method: "POST",
        body: new FormData(document.getElementById("form"))
    }).then(response => response.ok ? refresh_the_page() : response.json().then(console.error))
})