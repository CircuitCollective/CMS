package circuitcollective.dummy;

import jakarta.servlet.http.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping()
    List<DummyEntity> list() {
        return repo.findAll();
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
        if (dummy == null || dummy.val.isBlank()) throw new InvalidDummyException("Invalid Dummy val! " + (dummy == null ? "<null>" : dummy.toString()));
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    private static class InvalidDummyException extends IllegalArgumentException {
        public InvalidDummyException(String s) {
            super(s);
        }
    }

    //endregion
}