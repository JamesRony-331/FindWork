package com.wzbc.GoWorking.Service;

import com.wzbc.GoWorking.Mapper.UserMapper;
import com.wzbc.GoWorking.Service.impl.UserServiceImpl;
import com.wzbc.GoWorking.entity.DTO.User.UserPageDTO;
import com.wzbc.GoWorking.entity.PO.User.UserPO;
import com.wzbc.GoWorking.entity.Query.PageQuery;
import com.wzbc.GoWorking.entity.VO.SelectByPageVO;
import com.wzbc.GoWorking.entity.VO.User.UserAdminVO;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserPaginationServiceTests {

    @Test
    void returnsUserAdminVoPageUsingCountAndCalculatedPageQuery() {
        UserMapper mapper = mock(UserMapper.class);
        UserServiceImpl service = new UserServiceImpl();
        ReflectionTestUtils.setField(service, "userMapper", mapper);

        UserPageDTO dto = new UserPageDTO();
        dto.setPageNum(2);
        dto.setPageSize(10);
        UserPO user = new UserPO();
        user.setUuid("user-1");
        user.setNickname("测试用户");
        when(mapper.selectUserTotalCount()).thenReturn(21);
        when(mapper.selectUsersByPage(org.mockito.ArgumentMatchers.any(PageQuery.class))).thenReturn(List.of(user));

        SelectByPageVO<UserAdminVO> result = service.getUsersByPage(dto);

        ArgumentCaptor<PageQuery> queryCaptor = ArgumentCaptor.forClass(PageQuery.class);
        verify(mapper).selectUsersByPage(queryCaptor.capture());
        assertEquals(10, queryCaptor.getValue().getStart());
        assertEquals(2, result.getPageNum());
        assertEquals(10, result.getPageSize());
        assertEquals(3, result.getTotal());
        assertEquals(21, result.getTotalCount());
        assertEquals("user-1", result.getList().get(0).getUuid());
        assertEquals("测试用户", result.getList().get(0).getNickname());
    }
}
