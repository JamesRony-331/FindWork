package com.wzbc.GoWorking.entity.DTO.Token;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtSecretProviderTests {

    @Test
    void systemEnvironmentVariableTakesPriority() {
        String secret = JwtSecretProvider.resolveSecret("system-secret", List.of("JWT_SECRET=file-secret"));

        assertEquals("system-secret", secret);
    }

    @Test
    void readsSecretFromDotEnvWhenEnvironmentVariableIsMissing() {
        String secret = JwtSecretProvider.resolveSecret(null, List.of("# local config", "JWT_SECRET=\"file-secret\""));

        assertEquals("file-secret", secret);
    }

    @Test
    void throwsWhenSecretIsNotConfigured() {
        assertThrows(IllegalStateException.class, () -> JwtSecretProvider.resolveSecret(" ", List.of("OTHER=value")));
    }
}
