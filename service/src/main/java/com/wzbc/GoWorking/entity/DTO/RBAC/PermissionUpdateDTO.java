package com.wzbc.GoWorking.entity.DTO.RBAC;

import lombok.Data;

@Data
public class PermissionUpdateDTO {
    private Long id;
    private String permissionName;
    private String permissionCode;
}
