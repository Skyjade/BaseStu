package com.sky.test.baseThing.concurrent;

import org.junit.Test;

import java.util.concurrent.CountDownLatch;

public class VolatileTest {

    public static volatile int race = 0;

    private static final int THREADS_COUNT = 20;

    private static final CountDownLatch countDownLatch = new CountDownLatch(THREADS_COUNT);

    public synchronized static void increase() {
        race++;
    }

    public static void main(String[] args) throws InterruptedException {
//        Thread[] threads = new Thread[THREADS_COUNT];
        for (int i = 0; i < THREADS_COUNT; i++) {
//            threads[i] = new Thread(() -> {
            for (int i1 = 0; i1 < 10000; i1++) {
                increase();
            }
            countDownLatch.countDown();
//            });
//            threads[i].start();
        }

    }

    @Test
    public void test() {

    }
}
