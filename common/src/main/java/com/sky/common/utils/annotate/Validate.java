package com.sky.common.utils.annotate;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @Author wangtq
 * @Description 通过注解来组装查询条件，生成查询语句
 * @Date 2019/06/11
 **/
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Validate {
    int id();
    String description() default "no description";
}
