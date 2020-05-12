package com.sky.concurrency.event;

import com.lmax.disruptor.RingBuffer;
import com.lmax.disruptor.dsl.Disruptor;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;

@Component
public class WsPushEventProducer {

    @Resource(name = "wsPushEventDisruptor")
    private Disruptor<WsPushEvent>  wsPushEventDisruptor;


    private void send(Object content,WsPushEvent.Action action){
        RingBuffer<WsPushEvent> ringBuffer =wsPushEventDisruptor.getRingBuffer();
        long next = ringBuffer.next();
        try{
            WsPushEvent event = ringBuffer.get(next);
            event.setContent(content);
            event.setAction(action);
        }finally {
            ringBuffer.publish(next);
        }
    }

    public void send(List<Object> dataList, WsPushEvent.Action action){
        dataList.forEach(s->send(s,action));
    }
}
