package com.sky.common.utils.annotate;

import com.sky.common.utils.common.PasswordUtils;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

/**
 * @Author wangtq
 * @Description 注解处理器
 * @Date
 **/
public class ValidateTracker {

    public static void trackUseCases(List<Integer> useCases, Class<?> cl) {
        Stream<Annotation[]> stream = Arrays.stream(cl.getDeclaredMethods()).map(s -> s.getAnnotations());
        for (Method m : cl.getDeclaredMethods()) {
            Validate uc = m.getAnnotation(Validate.class);
            if (uc != null) {
                System.out.println("Found Use Case: " + uc.id() + " " + uc.description());
                useCases.remove(new Integer(uc.id()));
            }
        }
        for (int i : useCases) {
            System.out.println("Warning: Missing use case-" + i);
        }
    }


    public static void main(String[] args) {
        List<Integer> useCases = new ArrayList<Integer>();
        Collections.addAll(useCases, 1, 2);
        trackUseCases(useCases, PasswordUtils.class);
    }
}
