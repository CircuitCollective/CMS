package circuitcollective.game;

import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.json.*;
import jakarta.persistence.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.parallel.*;
import org.mapstruct.factory.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.boot.test.autoconfigure.jdbc.*;
import org.springframework.boot.test.context.*;
import org.springframework.data.util.*;
import org.springframework.http.*;
import org.springframework.test.context.*;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.setup.*;
import org.springframework.web.context.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.http.MediaType.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** This class tests behavior from {@link GameController} and {@link GameAdminController} */
@SpringBootTest
@AutoConfigureTestDatabase
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Execution(ExecutionMode.SAME_THREAD)
@ActiveProfiles("test")
public class GameControllersTest {
    @Autowired
    private WebApplicationContext context;

    @Autowired
    private EntityManager entityManager;

    private MockMvc mvc;

    private final ObjectMapper mapper = JsonMapper.builder().disable(MapperFeature.USE_ANNOTATIONS).build();
    private final ObjectReader reader = mapper.readerForListOf(Game.class);
    private final ObjectWriter writer = mapper.writer();

    private final Game g1 = new Game() {{ // Good game
        name = "Game1";
        desc = "Desc1";
        stock = 1;
        genres = Set.of("GenreA", "GenreB");
        platforms = Set.of("Platform1","Platform2");
        revenue = 160.0;
        price = 80.0;
    }}, g2 = new Game(); // Bad game

    @BeforeEach
    public void setup() {
        mvc = MockMvcBuilders
            .webAppContextSetup(context)
            .defaultRequest(get("").with(user("admin").roles("ADMIN")))
            .apply(springSecurity())
            .build();
    }

    /** Insert a game into the database */
    private void insert(Game g, boolean okay) throws Exception {
        mvc.perform(post("/api/admin/game").contentType(APPLICATION_JSON).content(writer.writeValueAsString(g))).andExpect(okay ? status().isOk() : status().isBadRequest());
    }

    /** Returns a list of all games in the db */
    private List<Game> list() throws Exception {
        return reader.readValue(mvc.perform(get("/api/game")).andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
    }

    /** Searches games by name */
    private List<Game> search(String query) throws Exception {
        return reader.readValue(mvc.perform(get("/api/game/search").queryParam("q", query)).andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
    }

    /** Test insertion of new games into the db */
    @Test
    @Order(1)
    void testInsert() throws Exception {
        insert(g1, true); // Expect OK
        insert(g2, false); // Expect Bad Request due to invalid field values
    }

    /** Test listing of games in the db as well as individual retrieval. */
    @Test
    @Order(2)
    void testListAndGet() throws Exception {
        // Read back the game list (should be the single game)
        var games = list();
        assertEquals(1, games.size(), "Wrong number of games saved to db"); // Make sure it's the only thing in db
        var out = games.getFirst();
        ReflectionUtils.setField(ReflectionUtils.findRequiredField(Game.class, "id"), out, g1.getId()); // Copy g1's id to out to make sure equality works.
        assertEquals(g1, out, "Incorrect game data saved to database"); // Make sure it serializes properly

        // Also make sure that we can get the individual game by id
        Game game = mapper.readerFor(Game.class).readValue(mvc.perform(get("/api/game/{id}", 1)).andExpect(status().isOk()).andReturn().getResponse().getContentAsByteArray());
        ReflectionUtils.setField(ReflectionUtils.findRequiredField(Game.class, "id"), game, g1.getId()); // Copy g1's id to game to make sure equality works.
        assertEquals(g1, game);
    }

    /** Tests search functionality. Also, indirectly tests the update functionality as it uses GameMapper which handles that for us. */
    @Test
    @Order(3)
    void testSearchAndUpdate() throws Exception {
        var names = new String[]{"Apple", "Banana", "Cucumber", "Cucumber 2: Electric Boogaloo"}; // Dummy games to add

        var gMapper = Mappers.getMapper(GameMapper.class);
        for (var name : names) {
            var g = new Game();
            gMapper.updateGame(g1, g); // Copy g1 into g
            g.name = name;

            try {
                insert(g, true);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        var apple = search("Apple"); // Should have 1 result
        System.out.println(apple);
        System.out.println(apple.size());
        System.out.println(list());
        System.out.println(list().size());
        assertEquals(1, apple.size());

        var cucumber = search("Cucumber"); // Should have 2 results
        assertEquals(2, cucumber.size());
    }

    @Test
    @Order(4)
    void testDelete() throws Exception {
        insert(g1, true);
        var games = list();
        var size = games.size();
        System.out.println(games);
        mvc.perform(delete("/api/admin/game/{id}", games.getFirst().getId()).contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn(); // Delete the first game we find
        var gamesAfterDelete = list();
        assertEquals(size - 1, gamesAfterDelete.size(), "Expected games list size to shrink by 1 after deleting a game");
    }
}
