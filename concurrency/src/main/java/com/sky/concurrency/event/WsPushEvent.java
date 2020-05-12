package com.sky.concurrency.event;

import com.lmax.disruptor.EventFactory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WsPushEvent <T>{
    private T content;
    private Action action;
    public static final EventFactory<WsPushEvent> FACTORY = WsPushEvent::new;

    public enum Action{
        CONTENT,CONFIRM
    }
}
