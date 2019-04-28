package com.sky.common.utils.str;

import org.apache.commons.lang3.StringUtils;

import java.util.UUID;

/**
 * 
 * @author wangtq
 * @time 2019年4月8日 上午9:38:55
 * @description UUID生成工具类
 *
 */
public class UUIDUtils {


	/**
	 * 32位UUID生成方法
	 * 
	 * @return 32位UUID生成方法
	 */
	public static String getUUID() {
		UUID uuid = UUID.randomUUID();
		String uuidStr = uuid.toString();
		if (StringUtils.isNotEmpty(uuidStr)) {
			uuidStr = uuidStr.toUpperCase();
			uuidStr = uuidStr.replaceAll("-", "");
		} else {
			uuidStr = "";
		}
		return uuidStr;
	}

}
