package com.wzbc.GoWorking.Service;

import com.wzbc.GoWorking.Exception.BusinessException;
import com.wzbc.GoWorking.Mapper.MenuMapper;
import com.wzbc.GoWorking.Service.impl.MenuServiceImpl;
import com.wzbc.GoWorking.entity.DTO.Menu.MenuDTO;
import com.wzbc.GoWorking.entity.PO.Menu.MenuPO;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class MenuServiceImplTests {

    @Test
    void insertMenuRejectsAnExistingPathWithoutInserting() {
        MenuMapper mapper = mock(MenuMapper.class);
        MenuServiceImpl service = serviceWith(mapper);
        MenuDTO dto = menu("/system/menu");
        when(mapper.selectByPath(dto.getPath())).thenReturn(new MenuPO());

        BusinessException error = assertThrows(BusinessException.class, () -> service.insertMenu(dto));

        assertEquals("菜单已存在", error.getMessage());
        verify(mapper, never()).insert(any());
    }

    @Test
    void insertMenuCopiesAndInsertsANewMenu() {
        MenuMapper mapper = mock(MenuMapper.class);
        MenuServiceImpl service = serviceWith(mapper);
        MenuDTO dto = menu("/system/new-menu");
        dto.setMenuName("新菜单");
        when(mapper.selectByPath(dto.getPath())).thenReturn(null);

        service.insertMenu(dto);

        verify(mapper).insert(any(MenuPO.class));
    }

    private MenuServiceImpl serviceWith(MenuMapper mapper) {
        MenuServiceImpl service = new MenuServiceImpl();
        ReflectionTestUtils.setField(service, "menuMapper", mapper);
        return service;
    }

    private MenuDTO menu(String path) {
        MenuDTO dto = new MenuDTO();
        dto.setPath(path);
        return dto;
    }
}
