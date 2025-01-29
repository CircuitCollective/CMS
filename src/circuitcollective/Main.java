package circuitcollective;

import org.springdoc.core.models.*;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.context.annotation.*;
import org.springframework.web.servlet.config.annotation.*;

@SpringBootApplication
public class Main {
    public static void main(String... args) {
        SpringApplication.run(Main.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedMethods("*");
            }
        };
    }

    @Bean
    public GroupedOpenApi apiDocs() { // http://localhost:8080/swagger-ui.html
        return GroupedOpenApi.builder().group("API Docs").packagesToScan("circuitcollective").build();
    }
}
