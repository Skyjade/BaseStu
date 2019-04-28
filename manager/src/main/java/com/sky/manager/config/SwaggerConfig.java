package com.sky.manager.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.Parameter;
import springfox.documentation.service.VendorExtension;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * @Author wangtq
 * @Description swagger配置
 * @Date 2019/04/28
 **/
@Configuration
@EnableSwagger2
public class SwaggerConfig implements WebMvcConfigurer {

    @Bean
    public Docket customDocket() {
        ParameterBuilder ticketPar = new ParameterBuilder();
        List<Parameter> pars = new ArrayList();
        ticketPar.name("Authorization").description("Token  start with [Bearer ] ").modelRef(new ModelRef("string")).parameterType("header").required(false).build();
        pars.add(ticketPar.build());
        return new Docket(DocumentationType.SWAGGER_2) .apiInfo(apiInfo()) .select() .apis(RequestHandlerSelectors.basePackage("com.sky")) .paths(PathSelectors.any()) .build();
    }
    private ApiInfo apiInfo() {
        Contact contact = new Contact(" GitHub地址 ", "https://github.com/Skyjade", "1351158315@qq.com");
        Collection<VendorExtension> s = new ArrayList();
        return new ApiInfo("Sky Restful API", "", "1.0", "", contact, "", "", s);
    }

}
