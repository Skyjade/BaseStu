package com.sky.test.baseThing.lamda;

import org.junit.Test;

/**
 * @Author wangtq
 * @Description lamda测试
 * @Date
 **/
public class LambdaTestSon extends LambdaTest {

     @Override
     public void save(){
        super.save();
     }

     @Test
     public void test1(){
          save();
     }
}
