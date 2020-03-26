package com.sky.manager.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.sky.common.constant.MsgInfo;
import com.sky.common.entity.ModelResp;
import com.sky.manager.service.TestService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.Proxy;
import java.net.URL;
import java.net.URLConnection;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
@Service
@Slf4j
public class TestServiceImpl implements TestService {


    @Override
    public ModelResp getWeaData(String city) {
        RequestAttributes ra = RequestContextHolder.getRequestAttributes();
        ServletRequestAttributes sra = (ServletRequestAttributes) ra;
        HttpServletRequest request = sra.getRequest();
        ModelResp<Object> responseInfo = new ModelResp<>();
        responseInfo.setMsgCode(MsgInfo.SUC);
        String resultInfo;
        try {
            String urlInfo = getUrlInfo(city);
            resultInfo = sendGet(urlInfo);
        } catch (Exception e) {
            log.error(e.getMessage());
            responseInfo.setMsgCode(MsgInfo.SUC);
            responseInfo.setMessage(e.getMessage());
            return responseInfo;
        }
        JSONObject weatherInfo = JSON.parseObject(resultInfo);
        responseInfo.setData(weatherInfo);
        return responseInfo;
    }



    private String getUrlInfo(String cityName) {
        String  urlInfo = "https://www.tianqiapi.com/api/?version=v5&appid=87772396&appsecret=zgNGm7lp&city="
                    + cityName;
        return urlInfo;
    }

    public String sendGet(String urlInfo) {
        String result = "";
        BufferedReader in = null;
        try {
            String urlNameString = urlInfo;
            URL realUrl = new URL(urlNameString);
            Proxy proxyInfo = null;
            URLConnection urlConnection = realUrl.openConnection();
            in = new BufferedReader(new InputStreamReader(urlConnection.getInputStream(), "UTF-8"));
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        } finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (Exception e2) {
                log.error(e2.getMessage());
            }
        }
        return result;
    }
}
