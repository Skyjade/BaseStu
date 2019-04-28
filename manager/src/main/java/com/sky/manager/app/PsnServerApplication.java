package com.sky.manager.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(
        exclude={DataSourceAutoConfiguration.class, HibernateJpaAutoConfiguration.class})//(scanBasePackages = "com.sky")
@ComponentScan(basePackages = {"com.sky.manager"})
public class PsnServerApplication extends SpringBootServletInitializer {


  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    return application.sources(PsnServerApplication.class);
  }


  public static void main(String[] args) {
    SpringApplication.run(PsnServerApplication.class, args);
  }


}
