package com.wzbc.GoWorking.Service;

import com.wzbc.GoWorking.entity.DTO.RBAC.PermissionDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.PermissionUpdateDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.RoleDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.RolePermissionDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.RoleUpdateDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.UserRoleDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.UserRoleUpdateDTO;
import com.wzbc.GoWorking.entity.PO.RBAC.PermissionPO;
import com.wzbc.GoWorking.entity.PO.RBAC.RolePO;
import com.wzbc.GoWorking.entity.VO.RBAC.PermissionTreeVO;

import java.util.List;

public interface RbacService {
    List<PermissionPO> GetPermissionsById(String userId);
    List<RolePO> GetRoleById(String userId);
    List<RolePO> getRoleList();
    List<PermissionTreeVO> getPermissionTree(Long roleId);

    boolean checkPermission(String userId, String permission);
    void insertRole(RoleDTO roleDTO);
    void updateRole(RoleUpdateDTO roleDTO);
    void insertPermission(PermissionDTO permissionDTO);
    void updatePermission(PermissionUpdateDTO permissionDTO);
    void bindRolePermission(RolePermissionDTO rolePermissionDTO);
    void unbindRolePermission(RolePermissionDTO rolePermissionDTO);
    void bindUserRole(UserRoleDTO userRoleDTO);
    void updateUserRole(UserRoleUpdateDTO userRoleDTO);
}
