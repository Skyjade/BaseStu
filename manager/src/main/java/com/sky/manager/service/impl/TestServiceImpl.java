package com.sky.manager.service.impl;

import com.sky.manager.service.TestService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.ListenableFuture;

import java.util.concurrent.TimeUnit;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
@Service
@Slf4j
public class TestServiceImpl implements TestService {
    private volatile int num=1;

    @Override
    @Async
    public void testAsync() {
        log.info("测试开始...");
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        num+=1;
        log.info("结果："+String.valueOf(num));
    }

    @Override
    @Async
    public ListenableFuture<String> testAsyncResult() {
        System.out.println("向rabbitmq发送消息");
        String res = "Hello World!";
        try {
            TimeUnit.SECONDS.sleep(10);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        //日志使用技巧
        log.info("{}, {},参数1 [{}], 参数2 [{}], 参数3 [{}]",
                "执行","完成","123","456","789");
        return new AsyncResult<>(res);
    }
}
