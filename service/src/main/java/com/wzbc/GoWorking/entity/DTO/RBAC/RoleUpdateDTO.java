package com.wzbc.GoWorking.entity.DTO.RBAC;

import lombok.Data;

import java.util.List;

@Data
public class RoleUpdateDTO {
    private Long id;
    private String roleName;
    private String roleCode;
    private List<Long> permissionIds;
}
