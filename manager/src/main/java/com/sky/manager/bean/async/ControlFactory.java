package com.sky.manager.bean.async;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class ControlFactory {

    public final static ConcurrentMap<String, CountDownObj> countDownLatchMap = new ConcurrentHashMap<>();

}
