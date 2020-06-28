# [base](#base)
   基础模块
##[base-client](#base-client)
    用于应用进程的注册，打包成jar供其他应用服务与中间件的消息处理
###FUN:
* register (String ip,int port,String appName)
    更新共享内存1 的节点信息,提供方法给应用程序自动注册
* syncSubData
    扫描自定义注解@SharedMemoryListener,将订阅的信息同步更新共享内存2
* appConsume (XMessage msg) 
    单独的线程循环读取应用服务缓存队列的消息，并将消息路由到有注解的方法上
* appProduce (XMessage msg) 
    需要客户端主动调用，所有应用服务用来生产数据，通过查找共享内存2中的订阅信息，
    将消息拷贝多份发送给订阅此消息的应用服务所在节点的中间件

## [base-util](#base-util)
    通用工具类
## [base-component](#base-componet)
    通用类及通用返回常量信息
    
#[middleWare](#middleWare)
    消息中间件
## [middleWare-registry](#middleWare-registry)
    注册中心：检测应用进程的心跳，管理共享内存1，如果有变化删除节点信息和此节点下的应用进程的注册信息
##[middleWare-dominator](#middleWare-dominator)
    支配中心： TCP服务端，其他节点的中间件启动后与其建立TCP链接，应用进程通过client.jar提供的接口注册信息，包括应用服务的注册名和服务启动时扫描注解@SharedMemoryListener得到的事件订阅信息，将其写入共享内存2
    eg.@SharedMemoryListener(app = "collection",topics = {"event1"})
    支配中心应支持动态负载采集程序的压力，定时检查共享内存1中的节点信息然后动态均匀分配采集信息发送至不同的节点上的中间件
##[middleWare-cache](#middleWare-cache)
    缓冲区：与其他节点的中间件交互的缓冲
*  MSG-PUSH-QUEUE 
    TCP发送缓存队列，判断如果是本节点将此消息放置本节点应用的接受缓存队列（共享内存2），否则将消息通过TCP发送给其他节点的中间件  
*  MSG-PULL-QUEUE
    TCP接受缓冲队列，判断是本节点的应用的消息，否则是其他节点中间件的则推送给本节点的各应用进程
##[middleWare-server](#middleWare-server)
    中间件服务
    
# [collect](#collect)
    采集程序模块
# [web-api](#web-api)
    web模块


