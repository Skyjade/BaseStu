package com.sky.test.baseThing.event;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

@Setter
@Getter
public class Event extends ApplicationEvent {
    private String msg;


    public Event(Object source, String msg) {
        super(source);
        this.msg =msg;
    }
}
