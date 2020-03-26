package com.sky.manager.controller;

import com.google.common.collect.BiMap;
import com.google.common.collect.HashBiMap;
import com.sky.common.constant.MsgInfo;
import com.sky.common.entity.*;
import com.sky.common.utils.str.UUIDUtils;
import com.sky.manager.bean.AssestStatistics;
import com.sky.manager.service.AssestStatisticsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
@RestController
@RequestMapping(value="assestStatistics",produces  = "application/json;charset=UTF-8")
@Api(tags="FUND类",value="FUND类")
@Slf4j
public class AssestsController {

    @Autowired
    private AssestStatisticsService assestStatisticsService;

    @ApiOperation(value="获取单个信息", notes="提交一根据id，返回Fund信息")
    @GetMapping(value = "/{id}")
    public ModelResp<AssestStatistics> getStatisitcs(@PathVariable String id){
        ModelResp<AssestStatistics> resp = new ModelResp<>();
        AssestStatistics bean = assestStatisticsService.getOne(id);
        resp.setData(bean);
        return resp;
    }

    @ApiOperation(value="获取集合信息", notes="提交一根据条件，返回Fund信息集合")
    @PostMapping(value = "/list")
    public ListDataResp<AssestStatistics> getStatisitcsList(@RequestBody PageQuery<AssestStatistics> query){
        //参数校验
        //返回结果
        log.info("开始查询集合信息...");
        return assestStatisticsService.getStatisticsList(query);
    }

    @ApiOperation(value="修改单个信息", notes="提交一根据内容，修改Fund信息")
    @PutMapping(value = "")
    public CommonResp updStatisitcs(@RequestBody AssestStatistics asset){
        log.info("开始修改信息...");
        handleAddOrUpdData(asset);
        CommonResp resp = new CommonResp();
        asset.setUpdateTime(new Date());
        assestStatisticsService.update(asset);
        resp.setMsgCode(MsgInfo.SUC);
        resp.setMessage(MsgInfo.OPERATE_SUC);
        return resp;
    }

    @ApiOperation(value="删除单个信息", notes="提交一根据内容，删除Fund信息")
    @DeleteMapping(value = "/{id}")
    public CommonResp delStatisitcs(@RequestBody String id){
        log.info("开始删除单个信息...");
        CommonResp resp = new CommonResp();
        assestStatisticsService.delete(id);
        resp.setMsgCode(MsgInfo.SUC);
        resp.setMessage(MsgInfo.OPERATE_SUC);
        return resp;
    }

    @ApiOperation(value="批量删除信息", notes="提交一根据内容，删除Fund信息")
    @DeleteMapping(value = "/batchRemove")
    public CommonResp delStatisitcsBatch(@RequestBody BatchIdResult ids){
        log.info("开始批量删除信息...");
        CommonResp resp = new CommonResp();
        assestStatisticsService.deleteBatchByKeys(ids.getResult());
        resp.setMsgCode(MsgInfo.SUC);
        resp.setMessage(MsgInfo.OPERATE_SUC);
        return resp;
    }

    @ApiOperation(value="新增单个信息", notes="提交一根据内容，新增Fund信息")
    @PostMapping(value = "")
    public CommonResp addStatisitcs(@RequestBody AssestStatistics asset){
        log.info("开始新增单个信息...");
        handleAddOrUpdData(asset);
        CommonResp resp = new CommonResp();
        asset.setId(UUIDUtils.getUUID());
        asset.setCreateTime(new Date());
        asset.setUpdateTime(new Date());
        assestStatisticsService.add(asset);
        resp.setMsgCode(MsgInfo.SUC);
        resp.setMessage(MsgInfo.OPERATE_SUC);
        return resp;
    }

    /**
     * 处理新增、修改参数
     * @param asset
     */
    private void handleAddOrUpdData(AssestStatistics asset) {
        asset.setTotal(asset.getWx()+asset.getYhk()+asset.getZfb());
    }

    @Test
    public void test1(){
        BiMap<String,String> britishToAmerican = HashBiMap.create();
// Initialise and use just like a normal map
        britishToAmerican.put("aubergine","egglant");
        britishToAmerican.put("courgette","zucchini");
        britishToAmerican.put("jam","jelly");
        String content = britishToAmerican.get("jam");

        BiMap<String, String> inverse = britishToAmerican.inverse();
        System.out.println(inverse.get("jelly"));
    }
}
