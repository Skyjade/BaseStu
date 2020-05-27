package com.sky.nettyClient.handler;


import com.sky.nettyBase.entity.Message;
import com.sky.nettyClient.utils.NettyClientSendMessageEvent;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.timeout.IdleStateEvent;

import java.util.Date;


/**
 * Netty进站处理器
 * 描述：处理进站数据和所有状态更改事件
 */
public class NettyClientBusinessHandler extends ChannelInboundHandlerAdapter {

    private int UNCONNECT_NUM = 0;//连接失败计数

    /**
     * 当前channel激活的时候
     * @param ctx
     * @throws Exception
     */
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        NettyClientSendMessageEvent.setChannelHandlerContext(ctx);
    }

    /**
     * 当前channel从远端读取到数据
     * @param ctx
     * @param msg
     * @throws Exception
     */
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
            Message message = (Message) msg;
            System.out.println(message.getBody());
    }

    /**
     * 当前channel不活跃的时候，也就是当前channel到了它生命周期末期
     * @param ctx
     * @throws Exception
     */
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        super.channelInactive(ctx);
    }


    /**
     * 异常捕获
     * @param ctx
     * @param cause
     */
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        ctx.close();
    }

    /**
     * 用户事件触发
     * 1.WRITER_IDLE: 发送心跳
     * 2.READ_IDLE :
     * @param ctx
     * @param evt
     * @throws Exception
     */
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if (IdleStateEvent.class.isAssignableFrom(evt.getClass())) {
            if(UNCONNECT_NUM >= 4) {
                //此处当重启次数达到4次之后，关闭此链接后，并重新请求进行一次登录请求
                System.err.println("connect status is disconnect.");
                ctx.close();
                return;
            }
            IdleStateEvent event= (IdleStateEvent) evt;
            switch (event.state()) {
                case WRITER_IDLE:
                    System.out.println("send ping to server---date=" + new Date());
                    ctx.channel().writeAndFlush(new Message("t3st"));
                    break;
                case READER_IDLE:
                    System.err.println("reader_idle over.");
                    //读取服务端消息超时时，直接断开该链接，并重新登录请求，建立通道
                    ctx.channel().writeAndFlush(new Message("t3st"));
                case ALL_IDLE:
                    System.err.println("all_idle over.");
                    ctx.channel().writeAndFlush(new Message("t3st"));
                default:
                    break;
            }
        }
      super.userEventTriggered(ctx, evt);
    }

}


