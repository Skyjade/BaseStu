package com.sky.manager.service.impl;

import com.sky.manager.bean.AssestStatistics;
import com.sky.manager.dao.AssestStatisticsDao;
import com.sky.manager.dao.MyBatisBaseDao;
import com.sky.manager.service.AssestStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
@Service
public class AssestStatisticsServiceImpl  extends BaseServiceImpl<AssestStatistics> implements AssestStatisticsService{

    @Autowired
    private AssestStatisticsDao assestStatisticsDao;

    @Override
    protected MyBatisBaseDao <AssestStatistics,String> getDao() {
        return assestStatisticsDao;
    }
}
