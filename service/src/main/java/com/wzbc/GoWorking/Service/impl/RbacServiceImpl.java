package com.wzbc.GoWorking.Service.impl;

import com.wzbc.GoWorking.Exception.BusinessException;
import com.wzbc.GoWorking.Mapper.PermissionMapper;
import com.wzbc.GoWorking.Mapper.RoleMapper;
import com.wzbc.GoWorking.Mapper.RolePermissionMapper;
import com.wzbc.GoWorking.Mapper.UserRoleMapper;
import com.wzbc.GoWorking.Service.RbacService;
import com.wzbc.GoWorking.entity.DTO.RBAC.PermissionDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.PermissionUpdateDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.RoleDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.RolePermissionDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.RoleUpdateDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.UserRoleDTO;
import com.wzbc.GoWorking.entity.DTO.RBAC.UserRoleUpdateDTO;
import com.wzbc.GoWorking.entity.PO.RBAC.PermissionPO;
import com.wzbc.GoWorking.entity.PO.RBAC.RolePO;
import com.wzbc.GoWorking.entity.PO.RBAC.RolePermissionPO;
import com.wzbc.GoWorking.entity.PO.RBAC.UserRolePO;
import com.wzbc.GoWorking.entity.VO.RBAC.PermissionTreeVO;
import com.wzbc.GoWorking.utils.CopyTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class RbacServiceImpl implements RbacService {
    @Autowired
    private PermissionMapper permissionMapper;
    @Autowired
    private RoleMapper roleMapper;
    @Autowired
    private RolePermissionMapper rolePermissionMapper;
    @Autowired
    private UserRoleMapper userRoleMapper;


    @Override
    public List<PermissionPO> GetPermissionsById(String userId) {
        List<UserRolePO> rolePOS=userRoleMapper.selectByUserId(userId);
        return rolePermissionMapper.selectPermissionsByUserRoles(rolePOS);
    }

    @Override
    public List<RolePO> GetRoleById(String userID) {
        return roleMapper.selectByUserId(userID);
    }

    @Override
    public List<RolePO> getRoleList() {
        return roleMapper.selectAll();
    }

    @Override
    public List<PermissionTreeVO> getPermissionTree(Long roleId) {
        Set<Long> assignedIds = roleId == null
                ? Set.of()
                : new LinkedHashSet<>(rolePermissionMapper.selectPermissionIdsByRoleId(roleId));
        List<PermissionTreeVO> roots = new ArrayList<>();
        for (PermissionPO permission : permissionMapper.selectAll()) {
            appendPermission(roots, permission, assignedIds.contains(permission.getId()));
        }
        roots.forEach(this::refreshGroupCheckedState);
        return roots;
    }

    @Override
    public boolean checkPermission(String userId, String permission) {
        List<UserRolePO> rolePOS=userRoleMapper.selectByUserId(userId);
        List<PermissionPO> permissionPOS=rolePermissionMapper.selectPermissionsByUserRoles(rolePOS);
        for (PermissionPO p : permissionPOS) {
            if (p.getPermissionCode().equals(permission)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public void insertRole(RoleDTO roleDTO) {
        if (roleMapper.selectByCode(roleDTO.getRoleCode()) != null) {
            throw new BusinessException("角色已存在");
        }
        roleMapper.insert(CopyTools.copy(roleDTO, RolePO.class));
    }

    @Override
    @Transactional
    public void updateRole(RoleUpdateDTO roleDTO) {
        if (roleMapper.selectById(roleDTO.getId()) == null) {
            throw new BusinessException("角色不存在");
        }
        RolePO sameCode = roleMapper.selectByCode(roleDTO.getRoleCode());
        if (sameCode != null && !sameCode.getId().equals(roleDTO.getId())) {
            throw new BusinessException("角色已存在");
        }
        roleMapper.updateById(CopyTools.copy(roleDTO, RolePO.class));
        synchronizeRolePermissions(roleDTO);
    }

    @Override
    public void insertPermission(PermissionDTO permissionDTO) {
        if (permissionMapper.selectByCode(permissionDTO.getPermissionCode()) != null) {
            throw new BusinessException("权限已存在");
        }
        permissionMapper.insert(CopyTools.copy(permissionDTO, PermissionPO.class));
    }

    @Override
    public void updatePermission(PermissionUpdateDTO permissionDTO) {
        if (permissionMapper.selectById(permissionDTO.getId()) == null) {
            throw new BusinessException("权限不存在");
        }
        PermissionPO sameCode = permissionMapper.selectByCode(permissionDTO.getPermissionCode());
        if (sameCode != null && !sameCode.getId().equals(permissionDTO.getId())) {
            throw new BusinessException("权限已存在");
        }
        permissionMapper.updateById(CopyTools.copy(permissionDTO, PermissionPO.class));
    }

    @Override
    public void bindRolePermission(RolePermissionDTO rolePermissionDTO) {
        if (rolePermissionMapper.selectByRoleAndPermission(rolePermissionDTO.getRoleId(), rolePermissionDTO.getPermissionId()) != null) {
            throw new BusinessException("角色权限已绑定");
        }
        rolePermissionMapper.insert(CopyTools.copy(rolePermissionDTO, RolePermissionPO.class));
    }

    @Override
    public void unbindRolePermission(RolePermissionDTO rolePermissionDTO) {
        if (rolePermissionMapper.selectByRoleAndPermission(rolePermissionDTO.getRoleId(), rolePermissionDTO.getPermissionId()) == null) {
            throw new BusinessException("角色权限未绑定");
        }
        rolePermissionMapper.deleteByRoleAndPermission(rolePermissionDTO.getRoleId(), rolePermissionDTO.getPermissionId());
    }

    @Override
    public void bindUserRole(UserRoleDTO userRoleDTO) {
        if (userRoleMapper.selectByUserAndRole(userRoleDTO.getUserId(), userRoleDTO.getRoleId()) != null) {
            throw new BusinessException("用户角色已绑定");
        }
        userRoleMapper.insert(CopyTools.copy(userRoleDTO, UserRolePO.class));
    }

    @Override
    public void updateUserRole(UserRoleUpdateDTO userRoleDTO) {
        if (userRoleMapper.selectById(userRoleDTO.getId()) == null) {
            throw new BusinessException("用户角色关联不存在");
        }
        UserRolePO sameBinding = userRoleMapper.selectByUserAndRole(userRoleDTO.getUserId(), userRoleDTO.getRoleId());
        if (sameBinding != null && !sameBinding.getId().equals(userRoleDTO.getId())) {
            throw new BusinessException("用户角色已绑定");
        }
        userRoleMapper.updateById(CopyTools.copy(userRoleDTO, UserRolePO.class));
    }

    private void synchronizeRolePermissions(RoleUpdateDTO roleDTO) {
        if (roleDTO.getPermissionIds() == null) {
            return;
        }
        Set<Long> existing = new LinkedHashSet<>(rolePermissionMapper.selectPermissionIdsByRoleId(roleDTO.getId()));
        Set<Long> desired = new LinkedHashSet<>(roleDTO.getPermissionIds());

        desired.stream().filter(id -> !existing.contains(id)).forEach(permissionId -> {
            RolePermissionDTO binding = new RolePermissionDTO();
            binding.setRoleId(roleDTO.getId());
            binding.setPermissionId(permissionId);
            bindRolePermission(binding);
        });
        existing.stream().filter(id -> !desired.contains(id)).forEach(permissionId -> {
            RolePermissionDTO binding = new RolePermissionDTO();
            binding.setRoleId(roleDTO.getId());
            binding.setPermissionId(permissionId);
            unbindRolePermission(binding);
        });
    }

    private void appendPermission(List<PermissionTreeVO> roots, PermissionPO permission, boolean checked) {
        String code = permission.getPermissionCode();
        String[] parts = code == null ? new String[0] : code.split(":");
        List<String> groupParts = new ArrayList<>();
        if (parts.length == 0 || code.contains("*")) {
            groupParts.add("wildcard");
        } else {
            for (int index = 0; index < Math.max(1, parts.length - 1); index++) {
                groupParts.add(parts[index]);
            }
        }

        List<PermissionTreeVO> level = roots;
        StringBuilder path = new StringBuilder();
        for (String part : groupParts) {
            if (!path.isEmpty()) path.append(':');
            path.append(part);
            String key = "group:" + path;
            PermissionTreeVO group = level.stream()
                    .filter(node -> key.equals(node.getKey()))
                    .findFirst()
                    .orElse(null);
            if (group == null) {
                group = new PermissionTreeVO();
                group.setKey(key);
                group.setCode(path.toString());
                group.setLabel(groupLabel(part));
                level.add(group);
            }
            level = group.getChildren();
        }

        PermissionTreeVO leaf = new PermissionTreeVO();
        leaf.setKey("permission:" + permission.getId());
        leaf.setLabel(permission.getPermissionName());
        leaf.setCode(permission.getPermissionCode());
        leaf.setPermissionId(permission.getId());
        leaf.setChecked(checked);
        level.add(leaf);
    }

    private boolean refreshGroupCheckedState(PermissionTreeVO node) {
        if (node.getPermissionId() != null) {
            return node.isChecked();
        }
        boolean checked = !node.getChildren().isEmpty();
        for (PermissionTreeVO child : node.getChildren()) {
            if (!refreshGroupCheckedState(child)) {
                checked = false;
            }
        }
        node.setChecked(checked);
        return checked;
    }

    private String groupLabel(String codePart) {
        return switch (codePart) {
            case "system" -> "系统管理";
            case "menu" -> "菜单管理";
            case "role" -> "角色管理";
            case "permission" -> "权限管理";
            case "user" -> "用户管理";
            case "admin" -> "管理端";
            case "dashboard" -> "数据大屏";
            case "profile" -> "个人主页";
            case "wildcard" -> "全局权限";
            default -> codePart;
        };
    }
}
