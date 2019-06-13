package com.sky.test.baseThing.concurrent.TestExam;

import java.util.Iterator;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.DelayQueue;
import java.util.concurrent.ExecutorService;

/**
 * @Author wangtq
 * @Description 终结者
 * @Date
 **/
public class ExamTerminator extends ExamStudent {
    private ExecutorService pool;
    private CountDownLatch countDownLatch;
    private DelayQueue<ExamStudent>delayQueue;

    public ExamTerminator(CountDownLatch countDownLatch, ExecutorService pool,DelayQueue delayQueue) {
        super("终结者", 40, countDownLatch);
        this.pool = pool;
        this.countDownLatch = countDownLatch;
        this.delayQueue=delayQueue;
    }

    @Override
    public void submitPaper(){
        this.pool.shutdownNow();
        Iterator<ExamStudent> iterator = delayQueue.iterator();
        while(iterator.hasNext()){
            ExamStudent stu = iterator.next();
            if(stu.getWorkTime()>40){
                stu.setForce(true);
                stu.submitPaper();
            }
        }
        countDownLatch.countDown();
    }
}
