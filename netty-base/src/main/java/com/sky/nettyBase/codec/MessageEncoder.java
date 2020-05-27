package com.sky.nettyBase.codec;

import com.sky.nettyBase.entity.Message;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToByteEncoder;

import java.nio.charset.StandardCharsets;

/**
 * Netty编码器
 */
public class MessageEncoder extends MessageToByteEncoder<Message> {
    @Override
    protected void encode(ChannelHandlerContext channelHandlerContext, Message message, ByteBuf byteBuf) throws Exception {
        //byteBuf.writeInt(message.getOrderId());
        byteBuf.writeInt(message.getLength());
        byteBuf.writeBytes(message.getBody().getBytes(StandardCharsets.UTF_8));
    }
}
