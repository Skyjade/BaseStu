package com.sky.nettyClient.initializer;

import com.sky.nettyBase.codec.MessageDecoder;
import com.sky.nettyBase.codec.MessageEncoder;
import com.sky.nettyBase.initializer.BaseInitializer;
import com.sky.nettyClient.handler.NettyClientBusinessHandler;
import io.netty.channel.ChannelHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;
import io.netty.handler.timeout.IdleStateHandler;


/**
 * Netty初始化设置
 */
public class DefaultNettyClientInitializer extends BaseInitializer {


    /**
     * 初始化通道
     * @param socketChannel
     * @throws Exception
     */
    protected void initChannel(SocketChannel socketChannel) throws Exception {
        super.initChannel(socketChannel);
        //加载进站处理器
        ChannelPipeline channelPipeline = socketChannel.pipeline();
        channelPipeline.addLast(new NettyClientBusinessHandler());
    }


}
