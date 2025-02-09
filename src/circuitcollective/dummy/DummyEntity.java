package circuitcollective.dummy;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@JsonPropertyOrder({"id", "name", "program", "faculty"})
public class DummyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    public String name, program, faculty;

    /** No-arg constructor for Persistence. */
    protected DummyEntity() {}

    public DummyEntity(String name, String program, String faculty) {
        this.name = name;
        this.program = program;
        this.faculty = faculty;
    }
    @Override
    public String toString() {
        return "DummyEntity{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", program='" + program + '\'' +
            ", faculty='" + faculty + '\'' +
            '}';
    }
}
