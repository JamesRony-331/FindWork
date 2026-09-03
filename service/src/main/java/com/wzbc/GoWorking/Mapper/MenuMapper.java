package com.wzbc.GoWorking.Mapper;

import com.wzbc.GoWorking.entity.PO.Menu.MenuPO;
import com.wzbc.GoWorking.entity.PO.RBAC.PermissionPO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MenuMapper {
    int insert(@Param("menuPO") MenuPO menuPO);
    int updateById(@Param("menuPO") MenuPO menuPO);
    int deleteById(@Param("menuId") Long menuId);

    MenuPO selectById(@Param("menuId") Long menuId);
    MenuPO selectByPath(@Param("path") String path);
    List<MenuPO> selectByPermissions(@Param("permissions") List<PermissionPO> permissions);
    List<MenuPO> selectAll();
}
