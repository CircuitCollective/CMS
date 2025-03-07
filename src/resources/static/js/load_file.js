const inputFile_Location = document.getElementById("desired_file_upload")
const chooseFile_Button = document.getElementById("choose_desired_file")
const textFile_Name = document.getElementById("text_file_name")

chooseFile_Button.addEventListener("click", () => inputFile_Location.click())
inputFile_Location.addEventListener("change", () => inputFile_Location.value ? textFile_Name.innerHTML = inputFile_Location.value : 0);

function import_csv_data() {
    inputFile_Location.addEventListener("change", () =>
        fetch(`${api}/admin/game/batch`, {
            method: "POST",
            headers: {
                'X-XSRF-TOKEN': csrfToken
            },
            body: new FormData(document.getElementById("form"))
        }).then(obtain_database_data))
}