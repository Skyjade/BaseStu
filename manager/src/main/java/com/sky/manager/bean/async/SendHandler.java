package com.sky.manager.bean.async;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static com.sky.manager.bean.async.ControlFactory.countDownLatchMap;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class SendHandler {

    /**
     *
     */
    public String send(String key) throws Exception{
        CountDownLatch countDownLatch = new CountDownLatch(1);
        countDownLatchMap.putIfAbsent(key, new CountDownObj(countDownLatch));
        //阻塞，超时时间3s
        countDownLatch.await(3, TimeUnit.SECONDS);
        //返回JNI后台返回对应的结果或者null
        return countDownLatchMap.remove(key).getValue();

    }
}
