package com.sky.concurrency.event;

import com.lmax.disruptor.dsl.Disruptor;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

@Component
public class WsPushEventInitializer {


    @Resource(name = "wsPushEventDisruptor")
    private Disruptor<WsPushEvent> disruptor;
    @Resource
    private WsPushEventConsumer wsPushEventConsumer;

    @PostConstruct
    public void init() {
         //绑定配置关系
        disruptor.handleEventsWith(wsPushEventConsumer);
        disruptor.start();
    }



}
