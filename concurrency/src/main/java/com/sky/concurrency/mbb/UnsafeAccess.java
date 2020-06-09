package com.sky.concurrency.mbb;

import sun.misc.Unsafe;

import java.lang.reflect.Field;

/**
 * Class for direct access to a memory .
 * Access to sun.misc.Unsafe (subset)
 * <a href="http://j7a.ru/classsun_1_1misc_1_1_unsafe.html">sun.misc.Unsafe API</a>
 */
@SuppressWarnings("restriction")
class UnsafeAccess {
	private static final Unsafe unsafe;

	private static final long OBJECT_ARRAY_OFFSET;
	//private static final long bufferAddressOffset;

	//1.get Unsafe //利用反射机制，Unsafe中有一个字段名为“theUnsafe”，该字段保存有一个Unsafe的实例，获取在该字段上的Unsafe实例
	static {
		try {
			//a.get Unsafe
			Field singleoneInstanceField = Unsafe.class.getDeclaredField("theUnsafe");
			singleoneInstanceField.setAccessible(true);
			unsafe = (Unsafe) singleoneInstanceField.get(null);

			// Get direct access to Buffer.address
			OBJECT_ARRAY_OFFSET = unsafe.arrayBaseOffset(Object[].class);
			//bufferAddressOffset = unsafe.objectFieldOffset(Buffer.class.getDeclaredField("address"));
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public static boolean isUnsafeAvailable() {
		return (unsafe != null);
	}

	public static int systemAddressSize(){
		return unsafe.addressSize();
	}

	public static int systempageSize(){
		return unsafe.pageSize();
	}

	/**
	 * Byte 操作相关
	 */

	public static void putByteVolatile(final long address, final byte value){
		unsafe.putByteVolatile(null, address, value);
	}

	public static void putByte(final long address, final byte value) {
		unsafe.putByte(address, value);
	}

	public static byte getByteVolatile(final long address)	{
		return unsafe.getByteVolatile(null, address);
	}

	public static byte getByte(final long address){
		return unsafe.getByte(address);
	}

	/**
	 * Short 操作相关
	 */

	public static void putShortVolatile(final long address, final short value){
		unsafe.putShortVolatile(null, address, value);
	}

	public static void putShort(final long address, final short value) {
		unsafe.putShort(address, value);
	}

	public static short getShortVolatile(final long address)	{
		return unsafe.getShortVolatile(null, address);
	}

	public static short getShort(final long address){
		return unsafe.getShort(address);
	}

	/**
	 * Int 操作相关
	 */

	public static void putIntVolatile(final long address, final int value){
		unsafe.putIntVolatile(null, address, value);
	}

	public static void putInt(final long address, final int value) {
		unsafe.putInt(address, value);
	}

	public static int getIntVolatile(final long address)	{
		return unsafe.getIntVolatile(null, address);
	}

	public static int getInt(final long address){
		return unsafe.getInt(address);
	}

	/**
	 * Long 操作相关
	 */

	public static void putLongVolatile(final long address, final long value){
		unsafe.putLongVolatile(null, address, value);
	}

	public static void putLong(final long address, final long value) {
		unsafe.putLong(address, value);
	}

	public static long getLongVolatile(final long address)	{
		return unsafe.getLongVolatile(null, address);
	}

	public static long getLong(final long address){
		return unsafe.getLong(address);
	}

	/**
	 * Float 操作相关
	 */

	public static void putFloatVolatile(final long address, final float value){
		unsafe.putFloatVolatile(null, address, value);
	}

	public static void putFloat(final long address, final float value) {
		unsafe.putFloat(address, value);
	}

	public static float getFloatVolatile(final long address)	{
		return unsafe.getFloatVolatile(null, address);
	}

	public static float getFloat(final long address){
		return unsafe.getFloat(address);
	}

	/**
	 * Double 操作相关
	 */

	public static void putDoubleVolatile(final long address, final double value){
		unsafe.putDoubleVolatile(null, address, value);
	}

	public static void putDouble(final long address, final double value) {
		unsafe.putDouble(address, value);
	}

	public static double getDoubleVolatile(final long address)	{
		return unsafe.getDoubleVolatile(null, address);
	}

	public static double getDouble(final long address){
		return unsafe.getDouble(address);
	}



	/**
	 * CAS操作
	 * CAS操作有3个操作数，内存值M，预期值E，新值U，如果M==E，则将内存值修改为B，否则啥都不做。
	 * 是通过compareAndSwapXXX方法实现的
	 * 用来解决不同的线程或者进程间同步的问题
	 * 使用LockSupport.parkNanos(123)比TimeUnit类中的sleep()获得时间更精细的延时
	 *
	 */

	/**
	 * 比较obj的offset处内存位置中的值和期望的值，如果相同则更新。此更新是不可中断的。
	 *
	 * @param obj 需要更新的对象
	 * @param valueOffset obj中整型field的偏移量
	 * @param expect 希望field中存在的值
	 * @param update 如果期望值expect与field的当前值相同，设置filed的值为这个新值
	 * @return 如果field的值被更改返回true
	 */
	public static final boolean compareAndSwapInt(final Object obj, final long valueOffset, final int expect,
												   final int update) {
		return unsafe.compareAndSwapInt(obj, valueOffset, expect, update);
	}

	public static final boolean compareAndSwapInt(final long valueMemAddress, final int expect,
												  final int update) {
		return unsafe.compareAndSwapInt(null, valueMemAddress, expect, update);
	}

	public static final boolean compareAndSwapLong(final Object obj, final long valueOffset, final long expect,
												  final long update) {
		return unsafe.compareAndSwapLong(obj, valueOffset, expect, update);
	}

	public static final boolean compareAndSwapLong(final long valueMemAddress, final long expect,
												  final long update) {
		return unsafe.compareAndSwapLong(null, valueMemAddress, expect, update);
	}

	public static final boolean compareAndSwapObject(final Object obj, final long valueOffset, final Object expect,
												  final Object update) {
		return unsafe.compareAndSwapObject(obj, valueOffset, expect, update);
	}

	public static final boolean compareAndSwapObject(final long valueMemAddress, final Object expect,
												  final Object update) {
		return unsafe.compareAndSwapObject(null, valueMemAddress, expect, update);
	}


	public static int getAndAddInt(final long address, final int value){
		return unsafe.getAndAddInt(null, address, value);
	}

	public static int getAndSetInt(final long address, final int value){
		return unsafe.getAndSetInt(null, address, value);
	}

	public static long getAndAddLong(final long address, final long value){
		return unsafe.getAndAddLong(null, address, value);
	}

	public static long getAndSetLong(final long address, final long value){
		return unsafe.getAndSetLong(null, address, value);
	}
}