package com.wzbc.GoWorking.Controller;

import com.wzbc.GoWorking.entity.DTO.Token.TokenUserDTO;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ABaseControllerTokenTests {

    @AfterEach
    void clearRequestContext() {
        RequestContextHolder.resetRequestAttributes();
    }

    @Test
    void getUserIdParsesTheRawAuthorizationTokenValidatedByTheInterceptor() {
        String expectedUserId = "admin-user-id";
        String token = TokenUserDTO.generateToken(expectedUserId);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", token);
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        assertEquals(expectedUserId, new TestController().currentUserId());
    }

    private static final class TestController extends ABaseController {
        String currentUserId() {
            return getUserId();
        }
    }
}
