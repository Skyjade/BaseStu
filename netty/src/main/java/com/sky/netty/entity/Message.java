package com.sky.netty.entity;

public class Message {
    private int length;
    private String body;
    private MsgType type;


    public MsgType getType() {
        return type;
    }

    public void setType(MsgType type) {
        this.type = type;
    }

    public enum  MsgType {
        PING,REPLY,ACK
    }
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
