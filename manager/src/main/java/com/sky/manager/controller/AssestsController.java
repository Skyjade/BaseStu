package com.sky.manager.controller;

import com.sky.common.constant.MsgInfo;
import com.sky.common.entity.CommonResp;
import com.sky.common.entity.ListDataResp;
import com.sky.common.entity.ModelResp;
import com.sky.common.entity.PageQuery;
import com.sky.common.utils.str.UUIDUtils;
import com.sky.manager.bean.AssestStatistics;
import com.sky.manager.service.AssestStatisticsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
@RestController
@RequestMapping(value = "/assestStatistics",produces  = "application/json;charset=UTF-8")
@Api(tags="资产管理类",value="资产管理类")
@Slf4j
public class AssestsController {

    @Autowired
    private AssestStatisticsService assestStatisticsService;

    @ApiOperation(value="获取单个信息", notes="提交一根据id，返回资产信息")
    @GetMapping(value = "/statisitcs/{id}")
    public ModelResp<AssestStatistics> getStatisitcs(@PathVariable String id){
        ModelResp<AssestStatistics> resp = new ModelResp<>();
        AssestStatistics bean = assestStatisticsService.getOne(id);
        resp.setData(bean);
        return resp;
    }

    @ApiOperation(value="获取集合信息", notes="提交一根据条件，返回资产信息集合")
    @PostMapping(value = "/statisitcs/list")
    public ListDataResp<AssestStatistics> getStatisitcsList(@RequestBody PageQuery<AssestStatistics> query){
        //参数校验
        //返回结果
        log.info("开始查询集合...");
        return assestStatisticsService.getStatisticsList(query);
    }

    @ApiOperation(value="修改单个信息", notes="提交一根据内容，修改资产信息")
    @PutMapping(value = "/statisitcs")
    public CommonResp updStatisitcs(@RequestBody AssestStatistics asset){
        handleAddOrUpdData(asset);
        CommonResp resp = new CommonResp();
        asset.setUpdateTime(new Date());
        assestStatisticsService.update(asset);
        resp.setMsgCode(MsgInfo.SUC);
        resp.setMessage(MsgInfo.OPERATE_SUC);
        return resp;
    }

    @ApiOperation(value="删除单个信息", notes="提交一根据内容，删除资产信息")
    @DeleteMapping(value = "/statisitcs/{id}")
    public CommonResp delStatisitcs(@RequestBody String id){
        CommonResp resp = new CommonResp();
        assestStatisticsService.delete(id);
        resp.setMsgCode(MsgInfo.SUC);
        resp.setMessage(MsgInfo.OPERATE_SUC);
        return resp;
    }


    @ApiOperation(value="新增单个信息", notes="提交一根据内容，新增资产信息")
    @PostMapping(value = "/statisitcs")
    public CommonResp addStatisitcs(@RequestBody AssestStatistics asset){
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
}
