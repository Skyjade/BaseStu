package com.sky.common.entity;

import java.util.Date;

/**
 * @Author wangtq
 * @Description 分页查询条件类
 * @Date
 **/
public class PageQuery<T> {
    private int start;
    private int limit;
    private T t;
    private Date startDate;
    private Date endDate;

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public T getT() {
        return t;
    }

    public void setT(T t) {
        this.t = t;
    }
}
