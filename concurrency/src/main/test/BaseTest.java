import com.sky.concurrency.cache.LRUCache;
import org.junit.Test;
import org.xmlunit.util.Convert;

import java.util.Arrays;
import java.util.UUID;

public class BaseTest {
    public static void main(String[] args) {
        //定义一个十进制值
        int valueTen = 328;
        //将其转换为十六进制并输出
        String strHex = Integer.toHexString(valueTen);
        System.out.println(valueTen + " [十进制]---->[十六进制] " + strHex);
        //将十六进制格式化输出
        String strHex2 = String.format("%08x", valueTen);
        System.out.println(valueTen + " [十进制]---->[十六进制] " + strHex2);

        System.out.println("==========================================================");
        //定义一个十六进制值
        String strHex3 = "00001322";
        //将十六进制转化成十进制
        int valueTen2 = Integer.parseInt(strHex3, 16);
        System.out.println(strHex3 + " [十六进制]---->[十进制] " + valueTen2);

        System.out.println("==========================================================");
        //可以在声明十进制时，自动完成十六进制到十进制的转换
        int valueHex = 0x00001322;
        System.out.println("int valueHex = 0x00001322 --> " + valueHex);
    }

    @Test
    public void testShort (){
        byte[] bytes = short2byte((short) Integer.MIN_VALUE);
        System.out.println(bytesToHexString(bytes));
        System.out.println(Integer.MAX_VALUE);
    }


    public static byte[] short2byte(short s){
        byte[] b = new byte[2];
        for(int i = 0; i < 2; i++){
            int offset = 16 - (i+1)*8; //因为byte占4个字节，所以要计算偏移量
            b[i] = (byte)((s >> offset)&0xff); //把16位分为2个8位进行分别存储
        }
        return b;
    }

    public static short byte2short(byte[] b){
        short l = 0;
        for (int i = 0; i < 2; i++) {
            l<<=8; //<<=和我们的 +=是一样的，意思就是 l = l << 8
            l |= (b[i] & 0xff); //和上面也是一样的  l = l | (b[i]&0xff)
        }
        return l;
    }


    public static String bytesToHexString(byte[] src){
        StringBuilder stringBuilder = new StringBuilder("");
        if (src == null || src.length <= 0) {
            return null;
        }
        for (int i = 0; i < src.length; i++) {
            int v = src[i] & 0xFF;
            String hv = Integer.toHexString(v);
            if (hv.length() < 2) {
                stringBuilder.append(0);
            }
            stringBuilder.append(hv);
        }
        return stringBuilder.toString();
    }
    /**
     * Convert hex string to byte[]
     * @param hexString the hex string
     * @return byte[]
     */
    public static byte[] hexStringToBytes(String hexString) {
        if (hexString == null || hexString.equals("")) {
            return null;
        }
        hexString = hexString.toUpperCase();
        int length = hexString.length() / 2;
        char[] hexChars = hexString.toCharArray();
        byte[] d = new byte[length];
        for (int i = 0; i < length; i++) {
            int pos = i * 2;
            d[i] = (byte) (charToByte(hexChars[pos]) << 4 | charToByte(hexChars[pos + 1]));
        }
        return d;
    }
    /**
     * Convert char to byte
     * @param c char
     * @return byte
     */
    private static byte charToByte(char c) {
        return (byte) "0123456789ABCDEF".indexOf(c);
    }
}
