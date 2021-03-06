package com.sky.concurrency.mbb;

import sun.misc.Unsafe;
import sun.nio.ch.FileChannelImpl;

import java.io.RandomAccessFile;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.nio.channels.FileChannel;

/**
 * Class for direct access to a memory mapped file.
 *
 */
@SuppressWarnings("restriction")
public class  SharedMemoryMapFile {

    private static final Unsafe unsafe;
    private static final Method mmap;
    private static final Method unmmap;
    private static final int BYTE_ARRAY_OFFSET;

    private long addr, size;
    private final String filePath;

    public long getAddr() {
        return addr;
    }

    //1.get Unsafe //利用反射机制，Unsafe中有一个字段名为“theUnsafe”，该字段保存有一个Unsafe的实例，获取在该字段上的Unsafe实例
    //get map0 和 unmap0 方法,native方法
    static {
        try {
            //a.get Unsafe
            Field singleoneInstanceField = Unsafe.class.getDeclaredField("theUnsafe");
            singleoneInstanceField.setAccessible(true);
            unsafe = (Unsafe) singleoneInstanceField.get(null);

            //b.get native method
            mmap = getClassMethodByName(FileChannelImpl.class, "map0", int.class, long.class, long.class);
            unmmap = getClassMethodByName(FileChannelImpl.class, "unmap0", long.class, long.class);

            BYTE_ARRAY_OFFSET = unsafe.arrayBaseOffset(byte[].class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static Method getClassMethodByName(Class<?> cls, String name, Class<?>... params) throws Exception {
        Method m = cls.getDeclaredMethod(name, params);
        m.setAccessible(true);
        return m;
    }

    private static long roundTo4096(long i) {
        return (i + 0xfffL) & ~0xfffL;
    }

    private void mapAndSetOffset() throws Exception {
        final RandomAccessFile backingFile = new RandomAccessFile(this.filePath, "rw");
        backingFile.setLength(this.size);
        final FileChannel ch = backingFile.getChannel();
        this.addr = (long) mmap.invoke(ch, 1, 0L, this.size);//READ_ONLY:0;READ_WRITE:1;PRIVATE:2
        ch.close();
        backingFile.close();
    }

    /**
     * Constructs a new memory mapped file.
     * @param filePath the file name
     * @param len the file length
     * @throws Exception in case there was an error creating the memory mapped file
     */
    //protected SharedMemoryMapFile(final String filePath, long len) throws Exception {
    public SharedMemoryMapFile(final String filePath, long len) throws Exception {
        this.filePath = filePath;
        this.size = roundTo4096(len);
        mapAndSetOffset();
    }

    protected void unmap() throws Exception {
        unmmap.invoke(null, addr, this.size);
    }

    /**
     * Reads a byte from the specified position.
     * @param pos the position in the memory mapped file
     * @return the value read
     */
    public byte getByte(long pos) {
        return unsafe.getByte(pos + addr);
    }

    /**
     * Reads a byte (volatile) from the specified position.
     * @param pos the position in the memory mapped file
     * @return the value read
     */
    public byte getByteVolatile(long pos) {
        return unsafe.getByteVolatile(null, pos + addr);
    }

    public short getShort(long pos){
        return unsafe.getShort(pos + addr);
    }

    public short getShortVolatile(long pos){
        return unsafe.getShortVolatile(null, pos + addr);
    }

    /**
     * Reads an int from the specified position.
     * @param pos the position in the memory mapped file
     * @return the value read
     */
    public int getInt(long pos) {
        return unsafe.getInt(pos + addr);
    }

    /**
     * Reads an int (volatile) from the specified position.
     * @param pos position in the memory mapped file
     * @return the value read
     */
    public int getIntVolatile(long pos) {
        return unsafe.getIntVolatile(null, pos + addr);
    }

    /**
     * Reads a long from the specified position.
     * @param pos position in the memory mapped file
     * @return the value read
     */
    public long getLong(long pos) {
        return unsafe.getLong(pos + addr);
    }

    /**
     * Reads a long (volatile) from the specified position.
     * @param pos position in the memory mapped file
     * @return the value read
     */
    public long getLongVolatile(long pos) {
        return unsafe.getLongVolatile(null, pos + addr);
    }

    public float getFloat(long pos){
        return unsafe.getFloat(pos + addr);
    }

    public float getFloatVolatile(long pos){
        return unsafe.getFloatVolatile(null, pos + addr);
    }

    public double getDouble(long pos){
        return unsafe.getDouble(pos + addr);
    }

    public double getDoubleVolatile(long pos){
        return unsafe.getDoubleVolatile(null, pos + addr);
    }
    
    /**
     * Writes a byte to the specified position.
     * @param pos the position in the memory mapped file
     * @param val the value to write
     */
    public void putByte(long pos, byte val) {
        unsafe.putByte(pos + addr, val);
    }

    /**
     * Writes a byte (volatile) to the specified position.
     * @param pos the position in the memory mapped file
     * @param val the value to write
     */
    public void putByteVolatile(long pos, byte val) {
        unsafe.putByteVolatile(null, pos + addr, val);
    }

    public void putShort(long pos, short val) {
        unsafe.putShort(pos + addr, val);
    }

    public void putShortVolatile(long pos, short val) {
        unsafe.putShortVolatile(null, pos + addr, val);
    }
    
    /**
     * Writes an int to the specified position.
     * @param pos the position in the memory mapped file
     * @param val the value to write
     */
    public void putInt(long pos, int val) {
        unsafe.putInt(pos + addr, val);
    }

    /**
     * Writes an int (volatile) to the specified position.
     * @param pos the position in the memory mapped file
     * @param val the value to write
     */
    public void putIntVolatile(long pos, int val) {
        unsafe.putIntVolatile(null, pos + addr, val);
    }

    /**
     * Writes a long to the specified position.
     * @param pos the position in the memory mapped file
     * @param val the value to write
     */
    public void putLong(long pos, long val) {
        unsafe.putLong(pos + addr, val);
    }

    /**
     * Writes a long (volatile) to the specified position.
     * @param pos the position in the memory mapped file
     * @param val the value to write
     */
    public void putLongVolatile(long pos, long val) {
        unsafe.putLongVolatile(null, pos + addr, val);
    }

    public void putFloat(long pos, float val) {
        unsafe.putFloat(pos + addr, val);
    }

    public void putFloatVolatile(long pos, float val) {
        unsafe.putFloatVolatile(null, pos + addr, val);
    }

    public void putDouble(long pos, double val) {
        unsafe.putDouble(pos + addr, val);
    }

    public void putDoubleVolatile(long pos, double val) {
        unsafe.putDoubleVolatile(null, pos + addr, val);
    }
    
    /**
     * Reads a buffer of data.
     * @param pos the position in the memory mapped file
     * @param data the input buffer
     * @param offset the offset in the buffer of the first byte to read data into
     * @param length the length of the data
     */
    public void getBytes(long pos, byte[] data, int offset, int length) {
        unsafe.copyMemory(null, pos + addr, data, BYTE_ARRAY_OFFSET + offset, length);
    }

    /**
     * Writes a buffer of data.
     * @param pos the position in the memory mapped file
     * @param data the output buffer
     * @param offset the offset in the buffer of the first byte to write
     * @param length the length of the data
     */
    public void setBytes(long pos, byte[] data, int offset, int length) {
        unsafe.copyMemory(data, BYTE_ARRAY_OFFSET + offset, null, pos + addr, length);
    }

    public boolean compareAndSwapInt(long pos, int expected, int value) {
        return unsafe.compareAndSwapInt(null, pos + addr, expected, value);
    }

    public boolean compareAndSwapLong(long pos, long expected, long value) {
        return unsafe.compareAndSwapLong(null, pos + addr, expected, value);
    }

    public int getAndAddInt(long pos, int delta) {
        return unsafe.getAndAddInt(null, pos + addr, delta);
    }

    public int getAndSetInt(long pos, int value) {
        return unsafe.getAndSetInt(null, pos + addr, value);
    }

    public long getAndAddLong(long pos, long delta) {
        return unsafe.getAndAddLong(null, pos + addr, delta);
    }

    public long getAndSetLong(long pos, long value) {
        return unsafe.getAndSetLong(null, pos + addr, value);
    }

}
