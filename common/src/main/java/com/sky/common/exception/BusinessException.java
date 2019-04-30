package com.sky.common.exception;

/**
 * @Author wangtq
 * @Description 运行异常
 * @Date 2019-03-25
 **/
public class BusinessException extends RuntimeException {

    /**
     * serialVersionUID:TOD(用一句话描述这个变量表示什么).
     */
    private static final long serialVersionUID = 1L;

    public BusinessException(String message) {
        super(message);
    }
}
