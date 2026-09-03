package com.wzbc.GoWorking.InterceptorConfig;

import com.wzbc.GoWorking.Interceptor.JwtAuthenticationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class JwtAuthenticationTokenConfig implements WebMvcConfigurer {

    @Autowired
    public JwtAuthenticationToken jwtAuthenticationToken;

    @Override
    public void addInterceptors(
            InterceptorRegistry registry
    ) {

        registry.addInterceptor(jwtAuthenticationToken)
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/user/login",
                        "/user/reg",
                        "/user/AdminLogin"
                );
    }
}
