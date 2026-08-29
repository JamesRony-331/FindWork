package com.wzbc.GoWorking.entity.PO.RBAC;

import lombok.Data;

@Data
public class RolePO {

    /**
     * 角色ID
     */
    private Long id;

    /**
     * 角色名称
     * 例如：管理员
     */
    private String roleName;

    /**
     * 角色编码
     * 例如：admin
     */
    private String roleCode;
}