package com.sky.test.baseThing.concurrent;

import org.junit.Test;

import java.util.concurrent.*;

/**
 * @Author wangtq
 * @Description Java并发编程
 * @Date 2019/06/11
 **/
public class ConcurrentTest {
    /**
     * ReentrantLock是一个可重入且独占式的锁，它具有与使用synchronized监视器锁相同的基本行为
     * 和语义，但与synchronized关键字相比，它更灵活、更强大，增加了轮询、超时,中断等功能
     * ReentrantLock，顾名思义，它是支持可重入锁的锁，是一种递归无阻塞的同步机制。
     * 除此之外，该锁还支持获取锁时的公平和非公平选择。
     ---------------------
     作者：DivineH
     来源：CSDN
     原文：https://blog.csdn.net/qq_38293564/article/details/80515718
     */
    @Test
    public void testReentrantLock(){

        //TODO

    }


    /**
     * 使用场景：
     确保某个计算在其需要的所有资源都被初始化之后才继续执行。
     确保某个服务在其依赖的所有其他服务都已启动后才启动。
     等待知道某个操作的所有者都就绪在继续执行。
     */
    @Test
    public void testCountDownLatch(){
        final CountDownLatch latch=new CountDownLatch(10);
        final CountDownLatch begin=new CountDownLatch(1);
        for(int i=1;i<=10;i++){
              new Thread(() -> {
                  try {
                      begin.await();
                      System.out.println("线程"+Thread.currentThread().getId()+" 开始出发");
                      TimeUnit.SECONDS.sleep(5);
                  } catch (InterruptedException e) {
                      e.printStackTrace();
                  }
                  System.out.println("线程"+Thread.currentThread().getId()+" 结束");
                  latch.countDown();
              }).start();
        }
        try {
            System.out.println("2秒后开始");
            TimeUnit.SECONDS.sleep(2);
            begin.countDown();
            latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("10个线程全部结束");
    }

    /**
     * TODO 超过一定时间仍然在某个数值以上则告警
     * DelayQueue类的主要作用：是一个无界的BlockingQueue，用于放置实现了Delayed接口的对象，其
     * 中的对象只能在其到期时才能从队列中取走。这种队列是有序的，即队头对象的延迟到期时间最长
     * 注意：不能将null元素放置到这种队列中。Delayed，一种混合风格的接口，用来标记那些应该在
     * 给定延迟时间之后执行的对象。此接口的实现必须定义一个 compareTo 方法，该方法提供与此接
     * 口的 getDelay 方法一致的排序。
     */
    public static CountDownLatch latch = new CountDownLatch(2);
    @Test
    public void test1(){
        //实现思路 1.延迟队列 2.定时器 3.quartz轮询

        //方式1
        // 创建延时队列
        DelayQueue<Message> queue = new DelayQueue<Message>();
        // 添加延时消息,m1 延时3s
        Message m1 = new Message(1, "test1-Ia", 3000);
        // 添加延时消息,m2 延时10s
        Message m2 = new Message(2, "test1-Ib", 3000);
        //将延时消息放到延时队列中
        queue.offer(m2);
        queue.offer(m1);
        // 启动消费线程 消费添加到延时队列中的消息，前提是任务到了延期时间
        ExecutorService exec = Executors.newFixedThreadPool(1);
        exec.execute(new Consumer(queue));
        exec.shutdown();
        try {
            latch.await(5,TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }


    }

}
