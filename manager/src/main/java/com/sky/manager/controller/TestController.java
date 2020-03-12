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

import java.io.File;
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


    public static void main(String[] args) {

        //要改的文件夹路径
        String path= "E:\\电视剧\\sport siwmer";

        getNew(path);

    }
    private static void getNew(String path) {
        String mkvpath= "E:\\电视剧\\mkv3";
        File file = new File(path);
        //得到文件夹下的所有文件和文件夹
        String[] list = file.list();

        if(list!=null && list.length>0){
            for (String oldName : list) {
                File oldFile = new File(path,oldName);
                //判断出文件和文件夹
                if(!oldFile.isDirectory()){
                    //文件则判断是不是要修改的
                    if(oldName.contains("copy")){
//                        System.out.println(oldName);
//                        String newoldName = oldName.substring(0, oldName.lastIndexOf("."))+"copy.mp4";
//                        System.out.println(newoldName);
//                        File newFile = new File(mkvpath,newoldName);
//                        boolean flag = oldFile.renameTo(newFile);
//                        System.out.println(flag);
                        file.delete();
                    }
                }else{
                    //文件夹则迭代
                    String newpath=path+"/"+oldName;
                    getNew(newpath);
                }
            }
        }
    }

}
