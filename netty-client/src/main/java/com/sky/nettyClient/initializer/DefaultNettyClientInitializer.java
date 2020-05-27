package com.sky.nettyClient.initializer;

import com.sky.nettyClient.codec.MessageDecoder;
import com.sky.nettyClient.codec.MessageEncoder;
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
public class DefaultNettyClientInitializer extends ChannelInitializer<SocketChannel> {

    private final static int readerIdleTimeSeconds = 30;//读操作空闲30秒
    private final static int writerIdleTimeSeconds = 15;//写操作空闲15秒
    private final static int allIdleTimeSeconds = 100000;//读写全部空闲10000秒
    private static final int MAX_FRAME_LENGTH = 1024 * 1024;
    private static final int LENGTH_FIELD_LENGTH = 4;//4 长度4字节 4
    private static final int LENGTH_FIELD_OFFSET = 0;// 长度字节起始位置 0
    private static final int LENGTH_ADJUSTMENT = 0;// 长度实际需要调整 4
    private static final int LENGTH_SKIP = 0;// 丢弃字节数 0

    /**
     * 初始化通道
     * @param socketChannel
     * @throws Exception
     */
    protected void initChannel(SocketChannel socketChannel) throws Exception {
        ChannelPipeline channelPipeline = socketChannel.pipeline();
        //设置日志输出级别
        channelPipeline.addLast(new LoggingHandler(LogLevel.DEBUG));
        //加载心跳处理器
        IdleStateHandler idleStateHandler = new IdleStateHandler(readerIdleTimeSeconds, writerIdleTimeSeconds, allIdleTimeSeconds);
        channelPipeline.addLast("idleStateHandler", idleStateHandler);
        //加载解码器
        this.loadDecoderChannelHandler(channelPipeline);
        //加载编码器
        this.loadEncoderChannelHandler(channelPipeline);
        //加载进站处理器
        channelPipeline.addLast(new NettyClientBusinessHandler());
    }


    /**
     * 加载解码器
     * @param channelPipeline
     */
    protected void loadDecoderChannelHandler(ChannelPipeline channelPipeline){
        ChannelHandlerAdapter messageDecoder = new MessageDecoder(MAX_FRAME_LENGTH,LENGTH_FIELD_OFFSET,LENGTH_FIELD_LENGTH,LENGTH_ADJUSTMENT,LENGTH_SKIP);
        channelPipeline.addLast(messageDecoder);
    }

    /**
     * 加载编码器
     * @param channelPipeline
     */
    protected void loadEncoderChannelHandler(ChannelPipeline channelPipeline){
        ChannelHandlerAdapter messageEncoder = new MessageEncoder();
        channelPipeline.addLast(messageEncoder);
    }

}
