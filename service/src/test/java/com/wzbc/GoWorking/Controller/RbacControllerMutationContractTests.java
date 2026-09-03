package com.wzbc.GoWorking.Controller;

import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertTrue;

class RbacControllerMutationContractTests {

    @Test
    void controllerExposesTheApprovedRbacMutationEndpoints() throws Exception {
        String source = Files.readString(Path.of("src/main/java/com/wzbc/GoWorking/Controller/RbacController.java"));
        for (String endpoint : new String[]{
                "/getRoleList", "/getPermissionTree",
                "/insertRole", "/updateRole", "/insertPermission", "/updatePermission",
                "/bindRolePermission", "/unbindRolePermission", "/bindUserRole", "/updateUserRole"
        }) {
            assertTrue(source.contains(endpoint), endpoint);
        }
    }

    @Test
    void permissionTreeAndRoleListUseReadPermissions() throws Exception {
        String source = Files.readString(Path.of("src/main/java/com/wzbc/GoWorking/Controller/RbacController.java"));
        assertTrue(source.contains("@PreAuthorize(\"@ss.hasPermission('system:role:list')\")"));
        assertTrue(source.contains("@PreAuthorize(\"@ss.hasPermission('system:permission:list')\")"));
    }

    @Test
    void mutationEndpointsUseTheirMatchingPreAuthorizePermission() throws Exception {
        String source = Files.readString(Path.of("src/main/java/com/wzbc/GoWorking/Controller/RbacController.java"));
        for (String permission : new String[]{
                "system:role:add", "system:role:update", "system:permission:add", "system:permission:update",
                "system:role:permission:bind", "system:role:permission:unbind",
                "system:user:role:bind", "system:user:role:update"
        }) {
            assertTrue(source.contains("@PreAuthorize(\"@ss.hasPermission('" + permission + "')\")"), permission);
        }
    }
}
