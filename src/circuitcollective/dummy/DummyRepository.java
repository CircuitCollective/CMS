package circuitcollective.dummy;


import org.springframework.data.jpa.repository.*;

//@RepositoryRestResource
public interface DummyRepository extends JpaRepository<DummyEntity, Long> {
}
