package com.sky.test.baseThing.concurrent;

import com.sky.test.baseThing.concurrent.TestExam.ExamStudent;
import com.sky.test.baseThing.concurrent.TestExam.ExamTerminator;
import com.sky.test.baseThing.concurrent.TestExam.Teacher;
import org.apache.commons.lang3.RandomUtils;
import org.junit.Test;

import java.util.Random;
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
        Message m1 = new Message(1, "test1-Ia", 8000);
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
            latch.await(50,TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }


    }
//    java中声明一个静态变量，意味着只有一个副本，无论创建了多少个类的对象，即使没有创建对象，变量也可以访问，
//    但是线程可能具有本地缓存的值。 当变量volatile而不是静态时，每个object都有一个变量，所以，表面看来，
//    与正常变量没有区别，但是与静态完全不同。然而，即使使用object字段，线程也可能在本地缓存变量值。
//    这意味着如果两个线程同时更新同一个对象的变量，并且该变量未被声明为volatile，
//    则可能存在一个线程在缓存中具有旧值的情况。 即使你通过多个线程访问静态值，每个线程都可以具有本地缓存副本，为
//    了避免这种情况，可以将变量申明为静态volatile，这将强制线程每次读取全局值，但是volatile并不能代替正确的同步！

    public static volatile int subitNUM=0;
    public static volatile int subitByTeacherNUM=0;
    /**
     * 模拟exam场景
     */
    @Test
    public void testExam(){
        //
        DelayQueue<ExamStudent> studentDelayQueue = new DelayQueue<>();
        CountDownLatch countDownLatch=new CountDownLatch(51);
        ExecutorService pool = Executors.newCachedThreadPool();
        // pool.execute(new Teacher());
        for (int i=1;i<=50;i++){
            //放置生产者
            studentDelayQueue.put(
                    new ExamStudent("stu"+i,
                    10+ RandomUtils.nextInt(0,40),
                    countDownLatch));

        }
        //放置终结者-->终结消费者
        studentDelayQueue.put(new ExamTerminator(countDownLatch,pool,studentDelayQueue));

        //消费者
        Teacher teacher = new Teacher(studentDelayQueue);
        //开始执行exam
        pool.execute(teacher);
        try {
            //wait.....
            countDownLatch.await();
            //结束
            System.out.println("自动提交人数："+subitNUM);
            System.out.println("被动提交人数："+subitByTeacherNUM);
            //countDownLatch.countDown();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    /**
     * /**
     * 一、线程池：提供了一个线程队列，队列中保存着所有等待状态的线程。避免了创建与销毁额外的开销，提高了响应速度。
     * 二、线程池的体系结构：
     *    java.util.concurrent.Executor:负责线程的使用与调度的根接口
     *       |-- ExecutorService 子接口：线程池的主要接口
     *          |-- ThreadPoolExecutor 线程池的实现类
     *          |-- ScheduledExecutorService 子接口：负责线程的调度
     *             |--ScheduledThreadPoolExecutor：继承了ThreadPoolExecutor实现了ScheduledExecutorService
     * <p>
     * 三、工具类：Executors
     * ExecutorService newFixedThreadPool():创新固定大小的线程池、
     * ExecutorService newCacheThreadPool():缓存线程池，线程池的数量不固定，可以根据需求自动的而更改数量。
     * ExecutorService newSingleThreadExecutor():创建单个线程池，线程池中只有一个线程
     * <p>
     * ScheduledExecutorService newScheduledThreadPool():创建固定大小的线程，可以延迟或定时执行任务。
     */
    @Test
    public void astest1() throws Exception{
        ScheduledExecutorService pool = Executors.newScheduledThreadPool(5);
        for (int i = 0; i < 5; i++) {
             pool.schedule(() -> {
                 int num = new Random().nextInt(100);//生成随机数
                 System.out.println(Thread.currentThread().getName() + " : " + num);
                // return num;
             }, 0, TimeUnit.SECONDS);
            Thread.sleep(2000);
         //   System.out.println(result.get());
        }
        pool.shutdown();
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}
