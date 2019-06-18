package com.sky.manager.service;

import com.sky.common.entity.ListDataResp;
import com.sky.common.entity.PageQuery;
import com.sky.manager.bean.AssestStatistics;

public interface AssestStatisticsService extends BaseService<AssestStatistics>{
    ListDataResp<AssestStatistics> getStatisticsList(PageQuery<AssestStatistics> query);

}
