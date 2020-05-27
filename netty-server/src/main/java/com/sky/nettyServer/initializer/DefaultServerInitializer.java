package com.sky.nettyServer.initializer;

import com.sky.nettyBase.codec.MessageDecoder;
import com.sky.nettyBase.codec.MessageEncoder;
import com.sky.nettyBase.initializer.BaseInitializer;
import com.sky.nettyServer.handler.ServerHandler;
import io.netty.channel.ChannelHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;

public class DefaultServerInitializer extends BaseInitializer {
    @Override
    protected void initChannel(SocketChannel socketChannel) throws Exception {
        super.initChannel(socketChannel);
        //管道注册handler
        ChannelPipeline pipeline = socketChannel.pipeline();
        //聊天服务通道处理
        pipeline.addLast("chat", new ServerHandler());
    }
}
