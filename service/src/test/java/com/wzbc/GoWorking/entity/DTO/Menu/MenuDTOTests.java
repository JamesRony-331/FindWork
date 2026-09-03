package com.wzbc.GoWorking.entity.DTO.Menu;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MenuDTOTests {

    @Test
    void createMenuDtoContainsOnlyWritableMenuFields() {
        Map<String, Class<?>> fields = Arrays.stream(MenuDTO.class.getDeclaredFields())
                .collect(Collectors.toMap(Field::getName, Field::getType));

        assertEquals(Map.ofEntries(
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
                Map.entry("remark", String.class)
        ), fields);
    }

    @Test
    void createMenuDtoUsesTheSameDefaultsAsMenuPo() throws Exception {
        MenuDTO dto = new MenuDTO();

        assertEquals(0L, fieldValue(dto, "parentId"));
        assertEquals(0, fieldValue(dto, "sortOrder"));
        assertEquals(1, fieldValue(dto, "visible"));
        assertEquals(1, fieldValue(dto, "status"));
        assertEquals(0, fieldValue(dto, "keepAlive"));
        assertEquals(0, fieldValue(dto, "externalLink"));
    }

    private Object fieldValue(MenuDTO dto, String name) throws Exception {
        Field field = MenuDTO.class.getDeclaredField(name);
        field.setAccessible(true);
        return field.get(dto);
    }
}
