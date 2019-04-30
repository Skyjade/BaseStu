package com.sky.common.entity;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class ModelResp <T> extends CommonResp  {
    private T data;

    public ModelResp() {
    }

    public T getData() {
        return this.data;
    }

    public void setData(T data) {
            this.data = data;
        }
}
