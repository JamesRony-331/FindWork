package com.wzbc.GoWorking.Mapper;

import com.wzbc.GoWorking.entity.PO.Menu.MenuPO;
import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.session.Configuration;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MenuMapperContractTests {

    @Test
    void menuPoAndMapperMatchTheSysMenuContract() throws Exception {
        Class<?> menuType = Class.forName("com.wzbc.GoWorking.entity.PO.Menu.MenuPO");
        Map<String, Class<?>> actualFields = List.of(menuType.getDeclaredFields()).stream()
                .collect(Collectors.toMap(Field::getName, Field::getType));
        assertEquals(expectedFields(), actualFields);

        Class<?> mapperType = Class.forName("com.wzbc.GoWorking.Mapper.MenuMapper");
        Set<String> methods = List.of(mapperType.getDeclaredMethods()).stream()
                .map(Method::getName)
                .collect(Collectors.toSet());
        Set<String> expectedMethods = Set.of(
                "insert", "updateById", "deleteById", "selectById", "selectByPath", "selectAll", "selectByPermissions"
        );
        assertEquals(expectedMethods, methods);

        Configuration configuration = new Configuration();
        String resource = "mapper/menuMapper.xml";
        try (InputStream input = Resources.getResourceAsStream(resource)) {
            new XMLMapperBuilder(input, configuration, resource, configuration.getSqlFragments()).parse();
        }

        for (String method : expectedMethods) {
            String statementId = mapperType.getName() + "." + method;
            assertTrue(configuration.hasStatement(statementId, false), statementId);
            MappedStatement statement = configuration.getMappedStatement(statementId);
            assertTrue(statement.getBoundSql(null).getSql().toLowerCase().contains("sys_menu"), statementId);
        }

        Set<String> mappedProperties = configuration
                .getMappedStatement(mapperType.getName() + ".selectById")
                .getResultMaps().getFirst().getResultMappings().stream()
                .map(resultMapping -> resultMapping.getProperty())
                .collect(Collectors.toSet());
        assertEquals(expectedFields().keySet(), mappedProperties);
    }

    @Test
    void menuMapperCanFindAnExistingMenuByPath() throws Exception {
        Class<?> mapperType = Class.forName("com.wzbc.GoWorking.Mapper.MenuMapper");
        assertEquals(MenuPO.class, mapperType.getDeclaredMethod("selectByPath", String.class).getReturnType());

        Configuration configuration = new Configuration();
        String resource = "mapper/menuMapper.xml";
        try (InputStream input = Resources.getResourceAsStream(resource)) {
            new XMLMapperBuilder(input, configuration, resource, configuration.getSqlFragments()).parse();
        }
        String sql = configuration.getMappedStatement(mapperType.getName() + ".selectByPath")
                .getBoundSql(null).getSql().replaceAll("\\s+", " ").trim().toLowerCase();
        assertTrue(sql.contains("where path = ?"));
    }

    @Test
    void menuMapperQueriesMenusByPermissionCodes() throws Exception {
        Class<?> mapperType = Class.forName("com.wzbc.GoWorking.Mapper.MenuMapper");
        Method method = mapperType.getDeclaredMethod("selectByPermissions", List.class);
        ParameterizedType returnType = (ParameterizedType) method.getGenericReturnType();
        assertEquals(List.class, returnType.getRawType());
        assertEquals(com.wzbc.GoWorking.entity.PO.Menu.MenuPO.class, returnType.getActualTypeArguments()[0]);

        Configuration configuration = new Configuration();
        String resource = "mapper/menuMapper.xml";
        try (InputStream input = Resources.getResourceAsStream(resource)) {
            new XMLMapperBuilder(input, configuration, resource, configuration.getSqlFragments()).parse();
        }

        com.wzbc.GoWorking.entity.PO.RBAC.PermissionPO first =
                new com.wzbc.GoWorking.entity.PO.RBAC.PermissionPO();
        first.setPermissionCode("system:user:list");
        com.wzbc.GoWorking.entity.PO.RBAC.PermissionPO second =
                new com.wzbc.GoWorking.entity.PO.RBAC.PermissionPO();
        second.setPermissionCode("system:role:list");

        String sql = configuration
                .getMappedStatement(mapperType.getName() + ".selectByPermissions")
                .getBoundSql(Map.of("permissions", List.of(first, second)))
                .getSql().replaceAll("\\s+", " ").trim().toLowerCase();
        assertTrue(sql.contains("where permission in ( ? , ? )"));
        assertTrue(sql.contains("order by sort_order, menu_id"));
    }

    private Map<String, Class<?>> expectedFields() {
        return Map.ofEntries(
                Map.entry("menuId", Long.class),
                Map.entry("parentId", Long.class),
                Map.entry("menuName", String.class),
                Map.entry("menuType", String.class),
                Map.entry("path", String.class),
                Map.entry("component", String.class),
                Map.entry("routeName", String.class),
                Map.entry("permission", String.class),
                Map.entry("icon", String.class),
                Map.entry("sortOrder", Integer.class),
                Map.entry("visible", Integer.class),
                Map.entry("status", Integer.class),
                Map.entry("keepAlive", Integer.class),
                Map.entry("externalLink", Integer.class),
                Map.entry("redirect", String.class),
                Map.entry("createTime", LocalDateTime.class),
                Map.entry("updateTime", LocalDateTime.class),
                Map.entry("remark", String.class)
        );
    }
}
