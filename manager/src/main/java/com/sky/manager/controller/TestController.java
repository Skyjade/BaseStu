package com.sky.manager.controller;

import com.sky.common.constant.MsgInfo;
import com.sky.common.entity.CommonResp;
import com.sky.common.utils.str.UUIDUtils;
import com.sky.manager.bean.DoubtPointInfo;
import com.sky.manager.other.queue.PsnQueue;
import com.sky.manager.service.TestService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
@RestController
@RequestMapping(value="test",produces  = "application/json;charset=UTF-8")
@Api(tags="测试类",value="测试类")
@Slf4j
public class TestController {



    @Autowired
    private TestService testService;

    @ApiOperation(value="测试异步执行", notes="test...")
    @PostMapping(value = "/testAsync")
    public  CommonResp testAsync(){
        CommonResp resp = new CommonResp();
        //测试异步调用
        //testService.testAsync();
        try {
            //阻塞调用
            //testService.testAsyncResult().get();
            //限时调用
            String result = testService.testAsyncResult().get(2, TimeUnit.SECONDS);
        } catch (Exception e) {
            //e.printStackTrace();
        }
        resp.setMsgCode(MsgInfo.SUC);
        resp.setMessage(MsgInfo.OPERATE_SUC);
        return resp;
    }


    @ApiOperation(value="模拟往队列添加待告警数据", notes="test...")
    @PostMapping(value = "/testPutDataToQueue")
    public  CommonResp testPutDataToQueue() throws Exception{
        CommonResp resp = new CommonResp();
        DoubtPointInfo info = new DoubtPointInfo();
        info.setKey(UUIDUtils.getUUID());
        PsnQueue.putDoubtData(info);
        resp.setMsgCode(MsgInfo.SUC);
        resp.setMessage(MsgInfo.OPERATE_SUC);
        return resp;
    }
}
