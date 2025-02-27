package circuitcollective.game;

import com.fasterxml.jackson.dataformat.csv.*;
import jakarta.servlet.http.*;
import jakarta.validation.*;
import org.springframework.transaction.annotation.*;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.*;

import java.io.*;
import java.util.*;

@RestController
@RequestMapping("game")
class GameController {
    private final GameRepository repo;
    private final GameMapper gameMapper;

    GameController(GameRepository repo, GameMapper gameMapper, Validator validator) {
        this.repo = repo;
        this.gameMapper = gameMapper;
    }

    //region Multiple Entity Methods

    /** Lists all games */
    @GetMapping
    List<Game> list() {
        return repo.findAll();
    }

    /** Batch upload new games */
    @Transactional
    @PostMapping(value = "/batch", consumes = "multipart/form-data")
    void uploadMultipart(@RequestParam("file") MultipartFile file) throws IOException {
        var mapper = new CsvMapper();
        var schema = mapper.typedSchemaFor(Game.class).rebuild().removeColumn(0).build(); // Schema without the ID column.
        var reader = mapper.readerFor(Game.class).with(schema);
        reader.<Game>readValues(file.getInputStream()).forEachRemaining(this::create);
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
        if (limit > 25 || limit < 1) throw new IllegalArgumentException("Invalid limit. Must be 1-25");
        if (offset < 0) throw new IllegalArgumentException("Invalid offset. Cannot be below 0");
        return repo.search(query, limit, offset, fields);
    }

    /** Gets a game */
    @GetMapping("{id}")
    Game get(@PathVariable long id, HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        return repo.getReferenceById(id);
    }

    /** Creates a game */
    @PostMapping
    Game create(@Valid @RequestBody Game game) {
        return repo.save(game);
    }

    /** Replaces a game entirely (or saves a new one if it doesn't exist) */
    @PutMapping
    Game replace(@Valid @RequestBody Game game) {
        return repo.findById(game.getId())
            .map(old -> {
                gameMapper.updateGame(game, old);
                return repo.save(old);
            }).orElseGet(() -> repo.save(game));
    }

    /** Deletes a game */
    @DeleteMapping("{id}")
    void delete(@PathVariable long id) {
        repo.deleteById(id);
    }

    //endregion
}