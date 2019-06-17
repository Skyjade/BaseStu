package com.sky.manager.dao;

import com.sky.common.entity.PageQuery;
import com.sky.manager.bean.AssestStatistics;

import java.util.List;

/**
 * AssestStatisticsDao继承基类
 */
public interface AssestStatisticsDao extends MyBatisBaseDao<AssestStatistics, String> {
    List<AssestStatistics> getStatisticsList(PageQuery<AssestStatistics> query);
    long getCountByCondition(PageQuery<AssestStatistics> query);

    int deleleBatch(List ids);
}