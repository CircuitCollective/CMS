package circuitcollective.game;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.*;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.*;

import java.util.*;

@Entity
@Indexed
@JsonPropertyOrder({"id", "name", "desc", "stock", "revenue", "price", "tags", "genres", "platforms"})
@ToString
@EqualsAndHashCode
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    /** Game name */
    @FullTextField
    @NotBlank
    @Size(max = 100)
    public String name;

    /** Game description */
    @NotBlank
    @Size(max = 10_000)
    public String desc;

    /** Number of copies in stock */
    @Min(0)
    public int stock; // TODO: Base this off of stockByLocation somehow

    @ElementCollection @ColumnDefault("")
    public Set<String> tags = new HashSet<>();

    @ElementCollection @ColumnDefault("")
    public Set<String> genres = new HashSet<>();

    @ElementCollection @ColumnDefault("")
    public Set<String> platforms = new HashSet<>();

    /** Revenue produced by sales of the game */
    @Min(0) @ColumnDefault("0")
    public double revenue;

    /** The price of a game */
    @Min(0) @ColumnDefault("0")
    public double price;

    @ElementCollection @ColumnDefault("")
    public Map<String, Integer> stockByLocation = new HashMap<>();

    /** No-arg constructor for persistence */
    public Game() {}
}
