package com.sky.nettyBase.entity;

import lombok.Builder;

public class Message {
    private int length;
    private String body;

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Message() {
    }
    public Message(String body) {
        this.length = body.getBytes().length;
        this.body = body;
    }

}
