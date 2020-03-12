package com.sky.manager.bean.async;

import java.util.concurrent.CountDownLatch;

/**
 * @Author wangtq
 * @Description
 * 封装CountDownLatch 和 value
 * 用于CountDownLatch阻塞控制和返回结果
 * @Date
 **/
public class CountDownObj {

    private final CountDownLatch countDownLatch;
    private volatile String value;

    CountDownObj(CountDownLatch countDownLatch) {
        this.countDownLatch = countDownLatch;
    }

    public CountDownLatch getCountDownLatch() {
        return countDownLatch;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
