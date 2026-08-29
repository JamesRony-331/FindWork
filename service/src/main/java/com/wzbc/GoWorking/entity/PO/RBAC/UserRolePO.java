package com.wzbc.GoWorking.entity.PO.RBAC;

import lombok.Data;

@Data
public class UserRolePO {

    /**
     * 主键ID
     */
    private Long id;

    /**
     * 用户UUID
     */
    private String userId;

    /**
     * 角色ID
     */
    private Long roleId;
}