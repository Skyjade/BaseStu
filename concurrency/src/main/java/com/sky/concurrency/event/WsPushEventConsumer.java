package com.sky.concurrency.event;

import com.lmax.disruptor.EventHandler;
import org.springframework.stereotype.Component;

@Component
public class WsPushEventConsumer implements EventHandler<WsPushEvent> {


    @Override
    public void onEvent(WsPushEvent wsPushEvent, long l, boolean b) throws Exception {
      //开始处理
        WsPushEvent.Action action = wsPushEvent.getAction();
        switch (action){
//            case CONFIRM:  {wsPublisher.confirmBroadcast(wsPushEvent.getContent());break;}
//            case CONTENT:  {wsPublisher.alarmBroadcast(wsPushEvent.getContent());break;}
            default:break;
        }

    }


}
