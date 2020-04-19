package com.sky;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication//(scanBasePackages = "com.sky")
public class WebServerApplication extends SpringBootServletInitializer {




  public static void main(String[] args) {
    SpringApplication.run(WebServerApplication.class, args);
  }


}
