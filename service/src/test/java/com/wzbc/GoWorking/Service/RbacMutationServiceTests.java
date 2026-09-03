package com.wzbc.GoWorking.Service;

import com.wzbc.GoWorking.Exception.BusinessException;
import com.wzbc.GoWorking.Mapper.PermissionMapper;
import com.wzbc.GoWorking.Mapper.RoleMapper;
import com.wzbc.GoWorking.Mapper.RolePermissionMapper;
import com.wzbc.GoWorking.Mapper.UserRoleMapper;
import com.wzbc.GoWorking.Service.impl.RbacServiceImpl;
import com.wzbc.GoWorking.entity.DTO.RBAC.PermissionDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.PermissionUpdateDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.RoleDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.RolePermissionDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.RoleUpdateDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.UserRoleDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.UserRoleUpdateDTO;
import com.wzbc.GoWorking.entity.PO.RBAC.PermissionPO;
import com.wzbc.GoWorking.entity.PO.RBAC.RolePO;
import com.wzbc.GoWorking.entity.PO.RBAC.RolePermissionPO;
import com.wzbc.GoWorking.entity.PO.RBAC.UserRolePO;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

class RbacMutationServiceTests {

    @Test
    void roleCreationRejectsDuplicateCodeAndOtherwiseInserts() {
        Fixture duplicate = fixture();
        RoleDTO dto = new RoleDTO();
        dto.setRoleCode("admin");
        when(duplicate.roleMapper.selectByCode("admin")).thenReturn(new RolePO());
        assertEquals("角色已存在", assertThrows(BusinessException.class, () -> duplicate.service.insertRole(dto)).getMessage());
        verify(duplicate.roleMapper, never()).insert(any());

        Fixture fresh = fixture();
        when(fresh.roleMapper.selectByCode("admin")).thenReturn(null);
        fresh.service.insertRole(dto);
        verify(fresh.roleMapper).insert(any(RolePO.class));
    }

    @Test
    void roleUpdateRequiresAnExistingRoleAndUniqueCode() {
        Fixture fixture = fixture();
        RoleUpdateDTO dto = new RoleUpdateDTO();
        dto.setId(2L);
        dto.setRoleCode("editor");
        when(fixture.roleMapper.selectById(2L)).thenReturn(new RolePO());
        RolePO collision = new RolePO();
        collision.setId(3L);
        when(fixture.roleMapper.selectByCode("editor")).thenReturn(collision);
        assertEquals("角色已存在", assertThrows(BusinessException.class, () -> fixture.service.updateRole(dto)).getMessage());
        verify(fixture.roleMapper, never()).updateById(any());
    }

    @Test
    void roleUpdateSynchronizesAddedAndRemovedPermissions() {
        Fixture fixture = fixture();
        RoleUpdateDTO dto = new RoleUpdateDTO();
        dto.setId(2L);
        dto.setRoleCode("editor");
        ReflectionTestUtils.setField(dto, "permissionIds", List.of(2L, 3L));
        RolePO existing = new RolePO();
        existing.setId(2L);
        when(fixture.roleMapper.selectById(2L)).thenReturn(existing);
        when(fixture.roleMapper.selectByCode("editor")).thenReturn(existing);
        when(fixture.rolePermissionMapper.selectPermissionIdsByRoleId(2L)).thenReturn(List.of(1L, 2L));
        when(fixture.rolePermissionMapper.selectByRoleAndPermission(2L, 3L)).thenReturn(null);
        when(fixture.rolePermissionMapper.selectByRoleAndPermission(2L, 1L)).thenReturn(new RolePermissionPO());

        fixture.service.updateRole(dto);

        verify(fixture.roleMapper).updateById(any(RolePO.class));
        verify(fixture.rolePermissionMapper).insert(any(RolePermissionPO.class));
        verify(fixture.rolePermissionMapper).deleteByRoleAndPermission(2L, 1L);
    }

    @Test
    void permissionCreationAndUpdateRejectDuplicateCodes() {
        Fixture fixture = fixture();
        PermissionDTO create = new PermissionDTO();
        create.setPermissionCode("menu:add");
        when(fixture.permissionMapper.selectByCode("menu:add")).thenReturn(new PermissionPO());
        assertEquals("权限已存在", assertThrows(BusinessException.class, () -> fixture.service.insertPermission(create)).getMessage());

        PermissionUpdateDTO update = new PermissionUpdateDTO();
        update.setId(2L);
        update.setPermissionCode("menu:update");
        when(fixture.permissionMapper.selectById(2L)).thenReturn(new PermissionPO());
        PermissionPO collision = new PermissionPO();
        collision.setId(3L);
        when(fixture.permissionMapper.selectByCode("menu:update")).thenReturn(collision);
        assertEquals("权限已存在", assertThrows(BusinessException.class, () -> fixture.service.updatePermission(update)).getMessage());
        verify(fixture.permissionMapper, never()).insert(any());
        verify(fixture.permissionMapper, never()).updateById(any());
    }

    @Test
    void rolePermissionCanBeBoundAndUnboundWithoutDuplicates() {
        Fixture fixture = fixture();
        RolePermissionDTO dto = new RolePermissionDTO();
        dto.setRoleId(1L);
        dto.setPermissionId(2L);
        when(fixture.rolePermissionMapper.selectByRoleAndPermission(1L, 2L)).thenReturn(null, new RolePermissionPO());

        fixture.service.bindRolePermission(dto);
        fixture.service.unbindRolePermission(dto);

        verify(fixture.rolePermissionMapper).insert(any(RolePermissionPO.class));
        verify(fixture.rolePermissionMapper).deleteByRoleAndPermission(1L, 2L);
    }

    @Test
    void userRoleCanBeBoundAndUpdatedWithoutDuplicates() {
        Fixture fixture = fixture();
        UserRoleDTO bind = new UserRoleDTO();
        bind.setUserId("user-1");
        bind.setRoleId(1L);
        when(fixture.userRoleMapper.selectByUserAndRole("user-1", 1L)).thenReturn(null);
        fixture.service.bindUserRole(bind);
        verify(fixture.userRoleMapper).insert(any(UserRolePO.class));

        UserRoleUpdateDTO update = new UserRoleUpdateDTO();
        update.setId(8L);
        update.setUserId("user-1");
        update.setRoleId(2L);
        UserRolePO existing = new UserRolePO();
        existing.setId(8L);
        when(fixture.userRoleMapper.selectById(8L)).thenReturn(existing);
        when(fixture.userRoleMapper.selectByUserAndRole("user-1", 2L)).thenReturn(null);
        fixture.service.updateUserRole(update);
        verify(fixture.userRoleMapper).updateById(any(UserRolePO.class));
    }

    private Fixture fixture() {
        Fixture fixture = new Fixture();
        ReflectionTestUtils.setField(fixture.service, "roleMapper", fixture.roleMapper);
        ReflectionTestUtils.setField(fixture.service, "permissionMapper", fixture.permissionMapper);
        ReflectionTestUtils.setField(fixture.service, "rolePermissionMapper", fixture.rolePermissionMapper);
        ReflectionTestUtils.setField(fixture.service, "userRoleMapper", fixture.userRoleMapper);
        return fixture;
    }

    private static class Fixture {
        final RbacServiceImpl service = new RbacServiceImpl();
        final RoleMapper roleMapper = mock(RoleMapper.class);
        final PermissionMapper permissionMapper = mock(PermissionMapper.class);
        final RolePermissionMapper rolePermissionMapper = mock(RolePermissionMapper.class);
        final UserRoleMapper userRoleMapper = mock(UserRoleMapper.class);
    }
}
