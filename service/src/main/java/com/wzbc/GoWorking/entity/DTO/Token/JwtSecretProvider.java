package com.wzbc.GoWorking.entity.DTO.Token;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

final class JwtSecretProvider {
    private static final String KEY = "JWT_SECRET";

    private JwtSecretProvider() {
    }

    static String getSecret() {
        List<String> lines = List.of();
        Path envFile = Path.of(".env");
        if (Files.isRegularFile(envFile)) {
            try {
                lines = Files.readAllLines(envFile);
            } catch (IOException e) {
                throw new IllegalStateException("读取 .env 文件失败", e);
            }
        }
        return resolveSecret(System.getenv(KEY), lines);
    }

    static String resolveSecret(String environmentSecret, List<String> envLines) {
        if (environmentSecret != null && !environmentSecret.isBlank()) {
            return environmentSecret.trim();
        }

        String prefix = KEY + "=";
        for (String line : envLines) {
            String trimmed = line.trim();
            if (trimmed.startsWith(prefix)) {
                String value = trimmed.substring(prefix.length()).trim();
                if (value.length() >= 2 && ((value.startsWith("\"") && value.endsWith("\""))
                        || (value.startsWith("'") && value.endsWith("'")))) {
                    value = value.substring(1, value.length() - 1);
                }
                if (!value.isBlank()) {
                    return value;
                }
            }
        }
        throw new IllegalStateException("未配置 JWT_SECRET，请设置环境变量或在 .env 中配置");
    }
}
