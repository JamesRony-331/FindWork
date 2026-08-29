package com.wzbc.GoWorking.entity.VO.User;

import lombok.Data;

import java.util.Date;

@Data
public class UserLoginVO {

    private String nickname;
    private String email;
    private Integer sex;
    private String avatar;
    private String token;
}
