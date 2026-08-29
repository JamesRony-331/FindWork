package com.wzbc.GoWorking.Interceptor;

import com.wzbc.GoWorking.entity.DTO.Token.TokenUserDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtAuthenticationToken implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {

        String token = request.getHeader("Authorization");

        if (token == null || token.isEmpty()) {
            throw new RuntimeException("缺少token，请先登录");
        }

        if (TokenUserDTO.isTokenExpired(token)) {
            throw new RuntimeException("token已过期，请重新登录");
        }

//        // 1. 从 Token 中获取用户ID
//        String userId = TokenUserDTO.parseToken(token).getUserId();
//
//        // 2. 查询用户权限
//        List<String> permissions =
//                userMapper.selectPermissionsByUserId(userId);
//
//        // 3. 转换成 Spring Security 权限对象
//        List<GrantedAuthority> authorities = permissions.stream()
//                .map(SimpleGrantedAuthority::new)
//                .toList();
//
//        // 4. 创建当前登录用户认证对象
//        UsernamePasswordAuthenticationToken authentication =
//                new UsernamePasswordAuthenticationToken(
//                        userId,
//                        null,
//                        authorities
//                );
//
//        // 5. 放入 SecurityContext
//        SecurityContextHolder.getContext()
//                .setAuthentication(authentication);

        return true;
    }
}