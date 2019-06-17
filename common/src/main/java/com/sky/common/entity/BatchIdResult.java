package com.sky.common.entity;

import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.List;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class BatchIdResult {
    private String  ids;
    private List<String> result;

    public List<String> getResult() {
        return result;
    }

    public void setResult(List<String> result) {
        this.result = result;
    }

    public String getIds() {
        return ids;
    }

    public void setIds(String ids) {
        this.ids = ids;
        if(StringUtils.isNotBlank(ids)){
            this.setResult(Arrays.asList(ids.split(",")));
        }
    }
}
