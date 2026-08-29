package com.wzbc.GoWorking.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // 前后端分离 + JWT，一般关闭 CSRF
                .csrf(csrf -> csrf.disable())

                // 关闭 Spring Security 默认登录页
                .formLogin(form -> form.disable())

                // 关闭 HTTP Basic
                .httpBasic(httpBasic -> httpBasic.disable())

                .authorizeHttpRequests(auth -> auth
                        // 这里暂时全部放行
                        // JWT 是否合法交给你的 Interceptor
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}