package com.hexing.alarmsystem.webPub.event;

import com.hexing.alarmsystem.basic.jpa.model.AlarmContent;
import com.hexing.alarmsystem.webPub.WsPublisher;
import com.lmax.disruptor.EventHandler;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

@Component
public class WsPushEventConsumer implements EventHandler<WsPushEvent> {

    @Resource
    private WsPublisher wsPublisher;

    @Override
    public void onEvent(WsPushEvent wsPushEvent, long l, boolean b) throws Exception {
      //开始处理
        WsPushEvent.Action action = wsPushEvent.getAction();
        switch (action){
            case CONFIRM:  {wsPublisher.confirmBroadcast(wsPushEvent.getContent());break;}
            case CONTENT:  {wsPublisher.alarmBroadcast(wsPushEvent.getContent());break;}
            default:break;
        }

    }


}
