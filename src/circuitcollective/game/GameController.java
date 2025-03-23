package circuitcollective.game;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.*;

import java.util.*;

/** Public endpoints for game listing */
@RestController
@RequestMapping("api/game")
public class GameController {
    private final GameRepository repo;

    GameController(GameRepository repo) {
        this.repo = repo;
    }

    //region Multiple Entity Methods

    /** Lists all games */
    @GetMapping
    List<Game> list() {
        return repo.findAll();
    }

    //endregion
    //region Single Entity Methods

    /** Get a list of games matching the query (fuzzy) */
    @GetMapping("search")
    List<Game> search(
        @RequestParam("q") String query,
        @RequestParam(name = "l", required = false, defaultValue = "10") int limit,
        @RequestParam(name = "o", required = false, defaultValue = "0") int offset,
        @RequestParam(name = "f", required = false, defaultValue = "name") String... fields // Comma separated list: a,b,c
    ) {
        if (limit > 25 || limit < 1) throw new IllegalArgumentException("Invalid limit. Must be 1-25"); // TODO: Replace with ResponseStatusExceptions
        if (offset < 0) throw new IllegalArgumentException("Invalid offset. Cannot be below 0");
        return repo.search(query, limit, offset, fields);
    }

    /** Gets a game */
    @GetMapping("/{id}")
    Game get(@PathVariable long id) {
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found with id " + id));
    }

    //endregion
}