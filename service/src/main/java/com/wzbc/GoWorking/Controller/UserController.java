package com.wzbc.GoWorking.Controller;

import com.wzbc.GoWorking.Service.UserService;
import com.wzbc.GoWorking.entity.DTO.User.UserLogin;
import com.wzbc.GoWorking.entity.DTO.User.UserMsgDTO;
import com.wzbc.GoWorking.entity.DTO.User.UserPageDTO;
import com.wzbc.GoWorking.entity.DTO.User.UserRegDTO;
import com.wzbc.GoWorking.entity.VO.ResponseVO;
import com.wzbc.GoWorking.entity.VO.User.UserLoginVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/user")
public class UserController extends ABaseController{
    @Autowired
    private UserService userService;

    @RequestMapping("/reg")
    public ResponseVO reg(@RequestBody UserRegDTO userdto){
        if (userdto.getPassword().equals("")||userdto.getEmail().equals("")){
            throw new RuntimeException("邮箱或密码不能为空");
        }
        userService.insertUser(userdto);
        return getSuccessResponseVO("注册成功");
    }

    @RequestMapping("/login")
    public ResponseVO login(@RequestBody UserLogin userdto){
        if (userdto.getPassword().equals("")||userdto.getEmail().equals("")){
            throw new RuntimeException("邮箱或密码不能为空");
        }
        UserLoginVO res=userService.login(userdto);
        return getSuccessResponseVO(res);
    }

    @RequestMapping("/update")
    public ResponseVO update(@RequestBody UserMsgDTO userdto){
        userService.updateUser(userdto,getUserId());
        return getSuccessResponseVO("更新成功");
    }

    @RequestMapping("/AdminLogin")
    public ResponseVO adminLogin(@RequestBody UserLogin userdto){
        if (userdto.getPassword().equals("")||userdto.getEmail().equals("")){
            throw new RuntimeException("邮箱或密码不能为空");
        }
        UserLoginVO res=userService.adminLogin(userdto);
        return getSuccessResponseVO(res);
    }

    @PostMapping("/getUserList")
    @PreAuthorize("@ss.hasPermission('system:user:list')")
    public ResponseVO getUserList(@RequestBody UserPageDTO userPageDTO) {
        return getSuccessResponseVO(userService.getUsersByPage(userPageDTO));
    }

}
