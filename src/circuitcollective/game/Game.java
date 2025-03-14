package circuitcollective.game;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.*;

import java.util.*;

@Entity
@Indexed
@JsonPropertyOrder({"id", "name", "desc", "stock", "tags"})
@ToString
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
    public int stock;

    @ElementCollection @CollectionTable
    public Set<String> tags = new HashSet<>();

//    /** Revenue produced by sales of the game */
//    @Min(0) @Generated @ColumnDefault("0")
//    public double revenue;

    /** No-arg constructor for persistence */
    protected Game() {}
}
