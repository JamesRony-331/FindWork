package com.wzbc.GoWorking.entity.DTO.Menu;

import lombok.Data;

@Data
public class MenuDTO {
    private Long parentId = 0L;
    private String menuName;
    private String menuType;
    private String path;
    private String component;
    private String routeName;
    private String permission;
    private String icon;
    private Integer sortOrder = 0;
    private Integer visible = 1;
    private Integer status = 1;
    private Integer keepAlive = 0;
    private Integer externalLink = 0;
    private String redirect;
    private String remark;
}
