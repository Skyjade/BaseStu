package com.sky.common.utils.common;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.SignStyle;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.alibaba.fastjson.serializer.SerializerFeature.*;
import static java.time.temporal.ChronoField.*;

public class JsonUtils {
    public static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private static final Logger LOGGER = LoggerFactory.getLogger(JsonUtils.class);
    private static final DateTimeFormatter MY_DATE_MILLISECOND_TIME;

    static {
        MY_DATE_MILLISECOND_TIME = new DateTimeFormatterBuilder()
                .appendValue(YEAR, 4, 10, SignStyle.EXCEEDS_PAD)
                .appendLiteral('-')
                .appendValue(MONTH_OF_YEAR, 2)
                .appendLiteral('-')
                .appendValue(DAY_OF_MONTH, 2)
                .appendLiteral(' ')
                .appendValue(HOUR_OF_DAY, 2)
                .appendLiteral(':')
                .appendValue(MINUTE_OF_HOUR, 2)
                .optionalStart()
                .appendLiteral(':')
                .appendValue(SECOND_OF_MINUTE, 2)
                .appendLiteral('.')
                .appendValue(MILLI_OF_SECOND,3)
                .toFormatter();
    }

    private static final DateTimeFormatter MY_DATE_TIME;

    static {
        MY_DATE_TIME = new DateTimeFormatterBuilder()
                .appendValue(YEAR, 4, 10, SignStyle.EXCEEDS_PAD)
                .appendLiteral('-')
                .appendValue(MONTH_OF_YEAR, 2)
                .appendLiteral('-')
                .appendValue(DAY_OF_MONTH, 2)
                .appendLiteral(' ')
                .appendValue(HOUR_OF_DAY, 2)
                .appendLiteral(':')
                .appendValue(MINUTE_OF_HOUR, 2)
                .optionalStart()
                .appendLiteral(':')
                .appendValue(SECOND_OF_MINUTE, 2)
                .toFormatter();
    }

    private static final DateTimeFormatter MY_DATE;

    static {
        MY_DATE = new DateTimeFormatterBuilder()
                .appendValue(YEAR, 4, 10, SignStyle.EXCEEDS_PAD)
                .appendLiteral('-')
                .appendValue(MONTH_OF_YEAR, 2)
                .appendLiteral('-')
                .appendValue(DAY_OF_MONTH, 2)
                .toFormatter();
    }

    static {
        OBJECT_MAPPER.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

        //LocalDateTime类型转换
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(MY_DATE_MILLISECOND_TIME));
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(MY_DATE_MILLISECOND_TIME));
        OBJECT_MAPPER.registerModule(javaTimeModule);
        OBJECT_MAPPER.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        OBJECT_MAPPER.setSerializationInclusion(JsonInclude.Include.NON_NULL);

    }

    private static String writeValue(Object object) {
        if (object == null) {
            return null;
        } else if(object instanceof String) {
            return (String) object;
        }

        try {
            return OBJECT_MAPPER.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            LOGGER.error("writeJsonValue error, ", e);
        }
        return null;
    }

    private static <T> T readValue(String json, Class<T> t) {
        if (json == null) {
            return null;
        }

        try {
            return OBJECT_MAPPER.readValue(json, t);
        } catch (Exception e) {
            LOGGER.error("readJsonValue error, ", e);
        }
        return null;
    }

    private static <T> T readValue(String json, TypeReference<T> t) {
        if (json == null) {
            return null;
        }
        try {
            return OBJECT_MAPPER.readValue(json, t);
        } catch (Exception e) {
            LOGGER.error("readJsonValue error, ", e);
        }
        return null;
    }


    /**
     * java对象转换为json字符串
     *
     * @param object
     * @return
     */
    public static String toJSONString(Object object) {
        return writeValue(object);
    }


    /**
     * json转换为java对象
     *
     * @param json json
     * @param t    对象类型
     * @param <T>
     * @return
     */
    public static <T> T toObject(String json, Class<T> t) {
        return readValue(json, t);
    }


    /**
     * json转换为List对象
     *
     * @param json json
     * @param <T>
     * @return
     */
    public static <T> List<T> toList(String json) {
        return readValue(json, new TypeReference<List<T>>() {
        });
    }

    /**
     * json转换为List对象
     *
     */

    public static <T> List<T> toList(String jsonStr, Class<?> clazz) {
        List<T> list = new ArrayList<T>();
        try {
            TypeFactory t = TypeFactory.defaultInstance();
            list = OBJECT_MAPPER.readValue(jsonStr,
                    t.constructCollectionType(ArrayList.class, clazz));
        } catch (IOException e) {
            LOGGER.error("readJsonValue error, ", e);
        }
        return list;
    }


    /**
     * json转换为Map对象
     *
     * @param json json
     * @return
     */
    public static <K, V> Map<K, V> toMap(String json) {
        return readValue(json, new TypeReference<Map<K, V>>() {
        });
    }

    /**
     * json转换为HashMap对象
     *
     * @param json json
     * @return
     */
    public static <K, V> HashMap<K, V> toHashMap(String json) {
        return readValue(json, new TypeReference<HashMap<K, V>>() {
        });
    }



    /**
     * json转换为java对象
     *
     * @param json json
     * @param t    对象类型
     * @param <T>
     * @return
     */
    public static <T> T toObject(String json, TypeReference<T> t) {
        return readValue(json, t);
    }

    /*
     ====java对象转换为json字符串  显示空值====
     QuoteFieldNames———-输出key时是否使用双引号,默认为true
     WriteMapNullValue——–是否输出值为null的字段,默认为false
     WriteNullNumberAsZero—-数值字段如果为null,输出为0,而非null
     WriteNullListAsEmpty—–List字段如果为null,输出为[],而非null
     WriteNullStringAsEmpty—字符类型字段如果为null,输出为”“,而非null
     WriteNullBooleanAsFalse–Boolean字段如果为null,输出为false,而非null
      SerializerFeature.WriteDateUseDateFormat 日期类型转化
     */
    public static String toString(Object t){
        return JSONObject.toJSONStringWithDateFormat(t,
                "yyyy-MM-dd HH:mm:ss.SSS",
                SerializerFeature.WriteMapNullValue,
                WriteNullStringAsEmpty,WriteNullNumberAsZero,WriteDateUseDateFormat);
    }

}
