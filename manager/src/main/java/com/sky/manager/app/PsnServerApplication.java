package com.sky.manager.app;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication//(scanBasePackages = "com.sky")
@MapperScan("com.sky.manager.dao")
@ComponentScan(basePackages = {"com.sky.manager.*"})
public class PsnServerApplication extends SpringBootServletInitializer {


  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    return application.sources(PsnServerApplication.class);
  }


  public static void main(String[] args) {
    SpringApplication.run(PsnServerApplication.class, args);
  }


}
