package com.sky.manager.controller;

import com.sky.common.entity.ModelResp;
import com.sky.manager.service.TestService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping(value = "/getWeatherData/{city}")
    @ApiOperation(value="获取天气信息", notes="``")
    public ModelResp<Object> getWeatherData(@PathVariable String city) {
        return testService.getWeaData(city);
    }


}
