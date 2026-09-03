package com.wzbc.GoWorking.Service;

import com.wzbc.GoWorking.entity.DTO.Menu.MenuDTO;
import com.wzbc.GoWorking.entity.VO.Menu.MenuVO;

import java.util.List;

public interface MenuService {
    List<MenuVO> getMenuByUserId(String userId);
    void insertMenu(MenuDTO menuDTO);
}
