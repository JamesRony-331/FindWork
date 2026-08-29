package com.wzbc.GoWorking.entity.PO.RBAC;

import lombok.Data;

@Data
public class RolePermissionPO {

    /**
     * 主键ID
     */
    private Long id;

    /**
     * 角色ID
     */
    private Long roleId;

    /**
     * 权限ID
     */
    private Long permissionId;
}