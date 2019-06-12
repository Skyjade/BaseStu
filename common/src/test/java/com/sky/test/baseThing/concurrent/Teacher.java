package com.sky.test.baseThing.concurrent;

import java.util.concurrent.DelayQueue;

/**
 * @Author wangtq
 * @Description
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

                delayQueue.take().run();

            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
