package com.wzbc.GoWorking.Mapper;

import com.wzbc.GoWorking.entity.PO.RBAC.PermissionPO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PermissionMapper {
    int insert(@Param("permissionPO") PermissionPO permissionPO);
    int updateById(@Param("permissionPO") PermissionPO permissionPO);
    int deleteById(@Param("id") Long id);

    PermissionPO selectById(@Param("id") Long id);
    PermissionPO selectByCode(@Param("permissionCode") String permissionCode);
    List<PermissionPO> selectAll();
}
