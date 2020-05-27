package com.sky.nettyClient.utils;

import com.sky.nettyBase.entity.Message;
import io.netty.channel.ChannelHandlerContext;

/**
 * Netty消息发送类
 */
public class NettyClientSendMessageEvent {


    private static ChannelHandlerContext channelHandlerContext;

    public static void setChannelHandlerContext(ChannelHandlerContext channelHandlerContext){
        NettyClientSendMessageEvent.channelHandlerContext = channelHandlerContext;
    }

    /**
     * 发送异步消息
     * @param message
     * @throws Exception
     */
    public static void sendMessage(Message message)throws Exception{
        if(!channelHandlerContext.channel().isActive()){
            throw new Exception("连接已断开");
        }
        channelHandlerContext.channel().writeAndFlush(message);
    }






}
