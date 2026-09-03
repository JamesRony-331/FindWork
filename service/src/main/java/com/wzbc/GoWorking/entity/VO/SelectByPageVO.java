package com.wzbc.GoWorking.entity.VO;

import lombok.Data;

import java.util.List;

@Data
public class SelectByPageVO<T> {
    private int pageNum; //页数
    private int pageSize; //每一页大小
    private int total; //总页数
    private int totalCount; //总条数
    private List<T> list;
}
