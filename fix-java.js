const fs = require('fs');
const path = require('path');

const base = 'e:/Bookify/backend/src/main/java/com/bookify';

function writeJava(rel, content) {
    const fullPath = path.join(base, rel);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, { encoding: 'utf8', flag: 'w' });
    const verify = fs.readFileSync(fullPath, 'utf8');
    const ok = verify.startsWith('package');
    console.log((ok ? 'OK' : 'FAIL') + ': ' + rel);
}

writeJava('BookifyApplication.java', [
    'package com.bookify;',
    '',
    'import org.springframework.boot.SpringApplication;',
    'import org.springframework.boot.autoconfigure.SpringBootApplication;',
    'import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;',
    'import org.springframework.data.jpa.repository.config.EnableJpaAuditing;',
    'import org.springframework.scheduling.annotation.EnableAsync;',
    '',
    '@SpringBootApplication(',
    '    exclude = { UserDetailsServiceAutoConfiguration.class }',
    ')',
    '@EnableJpaAuditing',
    '@EnableAsync',
    'public class BookifyApplication {',
    '    public static void main(String[] args) {',
    '        SpringApplication.run(BookifyApplication.class, args);',
    '    }',
    '}',
    ''
].join('\n'));

console.log('Done');