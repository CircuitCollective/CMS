const recommended_searches = []

function search_engine() {
    const search_input_menu = document.getElementById("search_bar_input") //Gain access to the search bar

    //Implement a addEventListener() "keydown" event that allows the administrator
    // to search for any game they need to view using specific keywords in the string.
    search_input_menu.addEventListener("keydown", event_key => {
        if (event_key.key !== "Enter") {
            return
        }

        const desired_games_search = search_input_menu.value
        if (desired_games_search.trim() === "") {
            refresh_the_page()
        }
        else {
            clearGame_ListData()
            fetch(`${api}/game/search?l-25&q=${desired_games_search}`)
                .then(response => response.json())
                .then(response => response.forEach(initialize_game_data))
                .catch(error => console.error(error))
        }
    })
}

function get_all_recommended_name_searches() {
    fetch(`${api}/game`)
        .then(response => response.json())
        .then(response => response.forEach(get_all_game_names))
        .catch(error => console.error(error))
    function get_all_game_names(game_data) {
        recommended_searches.push(game_data.name)
    }
}

function process_all_recommended_names() {
    const search_input_contains = document.getElementById("search_bar_input") //Gain access to the search bar
    const search_input_wrapper = document.querySelector(".wrapper")
    const search_input_results = document.querySelector(".recommendation_results")

    search_input_contains.addEventListener('keyup', () => {
        let recommended_results = []
        let input_value = search_input_contains.value
        if (input_value.length) {
            recommended_results = recommended_searches.filter((game_name) => {
                return game_name.toLowerCase().includes(input_value.toLowerCase())
            })
        }
        render_all_name_recommendations(recommended_results, search_input_wrapper, search_input_results)
    })
}

function render_all_name_recommendations(name_results, input_wrapper, input_results) {
    if (!name_results.length) {
        return input_wrapper.classList.remove('show')
    }

    const names_contents = name_results.map((game_name) => {
        return `<li>${game_name}</li>`
    }).join('')

    input_wrapper.classList.add('show')
    input_results.innerHTML = `<ul>${names_contents}</ul>`
}

function search_engine_functionality() {
    search_engine()
    get_all_recommended_name_searches()
    process_all_recommended_names()
}
