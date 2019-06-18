package com.sky.manager.service.impl;

import com.sky.common.constant.MsgInfo;
import com.sky.common.exception.BusinessException;
import com.sky.manager.dao.MyBatisBaseDao;
import com.sky.manager.service.BaseService;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.List;

/**
 * @Author wangtq
 * @Description 基本逻辑层实现类父类
 * @Date 2019/04/30
 **/
@Service
public abstract class BaseServiceImpl <T extends Serializable> implements BaseService<T> {


    protected abstract MyBatisBaseDao<T,String> getDao();

    @Override
    public void delete(String id) throws BusinessException {
        int result = getDao().deleteByPrimaryKey(id);
        if(result==0){
            throw new BusinessException("delete fail");
        }
    }

    @Override
    public void update(T t) throws BusinessException {
        int result = getDao().updateByPrimaryKeySelective(t);
        if(result==0){
            throw new BusinessException("upd fail");
        }
    }

    @Override
    public void add(T t) throws BusinessException {
        int result = getDao().insertSelective(t);
        if(result==0){
            throw new BusinessException("add fail");
        }
    }

    @Override
    public T getOne(String t) throws BusinessException {
        T o = (T) getDao().selectByPrimaryKey(t);
        if(o==null){
            throw new BusinessException("no exist data");
        }
        return o;
    }

    @Override
    public void deleteBatchByKeys(List ids) {
        int i = getDao().deleleBatchByKeys(ids);
        if(i==0){
            throw new BusinessException(MsgInfo.Delete_Fail);
        }
    }
}
