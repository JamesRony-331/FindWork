package com.wzbc.GoWorking.entity.PO;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class UserPO {
    /**
     * 用户唯一标识
     */
    private String uuid;

    /**
     * 用户昵称
     */
    private String nickname;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 性别
     * 0：未知
     * 1：男
     * 2：女
     */
    private Integer sex;

    /**
     * 头像地址
     */
    private String avatar;

    /**
     * 密码
     */
    private String password;

    /**
     * 创建时间
     */
    private Date createTime;
    /**
     是否删除
     * */
    private Integer IsDelete;
}
