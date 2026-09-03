package com.wzbc.GoWorking.Controller;

import com.wzbc.GoWorking.entity.DTO.User.UserPageDTO;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.lang.reflect.Method;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UserPaginationControllerContractTests {

    @Test
    void exposesSecuredUserPaginationEndpointWithRequestBodyDto() throws Exception {
        Method method = UserController.class.getDeclaredMethod("getUserList", UserPageDTO.class);

        PostMapping mapping = method.getAnnotation(PostMapping.class);
        assertNotNull(mapping);
        assertTrue(java.util.List.of(mapping.value()).contains("/getUserList"));
        assertEquals("@ss.hasPermission('system:user:list')", method.getAnnotation(PreAuthorize.class).value());
        assertNotNull(method.getParameters()[0].getAnnotation(RequestBody.class));
    }
}
