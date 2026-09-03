package com.wzbc.GoWorking.Controller;

import com.wzbc.GoWorking.Service.RbacService;
import com.wzbc.GoWorking.entity.DTO.RBAC.PermissionDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.PermissionUpdateDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.RoleDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.RolePermissionDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.RoleUpdateDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.UserRoleDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.UserRoleUpdateDTO;
import com.wzbc.GoWorking.entity.VO.ResponseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rbac")
public class RbacController extends ABaseController {
    @Autowired
    private RbacService rbacService;

    @RequestMapping("/getUserRole")
    public ResponseVO getUserRole() {
        String uuid = getUserId();
        return getSuccessResponseVO(rbacService.GetRoleById(uuid));
    }

    @RequestMapping("/getUserPermission")
    public ResponseVO getUserPermission() {
        String uuid = getUserId();
        return getSuccessResponseVO( rbacService.GetPermissionsById(uuid));
    }

    @GetMapping("/getRoleList")
    @PreAuthorize("@ss.hasPermission('system:role:list')")
    public ResponseVO getRoleList() {
        return getSuccessResponseVO(rbacService.getRoleList());
    }

    @GetMapping("/getPermissionTree")
    @PreAuthorize("@ss.hasPermission('system:permission:list')")
    public ResponseVO getPermissionTree(@RequestParam(required = false) Long roleId) {
        return getSuccessResponseVO(rbacService.getPermissionTree(roleId));
    }

    @PostMapping("/insertRole")
    @PreAuthorize("@ss.hasPermission('system:role:add')")
    public ResponseVO insertRole(@RequestBody RoleDTO roleDTO) {
        rbacService.insertRole(roleDTO);
        return getSuccessResponseVO("添加成功");
    }

    @PostMapping("/updateRole")
    @PreAuthorize("@ss.hasPermission('system:role:update')")
    public ResponseVO updateRole(@RequestBody RoleUpdateDTO roleDTO) {
        rbacService.updateRole(roleDTO);
        return getSuccessResponseVO("修改成功");
    }

    @PostMapping("/insertPermission")
    @PreAuthorize("@ss.hasPermission('system:permission:add')")
    public ResponseVO insertPermission(@RequestBody PermissionDTO permissionDTO) {
        rbacService.insertPermission(permissionDTO);
        return getSuccessResponseVO("添加成功");
    }

    @PostMapping("/updatePermission")
    @PreAuthorize("@ss.hasPermission('system:permission:update')")
    public ResponseVO updatePermission(@RequestBody PermissionUpdateDTO permissionDTO) {
        rbacService.updatePermission(permissionDTO);
        return getSuccessResponseVO("修改成功");
    }

    @PostMapping("/bindRolePermission")
    @PreAuthorize("@ss.hasPermission('system:role:permission:bind')")
    public ResponseVO bindRolePermission(@RequestBody RolePermissionDTO rolePermissionDTO) {
        rbacService.bindRolePermission(rolePermissionDTO);
        return getSuccessResponseVO("绑定成功");
    }

    @PostMapping("/unbindRolePermission")
    @PreAuthorize("@ss.hasPermission('system:role:permission:unbind')")
    public ResponseVO unbindRolePermission(@RequestBody RolePermissionDTO rolePermissionDTO) {
        rbacService.unbindRolePermission(rolePermissionDTO);
        return getSuccessResponseVO("解绑成功");
    }

    @PostMapping("/bindUserRole")
    @PreAuthorize("@ss.hasPermission('system:user:role:bind')")
    public ResponseVO bindUserRole(@RequestBody UserRoleDTO userRoleDTO) {
        rbacService.bindUserRole(userRoleDTO);
        return getSuccessResponseVO("绑定成功");
    }

    @PostMapping("/updateUserRole")
    @PreAuthorize("@ss.hasPermission('system:user:role:update')")
    public ResponseVO updateUserRole(@RequestBody UserRoleUpdateDTO userRoleDTO) {
        rbacService.updateUserRole(userRoleDTO);
        return getSuccessResponseVO("修改成功");
    }

}
