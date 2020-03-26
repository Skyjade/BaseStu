package com.sky.manager.controller;

import com.sky.common.constant.MsgInfo;
import com.sky.common.entity.ListDataResp;
import com.sky.manager.service.TestService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
@RestController
@RequestMapping(value="test",produces  = "application/json;charset=UTF-8")
@Api(tags="天气",value="天气")
@Slf4j
public class WeatherController {



    @Autowired
    private TestService testService;


    @ApiOperation(value="wea", notes="test...")
    @PostMapping(value = "/wea")
    public ListDataResp wea() throws Exception{
        ListDataResp resp = new ListDataResp();
        resp.setMsgCode(MsgInfo.SUC);
        resp.setMessage(MsgInfo.OPERATE_SUC);
        return resp;
    }



}
