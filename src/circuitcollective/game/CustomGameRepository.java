package circuitcollective.game;

import java.util.*;

public interface CustomGameRepository {
    List<Game> search(String query, int limit, int offset, String... fields);
}
