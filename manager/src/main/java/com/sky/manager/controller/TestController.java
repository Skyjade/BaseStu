package com.sky.manager.controller;

import com.sky.common.constant.MsgInfo;
import com.sky.common.entity.CommonResp;
import com.sky.common.entity.PageQuery;
import com.sky.manager.bean.AssestStatistics;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    private volatile int num=1;

    @ApiOperation(value="测试并发", notes="test...")
    @PostMapping(value = "/test1")
    public  CommonResp getStatisitcsList(@RequestBody PageQuery<AssestStatistics> query){
        CommonResp resp = new CommonResp();
        log.info("测试开始...");
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        num+=1;
        log.info("结果："+String.valueOf(num));
        resp.setMsgCode(MsgInfo.SUC);
        resp.setMessage(MsgInfo.OPERATE_SUC);
        return resp;
    }

}
