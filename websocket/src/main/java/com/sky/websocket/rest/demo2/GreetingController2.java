package com.sky.websocket.rest.demo2;

import com.sky.websocket.login.Authentication;
import com.sky.websocket.model.Greeting;
import com.sky.websocket.model.HelloMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

/**
 * Description:
 * Author: 杰明Jamin
 * Date: 2017/11/4 11:49
 */
@RestController
public class GreetingController2 {

    @MessageMapping("/demo2/hello/{typeId}")
    @SendTo("/topic/demo2/greetings")
    public Greeting greeting(HelloMessage message, StompHeaderAccessor headerAccessor) throws Exception {

        Authentication user = (Authentication) headerAccessor.getUser();

        String sessionId = headerAccessor.getSessionId();

        return new Greeting(user.getName(), "sessionId: " + sessionId + ", message: " + message.getMessage());
    }

}
