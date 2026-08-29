package com.wzbc.GoWorking.Mapper;

import com.wzbc.GoWorking.entity.PO.RBAC.RolePO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RoleMapper {
    int insert(@Param("rolePO") RolePO rolePO);
    int updateById(@Param("rolePO") RolePO rolePO);
    int deleteById(@Param("id") Long id);
    RolePO selectById(@Param("id") Long id);
    List<RolePO> selectAll();
}
