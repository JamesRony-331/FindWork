package com.wzbc.GoWorking.Mapper;

import com.wzbc.GoWorking.entity.PO.RBAC.RolePermissionPO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RolePermissionMapper {
    int insert(@Param("rolePermissionPO") RolePermissionPO rolePermissionPO);
    int updateById(@Param("rolePermissionPO") RolePermissionPO rolePermissionPO);
    int deleteById(@Param("id") Long id);
    RolePermissionPO selectById(@Param("id") Long id);
    List<RolePermissionPO> selectAll();
}
