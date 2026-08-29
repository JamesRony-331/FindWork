package com.wzbc.GoWorking.Service.impl;

import com.wzbc.GoWorking.Exception.BusinessException;
import com.wzbc.GoWorking.Mapper.UserMapper;
import com.wzbc.GoWorking.Service.UserService;
import com.wzbc.GoWorking.entity.DTO.Token.TokenUserDTO;
import com.wzbc.GoWorking.entity.DTO.User.UserLogin;
import com.wzbc.GoWorking.entity.DTO.User.UserMsgDTO;
import com.wzbc.GoWorking.entity.DTO.User.UserRegDTO;
import com.wzbc.GoWorking.entity.PO.UserPO;
import com.wzbc.GoWorking.entity.VO.User.UserLoginVO;
import com.wzbc.GoWorking.utils.CopyTools;
import com.wzbc.GoWorking.utils.StringTools;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public void insertUser(UserRegDTO userdto) {
        String Email=userdto.getEmail();
        if (userMapper.selectUserByEmail(Email) != null){
            throw new BusinessException("邮箱已注册");
        }
        String password=userdto.getPassword();
        String newPassword= StringTools.encodeByMD5(password);
        String uuid = UUID.randomUUID().toString();
        UserPO userPO=new UserPO();
        userPO.setEmail(Email);
        userPO.setPassword(newPassword);
        userPO.setUuid(uuid);
        userPO.setCreateTime(new Date());
        userMapper.insertUser(userPO);
    }

    @Override
    public UserLoginVO login(UserLogin userdto) {
        String Email=userdto.getEmail();
        String password=userdto.getPassword();
        String newPassword= StringTools.encodeByMD5(password);
        UserPO userPO=userMapper.selectUserByEmail(Email);
        if (userPO==null){
            throw new BusinessException("邮箱未注册");
        }
        if (!newPassword.equals(userPO.getPassword())){
            throw new BusinessException("密码错误");
        }
        UserLoginVO userLoginVO=new UserLoginVO();
        userLoginVO= CopyTools.copy(userPO,UserLoginVO.class);
        userLoginVO.setToken(TokenUserDTO.generateToken(userPO.getUuid()));
        return userLoginVO;
    }

    @Override
    public void updateUser(UserMsgDTO userdto, String userId) {
        if (userdto.getSex()!=0&&userdto.getSex()!=1){
            throw new BusinessException("性别输入有误");
        }
        if (userdto.getNickname().length()>20){
            throw new BusinessException("昵称过长");
        }
        UserPO userPO=CopyTools.copy(userdto,UserPO.class);
        userPO.setUuid(userId);
        userMapper.updateUser(userPO);

    }
}
