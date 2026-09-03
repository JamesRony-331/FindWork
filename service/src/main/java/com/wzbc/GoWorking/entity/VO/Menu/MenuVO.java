package com.wzbc.GoWorking.entity.VO.Menu;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MenuVO {
    private Long menuId;
    private Long parentId = 0L;
    private String menuName;
    private String menuType;
    private String path;
    private String component;
    private String routeName;
    private String permission;
    private String icon;
    private Integer sortOrder = 0;
    private String redirect;
}
