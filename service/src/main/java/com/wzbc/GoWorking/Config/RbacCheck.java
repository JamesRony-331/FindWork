package com.wzbc.GoWorking.Config;

import com.wzbc.GoWorking.Service.RbacService;
import com.wzbc.GoWorking.entity.DTO.Token.TokenUserDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component("ss")
public class RbacCheck {
    private final HttpServletRequest request;
    private final RbacService rbacService;

    public RbacCheck(HttpServletRequest request, RbacService rbacService) {
        this.request = request;
        this.rbacService = rbacService;
    }

    public boolean hasPermission(String required) {
        String token = request.getHeader("Authorization");
        if (token == null || token.isEmpty()) {
            return false;
        }
        String userId = TokenUserDTO.parseToken(token);
        Collection<String> permissions = rbacService.GetPermissionsById(userId).stream()
                .map(permission -> permission.getPermissionCode())
                .toList();
        return hasPermission(permissions, required);
    }

    public boolean hasPermission(Collection<String> permissions, String required) {

        if (permissions == null || required == null) {
            return false;
        }

        for (String permission : permissions) {
            if (match(permission, required)) {
                return true;
            }
        }

        return false;
    }

    public boolean match(String permission, String required) {

        if (permission == null || required == null) {
            return false;
        }

        String[] permissionParts = permission.split(":");
        String[] requiredParts = required.split(":");

        for (int i = 0; i < permissionParts.length; i++) {

            if (i >= requiredParts.length) {
                return false;
            }

            if ("*".equals(permissionParts[i])) {
                return true;
            }

            if (!permissionParts[i].equals(requiredParts[i])) {
                return false;
            }
        }

        return permissionParts.length == requiredParts.length;
    }
}
