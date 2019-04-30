package com.sky.manager.controller;

import com.sky.common.entity.ModelResp;
import com.sky.manager.bean.AssestStatistics;
import com.sky.manager.service.AssestStatisticsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
@RestController
@RequestMapping(value = "/test",produces  = "application/json;charset=UTF-8")
@Api(tags="测试类",value="测试类")
public class TestController {

    @Autowired
    private AssestStatisticsService assestStatisticsService;

    @ApiOperation(value="【PC端】测试", notes="提交一根据xx，返回xx")
    @PostMapping(value = "/test/{id}")
    public ModelResp test(@PathVariable String id){
        ModelResp<AssestStatistics> resp = new ModelResp<>();
        AssestStatistics bean = assestStatisticsService.getOne(id);
        resp.setData(bean);
        return resp;
    }
}
