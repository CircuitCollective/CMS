package circuitcollective;

import org.springdoc.core.models.*;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.context.annotation.*;
import org.springframework.http.*;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.config.annotation.web.configurers.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.provisioning.*;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.*;
import org.springframework.security.web.util.matcher.*;

@SpringBootApplication
@EnableWebSecurity
public class Main {
    public static void main(String... args) {
        SpringApplication.run(Main.class, args);
    }

    /** Sets up swagger docs */
    @Bean
    public GroupedOpenApi apiDocs() { // http://localhost:8080/swagger-ui.html
        return GroupedOpenApi.builder().group("API Docs").packagesToScan("circuitcollective").build();
    }

    //region auth

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Define returned status code for unauthorized users
                .exceptionHandling(except -> except
                        .defaultAuthenticationEntryPointFor(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED), new AntPathRequestMatcher("/api/**"))
                )
                // Define auth requirements for specific paths
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // All requests to games require admin role
                        .anyRequest().permitAll() // All other requests are fine
                )
                .formLogin(login -> login // Custom login page
                        .defaultSuccessUrl("/", true)
                        .loginPage("/login").permitAll()
                )
                .logout(LogoutConfigurer::permitAll) // Default logout page
                .csrf(csrf -> csrf
//                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()) // Enable CSRF for http requests
                                .disable() // CSRF Doesn't work with localhost and i cant seem to get it to
                );

        return http.build();
    }

    // Doesn't work for whatever reason.
//    /** Configure CORS: Allow requests from localhost:8080 */
//    @Bean
//    public CorsConfiguration getCorsConfiguration() {
//        CorsConfiguration config = new CorsConfiguration();
//        config.addAllowedOrigin("http://localhost:8080");
//        return config;
//    }

    /** Configure auth users: Add admin account with admin password */
    @Bean
    public UserDetailsService userDetailsService() {
        var admin = User.withDefaultPasswordEncoder()
                .username("admin")
                .password("admin")
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(admin);
    }

    //endregion auth
}
