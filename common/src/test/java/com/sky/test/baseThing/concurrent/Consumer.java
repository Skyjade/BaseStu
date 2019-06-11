package com.sky.test.baseThing.concurrent;

import java.util.concurrent.DelayQueue;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class Consumer implements Runnable {
    // 延时队列 ,消费者从其中获取消息进行消费
    private DelayQueue<Message> delayQueue;

    public Consumer(DelayQueue<Message> delayQueue) {
        this.delayQueue = delayQueue;
    }

    @Override
    public void run() {
        while(true){
            try {
                Message take = delayQueue.take();
                System.out.println("消费ID： "+take.getId()+" 消息体："+take.getBody());
                System.out.println("根据id检测是否越界");
                ConcurrentTest.latch.countDown();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
