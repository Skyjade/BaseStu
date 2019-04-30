package com.sky.manager.service;

import com.sky.common.exception.BusinessException;

import java.io.Serializable;

public interface BaseService<T extends Serializable>{
  void delete(String id) throws BusinessException;
  void update(T t) throws BusinessException;
  void add(T t)throws BusinessException;
  T getOne(String t)throws BusinessException;
}
