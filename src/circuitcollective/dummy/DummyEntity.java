package circuitcollective.dummy;

import jakarta.persistence.*;
import lombok.*;

@Entity
public class DummyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
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
