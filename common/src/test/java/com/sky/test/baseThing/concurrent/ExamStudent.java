package com.sky.test.baseThing.concurrent;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class ExamStudent implements Runnable,Delayed {
    //名称
    private String name;
    //是否强制
    private boolean force;
    //完成时间
    private Long workTime;
    //提交时间
    private Long submitTime;
    private CountDownLatch countDownLatch;
    public ExamStudent(String name,long workTime,CountDownLatch countDownLatch){
        this.name = name;
        this.workTime = workTime;
        this.submitTime = TimeUnit.NANOSECONDS.convert(workTime, TimeUnit.NANOSECONDS)+System.nanoTime();
        this.countDownLatch = countDownLatch;
    }
    /**
     * 延迟任务是否到时就是按照这个方法判断如果返回的是负数则说明到期否则还没到期
     */
    @Override
    public long getDelay(TimeUnit unit) {
        return unit.convert(this.submitTime - System.nanoTime(), TimeUnit.NANOSECONDS);
    }

    @Override
    public int compareTo(Delayed o) {
        // TODO Auto-generated method stub
        if(o == null || ! (o instanceof ExamStudent)) return 1;
        if(o == this) return 0;
        ExamStudent s = (ExamStudent)o;
        if (this.workTime > s.workTime) {
            return 1;
        }else if (this.workTime == s.workTime) {
            return 0;
        }else {
            return -1;
        }
    }

    @Override
    public void run() {
        if (force){
            System.out.println(name+" 完成，希望用时"+workTime+" 分钟，实际用时：120分钟");
        }else{
            System.out.println(name+" 完成，希望用时"+workTime+" 分钟，实际用时："+workTime+"分钟");
        }
        countDownLatch.countDown();
    }
}
