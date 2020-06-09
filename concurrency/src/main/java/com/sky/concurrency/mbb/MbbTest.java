package com.sky.concurrency.mbb;

import org.junit.Test;

/**
 * @Author wangtq
 * @Description 测试
 * @Date
 **/
public class MbbTest {

    @Test
    public void test1(){
        try {
            SharedMemoryMapFile sharedMemoryMapFile = new SharedMemoryMapFile("D:/Test/testSharedMemJava.txt", 10000);

            sharedMemoryMapFile.putByte(1, (byte)1);
            sharedMemoryMapFile.putByte(2, (byte)3);
            sharedMemoryMapFile.putByte(3, (byte)2);
            System.out.println(sharedMemoryMapFile.getByte(1));
            System.out.println(sharedMemoryMapFile.getByte(2));
            System.out.println(sharedMemoryMapFile.getByte(3));
            System.out.println(sharedMemoryMapFile.getByte(4));

            System.out.println(sharedMemoryMapFile.getByte(11));
            System.out.println(sharedMemoryMapFile.getByte(12));
            System.out.println(sharedMemoryMapFile.getByte(13));
            System.out.println(sharedMemoryMapFile.getByte(14));

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
