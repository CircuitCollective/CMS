package circuitcollective.game;

import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

@Controller
public class WebController {
    @GetMapping("/login")
    public String login() {
        return "login";
    }
}