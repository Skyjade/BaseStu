package com.hexing.test.baseThing;

import org.apache.commons.lang3.RandomUtils;
import org.junit.Test;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class BlueRedQuestion {

    @Test
    public void testRedAndBlue(){
      List<String> list1 = new ArrayList<>();
      list1.add("红");list1.add("蓝");
      List<String> list2 = new ArrayList<>();
      list2.add("红");list2.add("红");
      List<String> list3 = new ArrayList<>();
      list3.add("蓝");list3.add("蓝");
      LinkedList< List<String>> linkedList = new LinkedList<>();
      linkedList.add(list1);
      linkedList.add(list2);
      linkedList.add(list3);
      int bluecount=0;
      int redcount=0;
      for(int i=0;i<=1000000;i++){
          //获取随机index 0-2（前闭后开）
          int index = RandomUtils.nextInt(0, 3);
          List<String> firstSelect = linkedList.get(index);
          int firtsindex = RandomUtils.nextInt(0, 2);
          String firstcolor = firstSelect.get(firtsindex);
          firstSelect.remove(firstcolor);
          if(firstcolor.equals("红")){
              String left = firstSelect.get(0);
              if(left.equals("红")){
                  redcount+=1;
              }else{
                  bluecount+=1;
              }
          }
          firstSelect.add(firstcolor);
      }

        int total=redcount+bluecount;
        double result=Double.valueOf(redcount)/Double.valueOf(total);
        System.out.println("第二个球是红球的概率为："+result);
    }
}
