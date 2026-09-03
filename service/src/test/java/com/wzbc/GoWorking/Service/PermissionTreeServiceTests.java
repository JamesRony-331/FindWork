package com.wzbc.GoWorking.Service;

import com.wzbc.GoWorking.Mapper.PermissionMapper;
import com.wzbc.GoWorking.Mapper.RoleMapper;
import com.wzbc.GoWorking.Mapper.RolePermissionMapper;
import com.wzbc.GoWorking.Service.impl.RbacServiceImpl;
import com.wzbc.GoWorking.entity.PO.RBAC.PermissionPO;
import com.wzbc.GoWorking.entity.PO.RBAC.RolePO;
import com.wzbc.GoWorking.entity.VO.RBAC.PermissionTreeVO;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PermissionTreeServiceTests {

    @Test
    void permissionTreeGroupsCodesAndMarksRoleAssignments() {
        RbacServiceImpl service = new RbacServiceImpl();
        PermissionMapper permissionMapper = mock(PermissionMapper.class);
        RolePermissionMapper rolePermissionMapper = mock(RolePermissionMapper.class);
        ReflectionTestUtils.setField(service, "permissionMapper", permissionMapper);
        ReflectionTestUtils.setField(service, "rolePermissionMapper", rolePermissionMapper);
        when(permissionMapper.selectAll()).thenReturn(List.of(
                permission(1L, "菜单查询", "system:menu:list"),
                permission(2L, "新增菜单", "system:menu:add"),
                permission(3L, "角色查询", "system:role:list")
        ));
        when(rolePermissionMapper.selectPermissionIdsByRoleId(7L)).thenReturn(List.of(1L, 3L));

        List<PermissionTreeVO> tree = service.getPermissionTree(7L);

        assertEquals(1, tree.size());
        assertEquals("系统管理", tree.getFirst().getLabel());
        PermissionTreeVO menuGroup = tree.getFirst().getChildren().stream()
                .filter(node -> "菜单管理".equals(node.getLabel())).findFirst().orElseThrow();
        assertTrue(menuGroup.getChildren().stream().anyMatch(node -> node.getPermissionId().equals(1L) && node.isChecked()));
        assertTrue(menuGroup.getChildren().stream().anyMatch(node -> node.getPermissionId().equals(2L) && !node.isChecked()));
        PermissionTreeVO roleGroup = tree.getFirst().getChildren().stream()
                .filter(node -> "角色管理".equals(node.getLabel())).findFirst().orElseThrow();
        assertTrue(roleGroup.isChecked());
        assertFalse(tree.getFirst().isChecked());
    }

    @Test
    void roleListComesFromRoleMapper() {
        RbacServiceImpl service = new RbacServiceImpl();
        RoleMapper roleMapper = mock(RoleMapper.class);
        ReflectionTestUtils.setField(service, "roleMapper", roleMapper);
        RolePO role = new RolePO();
        role.setId(1L);
        when(roleMapper.selectAll()).thenReturn(List.of(role));

        assertEquals(List.of(role), service.getRoleList());
    }

    private PermissionPO permission(Long id, String name, String code) {
        PermissionPO permission = new PermissionPO();
        permission.setId(id);
        permission.setPermissionName(name);
        permission.setPermissionCode(code);
        return permission;
    }
}
