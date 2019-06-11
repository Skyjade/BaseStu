package com.sky.common.utils.common;

import com.sky.common.utils.annotate.Validate;

import java.util.List;

/**
 * @Author wangtq
 * @Description
 * @Date
 **/
public class PasswordUtils {
    @Validate(id = 1, description =
            "Passwords must contain at least one numeric")
    public boolean validatePassword(String password) {
        return (password.matches("\\w*\\d\\w*"));
    }

//    @Validate(id = 2)
//    public String encryptPassword(String password) {
//        return new StringBuilder(password).reverse().toString();
//    }

    @Validate(id = 2, description =
            "New passwords can't equal previously used ones")
    public boolean checkForNewPassword(
            List<String> prevPasswords, String password) {
        return !prevPasswords.contains(password);
    }


}
