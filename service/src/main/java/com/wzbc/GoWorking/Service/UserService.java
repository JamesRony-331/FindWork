package com.wzbc.GoWorking.Service;

import com.wzbc.GoWorking.entity.DTO.User.UserLogin;
import com.wzbc.GoWorking.entity.DTO.User.UserMsgDTO;
import com.wzbc.GoWorking.entity.DTO.User.UserPageDTO;
import com.wzbc.GoWorking.entity.DTO.User.UserRegDTO;
import com.wzbc.GoWorking.entity.VO.SelectByPageVO;
import com.wzbc.GoWorking.entity.VO.User.UserAdminVO;
import com.wzbc.GoWorking.entity.VO.User.UserLoginVO;

public interface UserService {
    void insertUser(UserRegDTO userdto);

    UserLoginVO login(UserLogin userdto);

    void updateUser(UserMsgDTO userdto, String userId);

    UserLoginVO adminLogin(UserLogin userdto);

    SelectByPageVO<UserAdminVO> getUsersByPage(UserPageDTO userPageDTO);
}
