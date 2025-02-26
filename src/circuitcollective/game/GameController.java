package circuitcollective.game;

import com.fasterxml.jackson.dataformat.csv.*;
import jakarta.servlet.http.*;
import org.springframework.http.*;
import org.springframework.transaction.annotation.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.*;

import java.io.*;
import java.util.*;

@RestController
@RequestMapping("game")
class GameController {
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

    /** Gets a game */
    @GetMapping("{id}")
    Game get(@PathVariable long id, HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        return repo.getReferenceById(id);
    }

    /** Creates a game */
    @PostMapping
    Game create(@RequestBody Game game) {
        validateGame(game);
        return repo.save(game);
    }

    /** Replaces a game entirely (or saves a new one if it doesn't exist) */
    @PutMapping("{id}")
    Game replace(@RequestBody Game game, @PathVariable long id) {
        validateGame(game);
        return repo.findById(id)
            .map(old -> {
                old.name = game.name;
                old.program = game.program;
                old.faculty = game.faculty;
                return repo.save(old);
            }).orElseGet(() -> repo.save(game));
    }

    /** Deletes a game */
    @DeleteMapping("{id}")
    void delete(@PathVariable long id) {
        repo.deleteById(id);
    }

    //endregion
    //region Validation

    /** This is only an example; validates the game to make sure there is a non-blank value */
    private void validateGame(Game game) throws InvalidGameException {
        if (game.name == null || game.name.isBlank() || game.name.length() > 255) throw new InvalidGameException("Invalid Game name! " + game);
        if (game.program == null || game.program.isBlank() || game.program.length() > 255) throw new InvalidGameException("Invalid Game program! " + game);
        if (game.faculty == null || game.faculty.isBlank() || game.faculty.length() > 255) throw new InvalidGameException("Invalid Game faculty! " + game);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    private static class InvalidGameException extends IllegalArgumentException {
        public InvalidGameException(String s) {
            super(s);
        }
    }

    //endregion
}