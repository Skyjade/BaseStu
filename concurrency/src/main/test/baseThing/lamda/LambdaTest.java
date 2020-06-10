package baseThing.lamda;

import com.sky.test.baseThing.testForPer.Student;
import org.junit.Test;

import java.util.Arrays;
import java.util.stream.Stream;

/**
 * @Author wangtq
 * @Description lamda测试
 * @Date
 **/
public class LambdaTest {
    //supply consumer predicat functione
    @Test
    public void test1(){
        //count为终结方法 使用完不可使用stream的其他方法
        String arr[]={"fasfas,女","低利润率,女","fasfsa,女"
                ,"sad,男"};
        String arr2[]={"hhhhhh"};
        Stream<String> s1 = Stream.of(arr);
        Stream<String> s2 = Stream.of(arr2);
        //long count = s1.count();
       // s1.limit(2).forEach(name-> System.out.println(name));
        //s1.skip(2).forEach(name-> System.out.println(name));
        //concat 用于合并流
        Stream.concat(s1,s2).forEach(s-> System.out.println(s));


    }

    @Test
    public void testpredicat(){
        //集合筛选，获取四字女
         String arr[]={"12312412,女","asdas,女","dasdasd,女"
         ,"sadas,男"};
         Arrays.stream(arr).filter(s -> s.indexOf(",") != -1)
                 .filter(s->s.split(",")[0].length()>3).
                 filter(s->s.split(",")[1].equals("女"))
          .forEach(name-> System.out.println(name));

         //Collectors.counting
        /**
         * 管道流只能被调用一次，调用完就关闭或者流转到下一个流
         */
         //foreach   ::::  consumer 消费传递的参数
        // filter   ::::  pridict 判断是否符合条件
        // map      ::::  function 类型转化接口

    }

    /**
     * 测试方法引用
     * 对象及方法以及存在
     */
    @Test
    public void testWayUse(){

    }


    @Test
    public void test123(){
     //栈、堆、方法区
        //方法的局部变量和本类的成员变量重名 this
        //"5".equals(a);
        String a="1";
        a="312";
        String b="2";
        String concat = a.concat(b);
        //[ ,)
        String substring = concat.substring(0, 2);

        String s = a + b;
        //获取指定索引位置的单个字符
        char c = b.charAt(0);
        System.out.println(a.equalsIgnoreCase(b));

    }


    /**
     * split本质是用了正则，所以如果是英文. 需要加转义字符
     * static 关键字  内容属于类本身
     */
    @Test
    public void testSplit(){
      String s="a.b.c";
        String[] split = s.split("\\.");
        for (String s1 : split) {
            System.out.println(s1);
        }
    }
    @Test
    public void testStatic(){
        //静态代码块 只执行一次，且优先于构造方法
        Student.sleep();
        Student student = new Student();
        Student student2 = new Student();
        //Arrays.sort();
        //绝对值
        int abs = Math.abs(-1);
        double ceil = Math.ceil(3.9);//向上取整‘
        double floor = Math.floor(3.1);
        double ceil2 = Math.ceil(3.1);//向上取整
        long round = Math.round(3.5);
        long round1 = Math.round(3.2);
        double pi = Math.PI;
        System.out.println("");
    }


    public void save(){
    }


}
