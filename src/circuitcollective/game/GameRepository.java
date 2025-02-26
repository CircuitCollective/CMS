package circuitcollective.game;


import org.springframework.data.jpa.repository.*;

public interface GameRepository extends JpaRepository<Game, Long>, CustomGameRepository{
}
