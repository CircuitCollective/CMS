package circuitcollective;

import org.springdoc.core.models.*;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.config.annotation.web.configurers.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.provisioning.*;
import org.springframework.security.web.*;

@SpringBootApplication
@EnableWebSecurity
public class Main {
    public static void main(String... args) {
        SpringApplication.run(Main.class, args);
    }

    @Bean
    public GroupedOpenApi apiDocs() { // http://localhost:8080/swagger-ui.html
        return GroupedOpenApi.builder().group("API Docs").packagesToScan("circuitcollective").build();
    }

    //region auth

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests((requests) -> requests
                .requestMatchers("api/admin/**").hasRole("ADMIN") // All requests to games require admin role
                .anyRequest().permitAll() // All other requests are fine
            )
            .formLogin(AbstractAuthenticationFilterConfigurer::permitAll) // Default login page
            .logout(LogoutConfigurer::permitAll); // Default logout page

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        var admin = User.withDefaultPasswordEncoder() // Add a generic admin account
            .username("admin")
            .password("admin")
            .roles("ADMIN")
            .build();

        return new InMemoryUserDetailsManager(admin);
    }

    //endregion auth
}
