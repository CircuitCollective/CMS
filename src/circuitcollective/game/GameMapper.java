package circuitcollective.game;

import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface GameMapper {
    void updateGame(Game game, @MappingTarget Game old);
}