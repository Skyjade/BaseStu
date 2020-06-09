package com.sky.concurrency.mbbNew;

import com.alibaba.fastjson.JSONObject;

import java.nio.charset.StandardCharsets;

public class MbbNewTest {
    public static void main(String arsg[]) throws Exception{
        try {
            ShareMemory sm = new ShareMemory("d:/test/TEST","22222");
            JSONObject json = new JSONObject();
            json.put("name","testname");
            json.put("age",18);
            String str = json.toJSONString();
            System.out.println(str);
            System.out.println(str.length());
            sm.write(5, 28, str.getBytes(StandardCharsets.UTF_8));
            byte[] b = new byte[50000000];
            sm.read(5, 28, b);
            String jsonStr = new String(b, StandardCharsets.UTF_8).trim();
            System.out.println(jsonStr);
            JSONObject jsonObject = (JSONObject) JSONObject.parse(jsonStr);
            String name = jsonObject.getString("name");
            Integer age = jsonObject.getInteger("age");
            System.out.println("name : " + name + " age : " + age);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
