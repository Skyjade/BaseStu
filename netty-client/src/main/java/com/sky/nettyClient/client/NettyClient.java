package com.sky.nettyClient.client;

import com.sky.nettyClient.initializer.DefaultNettyClientInitializer;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Netty单客户端->单服务端
 */
public final class NettyClient{

    private String host =  "127.0.0.1";
    private int port = 9527;

    /**
     * 重连线程池
     */
    private ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(1);//1
    /**
     * Event Loop Group
     */
    private EventLoopGroup group = new NioEventLoopGroup();


    public NettyClient(){
        scheduledExecutorService = Executors.newScheduledThreadPool(5);//5
    }

    public void connection() {

        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(group)//
                .channel(NioSocketChannel.class)
                .option(ChannelOption.TCP_NODELAY, true)
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS,30)
                .option(ChannelOption.SO_KEEPALIVE, true)
                .handler(new DefaultNettyClientInitializer());
        // 异步链接服务器 同步等待链接成功
        ChannelFuture channelFuture = null;
        try {
            channelFuture = bootstrap.connect(host, port).sync();
            channelFuture.channel().closeFuture().sync();
        } catch (Exception e) {//Interrupted

        } finally {
            this.close(channelFuture);
        }
    }


    public void close(ChannelFuture channelFuture) {
       // group.shutdownGracefully();
        if (null != channelFuture) {
            if (channelFuture.channel() != null && channelFuture.channel().isOpen()) {
                channelFuture.channel().close();
            }
        }
    }

    public void close() throws Exception {
        group.shutdownGracefully();
    }



    public static void main(String[] args) throws Exception {
        NettyClient client = new NettyClient();
        client.connection();
        TimeUnit.HOURS.sleep(24);
    }
}
