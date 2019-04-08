package com.sky.test.baseThing;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class Student {
    String name;
    int age;
    //第一次用到本类
    static{
        System.out.println("------------");
    }

    public static void sleep() {

        System.out.println("静态执行");
    }
}
