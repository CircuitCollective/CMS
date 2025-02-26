package circuitcollective.game;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.*;

@Entity
@Indexed
@JsonPropertyOrder({"id", "name", "program", "faculty"})
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @FullTextField
    public String name;

    public String program, faculty;

    /** No-arg constructor for Persistence. */
    protected Game() {}

    public Game(String name, String program, String faculty) {
        this.name = name;
        this.program = program;
        this.faculty = faculty;
    }
    @Override
    public String toString() {
        return "Game{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", program='" + program + '\'' +
            ", faculty='" + faculty + '\'' +
            '}';
    }
}
