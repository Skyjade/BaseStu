package com.sky.netty.config;

import com.sky.netty.client.NettyClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

/**
 * Netty配置
 */
@Configuration
public class NettyClientConfig {

    /**
     * 启动线程池
     */
    private ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(1);

    private NettyClient client;
    @Bean(destroyMethod = "close")
    public NettyClient nettyClient() {
        client = new NettyClient();
        this.scheduledExecutorService.execute(() -> {
            try {
                client.connection();
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Client连接失败!");
            }
        });
        return client;
    }


}
