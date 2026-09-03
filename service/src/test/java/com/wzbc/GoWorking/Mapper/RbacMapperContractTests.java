package com.wzbc.GoWorking.Mapper;

import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.session.Configuration;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RbacMapperContractTests {

    private static final Set<String> CRUD_METHODS = Set.of(
            "insert", "updateById", "deleteById", "selectById", "selectAll"
    );

    private static final List<MapperCase> MAPPERS = List.of(
            new MapperCase("RoleMapper", "roleMapper.xml", "sys_role",
                    Set.of("insert", "updateById", "deleteById", "selectById", "selectAll", "selectByUserId", "selectByCode")),
            new MapperCase("PermissionMapper", "permissionMapper.xml", "sys_permission",
                    Set.of("insert", "updateById", "deleteById", "selectById", "selectAll", "selectByCode")),
            new MapperCase("RolePermissionMapper", "rolePermissionMapper.xml", "sys_role_permission",
                    Set.of("insert", "updateById", "deleteById", "selectById", "selectAll",
                            "selectPermissionIdsByUserRoles", "selectPermissionsByUserRoles",
                            "selectPermissionIdsByRoleId", "selectByRoleAndPermission", "deleteByRoleAndPermission")),
            new MapperCase("UserRoleMapper", "userRoleMapper.xml", "sys_user_role",
                    Set.of("insert", "updateById", "deleteById", "selectById", "selectAll", "selectByUserId",
                            "selectByUserAndRole"))
    );

    @Test
    void eachRbacMapperExposesAndMapsCompleteCrudOperations() throws Exception {
        for (MapperCase mapperCase : MAPPERS) {
            Class<?> mapperType = Class.forName("com.wzbc.GoWorking.Mapper." + mapperCase.interfaceName());
            Set<String> methodNames = List.of(mapperType.getDeclaredMethods()).stream()
                    .map(Method::getName)
                    .collect(Collectors.toSet());
            assertEquals(mapperCase.methods(), methodNames, mapperCase.interfaceName());

            Configuration configuration = new Configuration();
            String resource = "mapper/" + mapperCase.xmlName();
            try (InputStream input = Resources.getResourceAsStream(resource)) {
                new XMLMapperBuilder(input, configuration, resource, configuration.getSqlFragments()).parse();
            }

            for (String method : mapperCase.methods()) {
                String statementId = mapperType.getName() + "." + method;
                assertTrue(configuration.hasStatement(statementId, false), statementId);
                MappedStatement statement = configuration.getMappedStatement(statementId);
                assertTrue(statement.getBoundSql(null).getSql().toLowerCase().contains(mapperCase.tableName()),
                        statementId + " should target " + mapperCase.tableName());
            }
        }
    }

    @Test
    void userRoleMapperCanQueryAllRolesByUserUuid() throws Exception {
        Class<?> mapperType = Class.forName("com.wzbc.GoWorking.Mapper.UserRoleMapper");
        Method method = mapperType.getDeclaredMethod("selectByUserId", String.class);
        assertEquals(List.class, method.getReturnType());

        Configuration configuration = new Configuration();
        String resource = "mapper/userRoleMapper.xml";
        try (InputStream input = Resources.getResourceAsStream(resource)) {
            new XMLMapperBuilder(input, configuration, resource, configuration.getSqlFragments()).parse();
        }
        String sql = configuration.getMappedStatement(mapperType.getName() + ".selectByUserId")
                .getBoundSql(null).getSql().toLowerCase();
        assertTrue(sql.contains("where user_id = ?"));
    }

    @Test
    void roleMapperReturnsCompleteRolesForAUserUuid() throws Exception {
        Class<?> mapperType = Class.forName("com.wzbc.GoWorking.Mapper.RoleMapper");
        Method method = mapperType.getDeclaredMethod("selectByUserId", String.class);
        ParameterizedType returnType = (ParameterizedType) method.getGenericReturnType();
        assertEquals(List.class, returnType.getRawType());
        assertEquals(com.wzbc.GoWorking.entity.PO.RBAC.RolePO.class, returnType.getActualTypeArguments()[0]);

        Configuration configuration = new Configuration();
        String resource = "mapper/roleMapper.xml";
        try (InputStream input = Resources.getResourceAsStream(resource)) {
            new XMLMapperBuilder(input, configuration, resource, configuration.getSqlFragments()).parse();
        }
        String sql = configuration.getMappedStatement(mapperType.getName() + ".selectByUserId")
                .getBoundSql(null).getSql().replaceAll("\\s+", " ").trim().toLowerCase();
        assertTrue(sql.contains("join sys_user_role ur on ur.role_id = r.id"));
        assertTrue(sql.contains("where ur.user_id = ?"));
    }

    @Test
    void rolePermissionMapperQueriesDistinctPermissionIdsFromUserRoles() throws Exception {
        Class<?> mapperType = Class.forName("com.wzbc.GoWorking.Mapper.RolePermissionMapper");
        Method method = mapperType.getDeclaredMethod("selectPermissionIdsByUserRoles", List.class);
        ParameterizedType returnType = (ParameterizedType) method.getGenericReturnType();
        assertEquals(List.class, returnType.getRawType());
        assertEquals(Long.class, returnType.getActualTypeArguments()[0]);

        Configuration configuration = new Configuration();
        String resource = "mapper/rolePermissionMapper.xml";
        try (InputStream input = Resources.getResourceAsStream(resource)) {
            new XMLMapperBuilder(input, configuration, resource, configuration.getSqlFragments()).parse();
        }

        com.wzbc.GoWorking.entity.PO.RBAC.UserRolePO first =
                new com.wzbc.GoWorking.entity.PO.RBAC.UserRolePO();
        first.setRoleId(10L);
        com.wzbc.GoWorking.entity.PO.RBAC.UserRolePO second =
                new com.wzbc.GoWorking.entity.PO.RBAC.UserRolePO();
        second.setRoleId(20L);
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("userRoles", List.of(first, second));

        String sql = configuration
                .getMappedStatement(mapperType.getName() + ".selectPermissionIdsByUserRoles")
                .getBoundSql(parameters).getSql().replaceAll("\\s+", " ").trim().toLowerCase();
        assertTrue(sql.contains("select distinct permission_id"));
        assertTrue(sql.contains("where role_id in ( ? , ? )"));
    }

    @Test
    void rolePermissionMapperQueriesCompletePermissionsFromUserRoles() throws Exception {
        Class<?> mapperType = Class.forName("com.wzbc.GoWorking.Mapper.RolePermissionMapper");
        Method method = mapperType.getDeclaredMethod("selectPermissionsByUserRoles", List.class);
        ParameterizedType returnType = (ParameterizedType) method.getGenericReturnType();
        assertEquals(List.class, returnType.getRawType());
        assertEquals(com.wzbc.GoWorking.entity.PO.RBAC.PermissionPO.class,
                returnType.getActualTypeArguments()[0]);

        Configuration configuration = new Configuration();
        String resource = "mapper/rolePermissionMapper.xml";
        try (InputStream input = Resources.getResourceAsStream(resource)) {
            new XMLMapperBuilder(input, configuration, resource, configuration.getSqlFragments()).parse();
        }

        com.wzbc.GoWorking.entity.PO.RBAC.UserRolePO userRole =
                new com.wzbc.GoWorking.entity.PO.RBAC.UserRolePO();
        userRole.setRoleId(10L);
        Map<String, Object> parameters = Map.of("userRoles", List.of(userRole));
        String sql = configuration
                .getMappedStatement(mapperType.getName() + ".selectPermissionsByUserRoles")
                .getBoundSql(parameters).getSql().replaceAll("\\s+", " ").trim().toLowerCase();

        assertTrue(sql.contains("select distinct p.id"));
        assertTrue(sql.contains("join sys_permission p on p.id = rp.permission_id"));
        assertTrue(sql.contains("where rp.role_id in ( ? )"));
    }

    @Test
    void rolePermissionMapperQueriesPermissionIdsByRoleId() throws Exception {
        Class<?> mapperType = Class.forName("com.wzbc.GoWorking.Mapper.RolePermissionMapper");
        Method method = mapperType.getDeclaredMethod("selectPermissionIdsByRoleId", Long.class);
        assertEquals(List.class, method.getReturnType());

        Configuration configuration = new Configuration();
        String resource = "mapper/rolePermissionMapper.xml";
        try (InputStream input = Resources.getResourceAsStream(resource)) {
            new XMLMapperBuilder(input, configuration, resource, configuration.getSqlFragments()).parse();
        }
        String sql = configuration.getMappedStatement(mapperType.getName() + ".selectPermissionIdsByRoleId")
                .getBoundSql(Map.of("roleId", 7L)).getSql().replaceAll("\\s+", " ").trim().toLowerCase();
        assertTrue(sql.contains("where role_id = ?"));
    }

    private record MapperCase(String interfaceName, String xmlName, String tableName, Set<String> methods) {
    }
}
