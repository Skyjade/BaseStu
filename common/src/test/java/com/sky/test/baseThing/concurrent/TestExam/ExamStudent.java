package com.sky.test.baseThing.concurrent.TestExam;

import com.sky.test.baseThing.concurrent.ConcurrentTest;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class ExamStudent implements Delayed {
    //名称
    private String name;
    //是否强制
    private boolean force;
    //完成时间
    private Long workTime;
    private Long submitTime;
    private CountDownLatch countDownLatch;
    public ExamStudent(String name,long delayTime,CountDownLatch countDownLatch){
        this.name = name;
        this.submitTime = TimeUnit.NANOSECONDS.convert(delayTime, TimeUnit.SECONDS)+System.nanoTime();
        this.workTime=delayTime;
        this.countDownLatch = countDownLatch;
    }

    public ExamStudent() {
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

    public void submitPaper(){

        if (force){
            ConcurrentTest.subitByTeacherNUM+=1;
            System.out.println(name+" 完成，希望用时"+workTime+" 秒，实际用时：40秒"+" ，被动提交提交人数："+ConcurrentTest.subitByTeacherNUM);
        }else{
            ConcurrentTest.subitNUM+=1;
            System.out.println(name+" 完成，希望用时"+workTime+" 秒，实际用时："+workTime+"秒"+" ，主动提交人数："+ConcurrentTest.subitNUM);
        }
        countDownLatch.countDown();
    }

    public String getName() {
        return name;
    }

    public Long getSubmitTime() {
        return submitTime;
    }

    public void setSubmitTime(Long submitTime) {
        this.submitTime = submitTime;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isForce() {
        return force;
    }

    public void setForce(boolean force) {
        this.force = force;
    }

    public Long getWorkTime() {
        return workTime;
    }

    public void setWorkTime(Long workTime) {
        this.workTime = workTime;
    }

    public CountDownLatch getCountDownLatch() {
        return countDownLatch;
    }

    public void setCountDownLatch(CountDownLatch countDownLatch) {
        this.countDownLatch = countDownLatch;
    }
}
