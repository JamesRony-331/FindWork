package com.wzbc.GoWorking.Mapper;

import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.session.Configuration;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RbacMapperContractTests {

    private static final Set<String> CRUD_METHODS = Set.of(
            "insert", "updateById", "deleteById", "selectById", "selectAll"
    );

    private static final List<MapperCase> MAPPERS = List.of(
            new MapperCase("RoleMapper", "roleMapper.xml", "sys_role"),
            new MapperCase("PermissionMapper", "permissionMapper.xml", "sys_permission"),
            new MapperCase("RolePermissionMapper", "rolePermissionMapper.xml", "sys_role_permission"),
            new MapperCase("UserRoleMapper", "userRoleMapper.xml", "sys_user_role")
    );

    @Test
    void eachRbacMapperExposesAndMapsCompleteCrudOperations() throws Exception {
        for (MapperCase mapperCase : MAPPERS) {
            Class<?> mapperType = Class.forName("com.wzbc.GoWorking.Mapper." + mapperCase.interfaceName());
            Set<String> methodNames = List.of(mapperType.getDeclaredMethods()).stream()
                    .map(Method::getName)
                    .collect(Collectors.toSet());
            assertEquals(CRUD_METHODS, methodNames, mapperCase.interfaceName());

            Configuration configuration = new Configuration();
            String resource = "mapper/" + mapperCase.xmlName();
            try (InputStream input = Resources.getResourceAsStream(resource)) {
                new XMLMapperBuilder(input, configuration, resource, configuration.getSqlFragments()).parse();
            }

            for (String method : CRUD_METHODS) {
                String statementId = mapperType.getName() + "." + method;
                assertTrue(configuration.hasStatement(statementId, false), statementId);
                MappedStatement statement = configuration.getMappedStatement(statementId);
                assertTrue(statement.getBoundSql(null).getSql().toLowerCase().contains(mapperCase.tableName()),
                        statementId + " should target " + mapperCase.tableName());
            }
        }
    }

    private record MapperCase(String interfaceName, String xmlName, String tableName) {
    }
}
