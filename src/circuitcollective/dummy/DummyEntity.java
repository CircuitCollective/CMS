package circuitcollective.dummy;

import jakarta.persistence.*;
import lombok.*;

@Entity
public class DummyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private long id;

    public String val;

    protected DummyEntity() {}

    public DummyEntity(String value) {
        this.val = value;
    }

    @Override
    public String toString() {
        return "DummyEntity{" +
            "id=" + id +
            ", val='" + val + '\'' +
            '}';
    }
}
