package com.wzbc.GoWorking.Security;

import com.wzbc.GoWorking.Config.RbacCheck;
import com.wzbc.GoWorking.Service.RbacService;
import com.wzbc.GoWorking.entity.DTO.Token.TokenUserDTO;
import com.wzbc.GoWorking.entity.PO.RBAC.PermissionPO;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SecurityServiceTests {

    @Test
    void hasPermissionChecksTheJwtUserAgainstTheRequestedPermission() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        RbacService rbacService = mock(RbacService.class);
        String token = TokenUserDTO.generateToken("user-1");
        when(request.getHeader("Authorization")).thenReturn(token);
        PermissionPO permission = new PermissionPO();
        permission.setPermissionCode("system:role:add");
        when(rbacService.GetPermissionsById("user-1")).thenReturn(java.util.List.of(permission));
        RbacCheck securityService = new RbacCheck(request, rbacService);

        assertTrue(securityService.hasPermission("system:role:add"));
    }

    @Test
    void hasPermissionReturnsFalseWithoutAnAuthorizationToken() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        RbacService rbacService = mock(RbacService.class);
        when(request.getHeader("Authorization")).thenReturn(null);

        assertFalse(new RbacCheck(request, rbacService).hasPermission("system:role:add"));
    }
}
