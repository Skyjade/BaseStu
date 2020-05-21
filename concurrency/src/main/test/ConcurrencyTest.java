import lombok.Cleanup;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.ByteBuffer;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;

@SpringBootTest
public class ConcurrencyTest {

    @Test
    public void test1() throws Exception{
        ByteBuffer byteBuf = ByteBuffer.allocate(1024 * 14 * 1024);

        //byte[] bbb = new byte[14 * 1024 * 1024];

        String s="123";
        @Cleanup
        FileInputStream fis = new FileInputStream("f:\\test\\testdata.txt");
        @Cleanup
        FileOutputStream fos = new FileOutputStream("f:\\outFile.txt");
        @Cleanup
        FileChannel fc = fis.getChannel();

        long timeStar = System.currentTimeMillis();//得到当前的时间

        fc.read(byteBuf);//1 读取

        long timeEnd = System.currentTimeMillis();//得到当前的时间

        System.out.println("Read time :" + (timeEnd - timeStar) + "ms");

        timeStar = System.currentTimeMillis();

        fos.write(s.getBytes());// 写入

        timeEnd = System.currentTimeMillis();

        System.out.println("Write time :" + (timeEnd - timeStar) + "ms");

    }

    @Test
    public void test2 () throws Exception{
        File file = new File("E:\\download\\office2007pro.chs.ISO");
        @Cleanup FileInputStream in = new FileInputStream(file);
        FileChannel channel = in.getChannel();
        MappedByteBuffer buff = channel.map(FileChannel.MapMode.READ_ONLY, 0,channel.size());
        //in.read(buff);
    }

}
