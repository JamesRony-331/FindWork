package com.wzbc.GoWorking.Mapper;

import com.wzbc.GoWorking.entity.PO.UserPO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    void insertUser(@Param("userPO") UserPO userPO);

    int updateUser(@Param("userPO") UserPO userPO);

    UserPO selectUserByEmail(@Param("email") String email);
}
