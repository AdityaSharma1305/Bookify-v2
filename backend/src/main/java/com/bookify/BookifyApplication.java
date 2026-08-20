package com.bookify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(
    exclude = { UserDetailsServiceAutoConfiguration.class }
)
@EnableJpaAuditing
@EnableAsync
public class BookifyApplication {
    public static void main(String[] args) {
        loadDotenv();
        SpringApplication.run(BookifyApplication.class, args);
    }

    private static void loadDotenv() {
        java.io.File[] files = new java.io.File[] {
            new java.io.File(".env"),
            new java.io.File("../.env"),
            new java.io.File("backend/.env")
        };
        for (java.io.File file : files) {
            if (file.exists() && file.isFile()) {
                try (java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.FileReader(file))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#") || !line.contains("=")) continue;
                        int eq = line.indexOf('=');
                        String key = line.substring(0, eq).trim();
                        String val = line.substring(eq + 1).trim();
                        if (val.startsWith("\"") && val.endsWith("\"") && val.length() >= 2) {
                            val = val.substring(1, val.length() - 1);
                        } else if (val.startsWith("'") && val.endsWith("'") && val.length() >= 2) {
                            val = val.substring(1, val.length() - 1);
                        }
                        if (key.equals("DATABASE_URL") && val.contains("your-project")) {
                            continue;
                        }
                        if (key.equals("DB_USERNAME") && val.equals("postgres")) {
                            continue;
                        }
                        if (key.equals("DB_PASSWORD") && (val.contains("your-database") || val.contains("your-password"))) {
                            continue;
                        }
                        if (System.getProperty(key) == null) {
                            System.setProperty(key, val);
                        }
                    }
                } catch (Exception ignored) {}
                break;
            }
        }
    }
}
