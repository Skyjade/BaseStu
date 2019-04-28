package com.sky.manager.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
@RestController
@RequestMapping(value = "/test",produces  = "application/json;charset=UTF-8")
@Api(tags="测试类",value="测试类")
public class TestController {
    @ApiOperation(value="【PC端】测试", notes="提交一根据xx，返回xx")
    @PostMapping(value = "/test/{id}")
    public Integer test(@PathVariable Integer id){
        System.out.println(id);
        return id;
    }
}
