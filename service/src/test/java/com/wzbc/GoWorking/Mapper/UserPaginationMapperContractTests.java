package com.wzbc.GoWorking.Mapper;

import com.wzbc.GoWorking.entity.Query.PageQuery;
import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.Configuration;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UserPaginationMapperContractTests {

    @Test
    void userAdminVoContainsOnlyAdministrativeListFields() throws Exception {
        Class<?> voType = Class.forName("com.wzbc.GoWorking.entity.VO.User.UserAdminVO");
        Map<String, Class<?>> fields = List.of(voType.getDeclaredFields()).stream()
                .collect(Collectors.toMap(Field::getName, Field::getType));

        assertEquals(Set.of("uuid", "nickname", "email", "sex", "createTime", "isDelete"),
                fields.keySet());
        assertEquals(java.util.Date.class, fields.get("createTime"));
        assertEquals(Integer.class, fields.get("isDelete"));
    }

    @Test
    void userMapperCountsAndPaginatesAllUsers() throws Exception {
        Method countMethod = UserMapper.class.getDeclaredMethod("selectUserTotalCount");
        assertEquals(int.class, countMethod.getReturnType());

        Method pageMethod = UserMapper.class.getDeclaredMethod("selectUsersByPage", PageQuery.class);
        ParameterizedType returnType = (ParameterizedType) pageMethod.getGenericReturnType();
        assertEquals(List.class, returnType.getRawType());
        assertEquals(com.wzbc.GoWorking.entity.PO.User.UserPO.class, returnType.getActualTypeArguments()[0]);

        Configuration configuration = new Configuration();
        String resource = "mapper/userMapper.xml";
        try (InputStream input = Resources.getResourceAsStream(resource)) {
            new XMLMapperBuilder(input, configuration, resource, configuration.getSqlFragments()).parse();
        }

        String namespace = UserMapper.class.getName();
        String countSql = normalize(configuration.getMappedStatement(namespace + ".selectUserTotalCount")
                .getBoundSql(null).getSql());
        assertEquals("select count(*) from sys_user", countSql);

        PageQuery pageQuery = new PageQuery(3, 20, 100);
        String pageSql = normalize(configuration.getMappedStatement(namespace + ".selectUsersByPage")
                .getBoundSql(Map.of("pageQuery", pageQuery)).getSql());
        assertTrue(pageSql.contains("creattime as createtime"));
        assertTrue(pageSql.contains("isdelete as isdelete"));
        assertTrue(pageSql.contains("order by creattime desc"));
        assertTrue(pageSql.contains("limit ?, ?"));
        assertFalse(pageSql.contains("password"));
        assertFalse(pageSql.contains("avatar"));
    }

    private String normalize(String sql) {
        return sql.replaceAll("\\s+", " ").trim().toLowerCase();
    }
}
