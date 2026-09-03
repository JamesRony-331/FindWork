package com.wzbc.GoWorking.Mapper;

import com.wzbc.GoWorking.entity.PO.User.UserPO;
import com.wzbc.GoWorking.entity.Query.PageQuery;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

    void insertUser(@Param("userPO") UserPO userPO);

    int updateUser(@Param("userPO") UserPO userPO);

    UserPO selectUserByEmail(@Param("email") String email);

    int selectUserTotalCount();

    List<UserPO> selectUsersByPage(@Param("pageQuery") PageQuery pageQuery);
}
