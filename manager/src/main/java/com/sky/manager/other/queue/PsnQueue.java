package com.sky.manager.other.queue;

import com.sky.manager.bean.DoubtPointInfo;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * @Author wangtq
 * @Description psn服务缓存队列
 * @Date 2019/06/13
 **/
public class PsnQueue {
    // 告警监测缓存队列
    public static BlockingQueue<DoubtPointInfo> doubtQueue = new ArrayBlockingQueue<>(200);

    /**
     * 获取怀疑点数据
     * @return
     * @throws InterruptedException
     */
    public static DoubtPointInfo fetchDoubtData() throws InterruptedException {
        return doubtQueue.take();
    }

    /**
     * 向队列中放置怀疑点信息
     * @param doubtPointInfo
     * @throws InterruptedException
     */
    public static void putDoubtData(DoubtPointInfo doubtPointInfo) throws InterruptedException {
        doubtQueue.offer(doubtPointInfo,1, TimeUnit.SECONDS);
    }
}
