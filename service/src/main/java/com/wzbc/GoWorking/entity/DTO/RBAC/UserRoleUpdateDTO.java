package com.wzbc.GoWorking.entity.DTO.RBAC;

import lombok.Data;

@Data
public class UserRoleUpdateDTO {
    private Long id;
    private String userId;
    private Long roleId;
}
