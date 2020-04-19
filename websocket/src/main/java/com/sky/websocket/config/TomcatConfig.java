package com.sky.websocket.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.AbstractServletWebServerFactory;
import org.springframework.context.annotation.Bean;

import java.io.File;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class TomcatConfig {

    @Value("${bw.factory.doc.root}")
    private String rootDoc;
    @Bean
    public AbstractServletWebServerFactory embeddedServletContainerFactory() {

        TomcatServletWebServerFactory tomcatServletWebServerFactory = new TomcatServletWebServerFactory();
        tomcatServletWebServerFactory.setDocumentRoot(
                new File(rootDoc));
        return  tomcatServletWebServerFactory;
    }
}
