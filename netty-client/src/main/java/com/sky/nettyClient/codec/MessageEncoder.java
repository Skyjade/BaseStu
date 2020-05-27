package com.sky.nettyClient.codec;

import com.sky.nettyClient.entity.Message;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToByteEncoder;

/**
 * Netty编码器
 */
public class MessageEncoder extends MessageToByteEncoder<Message> {
    @Override
    protected void encode(ChannelHandlerContext channelHandlerContext, Message message, ByteBuf byteBuf) throws Exception {
        //byteBuf.writeInt(message.getOrderId());
        byteBuf.writeInt(message.getLength());
        byteBuf.writeBytes(message.getBody().getBytes("UTF-8"));
    }
}
