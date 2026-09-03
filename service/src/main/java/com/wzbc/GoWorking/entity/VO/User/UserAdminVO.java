package com.wzbc.GoWorking.entity.VO.User;

import lombok.Data;

import java.util.Date;

@Data
public class UserAdminVO {
    private String uuid;
    private String nickname;
    private String email;
    private Integer sex;
    private Date createTime;
    private Integer isDelete;
}
