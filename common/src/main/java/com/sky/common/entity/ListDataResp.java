package com.sky.common.entity;

import java.util.List;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class ListDataResp<T> extends CommonResp {
    List<T> data;
    long total;

    public ListDataResp(List<T> data, long total) {
        this.data = data;
        this.total = total;
    }

    public ListDataResp() {
    }

    public List<T> getData() {
        return this.data;
    }

    public ListDataResp<T> setData(List<T> data) {
        this.data = data;
        return this;
    }

    public long getTotal() {
        return this.total;
    }

    public void setTotal(long total) {
        this.total = total;
    }
}
