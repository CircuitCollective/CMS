package circuitcollective.dummy;


import org.springframework.data.jpa.repository.*;

public interface DummyRepository extends JpaRepository<DummyEntity, Long> {
}
