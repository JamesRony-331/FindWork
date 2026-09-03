package com.wzbc.GoWorking.Mapper;

import com.wzbc.GoWorking.entity.PO.RBAC.PermissionPO;
import com.wzbc.GoWorking.entity.PO.RBAC.RolePermissionPO;
import com.wzbc.GoWorking.entity.PO.RBAC.UserRolePO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RolePermissionMapper {
    int insert(@Param("rolePermissionPO") RolePermissionPO rolePermissionPO);
    int updateById(@Param("rolePermissionPO") RolePermissionPO rolePermissionPO);
    int deleteById(@Param("id") Long id);
    RolePermissionPO selectById(@Param("id") Long id);
    RolePermissionPO selectByRoleAndPermission(@Param("roleId") Long roleId, @Param("permissionId") Long permissionId);
    int deleteByRoleAndPermission(@Param("roleId") Long roleId, @Param("permissionId") Long permissionId);
    List<Long> selectPermissionIdsByUserRoles(@Param("userRoles") List<UserRolePO> userRoles);
    List<Long> selectPermissionIdsByRoleId(@Param("roleId") Long roleId);
    List<PermissionPO> selectPermissionsByUserRoles(@Param("userRoles") List<UserRolePO> userRoles);
    List<RolePermissionPO> selectAll();
}
