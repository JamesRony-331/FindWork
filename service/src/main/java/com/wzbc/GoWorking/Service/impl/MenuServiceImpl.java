package com.wzbc.GoWorking.Service.impl;

import com.wzbc.GoWorking.Exception.BusinessException;
import com.wzbc.GoWorking.Mapper.MenuMapper;
import com.wzbc.GoWorking.Mapper.RolePermissionMapper;
import com.wzbc.GoWorking.Mapper.UserRoleMapper;
import com.wzbc.GoWorking.Service.MenuService;
import com.wzbc.GoWorking.entity.DTO.Menu.MenuDTO;
import com.wzbc.GoWorking.entity.PO.Menu.MenuPO;
import com.wzbc.GoWorking.entity.PO.RBAC.PermissionPO;
import com.wzbc.GoWorking.entity.PO.RBAC.UserRolePO;
import com.wzbc.GoWorking.entity.VO.Menu.MenuVO;
import com.wzbc.GoWorking.utils.CopyTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuServiceImpl implements MenuService {
    @Autowired
    private MenuMapper menuMapper;
    @Autowired
    private UserRoleMapper userRoleMapper;
    @Autowired
    private RolePermissionMapper rolePermissionMapper;

    @Override
    public List<MenuVO> getMenuByUserId(String userId) {
        //1.根据用户id查询用户的角色
        List<UserRolePO> userRoles = userRoleMapper.selectByUserId(userId);
        //2.根据角色查询角色的权限
        List<PermissionPO> permissions = rolePermissionMapper.selectPermissionsByUserRoles(userRoles);
        //3.根据权限查询菜单
        List<MenuPO> menus = menuMapper.selectByPermissions(permissions);
        //4.将菜单封装成MenuVO返回
        return CopyTools.copyList(menus, MenuVO.class);
    }
    @Override
    public void insertMenu(MenuDTO menuDTO) {
        if (menuMapper.selectByPath(menuDTO.getPath()) != null) {
            throw new BusinessException("菜单已存在");
        }
        MenuPO menuPO = CopyTools.copy(menuDTO, MenuPO.class);
        menuMapper.insert(menuPO);
    }


}
