package com.sky.manager.bean;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public  class Duck {
    private String name;
    private String age;
    FlyBehavior flyBehavior;


    public void peformFly(){
       flyBehavior.fly();
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public FlyBehavior getFlyBehavior() {
        return flyBehavior;
    }

    public void setFlyBehavior(FlyBehavior flyBehavior) {
        this.flyBehavior = flyBehavior;
    }
}
