package com.sky.websocket.rest.demo1;

import com.sky.websocket.model.Greeting;
import com.sky.websocket.model.HelloMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Description:
 * Author: 杰明Jamin
 * Date: 2017/11/4 11:49
 */
@RestController
public class GreetingController {

    /*
     * 使用restful风格
     */
    @MessageMapping("/demo1/hello/{typeId}")
    @SendTo("/topic/demo1/greetings")
    public Greeting greeting(@DestinationVariable Integer typeId, HelloMessage message, @Headers Map<String, Object> headers) throws Exception {
        return new Greeting(headers.get("simpSessionId").toString(), typeId + "---" + message.getMessage());
    }

    /*
     * 这里没用@SendTo注解指明消息目标接收者，消息将默认通过@SendTo("/topic/twoWays")交给Broker进行处理
     * 不推荐不使用@SendTo注解指明目标接受者
     */
    @MessageMapping("/demo1/twoWays")
    public Greeting twoWays(HelloMessage message) {
        return new Greeting("这是没有指明目标接受者的消息:", message.getMessage());
    }

}
