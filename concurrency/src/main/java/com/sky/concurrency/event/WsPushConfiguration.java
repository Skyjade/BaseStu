package com.hexing.alarmsystem.webPub.event;

import com.lmax.disruptor.YieldingWaitStrategy;
import com.lmax.disruptor.dsl.Disruptor;
import com.lmax.disruptor.dsl.ProducerType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.concurrent.Executors;

@Configuration
public class WsPushConfiguration {

    @Bean
    public Disruptor<WsPushEvent> wsPushEventDisruptor(){
        return new Disruptor<>(WsPushEvent.FACTORY, 1024, Executors.defaultThreadFactory(), ProducerType.SINGLE, new YieldingWaitStrategy());
    }

}
