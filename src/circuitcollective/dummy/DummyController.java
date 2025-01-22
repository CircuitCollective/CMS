package circuitcollective.dummy;

import com.fasterxml.jackson.dataformat.csv.*;
import jakarta.servlet.http.*;
import org.springframework.http.*;
import org.springframework.transaction.annotation.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.*;

import java.io.*;
import java.util.*;

@RestController
@RequestMapping("dummy")
class DummyController {
    private final DummyRepository repo;

    DummyController(DummyRepository repo) {
        this.repo = repo;
    }

    //region Multiple Entity Methods

    /** Lists all dummies */
    @GetMapping
    List<DummyEntity> list() {
        return repo.findAll();
    }

    /** Batch upload new dummies */
    @Transactional
    @PostMapping(value = "/batch", consumes = "multipart/form-data")
    public void uploadMultipart(@RequestParam("file") MultipartFile file) throws IOException {
        var mapper = new CsvMapper();
        var schema = mapper.schemaFor(DummyEntity.class)
            .rebuild().removeColumn(0).build(); // Remove the id column.
        var reader = mapper.readerFor(DummyEntity.class).with(schema);
        reader.<DummyEntity>readValues(file.getInputStream()).forEachRemaining(this::create);
    }

    //endregion
    //region Single Entity Methods

    /** Gets a dummy */
    @GetMapping("{id}")
    DummyEntity get(@PathVariable long id, HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        return repo.getReferenceById(id);
    }

    /** Creates a dummy */
    @PostMapping
    DummyEntity create(@RequestBody DummyEntity dummy) {
        validateDummy(dummy);
        return repo.save(dummy);
    }

    /** Replaces a dummy entirely (or saves a new one if it doesn't exist) */
    @PutMapping("{id}")
    DummyEntity replace(@RequestBody DummyEntity dummy, @PathVariable long id) {
        validateDummy(dummy);
        return repo.findById(id)
            .map(old -> {
                old.val = dummy.val;
                return repo.save(old);
            }).orElseGet(() -> repo.save(dummy));
    }

    /** Deletes a dummy */
    @DeleteMapping("{id}")
    void delete(@PathVariable long id) {
        repo.deleteById(id);
    }

    //endregion
    //region Validation

    /** This is only an example; validates the dummy to make sure there is a non-blank value */
    private void validateDummy(DummyEntity dummy) throws InvalidDummyException {
        if (dummy.val == null || dummy.val.isBlank()) throw new InvalidDummyException("Invalid Dummy val! " + dummy);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    private static class InvalidDummyException extends IllegalArgumentException {
        public InvalidDummyException(String s) {
            super(s);
        }
    }

    //endregion
}