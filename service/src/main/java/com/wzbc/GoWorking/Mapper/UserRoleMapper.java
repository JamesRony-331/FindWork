package com.wzbc.GoWorking.Mapper;

import com.wzbc.GoWorking.entity.PO.RBAC.UserRolePO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserRoleMapper {
    int insert(@Param("userRolePO") UserRolePO userRolePO);
    int updateById(@Param("userRolePO") UserRolePO userRolePO);
    int deleteById(@Param("id") Long id);
    UserRolePO selectById(@Param("id") Long id);
    List<UserRolePO> selectAll();
}
