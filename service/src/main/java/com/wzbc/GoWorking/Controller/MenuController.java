package com.wzbc.GoWorking.Controller;

import com.wzbc.GoWorking.Service.MenuService;
import com.wzbc.GoWorking.entity.DTO.Menu.MenuDTO;
import com.wzbc.GoWorking.entity.VO.Menu.MenuVO;
import com.wzbc.GoWorking.entity.VO.ResponseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/menu")
public class MenuController extends ABaseController {
    @Autowired
    private MenuService menuService;

    @RequestMapping("/getMenu")
    public ResponseVO getMenu() {
        String uuid=getUserId();
        List<MenuVO> menus = menuService.getMenuByUserId(uuid);
        return getSuccessResponseVO(menus);
    }

    @PostAuthorize("@ss.hasPermission('system:menu:add')")
    @RequestMapping("/insertMenu")
    public ResponseVO insertMenu(@RequestBody MenuDTO menuDTO) {
        return getSuccessResponseVO("插入成功");
    }

}
