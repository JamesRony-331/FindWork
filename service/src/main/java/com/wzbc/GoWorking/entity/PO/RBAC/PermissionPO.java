package com.wzbc.GoWorking.entity.PO.RBAC;

import lombok.Data;

@Data
public class PermissionPO {

    /**
     * 权限ID
     */
    private Long id;

    /**
     * 权限名称
     * 例如：新增用户
     */
    private String permissionName;

    /**
     * 权限编码
     * 例如：user:add
     */
    private String permissionCode;
}