package com.sky.manager.app;

import com.sky.manager.bean.DoubtPointInfo;
import com.sky.manager.other.queue.PsnQueue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * @Author wangtq
 * @Description 初始化观察者
 * @Date
 **/
@Component
@Slf4j
public class InitWatcher {

    @Autowired
    private TaskExecutor taskExecutor;

    @PostConstruct
    public void init(){
        taskExecutor.execute(() -> {
            log.info("初始化开始监听任务");
            for(;;){
                try {
                    DoubtPointInfo take = PsnQueue.fetchDoubtData();
                    log.info("获取到消费数据,ID:[{}]",take.getKey());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

    }
}
