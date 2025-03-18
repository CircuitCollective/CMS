package circuitcollective.game;

import com.fasterxml.jackson.dataformat.csv.*;
import jakarta.validation.*;
import org.springframework.transaction.annotation.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.*;

import java.io.*;

/** Private endpoints for game management */
@RestController
@RequestMapping("api/admin/game")
public class GameAdminController {
    private final GameRepository repo;
    private final GameMapper gameMapper;

    GameAdminController(GameRepository repo, GameMapper gameMapper) {
        this.repo = repo;
        this.gameMapper = gameMapper;
    }

    //region Multiple Entity Methods

    /** Batch upload new games */
    @Transactional
    @PostMapping(value = "/batch", consumes = "multipart/form-data")
    void uploadMultipart(@RequestParam("file") MultipartFile file) throws IOException {
        var mapper = new CsvMapper();
        var schema = mapper.typedSchemaFor(Game.class).rebuild().removeColumn(0).build().withHeader().withColumnReordering(true); // Schema without the ID column.
        var reader = mapper.readerFor(Game.class).with(schema);
        reader.<Game>readValues(file.getInputStream()).forEachRemaining(this::create);
    }

    //endregion
    //region Single Entity Methods

    /** Creates a game */
    @PostMapping
    Game create(@Valid @RequestBody Game game) {
        return repo.save(game);
    }

    /** Replaces a game entirely (or saves a new one if it doesn't exist) */
    @PutMapping("/{id}")
    Game replace(@Valid @RequestBody Game game, @PathVariable long id) {
        return repo.findById(id)
                .map(old -> {
                    gameMapper.updateGame(game, old);
                    return repo.save(old);
                }).orElseGet(() -> repo.save(game));
    }

    /** Deletes a game */
    @DeleteMapping("/{id}")
    void delete(@PathVariable long id) {
        repo.deleteById(id);
    }

    /** Sells some number of copies of a game: Decreases stock, increases revenue accordingly. */
    @PostMapping("/sell/{id}")
    void sell(@PathVariable long id, @RequestParam("sales") int count) {
        var game = repo.getReferenceById(id);
        if (count > game.stock) throw new IllegalArgumentException("Invalid number of sales, (" + count + ") > stock (" + game.stock + ")");
        game.stock -= count;
        game.revenue += game.price * count;
    }

    //endregion
}