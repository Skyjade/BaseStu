package com.sky.manager.bean.async;

import static com.sky.manager.bean.async.ControlFactory.countDownLatchMap;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class CallBackHandler {

    /**
     * JNI 接收数据回调
     */
    void jniReceiveCallback(String key, String data) {
        //接收到数据后，通过闭锁释放阻塞的线程，同时设置结果返回给调用者
        CountDownObj countDownObj=countDownLatchMap.get(key);
        if(countDownObj!=null) {
            countDownObj.setValue(data);
            countDownObj.getCountDownLatch().countDown();
        }

    }
}
