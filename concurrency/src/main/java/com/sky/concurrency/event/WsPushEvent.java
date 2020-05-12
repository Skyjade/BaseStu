package com.hexing.alarmsystem.webPub.event;

import com.hexing.alarmsystem.basic.jpa.model.AlarmContent;
import com.lmax.disruptor.EventFactory;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WsPushEvent {
    private AlarmContent content;
    private Action action;
    public static final EventFactory<WsPushEvent> FACTORY = WsPushEvent::new;

    public enum Action{
        CONTENT,CONFIRM
    }
}
