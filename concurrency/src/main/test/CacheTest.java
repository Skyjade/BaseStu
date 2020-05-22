import com.sky.concurrency.cache.LRUCache;
import org.junit.Test;

import java.util.UUID;

public class CacheTest {
    @Test
    public void test1 (){
        LRUCache lruCache = new LRUCache(3);
        lruCache.put(1,1);
        lruCache.put(2,1);
        lruCache.put(3,1);
        int i = lruCache.get(1);
        System.out.println("key:1;value:"+i);
        UUID uuid = UUID.randomUUID();
        System.out.println(uuid.toString());
        System.out.println(UUID.fromString(uuid.toString()));
        lruCache.put(4,1);
        System.out.println(lruCache);
    }
}
