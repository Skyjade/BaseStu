package com.sky.manager.bean;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class FlyNoWay implements FlyBehavior {
    @Override
    public void fly() {
        System.out.println("can not fly");
    }

}
