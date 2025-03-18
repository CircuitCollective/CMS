package circuitcollective.game;

import jakarta.persistence.*;
import org.hibernate.search.mapper.orm.*;

import java.util.*;

public class CustomGameRepositoryImpl implements CustomGameRepository {
    @PersistenceContext
    private EntityManager entityManager;

    // TODO(Nathan): Implement a whitelist of fields allowed to be searched. Ideally this should use an annotation to increase maintainability.
    /*private static final List<String> allowedFields = List.of( // List contains is significantly faster than hashset for small size
        "id",
        "name",
        "description",
        "genres"
    );*/

    @Override
    public List<Game> search(String query, int limit, int offset, String... fields) {
        try { // TODO: Temp hack
            Search.session(entityManager).massIndexer(Game.class).startAndWait();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return Search.session(entityManager).search(Game.class).where(e -> e.match().fields(fields).matching(query).fuzzy()).fetch(offset, limit).hits();
    }
}
