package com.sky.test.baseThing.concurrent.TestExam;

import java.util.concurrent.DelayQueue;

/**
 * @Author wangtq
 * @Description 教师->消费者
 * @Date
 **/
public class Teacher implements Runnable {
    private DelayQueue<ExamStudent>delayQueue;

    public Teacher(DelayQueue<ExamStudent> delayQueue) {
        this.delayQueue = delayQueue;
    }

    @Override
    public void run() {
        while(true){
            try {
                if(!Thread.interrupted()){
                    ExamStudent stu = delayQueue.take();
                    stu.submitPaper();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
