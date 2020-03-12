package com.sky.manager.bean;

import org.junit.Test;

import java.math.BigDecimal;
import java.util.concurrent.*;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class test {
    public static void main(String[] args) {
        Duck duck = new BlackDuck();
        duck.peformFly();
        duck.setFlyBehavior(new FlyRocketPower());
        duck.peformFly();
    }


    @Test
    public void test1(){
        BigDecimal a = new BigDecimal (121.00);
        BigDecimal b = new BigDecimal (111.00);
        if(a.compareTo(b) == -1){
            System.out.println("a小于b");
        }

        if(a.compareTo(b) == 0){
            System.out.println("a等于b");
        }

        if(a.compareTo(b) > 0){
            System.out.println("a大于b");
        }

        if(a.compareTo(b) > -1){
            System.out.println("a大于等于b");
        }

        if(a.compareTo(b) < 1){
            System.out.println("a小于等于b");
        }
    }


    public static boolean checkMeaStatus(String checkSymbol,BigDecimal first,BigDecimal last){
        switch (checkSymbol){
            case "=":return  first.compareTo(last)==0;
            case "<":return first.compareTo(last) < 0;
            case "<=":return  first.compareTo(last)<1;
            case ">":return first.compareTo(last) > 0;
            case ">=":return  first.compareTo(last)>-1;
            default:return false;
        }
    }

    @Test
    public void dstest1(){
        System.out.println(checkMeaStatus(">=",new BigDecimal("1.31111111111112"),new BigDecimal("1.31111111111111")));
    }


    @Test
    public void stest1() throws ExecutionException, InterruptedException {
        //step1 ......
        //step2:创建计算任务
        Task task = new Task();
        //step3:创建线程池，将Callable类型的task提交给线程池执行，通过Future获取子任务的执行结果
        ExecutorService executorService = Executors.newCachedThreadPool();
        final Future<Boolean> future = executorService.submit(task);
        //step4：通过future获取执行结果
        TimeUnit.SECONDS.sleep(6);
        future.cancel(true);
       // boolean result = (boolean) future.get();
        //System.out.println(result);
    }

    //step1:封装一个计算任务，实现Callable接口
    class Task implements Callable<Boolean> {

        @Override
        public Boolean call() throws Exception {
            try {
                for (int i=0;i<10 &&!Thread.currentThread().isInterrupted();i++) {
                    System.out.println( "task......." + Thread.currentThread().getName() + "...i = " + i);
                    //模拟耗时操作
                    Thread.sleep(10000);
                }
            } catch (InterruptedException e) {
                System.out.println("is interrupted when calculating, will stop...");
                return false; // 注意这里如果不return的话，线程还会继续执行，所以任务超时后在这里处理结果然后返回
            }
            return true;
        }
    }
}
