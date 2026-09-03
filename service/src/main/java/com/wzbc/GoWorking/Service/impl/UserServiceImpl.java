package com.wzbc.GoWorking.Service.impl;

import com.wzbc.GoWorking.Exception.BusinessException;
import com.wzbc.GoWorking.Mapper.UserMapper;
import com.wzbc.GoWorking.Service.RbacService;
import com.wzbc.GoWorking.Service.UserService;
import com.wzbc.GoWorking.entity.DTO.Token.TokenUserDTO;
import com.wzbc.GoWorking.entity.DTO.User.UserLogin;
import com.wzbc.GoWorking.entity.DTO.User.UserMsgDTO;
import com.wzbc.GoWorking.entity.DTO.User.UserPageDTO;
import com.wzbc.GoWorking.entity.DTO.User.UserRegDTO;
import com.wzbc.GoWorking.entity.PO.User.UserPO;
import com.wzbc.GoWorking.entity.Query.PageQuery;
import com.wzbc.GoWorking.entity.VO.SelectByPageVO;
import com.wzbc.GoWorking.entity.VO.User.UserAdminVO;
import com.wzbc.GoWorking.entity.VO.User.UserLoginVO;
import com.wzbc.GoWorking.utils.CopyTools;
import com.wzbc.GoWorking.utils.StringTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private RbacService rbacService;

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

        UserLoginVO userLoginVO= CopyTools.copy(userPO,UserLoginVO.class);;
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

    @Override
    public UserLoginVO adminLogin(UserLogin userdto) {
        String Email=userdto.getEmail();
        String password=userdto.getPassword();
        String newPassword= StringTools.encodeByMD5(password);
        UserPO userPO=userMapper.selectUserByEmail(Email);
        System.out.println(userPO);
        //判断是不是管理员
        if (!rbacService.checkPermission(userPO.getUuid(),"admin:login")){
            throw new BusinessException("没有管理员权限");
        }
        if (userPO==null){
            throw new BusinessException("邮箱未注册");
        }
        if (!newPassword.equals(userPO.getPassword())){
            throw new BusinessException("密码错误");
        }

        UserLoginVO userLoginVO= CopyTools.copy(userPO,UserLoginVO.class);;
        userLoginVO.setToken(TokenUserDTO.generateToken(userPO.getUuid()));
        return userLoginVO;
    }

    @Override
    public SelectByPageVO<UserAdminVO> getUsersByPage(UserPageDTO userPageDTO) {
        int totalCount = userMapper.selectUserTotalCount();
        PageQuery pageQuery = new PageQuery(userPageDTO.getPageNum(), userPageDTO.getPageSize(), totalCount);
        List<UserPO> userPOList = userMapper.selectUsersByPage(pageQuery);
        List<UserAdminVO> userAdminVOList = CopyTools.copyList(userPOList, UserAdminVO.class);

        SelectByPageVO<UserAdminVO> result = new SelectByPageVO<>();
        result.setPageNum(pageQuery.getPageNum());
        result.setPageSize(pageQuery.getPageSize());
        result.setTotal(pageQuery.getTotal());
        result.setTotalCount(pageQuery.getTotalCount());
        result.setList(userAdminVOList);
        return result;
    }
}
