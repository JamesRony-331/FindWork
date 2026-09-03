package com.wzbc.GoWorking.entity.VO.RBAC;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class PermissionTreeVO {
    private String key;
    private String label;
    private String code;
    private Long permissionId;
    private boolean checked;
    private List<PermissionTreeVO> children = new ArrayList<>();
}
