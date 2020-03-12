package com.sky.manager.bean;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class BlackDuck  extends Duck{


    public BlackDuck() {
        flyBehavior =  new FlyNoWay();
    }
}
