const search_input_menu = document.getElementById("search_bar_input") //Gain access to the search bar

//Implement a addEventListener() "keydown" event that allows the administrator
//to search for any game they need to view using specific keywords in the string.
search_input_menu.addEventListener("keydown", function(event_key) {
    if (event_key.key !== "Enter") {
        return
    }

    const desired_games_search = search_input_menu.value
    if (desired_games_search.trim() === "") {
        refresh_the_page()
    }
    else {
        clearGame_ListData()
        fetch(`${api_url}/game/search?l-25&q=${desired_games_search}`)
            .then(response => response.json())
            .then(response => response.forEach(obtain_database_data))
            .catch(error => console.error(error.message))
    }
})