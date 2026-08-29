package com.wzbc.GoWorking.entity.DTO.User;

import lombok.Data;

import java.util.Date;

@Data
public class UserMsgDTO {
    private String nickname;
    private Integer sex;
    private String avatar;
    private String password;
    private Integer IsDelete;
}
