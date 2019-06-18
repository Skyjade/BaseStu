package com.sky.manager.service.impl;

import com.sky.common.constant.MsgInfo;
import com.sky.common.entity.ListDataResp;
import com.sky.common.entity.PageQuery;
import com.sky.common.exception.BusinessException;
import com.sky.manager.bean.AssestStatistics;
import com.sky.manager.dao.AssestStatisticsDao;
import com.sky.manager.dao.MyBatisBaseDao;
import com.sky.manager.service.AssestStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

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

    @Override
    public ListDataResp<AssestStatistics> getStatisticsList(PageQuery<AssestStatistics> query) {
        List<AssestStatistics> statisticsList = assestStatisticsDao.getStatisticsList(query);
        long count = assestStatisticsDao.getCountByCondition(query);
        return  new ListDataResp<>(statisticsList,count);
    }


}
